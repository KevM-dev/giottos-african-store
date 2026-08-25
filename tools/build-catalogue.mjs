// Rebuilds products.js from the Giottos Inventory Google Sheet.
//
//   node tools/build-catalogue.mjs            # fetch the sheet, validate, write
//   node tools/build-catalogue.mjs --dry-run  # validate and report, write nothing
//   node tools/build-catalogue.mjs --file x   # read a local CSV instead of the sheet
//
// Exits non-zero on any validation failure, which is the whole point: a bad row
// in the spreadsheet stops the build instead of reaching the live shop.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const SHEET_CSV =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRRZaRNNiebDhyf_1HqUC5IWSz10oqudyR0g2fqEwlN4nHX6rzyYPEpYf5vuXauenlizRBB4vHodZvD/pub?gid=2075917347&single=true&output=csv";

const CATEGORIES = ["Fresh", "Pantry", "Spices", "Frozen", "Drinks", "Snacks"];
const BADGES = ["Fresh", "Sale"];
const OUT = path.join(ROOT, "products.js");
const PAGES = ["index.html", "shop.html", "visit.html"];

// A sheet that suddenly loses most of its rows is far more likely to be a
// botched edit or a half-loaded fetch than a real decision to shut the shop.
const SHRINK_LIMIT = 0.5;

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const fileArg = args.indexOf("--file");

const errors = [];
const warnings = [];

// ---------- CSV ----------
// Google's export quotes any field holding a comma, quote or newline, so the
// parser has to honour quoting rather than just splitting on commas.
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += c;
      continue;
    }
    if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\r") {
      /* handled by \n */
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

function toRecords(rows) {
  const headers = rows[0].map((h) => h.replace(/^﻿/, "").trim());
  return rows.slice(1).map((cells, i) => {
    const rec = { __line: i + 2 };
    headers.forEach((h, j) => (rec[h] = (cells[j] ?? "").trim()));
    return rec;
  });
}

// ---------- Load ----------
async function loadCsv() {
  if (fileArg !== -1) {
    const p = args[fileArg + 1];
    console.log(`Reading local CSV: ${p}`);
    return fs.readFileSync(p, "utf8").replace(/^﻿/, "");
  }
  console.log("Fetching the Giottos Inventory sheet…");
  const res = await fetch(SHEET_CSV, { redirect: "follow" });
  if (!res.ok) throw new Error(`Sheet fetch failed: HTTP ${res.status}`);
  const text = await res.text();
  // A sheet that has been unpublished returns an HTML error page, not CSV.
  if (/^\s*</.test(text)) {
    throw new Error(
      "Sheet returned HTML, not CSV. It may have been unpublished or the link changed.",
    );
  }
  return text.replace(/^﻿/, "");
}

// ---------- Validate + map ----------
function buildProducts(records) {
  const required = ["ID", "Name", "Size", "Category"];
  const missingCols = required.filter((c) => !(c in records[0]));
  if (missingCols.length) {
    errors.push(`Sheet is missing column(s): ${missingCols.join(", ")}`);
    return [];
  }

  const seen = new Map();
  const products = [];

  for (const r of records) {
    const at = `row ${r.__line}`;
    const id = r.ID;

    if (!id) {
      errors.push(`${at}: ID is empty (${r.Name || "unnamed"})`);
      continue;
    }
    if (seen.has(id)) {
      errors.push(`${at}: duplicate ID "${id}", already used on row ${seen.get(id)}`);
      continue;
    }
    seen.set(id, r.__line);

    if (!r.Name) errors.push(`${at} (${id}): Name is empty`);
    if (!r.Size) warnings.push(`${at} (${id}): Size is empty`);

    if (!CATEGORIES.includes(r.Category)) {
      errors.push(
        `${at} (${id}): Category "${r.Category}" is not one of ${CATEGORIES.join(", ")}`,
      );
    }

    // Blank means "Ask in-store". Anything non-numeric is a typo, not a price.
    let price = null;
    if (r.Price !== "") {
      const cleaned = r.Price.replace(/[£,\s]/g, "");
      const n = Number(cleaned);
      if (!Number.isFinite(n)) {
        errors.push(
          `${at} (${id}): Price "${r.Price}" is not a number. Leave it empty for "Ask in-store".`,
        );
      } else if (n < 0) {
        errors.push(`${at} (${id}): Price is negative`);
      } else {
        price = Math.round(n * 100) / 100;
      }
    }

    const badge = r.Badge || null;
    if (badge && !BADGES.includes(badge)) {
      errors.push(`${at} (${id}): Badge "${badge}" is not one of ${BADGES.join(", ")} (or empty)`);
    }

    const image = r.Image || "";
    if (image) {
      if (!fs.existsSync(path.join(ROOT, image))) {
        errors.push(`${at} (${id}): image not found in the repo: ${image}`);
      }
    } else {
      warnings.push(`${at} (${id}): no image, the card will show a category placeholder`);
    }

    const p = {
      id,
      name: r.Name,
      cat: r.Category,
      origin: r.Origin || "",
      size: r.Size,
      price,
      desc: r.Description || "",
      badge,
    };
    if (image) p.image = image;
    products.push(p);
  }

  return products;
}

