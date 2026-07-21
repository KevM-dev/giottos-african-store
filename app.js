// Giottos African Store — storefront app (vanilla JS, multi-page)
(() => {
  "use strict";

  // ---------- Contact (assembled at runtime so the raw number never sits in the HTML) ----------
  const CONTACT = (() => {
    const cc = "44"; // UK country code
    const national = ["742", "323", "3050"].join(""); // 7423233050 (no leading 0)
    return {
      tel: "tel:+" + cc + national, // +447423233050
      wa: "https://wa.me/" + cc + national, // wa.me/447423233050
      display: "0" + national.slice(0, 4) + " " + national.slice(4), // 07423 233050
    };
  })();

  // ---------- Data ----------
  const CATEGORIES = [
    "All",
    "Fresh",
    "Pantry",
    "Spices",
    "Frozen",
    "Drinks",
    "Snacks",
  ];

  const CAT_TILES = [
    { label: "Fresh", bg: "url('assets/fresh.jpg') center/cover" },
    { label: "Pantry", bg: "url('assets/pantry.webp') center/cover" },
    { label: "Spices", bg: "url('assets/spices.avif') center/cover" },
    { label: "Frozen", bg: "url('assets/frozen.webp') center/cover" },
    { label: "Drinks", bg: "url('assets/drinks.jpg') center/cover" },
    { label: "Snacks", bg: "url('assets/snacks.webp') center/cover" },
  ];

  const COUNTRIES = [
    "Nigeria",
    "Ghana",
    "Kenya",
    "Cameroon",
    "Senegal",
    "Ethiopia",
    "South Africa",
    "DRC",
    "Uganda",
    "Côte d'Ivoire",
  ];

  const PRODUCTS = [
    {
      id: "p33",
      name: "Peak milk",
      cat: "Pantry",
      origin: "Nigeria",
      size: "2500g",
      price: 26.0,
      desc: "Full-cream powdered milk, the big catering tin.",
      badge: null,
      image: "assets/products/pantry/peak-milk.webp",
    },
    {
      id: "p34",
      name: "Peak milk",
      cat: "Pantry",
      origin: "Nigeria",
      size: "900g",
      price: 10.5,
      desc: "Full-cream powdered milk for the week ahead.",
      badge: null,
      image: "assets/products/pantry/peak-milk.webp",
    },
    {
      id: "p35",
      name: "Peak milk",
      cat: "Pantry",
      origin: "Nigeria",
      size: "400g",
      price: 4.99,
      desc: "Full-cream powdered milk, the everyday size.",
      badge: null,
      image: "assets/products/pantry/peak-milk.webp",
    },
    {
      id: "p36",
      name: "Peak milk evaporated",
      cat: "Pantry",
      origin: "Nigeria",
      size: "can",
      price: 1.5,
      desc: "Evaporated milk for tea, custard, and stews.",
      badge: null,
      image: "assets/products/pantry/peak-milk-evaporated.webp",
    },
    {
      id: "p37",
      name: "Peak milk evaporated",
      cat: "Pantry",
      origin: "Nigeria",
      size: "mini can",
      price: 1.0,
      desc: "Smaller evaporated milk tin, just enough for one pot.",
      badge: null,
      image: "assets/products/pantry/peak-milk-evaporated.webp",
    },
    {
      id: "p38",
      name: "Nido",
      cat: "Pantry",
      origin: "Nigeria",
      size: "2.4kg",
      price: 24.0,
      desc: "Full-cream instant milk powder, catering size.",
      badge: null,
      image: "assets/products/pantry/nido.webp",
    },
    {
      id: "p39",
      name: "Nido",
      cat: "Pantry",
      origin: "Nigeria",
      size: "1.8kg",
      price: 22.0,
      desc: "Full-cream instant milk powder, family size.",
      badge: null,
      image: "assets/products/pantry/nido.webp",
    },
    {
      id: "p40",
      name: "Nido",
      cat: "Pantry",
      origin: "Nigeria",
      size: "900g",
      price: 10.99,
      desc: "Full-cream instant milk powder, the weekly tin.",
      badge: null,
      image: "assets/products/pantry/nido.webp",
    },
    {
      id: "p41",
      name: "Nido",
      cat: "Pantry",
      origin: "Nigeria",
      size: "400g",
      price: 4.99,
      desc: "Full-cream instant milk powder, the everyday size.",
      badge: null,
      image: "assets/products/pantry/nido.webp",
    },
    {
      id: "p42",
      name: "Tropical Sun milk",
      cat: "Pantry",
      origin: "UK",
      size: "large",
      price: 19.99,
      desc: "Full-cream powdered milk, catering size.",
      badge: null,
      image: "assets/products/pantry/tropical-sun-milk.webp",
    },
    {
      id: "p43",
      name: "Tropical Sun milk",
      cat: "Pantry",
      origin: "UK",
      size: "900g",
      price: 8.99,
      desc: "Full-cream powdered milk for the week.",
      badge: null,
      image: "assets/products/pantry/tropical-sun-milk.webp",
    },
    {
      id: "p44",
      name: "Tropical Sun milk",
      cat: "Pantry",
      origin: "UK",
      size: "400g",
      price: 4.39,
      desc: "Full-cream powdered milk, the everyday size.",
      badge: null,
      image: "assets/products/pantry/tropical-sun-milk.webp",
    },
    {
      id: "p45",
      name: "Cerelac",
      cat: "Pantry",
      origin: "Nigeria",
      size: "1kg",
      price: 7.99,
      desc: "Infant cereal, the trusted first-foods brand.",
      badge: null,
      image: "assets/products/pantry/cerelac.webp",
    },
    {
      id: "p46",
      name: "Golden Morn",
      cat: "Pantry",
      origin: "Nigeria",
      size: "500g",
      price: 3.99,
      desc: "Maize and soya breakfast cereal, a Nigerian morning classic.",
      badge: null,
      bg: "linear-gradient(135deg,#b8244c,#4a2618)",
    },
    {
      id: "p47",
      name: "Quaker white oat",
      cat: "Pantry",
      origin: "Nigeria",
      size: "500g",
      price: 2.5,
      desc: "Rolled oats for a quick, filling breakfast.",
      badge: null,
      image: "assets/products/pantry/quaker-white-oat.webp",
    },
    {
      id: "p48",
      name: "Ghana Best hausa koko",
      cat: "Pantry",
      origin: "Ghana",
      size: "400g",
      price: null,
      desc: "Spiced millet porridge flour, a Northern Ghanaian street-food breakfast.",
      badge: null,
      image: "assets/products/pantry/ghana-best-hausa-koko.webp",
    },
    {
      id: "p49",
      name: "Lady B custard",
      cat: "Pantry",
      origin: "Nigeria",
      size: "400g",
      price: 7.99,
      desc: "Classic custard powder for a sweet teatime treat.",
      badge: null,
      image: "assets/products/pantry/lady-b-custard.webp",
    },
    {
      id: "p50",
      name: "Checkers custard 3-in-1",
      cat: "Pantry",
      origin: "Nigeria",
      size: "1kg",
      price: 7.99,
      desc: "Instant custard, milk, and sugar in one, just add water.",
      badge: null,
      image: "assets/products/pantry/checkers-custard-original.webp",
    },
    {
      id: "p51",
      name: "Checkers custard 3-in-1 (vanilla)",
      cat: "Pantry",
      origin: "Nigeria",
      size: "1kg",
      price: 7.0,
      desc: "Vanilla instant custard, milk, and sugar in one.",
      badge: null,
      image: "assets/products/pantry/checkers-custard-vanilla.webp",
    },
    {
      id: "p52",
      name: "Checkers custard 3-in-1",
      cat: "Pantry",
      origin: "Nigeria",
      size: "400g",
      price: 2.99,
      desc: "Instant custard, milk, and sugar in one, the small tin.",
      badge: null,
      image: "assets/products/pantry/checkers-custard-400g.webp",
    },
    {
      id: "p53",
      name: "Dunn's River coconut milk",
      cat: "Pantry",
      origin: "UK",
      size: "400ml",
      price: null,
      desc: "Creamy tinned coconut milk for soups and stews.",
      badge: null,
      image: "assets/products/pantry/dunns-river-coconut-milk.webp",
    },
    {
      id: "p54",
      name: "Maggi coconut milk powder",
      cat: "Pantry",
      origin: "Nigeria",
      size: "300g",
      price: 8.5,
      desc: "Powdered coconut milk, just add water for instant coconut cream.",
      badge: null,
      image: "assets/products/pantry/maggi-coconut-milk-powder.webp",
    },
    {
      id: "p55",
      name: "Geisha mackerel",
      cat: "Pantry",
      origin: "Norway",
      size: "big tin",
      price: 2.5,
      desc: "Mackerel in tomato sauce, a store-cupboard staple with rice.",
      badge: null,
      image: "assets/products/pantry/geisha-mackerel.webp",
    },
    {
      id: "p56",
      name: "Sardine",
      cat: "Pantry",
      origin: "Morocco",
      size: "125g",
      price: 1.99,
      desc: "Tinned sardines, quick protein for rice or bread.",
      badge: null,
      image: "assets/products/pantry/sardine.webp",
    },
    {
      id: "p57",
      name: "Corned beef Exeter",
      cat: "Pantry",
      origin: "UK",
      size: "340g",
      price: null,
      desc: "Classic tinned corned beef for stew, sandwiches, or fried rice.",
      badge: null,
      image: "assets/products/pantry/corned-beef-exeter.webp",
    },
    {
      id: "p58",
      name: "Tropical Sun pure honey",
      cat: "Pantry",
      origin: "UK",
      size: "370g",
      price: null,
      desc: "Pure honey, unblended and naturally sweet.",
      badge: null,
      image: "assets/products/pantry/tropical-sun-pure-honey.webp",
    },
    {
      id: "p59",
      name: "Tropical Sun blossom honey",
      cat: "Pantry",
      origin: "UK",
      size: "370g",
      price: null,
      desc: "Blossom honey, light and floral.",
      badge: null,
      image: "assets/products/pantry/tropical-sun-blossom-honey.webp",
    },
    {
      id: "p60",
      name: "Africa Finest peanut butter",
      cat: "Pantry",
      origin: "Nigeria",
      size: "510g",
      price: null,
      desc: "Smooth peanut butter, ground the traditional way.",
      badge: null,
      image: "assets/products/pantry/africa-finest-peanut-butter.webp",
    },
    {
      id: "p61",
      name: "Tropical Sun crunchy peanut butter",
      cat: "Pantry",
      origin: "UK",
      size: "350g",
      price: 3.25,
      desc: "Crunchy peanut butter with real peanut pieces.",
      badge: null,
      image: "assets/products/pantry/tropical-sun-crunchy-peanut-butter.webp",
    },
    {
      id: "p62",
      name: "Blue Band margarine",
      cat: "Pantry",
      origin: "Nigeria",
      size: "500g",
      price: 5.99,
      desc: "Everyday spreadable margarine for bread and baking.",
      badge: null,
      image: "assets/products/pantry/blue-band-margarine.webp",
    },
    {
      id: "p63",
      name: "Blue Band margarine",
      cat: "Pantry",
      origin: "Nigeria",
      size: "250g",
      price: 3.99,
      desc: "Everyday spreadable margarine, the smaller tub.",
      badge: null,
      image: "assets/products/pantry/blue-band-margarine.webp",
    },
    {
      id: "p64",
      name: "STK Royal yeast",
      cat: "Pantry",
      origin: "Nigeria",
      size: "11g sachet",
      price: null,
      desc: "Baker's yeast for bread, buns, and puff-puff.",
      badge: null,
      image: "assets/products/pantry/stk-royal-yeast.webp",
    },
    {
      id: "p65",
      name: "Oluys pure cocoa powder",
      cat: "Pantry",
      origin: "Ghana",
      size: "200g",
      price: null,
      desc: "Unsweetened cocoa powder for baking and hot chocolate.",
      badge: null,
      image: "assets/products/pantry/oluys-cocoa-powder.webp",
    },
    {
      id: "p66",
      name: "St Louis sugar",
      cat: "Pantry",
      origin: "Senegal",
      size: "1kg",
      price: 2.5,
      desc: "Fine white sugar from Senegal's own St Louis mills.",
      badge: null,
      image: "assets/products/pantry/st-louis-sugar.webp",
    },
    {
      id: "p67",
      name: "Golden Penny spaghetti",
      cat: "Pantry",
      origin: "Nigeria",
      size: "500g",
      price: 1.5,
      desc: "Everyday spaghetti from Nigeria's biggest pasta brand.",
      badge: null,
      image: "assets/products/pantry/golden-penny-spaghetti.webp",
    },
    {
      id: "p68",
      name: "Rice stick",
      cat: "Pantry",
      origin: "Vietnam",
      size: "400g",
      price: 2.97,
      desc: "Flat rice noodles for stir-fries and soups.",
      badge: null,
      image: "assets/products/pantry/rice-stick.webp",
    },
    {
      id: "p69",
      name: "Tropical Sun hominy corn",
      cat: "Pantry",
      origin: "UK",
      size: "400g",
      price: 4.99,
      desc: "Tinned hominy corn for soups and stews.",
      badge: null,
      image: "assets/products/pantry/tropical-sun-hominy-corn.webp",
    },
    {
      id: "p70",
      name: "Bournvita",
      cat: "Drinks",
      origin: "Nigeria",
      size: "900g",
      price: 8.99,
      desc: "Chocolate malt drink, a Nigerian breakfast-table staple.",
      badge: null,
      bg: "linear-gradient(135deg,#b8244c,#4a2618)",
    },
    {
      id: "p71",
      name: "Bournvita",
      cat: "Drinks",
      origin: "Nigeria",
      size: "500g",
      price: 4.5,
      desc: "Chocolate malt drink, the smaller tin.",
      badge: null,
      bg: "linear-gradient(135deg,#6e8b4a,#4a6d8c)",
    },
    {
      id: "p72",
      name: "Nestle Milo",
      cat: "Drinks",
      origin: "Ghana",
      size: "1.4kg",
      price: 13.0,
      desc: "Chocolate-malt classic, the big family tin.",
      badge: null,
      image: "assets/products/drinks/nestle-milo.webp",
    },
    {
      id: "p73",
      name: "Nestle Milo",
      cat: "Drinks",
      origin: "Ghana",
      size: "400g",
      price: 4.0,
      desc: "Chocolate-malt classic, the everyday tin.",
      badge: null,
      image: "assets/products/drinks/nestle-milo.webp",
    },
    {
      id: "p74",
      name: "Nestle Milo sachet",
      cat: "Drinks",
      origin: "Ghana",
      size: "400g sachets",
      price: 5.5,
      desc: "Chocolate-malt drink in individual sachets.",
      badge: null,
      bg: "linear-gradient(135deg,#6e8b4a,#3f5028)",
    },
    {
      id: "p75",
      name: "Nestle Milo sachet",
      cat: "Drinks",
      origin: "Ghana",
      size: "900g sachets",
      price: 9.5,
      desc: "Chocolate-malt drink in individual sachets, family pack.",
      badge: null,
      bg: "linear-gradient(135deg,#c45a2c,#8a1a39)",
    },
    {
      id: "p76",
      name: "Ovaltine Original",
      cat: "Drinks",
      origin: "Nigeria",
      size: "800g",
      price: 12.99,
      desc: "Malted milk drink, a classic bedtime favourite.",
      badge: null,
      bg: "linear-gradient(135deg,#4a2618,#1f1a18)",
    },
    {
      id: "p77",
      name: "Tropical Sun drinking chocolate",
      cat: "Drinks",
      origin: "UK",
      size: "400g",
      price: 14.0,
      desc: "Rich drinking chocolate for a proper mug of cocoa.",
      badge: null,
      bg: "linear-gradient(135deg,#6e8b4a,#2a3f1c)",
    },
    {
      id: "p78",
      name: "Nestle Original 3-in-1",
      cat: "Drinks",
      origin: "Nigeria",
      size: "10 sachets",
      price: null,
      desc: "Instant coffee, creamer, and sugar in one sachet.",
      badge: null,
      bg: "linear-gradient(135deg,#b8244c,#4a2618)",
    },
    {
      id: "p79",
      name: "Lipton Yellow Label",
      cat: "Drinks",
      origin: "Kenya",
      size: "100 teabags",
      price: 4.99,
      desc: "The everyday black tea, 100 bags to keep you going.",
      badge: null,
      bg: "linear-gradient(135deg,#6e8b4a,#4a6d8c)",
    },
    {
      id: "p80",
      name: "Kopiko coffee",
      cat: "Drinks",
      origin: "Indonesia",
      size: "10 sticks",
      price: 3.99,
      desc: "Instant coffee sachets from the coffee-candy brand.",
      badge: null,
      bg: "linear-gradient(135deg,#c45a2c,#b8244c)",
    },
    {
      id: "p81",
      name: "Tropical Sun coffee",
      cat: "Drinks",
      origin: "UK",
      size: "100g",
      price: 3.25,
      desc: "Instant coffee, smooth and reliable.",
      badge: null,
      bg: "linear-gradient(135deg,#e6a531,#c45a2c)",
    },
    {
      id: "p82",
      name: "Gold Killi ginger drink",
      cat: "Drinks",
      origin: "Malaysia",
      size: "sachet",
      price: 4.0,
      desc: "Instant ginger tea powder, steep and stir.",
      badge: null,
      bg: "linear-gradient(135deg,#6e8b4a,#3f5028)",
    },
    {
      id: "p83",
      name: "Village Pride ginger drink",
      cat: "Drinks",
      origin: "Nigeria",
      size: "sachet",
      price: 2.99,
      desc: "Instant ginger drink powder, warming and spiced.",
      badge: null,
      bg: "linear-gradient(135deg,#c45a2c,#8a1a39)",
    },
    {
      id: "p84",
      name: "Tropical Sun ginger drink",
      cat: "Drinks",
      origin: "UK",
      size: "sachet",
      price: 2.99,
      desc: "Instant ginger drink powder, warming and spiced.",
      badge: null,
      bg: "linear-gradient(135deg,#4a2618,#1f1a18)",
    },
    {
      id: "p85",
      name: "Kopiko candy",
      cat: "Snacks",
      origin: "Indonesia",
      size: "150g",
      price: 1.5,
      desc: "Coffee-flavoured hard candy, a little pick-me-up.",
      badge: null,
      bg: "linear-gradient(135deg,#6e8b4a,#2a3f1c)",
    },
    {
      id: "p86",
      name: "Tom Tom",
      cat: "Snacks",
      origin: "Nigeria",
      size: "200g",
      price: 1.5,
      desc: "Classic minty-menthol boiled sweets.",
      badge: null,
      bg: "linear-gradient(135deg,#b8244c,#4a2618)",
    },
    {
      id: "p87",
      name: "Tropical Sun popcorn",
      cat: "Snacks",
      origin: "UK",
      size: "100g",
      price: 4.99,
      desc: "Ready-to-eat popcorn for movie night.",
      badge: null,
      bg: "linear-gradient(135deg,#6e8b4a,#4a6d8c)",
    },
    {
      id: "p88",
      name: "Ducros curry",
      cat: "Spices",
      origin: "France",
      size: "25g",
      price: 1.0,
      desc: "Curry powder in the small jar, French-milled.",
      badge: null,
      bg: "linear-gradient(135deg,#c45a2c,#b8244c)",
    },
    {
      id: "p89",
      name: "Ducros thyme",
      cat: "Spices",
      origin: "France",
      size: "15g",
      price: 1.0,
      desc: "Dried thyme in the small jar, French-milled.",
      badge: null,
      bg: "linear-gradient(135deg,#e6a531,#c45a2c)",
    },
    {
      id: "p90",
      name: "Tiger",
      cat: "Spices",
      origin: "Nigeria",
      size: "25g",
      price: 1.0,
      desc: "Grouped with your curry and thyme on the list, flagging this one for you to confirm the full product name.",
      badge: null,
      bg: "linear-gradient(135deg,#6e8b4a,#3f5028)",
    },
    {
      id: "p91",
      name: "Gino dried thyme",
      cat: "Spices",
      origin: "Nigeria",
      size: "5g",
      price: null,
      desc: "Dried thyme sachet for soups and stews.",
      badge: null,
      bg: "linear-gradient(135deg,#c45a2c,#8a1a39)",
    },
    {
      id: "p92",
      name: "Gino Asun cube",
      cat: "Spices",
      origin: "Nigeria",
      size: "60g",
      price: 1.5,
      desc: "Spiced stock cube for asun and grilled meat.",
      badge: null,
      bg: "linear-gradient(135deg,#4a2618,#1f1a18)",
    },
    {
      id: "p93",
      name: "Nkulenu soup base",
      cat: "Spices",
      origin: "Ghana",
      size: "780g",
      price: 3.5,
      desc: "Concentrated palm-nut cream for banga and palm-nut soup.",
      badge: null,
      bg: "linear-gradient(135deg,#6e8b4a,#2a3f1c)",
    },
    {
      id: "p94",
      name: "Africa Finest banga soup base",
      cat: "Spices",
      origin: "Nigeria",
      size: "350g",
      price: 3.5,
      desc: "Concentrated palm-nut cream for banga soup.",
      badge: null,
      bg: "linear-gradient(135deg,#b8244c,#4a2618)",
    },
    {
      id: "p95",
      name: "Tropical Sun chicken cube",
      cat: "Spices",
      origin: "UK",
      size: "100g",
      price: 3.29,
      desc: "Chicken stock cubes for everyday cooking.",
      badge: null,
      bg: "linear-gradient(135deg,#6e8b4a,#4a6d8c)",
    },
    {
      id: "p96",
      name: "Tasty Cube powder",
      cat: "Spices",
      origin: "China",
      size: "1kg",
      price: 4.99,
      desc: "All-purpose seasoning powder, the catering tub.",
      badge: null,
      bg: "linear-gradient(135deg,#c45a2c,#b8244c)",
    },
    {
      id: "p97",
      name: "Tasty Cube powder",
      cat: "Spices",
      origin: "China",
      size: "400g",
      price: 3.0,
      desc: "All-purpose seasoning powder, the everyday tub.",
      badge: null,
      bg: "linear-gradient(135deg,#e6a531,#c45a2c)",
    },
    {
      id: "p98",
      name: "Tasty Cube",
      cat: "Spices",
      origin: "China",
      size: "80g",
      price: 1.5,
      desc: "All-purpose seasoning cubes, the small pack.",
      badge: null,
      bg: "linear-gradient(135deg,#6e8b4a,#3f5028)",
    },
    {
      id: "p99",
      name: "Knorr chicken and beef",
      cat: "Spices",
      origin: "Nigeria",
      size: "8 cubes",
      price: 2.5,
      desc: "Chicken and beef stock cubes, the kitchen staple.",
      badge: null,
      bg: "linear-gradient(135deg,#c45a2c,#8a1a39)",
    },
    {
      id: "p100",
      name: "Super Seasoning Vedan",
      cat: "Spices",
      origin: "Vietnam",
      size: "454g",
      price: 1.5,
      desc: "MSG-based all-purpose seasoning for soups and stir-fries.",
      badge: null,
      bg: "linear-gradient(135deg,#4a2618,#1f1a18)",
    },
    {
      id: "p101",
      name: "Fresh ugu leaves",
      cat: "Fresh",
      origin: "Nigeria",
      size: "bunch",
      price: null,
      desc: "Off the Friday truck, best in two days.",
      badge: "Fresh",
      bg: "linear-gradient(135deg,#6e8b4a,#3f5028)",
    },
    {
      id: "p102",
      name: "Plantain (ripe)",
      cat: "Fresh",
      origin: "Cameroon",
      size: "3-pack",
      price: null,
      desc: "Sweet for dodo, fry low and slow.",
      badge: null,
      image: "assets/products/fresh/ripe-plantain.webp",
    },
    {
      id: "p103",
      name: "Bottle gourd (calabash)",
      cat: "Fresh",
      origin: "Kenya",
      size: "each",
      price: null,
      desc: "Whole, fresh, great in stews.",
      badge: null,
      bg: "linear-gradient(135deg,#6e8b4a,#4a6d8c)",
    },
    {
      id: "p104",
      name: "Scotch bonnet chillies",
      cat: "Fresh",
      origin: "Ghana",
      size: "200g",
      price: null,
      desc: "Fierce, fruity heat, the soul of jollof and pepper soup.",
      badge: "Fresh",
      image: "assets/products/fresh/chillies.webp",
    },
    {
      id: "p105",
      name: "Green plantain",
      cat: "Fresh",
      origin: "Cameroon",
      size: "3-pack",
      price: null,
      desc: "Firm and starchy, for boli, kelewele, or chips.",
      badge: null,
      image: "assets/products/fresh/green-plantain.webp",
    },
    {
      id: "p106",
      name: "Puna yam",
      cat: "Fresh",
      origin: "Ghana",
      size: "tuber",
      price: null,
      desc: "Whole West-African yam, pound it, fry it, boil it.",
      badge: null,
      image: "assets/products/fresh/yam.webp",
    },
    {
      id: "p107",
      name: "Cocoyam",
      cat: "Fresh",
      origin: "Nigeria",
      size: "each",
      price: null,
      desc: "Earthy and starchy, great in pepper soup or boiled as a side.",
      badge: null,
      image: "assets/products/fresh/cocoyam.webp",
    },
    {
      id: "p108",
      name: "Long bell pepper",
      cat: "Fresh",
      origin: "Ghana",
      size: "200g",
      price: null,
      desc: "Sweet and mild heat, roast into stew base or eat fresh.",
      badge: "Fresh",
      image: "assets/products/fresh/long-bell-pepper.webp",
    },
    {
      id: "p109",
      name: "Fresh tomatoes",
      cat: "Fresh",
      origin: "Nigeria",
      size: "500g",
      price: null,
      desc: "Plum tomatoes off the Friday truck, the stew starts here.",
      badge: "Fresh",
      image: "assets/products/fresh/tomatoes.webp",
    },
  ];

  // ---------- Deals (hero slideshow) ----------
  const DEALS = [
    {
      name: "Blue Band margarine",
      sub: "500g · Save 20% this week",
      was: 5.99,
      now: 4.79,
      bg: "linear-gradient(135deg,#e6a531,#c45a2c)",
    },
    {
      name: "Nestlé Milo",
      sub: "1.4kg · The family tin, discounted",
      was: 13.0,
      now: 11.0,
      bg: "linear-gradient(135deg,#c45a2c,#8a1a39)",
    },
    {
      name: "Golden Penny spaghetti",
      sub: "500g · Stock up and save",
      was: 1.5,
      now: 1.2,
      bg: "linear-gradient(135deg,#6e8b4a,#3f5028)",
    },
  ];

  // ---------- State ----------
  const state = {
    query: "",
    activeCat: "All",
  };

  // ---------- Utils ----------
  const $ = (sel) => document.querySelector(sel);
  const fmtPrice = (n) => `£${n.toFixed(2)}`;
  const escapeHtml = (s) =>
    String(s).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );

  // ---------- Render: category bar (shop page) ----------
  function renderCatBar() {
    const bar = $("#catBar");
    if (!bar) return;
    bar.innerHTML = "";
    CATEGORIES.forEach((c) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "gh-catLink" + (state.activeCat === c ? " is-active" : "");
      btn.textContent = c;
      btn.addEventListener("click", () => {
        state.activeCat = c;
        renderCatBar();
        renderProducts();
        scrollToProducts();
      });
      bar.appendChild(btn);
    });
  }

  // ---------- Render: category tiles (home page — link to shop) ----------
  function renderCatTiles() {
    const grid = $("#catGrid");
    if (!grid) return;
    grid.innerHTML = "";
    CAT_TILES.forEach((c) => {
      const a = document.createElement("a");
      a.href = `shop.html?cat=${encodeURIComponent(c.label)}`;
      a.className = "gh-catTile";
      a.innerHTML = `<div class="gh-catCircle" style="background:${c.bg}"></div><span class="gh-catLabel">${escapeHtml(c.label)}</span>`;
      grid.appendChild(a);
    });
  }

  // ---------- Render: countries ----------
  function renderCountries() {
    const list = $("#countryList");
    if (!list) return;
    list.innerHTML = COUNTRIES.map(
      (c) => `<span class="gh-countryChip">${escapeHtml(c)}</span>`,
    ).join("");
  }

  // ---------- Render: product grid (shop page) ----------
  function renderProducts() {
    const grid = $("#prodGrid");
    if (!grid) return;
    const empty = $("#prodEmpty");
    const title = $("#prodTitle");
    if (title)
      title.textContent =
        state.activeCat && state.activeCat !== "All"
          ? state.activeCat
          : "All products";

    const q = state.query.trim().toLowerCase();
    const filtered = PRODUCTS.filter((p) => {
      if (state.activeCat !== "All" && p.cat !== state.activeCat) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.origin.toLowerCase().includes(q) ||
        p.cat.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q)
      );
    });

    if (filtered.length === 0) {
      grid.hidden = true;
      grid.innerHTML = "";
      if (empty) {
        empty.hidden = false;
        empty.innerHTML = q
          ? `<p>Nothing matches "${escapeHtml(state.query)}". Try "egusi", "palm oil", or "ugu".</p>`
          : `<p>No products in this category just now. Check back Friday.</p>`;
      }
      return;
    }

    if (empty) empty.hidden = true;
    grid.hidden = false;
    grid.innerHTML = filtered
      .map((p) => {
        const badgeCls =
          p.badge === "Sale"
            ? "is-sale"
            : p.badge === "Fresh"
              ? "is-fresh"
              : "";
        const badge = p.badge
          ? `<span class="gh-pBadge ${badgeCls}">${escapeHtml(p.badge)}</span>`
          : "";
        const visual = p.image
          ? `<div class="gh-pimgBg gh-pimgBg--photo" style="background-image:url('${p.image}')" role="img" aria-label="${escapeHtml(p.name)}"></div>`
          : `<div class="gh-pimgBg" style="background:${p.bg}"><span class="gh-pimgLabel">${escapeHtml(p.name)}</span></div>`;
        return `
        <article class="gh-pcard" data-id="${p.id}">
          <div class="gh-pimg">
            ${visual}
            ${badge}
          </div>
          <div class="gh-pBody">
            <div class="gh-pNameRow">
              <div class="gh-pName">${escapeHtml(p.name)}</div>
              <span class="gh-pSize">${escapeHtml(p.size)}</span>
            </div>
            <p class="gh-pDesc">${escapeHtml(p.desc)}</p>
            <div class="gh-pFoot">
              <span class="gh-pPrice${p.price == null ? " is-poa" : ""}">${p.price == null ? "Ask in-store" : fmtPrice(p.price)}</span>
            </div>
          </div>
        </article>`;
      })
      .join("");
  }

  // ---------- Scroll helper ----------
  function scrollToProducts() {
    const sec = $("#prodSection");
    if (sec) sec.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ---------- Read ?cat= from URL (shop page) ----------
  function applyCatFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("cat");
    if (!raw) return;
    const match = CATEGORIES.find((c) => c.toLowerCase() === raw.toLowerCase());
    if (match) state.activeCat = match;
  }

  // ---------- Contact form ----------
  function bindContactForm() {
    const form = $("#contactForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = ($("#cfName").value || "").trim();
      const message = ($("#cfMessage").value || "").trim();
      if (!name || !message) {
        form.reportValidity();
        return;
      }
      const text = `Hi Giottos, my name is ${name}.\n\n${message}`;
      const url = `${CONTACT.wa}?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank");
    });
  }

  // ---------- Render: deal slider (home page) ----------
  function initDealSlider() {
    const slider = $("#dealSlider");
    const dotsEl = $("#dealDots");
    if (!slider || !dotsEl || !DEALS.length) return;

    let current = 0;

    DEALS.forEach((deal, i) => {
      const slide = document.createElement("div");
      slide.className = "gh-dealSlide" + (i === 0 ? " is-active" : "");
      slide.setAttribute("role", "group");
      slide.setAttribute("aria-label", `Deal ${i + 1} of ${DEALS.length}`);
      const slideVisual = deal.image
        ? `<div class="gh-dealSlideImg" style="background-image:url('${escapeHtml(deal.image)}')"></div>`
        : `<div class="gh-dealSlideImg" style="background:${deal.bg}"></div>`;
      slide.innerHTML = `
        ${slideVisual}
        <div class="gh-dealOverlay"></div>
        <div class="gh-dealContent">
          <span class="gh-dealBadge">★ This week's deal</span>
          <div class="gh-dealInfo">
            <div class="gh-dealName">${escapeHtml(deal.name)}</div>
            <div class="gh-dealPrices">
              <span class="gh-dealWas">${fmtPrice(deal.was)}</span>
              <span class="gh-dealNow">${fmtPrice(deal.now)}</span>
            </div>
            <span class="gh-dealSub">${escapeHtml(deal.sub)}</span>
          </div>
        </div>`;
      slider.insertBefore(slide, dotsEl);

      if (DEALS.length > 1) {
        const dot = document.createElement("button");
        dot.className = "gh-dealDot" + (i === 0 ? " is-active" : "");
        dot.setAttribute("aria-label", `Deal ${i + 1}`);
        dot.dataset.idx = i;
        dot.addEventListener("click", () => goTo(i));
        dotsEl.appendChild(dot);
      }
    });

    const slides = slider.querySelectorAll(".gh-dealSlide");
    const dots = dotsEl.querySelectorAll(".gh-dealDot");

    function goTo(idx) {
      slides[current].classList.remove("is-active");
      if (dots[current]) dots[current].classList.remove("is-active");
      current = idx;
      slides[current].classList.add("is-active");
      if (dots[current]) dots[current].classList.add("is-active");
    }

    if (DEALS.length > 1) {
      setInterval(() => goTo((current + 1) % DEALS.length), 4000);
    }
  }

  // ---------- Bindings ----------
  function bind() {
    const search = $("#search");
    if (search) {
      search.addEventListener("input", (e) => {
        state.query = e.target.value;
        renderProducts();
      });
    }

    hydrateContacts();
    bindContactForm();
    bindFab();
    bindBurgerMenu();

    const yr = $("#year");
    if (yr) yr.textContent = new Date().getFullYear();
  }

  // ---------- Fill phone / WhatsApp links + visible number at runtime ----------
  function hydrateContacts() {
    document
      .querySelectorAll("[data-tel]")
      .forEach((el) => el.setAttribute("href", CONTACT.tel));
    document
      .querySelectorAll("[data-wa]")
      .forEach((el) => el.setAttribute("href", CONTACT.wa));
    document.querySelectorAll("[data-phone]").forEach((el) => {
      el.textContent = CONTACT.display;
    });
  }

  // ---------- Floating contact button ----------
  function bindFab() {
    const fab = $("#fab");
    const toggle = $("#fabToggle");
    if (!fab || !toggle) return;

    const close = () => {
      fab.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    };
    const open = () => {
      fab.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
    };

    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      fab.classList.contains("is-open") ? close() : open();
    });
    // Close when tapping outside or pressing Escape
    document.addEventListener("click", (e) => {
      if (!fab.contains(e.target)) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  // ---------- Hamburger menu (mobile) ----------
  function bindBurgerMenu() {
    const burger = $("#burger");
    const menu = $("#mobileMenu");
    if (!burger || !menu) return;

    const close = () => {
      burger.classList.remove("is-open");
      menu.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    };
    const open = () => {
      burger.classList.add("is-open");
      menu.classList.add("is-open");
      burger.setAttribute("aria-expanded", "true");
    };

    burger.addEventListener("click", (e) => {
      e.stopPropagation();
      burger.classList.contains("is-open") ? close() : open();
    });
    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", close);
    });
    document.addEventListener("click", (e) => {
      // The menu now spans the full viewport height, so a tap on its own
      // backdrop (not on a link) counts as "outside the nav content" too.
      if (e.target === menu) {
        close();
        return;
      }
      if (!menu.contains(e.target) && !burger.contains(e.target)) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
    // Close on scroll so the menu never sits open (and blocking taps)
    // over content the user has scrolled to.
    window.addEventListener(
      "scroll",
      () => {
        if (burger.classList.contains("is-open")) close();
      },
      { passive: true },
    );
  }

  // ---------- Boot ----------
  document.addEventListener("DOMContentLoaded", () => {
    applyCatFromUrl();
    renderCatBar();
    renderCatTiles();
    renderCountries();
    renderProducts();
    initDealSlider();
    bind();
  });
})();
