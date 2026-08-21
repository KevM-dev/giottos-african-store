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
      image: "assets/products/pantry/golden-morn.webp",
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
      image: "assets/products/drinks/bournvita.webp",
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
      image: "assets/products/drinks/bournvita.webp",
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
      image: "assets/products/drinks/nestle-milo-sachet.webp",
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
      image: "assets/products/drinks/nestle-milo-sachet.webp",
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
      image: "assets/products/drinks/ovaltine-original.webp",
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
      image: "assets/products/drinks/tropical-sun-drinking-chocolate.webp",
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
      image: "assets/products/drinks/nestle-3in1.webp",
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
      image: "assets/products/drinks/lipton-yellow-label.webp",
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
      image: "assets/products/drinks/kopiko-coffee.webp",
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
      image: "assets/products/drinks/tropical-sun-coffee.webp",
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
      image: "assets/products/drinks/gold-killi-ginger-drink.webp",
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
      image: "assets/products/drinks/village-pride-ginger-drink.webp",
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
      image: "assets/products/drinks/tropical-sun-ginger-drink.webp",
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
      image: "assets/products/snacks/kopiko-candy.webp",
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
      image: "assets/products/snacks/tom-tom.webp",
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
      image: "assets/products/snacks/tropical-sun-popcorn.webp",
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
      image: "assets/products/spices/ducros-curry.webp",
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
      image: "assets/products/spices/ducros-thyme.webp",
    },
    {
      id: "p90",
      name: "Tiger thyme",
      cat: "Spices",
      origin: "Nigeria",
      size: "25g",
      price: 1.0,
      desc: "Dried thyme, the Tiger-brand pack.",
      badge: null,
      image: "assets/products/spices/tiger-thyme.webp",
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
      image: "assets/products/spices/gino-dried-thyme.webp",
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
      image: "assets/products/spices/gino-asun-cube.webp",
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
      image: "assets/products/spices/nkulenu-soup-base.webp",
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
      image: "assets/products/spices/africa-finest-banga-soup-base.webp",
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
      image: "assets/products/spices/tropical-sun-chicken-cube.webp",
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
      image: "assets/products/spices/tasty-cube-powder-1kg.webp",
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
      image: "assets/products/spices/tasty-cube-powder-400g.webp",
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
      image: "assets/products/spices/tasty-cube.webp",
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
      image: "assets/products/spices/knorr-chicken-and-beef.webp",
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
      image: "assets/products/spices/super-seasoning-vedan.webp",
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
      image: "assets/products/pantry/blue-band-margarine.webp",
    },
    {
      name: "Nestlé Milo",
      sub: "1.4kg · The family tin, discounted",
      was: 13.0,
      now: 11.0,
      image: "assets/products/drinks/nestle-milo.webp",
    },
    {
      name: "Golden Penny spaghetti",
      sub: "500g · Stock up and save",
      was: 1.5,
      now: 1.2,
      image: "assets/products/pantry/golden-penny-spaghetti.webp",
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
  const escapeRe = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Lower-case and strip accents so "cote" finds "Côte d'Ivoire".
  const normalise = (s) =>
    String(s)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  // Every whitespace-separated word must appear somewhere in the product,
  // so "milk peak" finds "Peak milk" just as well as "peak milk" does.
  const queryTokens = (q) => normalise(q).split(/\s+/).filter(Boolean);

  // Searchable text is built once per product and cached on it.
  function haystack(p) {
    if (!p._hay) {
      p._hay = normalise([p.name, p.cat, p.origin, p.size, p.desc].join(" "));
    }
    return p._hay;
  }

  const matches = (p, toks) => toks.every((t) => haystack(p).includes(t));

  // Wrap query hits in <mark>. Input is escaped first, so this stays safe.
  function highlight(text, toks) {
    let html = escapeHtml(text);
    if (!toks.length) return html;
    const re = new RegExp(`(${toks.map(escapeRe).join("|")})`, "gi");
    // Never mark inside an HTML entity such as &amp; or &#39;.
    return html.replace(/&[a-z#0-9]+;|[^&]+/gi, (chunk) =>
      chunk.charAt(0) === "&" ? chunk : chunk.replace(re, "<mark>$1</mark>"),
    );
  }

  // ---------- Category placeholder icons ----------
  // Used when a product has no photo yet, or when its photo fails to load,
  // so a card is never a bare block of text.
  const CAT_ICONS = {
    Fresh:
      '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
    Pantry:
      '<path d="M5 8h14v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2Z"/><path d="M6 8V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3"/><path d="M9 13h6"/>',
    Spices:
      '<path d="M7 3h10l-1 5H8Z"/><path d="M8 8h8l1 11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2Z"/><path d="M11 5.5h.01M13 5.5h.01M12 6.8h.01"/>',
    Frozen:
      '<path d="M12 2v20M4.2 7l15.6 10M19.8 7 4.2 17"/><path d="m9 4 3 2 3-2M9 20l3-2 3 2"/>',
    Drinks:
      '<path d="M6 3h12l-1.2 16a2 2 0 0 1-2 1.9H9.2a2 2 0 0 1-2-1.9Z"/><path d="M6.5 9h11"/>',
    Snacks:
      '<path d="M4 9h16l-1.4 10a2 2 0 0 1-2 1.7H7.4a2 2 0 0 1-2-1.7Z"/><path d="m4 9 2.5-5h11L20 9"/><path d="M10 13v4M14 13v4"/>',
  };

  function placeholderMarkup(p) {
    const glyph = CAT_ICONS[p.cat] || CAT_ICONS.Pantry;
    return `<div class="gh-pimgPh" data-cat="${escapeHtml(p.cat)}" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${glyph}</svg>
        <span>${escapeHtml(p.cat)}</span>
      </div>`;
  }

  // ---------- Search / filter core ----------
  // Products matching the current query, ignoring the category filter.
  function queryMatches() {
    const toks = queryTokens(state.query);
    return toks.length ? PRODUCTS.filter((p) => matches(p, toks)) : PRODUCTS;
  }

  // How many of those sit in each category, so the bar can show live counts.
  function countsByCat(pool) {
    const counts = { All: pool.length };
    CATEGORIES.forEach((c) => {
      if (c !== "All") counts[c] = 0;
    });
    pool.forEach((p) => {
      if (counts[p.cat] != null) counts[p.cat] += 1;
    });
    return counts;
  }

  // ---------- Render: category bar (shop page) ----------
  function renderCatBar() {
    const bar = $("#catBar");
    if (!bar) return;
    const counts = countsByCat(queryMatches());
    // The strip scrolls sideways on mobile; keep the reader's place across
    // the rebuild that every keystroke triggers.
    const scrollLeft = bar.scrollLeft;
    bar.innerHTML = "";
    CATEGORIES.forEach((c) => {
      const n = counts[c] || 0;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "gh-catLink" +
        (state.activeCat === c ? " is-active" : "") +
        (n === 0 ? " is-empty" : "");
      btn.innerHTML = `${escapeHtml(c)}<span class="gh-catCount">${n}</span>`;
      btn.setAttribute(
        "aria-pressed",
        state.activeCat === c ? "true" : "false",
      );
      btn.title = n === 1 ? `${c}: 1 item` : `${c}: ${n} items`;
      btn.addEventListener("click", () => {
        setCat(c);
        scrollToProducts();
      });
      bar.appendChild(btn);
    });
    bar.scrollLeft = scrollLeft;
  }

  function setCat(c) {
    state.activeCat = c;
    render();
    syncUrl();
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
    const count = $("#prodCount");
    const inCat = state.activeCat && state.activeCat !== "All";
    if (title) title.textContent = inCat ? state.activeCat : "All products";

    const toks = queryTokens(state.query);
    const pool = queryMatches();
    const filtered = inCat
      ? pool.filter((p) => p.cat === state.activeCat)
      : pool;

    if (count) {
      count.textContent = toks.length
        ? `${filtered.length} ${filtered.length === 1 ? "match" : "matches"}`
        : `${filtered.length} in store now`;
    }

    if (filtered.length === 0) {
      grid.hidden = true;
      grid.innerHTML = "";
      if (empty) {
        empty.hidden = false;
        // If the query does match elsewhere, offer a way out of the category
        // filter rather than leaving a dead end.
        if (toks.length && inCat && pool.length > 0) {
          empty.innerHTML = `<p>Nothing in <strong>${escapeHtml(state.activeCat)}</strong> matches "${escapeHtml(state.query.trim())}", but ${pool.length} ${pool.length === 1 ? "item matches" : "items match"} elsewhere.</p>
            <button type="button" class="gh-emptyBtn" id="emptyShowAll">Search all categories</button>`;
          const btn = $("#emptyShowAll");
          if (btn) btn.addEventListener("click", () => setCat("All"));
        } else if (toks.length) {
          empty.innerHTML = `<p>Nothing matches "${escapeHtml(state.query.trim())}". Try ${suggestionHtml()} — or ring us and we'll check the back.</p>
            <button type="button" class="gh-emptyBtn" id="emptyClear">Clear search</button>`;
          const btn = $("#emptyClear");
          if (btn) btn.addEventListener("click", clearSearch);
        } else {
          empty.innerHTML = `<p>Nothing in ${escapeHtml(state.activeCat)} on the shelves this week. Check back Friday, or give us a ring.</p>`;
        }
      }
      return;
    }

    if (empty) empty.hidden = true;
    grid.hidden = false;
    grid.innerHTML = filtered.map((p) => cardMarkup(p, toks)).join("");
    // A photo served straight from cache can finish before its onload runs,
    // which would leave the card faded out. Catch those here.
    grid.querySelectorAll(".gh-pimgPhoto").forEach((img) => {
      if (img.complete && img.naturalWidth > 0) img.classList.add("is-loaded");
    });
  }

  function cardMarkup(p, toks) {
    const badgeCls =
      p.badge === "Sale" ? "is-sale" : p.badge === "Fresh" ? "is-fresh" : "";
    const badge = p.badge
      ? `<span class="gh-pBadge ${badgeCls}">${escapeHtml(p.badge)}</span>`
      : "";
    const alt = escapeHtml(`${p.name}, ${p.size}`);
    // Images load lazily and fall back to a branded category icon, so a slow
    // connection or a missing file never leaves an empty card.
    const visual = p.image
      ? `${placeholderMarkup(p)}<img class="gh-pimgPhoto" src="${escapeHtml(p.image)}" alt="${alt}" loading="lazy" decoding="async"
           onload="this.classList.add('is-loaded')"
           onerror="this.remove()" />`
      : placeholderMarkup(p);

    // Fixed prices read as a price; "Ask in-store" reads as a note, so nobody
    // mistakes a variable-weight item for a missing price.
    const price =
      p.price == null
        ? `<span class="gh-pPrice is-poa" title="Priced by weight or size on the day, just ask at the counter">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2.5-3 4"/><path d="M12 17h.01"/></svg>
             Ask in-store</span>`
        : `<span class="gh-pPrice is-fixed">${fmtPrice(p.price)}</span>`;

    return `
        <article class="gh-pcard" data-id="${p.id}">
          <div class="gh-pimg">
            ${visual}
            ${badge}
          </div>
          <div class="gh-pBody">
            <div class="gh-pNameRow">
              <div class="gh-pName">${highlight(p.name, toks)}</div>
              <span class="gh-pSize">${escapeHtml(p.size)}</span>
            </div>
            <p class="gh-pDesc">${escapeHtml(p.desc)}</p>
            <div class="gh-pFoot">
              ${price}
            </div>
          </div>
        </article>`;
  }

  // Suggestions pulled from the live catalogue, so they always lead somewhere.
  function suggestionHtml() {
    const picks = ["milk", "thyme", "plantain", "milo"].filter((t) =>
      PRODUCTS.some((p) => haystack(p).includes(t)),
    );
    return picks
      .slice(0, 3)
      .map(
        (t) =>
          `<button type="button" class="gh-emptySuggest" data-q="${t}">${t}</button>`,
      )
      .join(" ");
  }

  // ---------- Scroll helper ----------
  function scrollToProducts() {
    const sec = $("#prodSection");
    if (sec) sec.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ---------- Read ?cat= / ?q= from URL (shop page) ----------
  function applyStateFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("cat");
    if (raw) {
      const match = CATEGORIES.find(
        (c) => c.toLowerCase() === raw.toLowerCase(),
      );
      if (match) state.activeCat = match;
    }
    const q = params.get("q");
    if (q) {
      state.query = q;
      const search = $("#search");
      if (search) search.value = q;
    }
  }

  // Keep the address bar in step so a filtered view can be shared or bookmarked.
  function syncUrl() {
    if (!$("#prodGrid")) return;
    const params = new URLSearchParams();
    if (state.activeCat && state.activeCat !== "All")
      params.set("cat", state.activeCat);
    const q = state.query.trim();
    if (q) params.set("q", q);
    const qs = params.toString();
    history.replaceState(
      null,
      "",
      qs ? `${location.pathname}?${qs}` : location.pathname,
    );
  }

  // ---------- Render both halves of the catalogue together ----------
  function render() {
    renderCatBar();
    renderProducts();
    const clear = $("#searchClear");
    if (clear) clear.hidden = !state.query.trim();
  }

  function setQuery(q) {
    state.query = q;
    render();
    syncUrl();
  }

  function clearSearch() {
    const search = $("#search");
    if (search) search.value = "";
    setQuery("");
    if (search) search.focus();
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
      // Re-render on the next frame so fast typing costs one paint, not ten.
      let frame = 0;
      search.addEventListener("input", (e) => {
        const value = e.target.value;
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => setQuery(value));
      });
      search.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          setQuery(search.value);
          search.blur();
        }
        if (e.key === "Escape" && search.value) {
          e.preventDefault();
          clearSearch();
        }
      });

      const clear = $("#searchClear");
      if (clear) clear.addEventListener("click", clearSearch);

      // "/" jumps to the search box the way it does in most catalogues.
      document.addEventListener("keydown", (e) => {
        const tag = (document.activeElement || {}).tagName;
        if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
          e.preventDefault();
          search.focus();
          search.select();
        }
      });
    }

    // Suggested searches inside the empty state.
    const empty = $("#prodEmpty");
    if (empty) {
      empty.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-q]");
        if (!btn) return;
        if (search) search.value = btn.dataset.q;
        setQuery(btn.dataset.q);
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
    applyStateFromUrl();
    renderCatTiles();
    renderCountries();
    initDealSlider();
    bind();
    // Last, so the clear button and counts reflect any ?cat= / ?q= in the URL.
    render();
  });
})();