// Customers' saved shopping lists point at IDs. Losing one silently drops an
// item from someone's list, so it is worth saying out loud.
function reportDroppedIds(products) {
  if (!fs.existsSync(OUT)) return;
  const prev = fs.readFileSync(OUT, "utf8");
  const prevIds = [...prev.matchAll(/id:\s*"([^"]+)"/g)].map((m) => m[1]);
  if (!prevIds.length) return;

  const now = new Set(products.map((p) => p.id));
  const gone = prevIds.filter((id) => !now.has(id));
  if (gone.length) {
    warnings.push(
      `${gone.length} product ID(s) removed since the last build: ${gone.join(", ")}. ` +
        `Anyone with these saved to their list will lose them.`,
    );
  }

  if (products.length < prevIds.length * SHRINK_LIMIT) {
    errors.push(
      `Refusing to publish: the sheet has ${products.length} products but the live site has ` +
        `${prevIds.length}. That is more than a ${(1 - SHRINK_LIMIT) * 100}% drop, which usually ` +
        `means a broken edit rather than a real change. Re-run once the sheet looks right.`,
    );
  }
}

// ---------- Emit ----------
function renderProductsJs(products, stamp) {
  const line = (p) => {
    const parts = [
      `id: ${JSON.stringify(p.id)}`,
      `name: ${JSON.stringify(p.name)}`,
      `cat: ${JSON.stringify(p.cat)}`,
      `origin: ${JSON.stringify(p.origin)}`,
      `size: ${JSON.stringify(p.size)}`,
      `price: ${p.price === null ? "null" : p.price}`,
      `desc: ${JSON.stringify(p.desc)}`,
      `badge: ${p.badge === null ? "null" : JSON.stringify(p.badge)}`,
    ];
    if (p.image) parts.push(`image: ${JSON.stringify(p.image)}`);
    return `  { ${parts.join(", ")} },`;
  };

  return `// GENERATED FILE — do not edit by hand.
// Source: the "Products" tab of the Giottos Inventory Google Sheet.
// Rebuilt by tools/build-catalogue.mjs via .github/workflows/catalogue.yml
// Last built: ${stamp}
// To change a price, name or description, edit the sheet, not this file.
window.__GIOTTOS_PRODUCTS = [
${products.map(line).join("\n")}
];
`;
}

// Short content hash keeps returning visitors off a cached copy of the old
// catalogue after a price change.
function hash(text) {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) >>> 0;
  return h.toString(36).slice(0, 7);
}

function stampPages(version) {
  const touched = [];
  for (const page of PAGES) {
    const file = path.join(ROOT, page);
    if (!fs.existsSync(file)) continue;
    const before = fs.readFileSync(file, "utf8");
    const after = before.replace(
      /(<script src="products\.js)(\?v=[^"]*)?(")/,
      `$1?v=${version}$3`,
    );
    if (after !== before) {
      fs.writeFileSync(file, after);
      touched.push(page);
    }
  }
  return touched;
}

// ---------- Run ----------
try {
  const csv = await loadCsv();
  const rows = parseCsv(csv);
  if (rows.length < 2) throw new Error("Sheet has no data rows.");

  const records = toRecords(rows);
  const products = buildProducts(records);
  reportDroppedIds(products);

  if (warnings.length) {
    console.log(`\n${warnings.length} warning(s):`);
    warnings.forEach((w) => console.log(`  ! ${w}`));
  }

  if (errors.length) {
    console.error(`\n${errors.length} error(s) — nothing was written:`);
    errors.forEach((e) => console.error(`  x ${e}`));
    console.error("\nThe live site is unchanged. Fix the sheet and run again.");
    process.exit(1);
  }

  const stamp = new Date().toISOString().replace("T", " ").slice(0, 16) + " UTC";
  const body = renderProductsJs(products, stamp);
  const version = hash(body);

  console.log(`\nValidated ${products.length} products.`);
  console.log(`  with a photo : ${products.filter((p) => p.image).length}`);
  console.log(`  ask in-store : ${products.filter((p) => p.price === null).length}`);
  console.log(`  categories   : ${[...new Set(products.map((p) => p.cat))].sort().join(", ")}`);

  if (dryRun) {
    console.log("\n--dry-run, nothing written.");
    process.exit(0);
  }

  // Compare ignoring the timestamp line, so an unchanged sheet is a no-op
  // rather than a pointless commit every 30 minutes.
  const strip = (s) => s.replace(/^\/\/ Last built:.*$/m, "");
  const prev = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : "";
  const changed = strip(prev) !== strip(body);

  if (changed) {
    fs.writeFileSync(OUT, body);
    console.log(`\nWrote products.js (v=${version})`);
  }

  // Always run, never inside the early exit: stamping is idempotent, and this
  // way a page whose cache-buster went missing is repaired on the next build
  // rather than serving a stale catalogue until the sheet happens to change.
  const touched = stampPages(version);
  if (touched.length) console.log(`Stamped: ${touched.join(", ")}`);

  if (!changed && !touched.length) console.log("\nNo change since the last build.");
} catch (err) {
  console.error(`\nBuild failed: ${err.message}`);
  console.error("The live site is unchanged.");
  process.exit(1);
}
