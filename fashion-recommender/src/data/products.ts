export interface Product {
  _id: string;
  brand: string;
  name: string;
  description: string;
  price: number;
  match: number;
  imageUrl: string;
  category: string;
  style: string;
  images?: string[];
  sku?: string;
  material?: string;
  fit?: string;
  productUrl?: string;
  stock?: number;
  tags?: string[];
}

export const PRODUCTS: Product[] = [
  // Traditional Wear (Existing)
  {
    _id: "trad1",
    name: "Ivory Silk Sherwani",
    brand: "Manyavar",
    description: "Elegant silk sherwani with fine embroidery for weddings and festivals.",
    price: 1850,
    match: 95,
    category: "Sherwani",
    style: "Traditional Wear",
    imageUrl: "https://m.media-amazon.com/images/I/61eo+imYSGL._SY741_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/61eo+imYSGL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/61uqM1XNhvL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/81JtwevA53L._SY741_.jpg"
    ],
    sku: "TRAD-0001",
    material: "Silk Blend",
    fit: "Regular",
    productUrl: "https://www.manyavar.com",
    stock: 18,
    tags: ["wedding", "festive", "ethnic", "embroidered"]
  },
  {
    _id: "trad2",
    name: "Classic White Kurta Pajama",
    brand: "Fabindia",
    description: "Comfortable cotton kurta pajama for daily and festive wear.",
    price: 879,
    match: 92,
    category: "Kurta Pajama",
    style: "Traditional Wear",
    imageUrl: "https://m.media-amazon.com/images/I/61ZnYhHiSEL._SY741_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/61ZnYhHiSEL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/711I1gX6IvL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/61+r6Cg8qrL._SY741_.jpg"
    ],
    sku: "TRAD-0002",
    material: "100% Cotton",
    fit: "Relaxed",
    productUrl: "https://www.fabindia.com",
    stock: 40,
    tags: ["cotton", "comfort", "dailywear", "festive"]
  },
  {
    _id: "trad3",
    name: "Embroidered Pathani Suit",
    brand: "Mebaz",
    description: "Stylish Pathani suit for festive and cultural occasions.",
    price: 683,
    match: 88,
    category: "Pathani Suit",
    style: "Traditional Wear",
    imageUrl: "https://m.media-amazon.com/images/I/61-npw9UqKL._SY741_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/61-npw9UqKL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/61K4khpj7qL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/61Qr3Z2C6XL._SY741_.jpg"
    ],
    sku: "TRAD-0003",
    material: "Cotton Silk",
    fit: "Regular",
    productUrl: "https://www.mebaz.com",
    stock: 22,
    tags: ["ethnic", "festival", "north-indian"]
  },
  {
    _id: "trad4",
    name: "Banarasi Dhoti Set",
    brand: "Sojanya",
    description: "Traditional Banarasi dhoti kurta set with zari borders.",
    price: 1760,
    match: 90,
    category: "Dhoti Set",
    style: "Traditional Wear",
    imageUrl: "https://m.media-amazon.com/images/I/51YhFIkYF2L._SY741_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/51YhFIkYF2L._SY741_.jpg",
      "https://m.media-amazon.com/images/I/51VGtAhlASL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/51v2CLfvcRL._SY741_.jpg"
    ],
    sku: "TRAD-0004",
    material: "Cotton Blend",
    fit: "Relaxed",
    productUrl: "https://www.sojanya.com",
    stock: 15,
    tags: ["south-indian", "ceremony", "ethnic"]
  },
  {
    _id: "trad5",
    name: "Nehru Jacket Kurta Set",
    brand: "Manyavar",
    description: "Kurta set with stylish Nehru jacket for festive wear.",
    price: 1899,
    match: 94,
    category: "Kurta Set",
    style: "Traditional Wear",
    imageUrl: "https://m.media-amazon.com/images/I/61B5J229muL._SY741_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/61B5J229muL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/71dMRNWU+qL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/91Ncr21KpdL._SY741_.jpg"
    ],
    sku: "TRAD-0005",
    material: "Silk Blend",
    fit: "Regular",
    productUrl: "https://www.manyavar.com",
    stock: 28,
    tags: ["indo-western", "festive", "party"]
  },
  // Traditional Wear (New)
  {
    _id: "trad11",
    name: "Royal Blue Silk Kurta Set",
    brand: "Sojanya",
    description: "Premium silk kurta with pajama for festive occasions.",
    price: 1999,
    match: 93,
    category: "Kurta Set",
    style: "Traditional Wear",
    imageUrl: "https://m.media-amazon.com/images/I/71wBm6C+03L._SY879_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/71wBm6C+03L._SY879_.jpg",
      "https://m.media-amazon.com/images/I/711I1gX6IvL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/71QTzvsvCvL._SY741_.jpg"
    ],
    sku: "TRAD-0011",
    material: "Silk Blend",
    fit: "Regular",
    productUrl: "https://www.sojanya.com",
    stock: 30,
    tags: ["festive", "ethnic", "wedding"]
  },
  {
    _id: "trad12",
    name: "Cream Linen Kurta Pajama",
    brand: "Fabindia",
    description: "Breathable linen kurta pajama for summer festivals.",
    price: 849,
    match: 91,
    category: "Kurta Pajama",
    style: "Traditional Wear",
    imageUrl: "https://m.media-amazon.com/images/I/51Kn9nDBYML._SY741_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/51Kn9nDBYML._SY741_.jpg",
      "https://m.media-amazon.com/images/I/81jw88DagFL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/811nL5UtH3L._SY741_.jpg"
    ],
    sku: "TRAD-0012",
    material: "Linen",
    fit: "Relaxed",
    productUrl: "https://www.fabindia.com",
    stock: 35,
    tags: ["summer", "linen", "traditional"]
  },

  // Casual Wear (Existing)
  {
    _id: "cas1",
    name: "Classic White Cotton T-Shirt",
    brand: "Mufti",
    description: "Soft cotton t-shirt for everyday casual comfort.",
    price: 399,
    match: 98,
    category: "T-Shirt",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/719ZxcfmNkL._SY741_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/719ZxcfmNkL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/61EnuGMFuvL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/61K90p9S5lL._SY741_.jpg"
    ],
    sku: "CAS-0001",
    material: "100% Cotton",
    fit: "Regular",
    productUrl: "https://www.mufticlothing.com",
    stock: 120,
    tags: ["basic", "summer", "everyday"]
  },
  {
    _id: "cas2",
    name: "Blue Denim Jeans",
    brand: "Flying Machine",
    description: "Comfort stretch slim fit jeans.",
    price: 599,
    match: 96,
    category: "Jeans",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/71vg01aBgPL._SY879_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/71vg01aBgPL._SY879_.jpg",
      "https://m.media-amazon.com/images/I/71khEmX9c+L._SY741_.jpg",
      "https://m.media-amazon.com/images/I/81KpB6KIo9L._SY741_.jpg"
    ],
    sku: "CAS-0002",
    material: "Denim",
    fit: "Slim",
    productUrl: "https://www.flyingmachine.com",
    stock: 90,
    tags: ["denim", "street", "casual"]
  },
  // Casual Wear (New)
  {
    _id: "cas11",
    name: "Graphic Print T-Shirt",
    brand: "Roadster",
    description: "Trendy graphic tee for casual street style.",
    price: 599,
    match: 95,
    category: "T-Shirt",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/71gG15IOA8L._SY741_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/71gG15IOA8L._SY741_.jpg",
      "https://m.media-amazon.com/images/I/713Rcsp7ehL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/71H17OuwnjL._SY741_.jpg"
    ],
    sku: "CAS-0011",
    material: "Cotton",
    fit: "Regular",
    productUrl: "https://www.myntra.com/roadster",
    stock: 140,
    tags: ["street", "graphic", "trendy"]
  },
  {
    _id: "cas12",
    name: "Olive Green Chinos",
    brand: "HRX",
    description: "Comfortable stretch chinos for everyday wear.",
    price: 749,
    match: 94,
    category: "Chinos",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/71mPQJaw85L._SY879_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/71mPQJaw85L._SY879_.jpg",
      "https://m.media-amazon.com/images/I/71LB98MMdvL._SX569_.jpg",
      "https://m.media-amazon.com/images/I/91-qXB7WoOL._SX569_.jpg"
    ],
    sku: "CAS-0012",
    material: "Cotton Blend",
    fit: "Slim",
    productUrl: "https://www.myntra.com/hrx",
    stock: 85,
    tags: ["chinos", "casual", "comfort"]
  },

  // Formal Wear (Existing)
  {
    _id: "form1",
    name: "Slim Fit Formal Shirt",
    brand: "Peter England",
    description: "Formal office shirt with tailored fit.",
    price: 1349,
    match: 93,
    category: "Formal Shirt",
    style: "Formal Wear",
    imageUrl: "https://m.media-amazon.com/images/I/81wgovxstvL._SX569_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/81wgovxstvL._SX569_.jpg",
      "https://m.media-amazon.com/images/I/61oXE1jBxrL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/71z26RkP5FL._SY741_.jpg"
    ],
    sku: "FORM-0001",
    material: "Cotton Blend",
    fit: "Slim",
    productUrl: "https://www.peterengland.com",
    stock: 60,
    tags: ["office", "workwear", "formal"]
  },
  // Formal Wear (New)
  {
    _id: "form11",
    name: "Navy Blue Formal Trousers",
    brand: "Louis Philippe",
    description: "Tailored formal trousers for office and business wear.",
    price: 1699,
    match: 92,
    category: "Formal Trousers",
    style: "Formal Wear",
    imageUrl: "https://m.media-amazon.com/images/I/61kqr5MqpwL._SX679_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/61kqr5MqpwL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/71SpaiaJeeL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/71yUIotKoKL._SX679_.jpg"
    ],
    sku: "FORM-0011",
    material: "Poly Viscose",
    fit: "Regular",
    productUrl: "https://www.louisphilippe.com",
    stock: 50,
    tags: ["office", "formal", "business"]
  },
  {
    _id: "form12",
    name: "Charcoal Grey Blazer",
    brand: "Van Heusen",
    description: "Slim-fit blazer for formal and semi-formal occasions.",
    price: 5899,
    match: 96,
    category: "Blazer",
    style: "Formal Wear",
    imageUrl: "https://m.media-amazon.com/images/I/61YquRQoZdL._SY741_.jpg",
    images: [
      "hhttps://m.media-amazon.com/images/I/61YquRQoZdL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/61wRJhs5mrL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/618jsFnkB2L._SY741_.jpg"
    ],
    sku: "FORM-0012",
    material: "Wool Blend",
    fit: "Slim",
    productUrl: "https://www.vanheusenindia.com",
    stock: 22,
    tags: ["blazer", "office", "formal"]
  },

  // Fusion/Party Wear (Existing)
  {
    _id: "fus1",
    name: "Bandhgala Jacket Set",
    brand: "Benzer",
    description: "Indo-Western jacket with trousers for parties.",
    price: 4640,
    match: 91,
    category: "Bandhgala",
    style: "Party Wear",
    imageUrl: "https://m.media-amazon.com/images/I/61e5d142WvL._SY741_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/61e5d142WvL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/81CcdgYrEJL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/81epomNooXL._SY741_.jpg"
    ],
    sku: "FUS-0001",
    material: "Silk Blend",
    fit: "Tailored",
    productUrl: "https://www.benzer.co.in",
    stock: 25,
    tags: ["party", "reception", "indo-western"]
  },
  // Fusion/Party Wear (New)
  {
    _id: "fus11",
    name: "Short Kurta with Denim",
    brand: "Manyavar Mohey",
    description: "Indo-western short kurta paired with denim look.",
    price: 4999,
    match: 89,
    category: "Short Kurta",
    style: "Party Wear",
    imageUrl: "https://m.media-amazon.com/images/I/61e1RW+Tp8L._SY741_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/61e1RW+Tp8L._SY741_.jpg",
      "https://m.media-amazon.com/images/I/71fp2h95GkL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/91DfsDIyZgL._SY741_.jpg"
    ],
    sku: "FUS-0011",
    material: "Cotton Silk",
    fit: "Regular",
    productUrl: "https://www.manyavar.com",
    stock: 34,
    tags: ["indo-western", "party", "casual-festive"]
  },
  {
    _id: "fus12",
    name: "Modern Bandhgala Jacket",
    brand: "Raymond",
    description: "Stylish bandhgala jacket for receptions and parties.",
    price: 4999,
    match: 97,
    category: "Bandhgala Jacket",
    style: "Party Wear",
    imageUrl: "https://m.media-amazon.com/images/I/51NUwRHlO5L._SY879_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/51NUwRHlO5L._SY879_.jpg",
      "https://m.media-amazon.com/images/I/51V6ur23q1L._SY741_.jpg",
      "https://m.media-amazon.com/images/I/51JqbR6m0TL._SY741_.jpg"
    ],
    sku: "FUS-0012",
    material: "Silk Blend",
    fit: "Tailored",
    productUrl: "https://www.raymond.in",
    stock: 18,
    tags: ["reception", "indo-western", "designer"]
  },

  // Traditional Wear (New Batch 2)
  {
    _id: "trad13",
    name: "Maroon Velvet Sherwani",
    brand: "Manyavar",
    description: "Luxurious velvet sherwani with gold embroidery for wedding occasions.",
    price: 699,
    match: 97,
    category: "Sherwani",
    style: "Traditional Wear",
    imageUrl: "https://m.media-amazon.com/images/I/517WJ4Ff6BL._SY741_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/517WJ4Ff6BL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/61ZggkDrVFL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/61kFyVgRItL._SY741_.jpg"
    ],
    sku: "TRAD-0013",
    material: "Velvet Silk",
    fit: "Regular",
    productUrl: "https://www.manyavar.com",
    stock: 12,
    tags: ["wedding", "royal", "embroidered"]
  },
  {
    _id: "trad14",
    name: "Pastel Green Kurta Pajama",
    brand: "Tasva",
    description: "Elegant pastel green kurta pajama ideal for day weddings.",
    price: 1200,
    match: 92,
    category: "Kurta Pajama",
    style: "Traditional Wear",
    imageUrl: "https://m.media-amazon.com/images/I/51zY8lQ6S3L._SY741_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/51zY8lQ6S3L._SY741_.jpg",
      "https://m.media-amazon.com/images/I/61ccb8nky6L._SY741_.jpg",
      "https://m.media-amazon.com/images/I/71bfYNi0btL._SY741_.jpg"
    ],
    sku: "TRAD-0014",
    material: "Cotton Silk",
    fit: "Regular",
    productUrl: "https://www.tasva.com",
    stock: 25,
    tags: ["pastel", "summer-wedding", "day-event"]
  },

  // Casual Wear (New Batch 2)
  {
    _id: "cas13",
    name: "Olive Green Bomber Jacket",
    brand: "Zara",
    description: "Stylish olive bomber jacket for a layered street look.",
    price: 449,
    match: 94,
    category: "Jacket",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/619xMvtqClL._SY879_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/619xMvtqClL._SY879_.jpg",
      "https://m.media-amazon.com/images/I/71B6sCb+lqL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/81IWea1qhjL._SY741_.jpg"
    ],
    sku: "CAS-0013",
    material: "Polyester",
    fit: "Regular",
    productUrl: "https://www.zara.com",
    stock: 45,
    tags: ["winter", "street", "layering"]
  },
  {
    _id: "cas14",
    name: "Beige Linen Shirt & Shorts",
    brand: "H&M",
    description: "Breezy linen co-ord set perfect for summer vacations.",
    price: 699,
    match: 93,
    category: "Co-ords",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/51SMe2bXGJL._SY741_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/51SMe2bXGJL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/51he99AJVWL.jpg",
      "https://m.media-amazon.com/images/I/51NL-CxJMhL._SY741_.jpg"
    ],
    sku: "CAS-0014",
    material: "Linen",
    fit: "Relaxed",
    productUrl: "https://www2.hm.com",
    stock: 60,
    tags: ["summer", "vacation", "linen"]
  },

  // Formal Wear (New Batch 2)
  {
    _id: "form13",
    name: "Charcoal Grey 3-Piece Suit",
    brand: "Blackberrys",
    description: "Premium charcoal grey 3-piece suit for classic corporate look.",
    price: 6899,
    match: 98,
    category: "Suit",
    style: "Formal Wear",
    imageUrl: "https://m.media-amazon.com/images/I/71Hnmw5ZBxL._SX679_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/71Hnmw5ZBxL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/71EBp0qFiUL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/71cpI7qIFVL._SX679_.jpg"
    ],
    sku: "FORM-0013",
    material: "Wool Blend",
    fit: "Slim",
    productUrl: "https://blackberrys.com",
    stock: 15,
    tags: ["boardroom", "wedding", "classic"]
  },
  {
    _id: "form14",
    name: "Navy Blue Double-Breasted Blazer",
    brand: "Arrow",
    description: "Sophisticated navy double-breasted blazer for power dressing.",
    price: 5199,
    match: 95,
    category: "Blazer",
    style: "Formal Wear",
    imageUrl: "https://m.media-amazon.com/images/I/51SLVpZUiwL._SX569_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/51SLVpZUiwL._SX569_.jpg",
      "https://m.media-amazon.com/images/I/613O8jgUi1L._SX569_.jpg",
      "https://m.media-amazon.com/images/I/71pl1-LoQ8L._SX569_.jpg"
    ],
    sku: "FORM-0014",
    material: "Poly Viscose",
    fit: "Slim",
    productUrl: "https://arrow.nnnow.com",
    stock: 20,
    tags: ["power-dressing", "corporate", "premium"]
  },

  // Fusion/Party Wear (New Batch 2)
  {
    _id: "fus13",
    name: "Indo-Western Asymmetric Kurta",
    brand: "Shantanu & Nikhil",
    description: "Avant-garde asymmetric kurta for high-fashion cocktail events.",
    price: 599,
    match: 96,
    category: "Kurta",
    style: "Party Wear",
    imageUrl: "https://m.media-amazon.com/images/I/41XpY9IzT-L._SX679_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/41XpY9IzT-L._SX679_.jpg",
      "https://m.media-amazon.com/images/I/51PVmD3rdiL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/517cN+mzn9L._SX679_.jpg"
    ],
    sku: "FUS-0013",
    material: "Silk",
    fit: "Draped",
    productUrl: "https://shantanunikhil.com",
    stock: 10,
    tags: ["designer", "avant-garde", "cocktail"]
  },
  {
    _id: "fus14",
    name: "Dhoti Pants with Crop Top",
    brand: "Masaba",
    description: "Quirky printed dhoti pants paired with a stylish crop top.",
    price: 899,
    match: 91,
    category: "Fusion Set",
    style: "Party Wear",
    imageUrl: "https://m.media-amazon.com/images/I/51qecz54ESL._SY741_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/51qecz54ESL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/714qSkM1SrL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/71vl+4B4RTL._SY741_.jpg"
    ],
    sku: "FUS-0014",
    material: "Crepe",
    fit: "Relaxed",
    productUrl: "https://houseofmasaba.com",
    stock: 22,
    tags: ["quirky", "printed", "boho-chic"]
  },

  // Traditional Wear (New Batch 3)
  {
    _id: "trad15",
    name: "Ivory Wedding Sherwani",
    brand: "Sabyasachi",
    description: "Premium ivory sherwani with hand embroidery for grand weddings.",
    price: 16999,
    match: 96,
    category: "Sherwani",
    style: "Traditional Wear",
    imageUrl: "https://m.media-amazon.com/images/I/61od7vhkqLL._SY741_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/61od7vhkqLL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/71mhTV7WCWL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/61VMPKc3JUL._SY741_.jpg"
    ],
    sku: "TRAD-0015",
    material: "Silk Brocade",
    fit: "Royal Fit",
    productUrl: "https://www.sabyasachi.com",
    stock: 8,
    tags: ["wedding", "luxury", "designer"]
  },
  {
    _id: "trad16",
    name: "Blue Handloom Kurta Set",
    brand: "Anokhi",
    description: "Handloom cotton kurta with pajama for daily traditional wear.",
    price: 749,
    match: 90,
    category: "Kurta Pajama",
    style: "Traditional Wear",
    imageUrl: "https://m.media-amazon.com/images/I/61QPw4JMHQL._SX569_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/61QPw4JMHQL._SX569_.jpg",
      "https://m.media-amazon.com/images/I/81-E8jiDl9L._SX569_.jpg",
      "https://m.media-amazon.com/images/I/91A1xI+AZEL._SX569_.jpg"
    ],
    sku: "TRAD-0016",
    material: "Handloom Cotton",
    fit: "Relaxed",
    productUrl: "https://www.anokhi.com",
    stock: 55,
    tags: ["handloom", "ethnic", "dailywear"]
  },

  // Casual Wear (New Batch 3)
  {
    _id: "cas15",
    name: "Graphic Print T-Shirt",
    brand: "Roadster",
    description: "Cotton T-shirt with bold street-style graphic print.",
    price: 599,
    match: 95,
    category: "T-Shirt",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/51HJ3rEerXL._SX679_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/51HJ3rEerXL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/310fr4PfvoL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/41hQveP0NRL.jpg"
    ],
    sku: "CAS-0015",
    material: "100% Cotton",
    fit: "Regular",
    productUrl: "https://www.myntra.com/roadster",
    stock: 120,
    tags: ["streetwear", "graphic", "casual"]
  },
  {
    _id: "cas16",
    name: "Jogger Track Pants",
    brand: "Puma",
    description: "Comfortable joggers for workouts and daily casual wear.",
    price: 919,
    match: 92,
    category: "Joggers",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/71lhBBi2nsL._SX679_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/71lhBBi2nsL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/61OUm4NTKzL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/61OxDEvjosL._SY741_.jpg"
    ],
    sku: "CAS-0016",
    material: "Poly Cotton",
    fit: "Slim",
    productUrl: "https://in.puma.com",
    stock: 60,
    tags: ["sportswear", "comfort", "active"]
  },

  // Formal Wear (New Batch 3)
  {
    _id: "form15",
    name: "Grey Office Trousers",
    brand: "Van Heusen",
    description: "Formal slim trousers for professional office look.",
    price: 1579,
    match: 93,
    category: "Formal Trousers",
    style: "Formal Wear",
    imageUrl: "https://m.media-amazon.com/images/I/51hrCHROqbL._SY879_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/51hrCHROqbL._SY879_.jpg",
      "https://m.media-amazon.com/images/I/51qaRrrWocL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/51jm60oOaYL._SY741_.jpg"
    ],
    sku: "FORM-0015",
    material: "Wool Blend",
    fit: "Slim",
    productUrl: "https://www.vanheusenindia.com",
    stock: 45,
    tags: ["officewear", "professional", "trousers"]
  },
  {
    _id: "form16",
    name: "Navy Blue Blazer",
    brand: "Louis Philippe",
    description: "Sharp tailored blazer for business and formal occasions.",
    price: 6320,
    match: 95,
    category: "Blazer",
    style: "Formal Wear",
    imageUrl: "https://m.media-amazon.com/images/I/61fj1ACvUPL._SX679_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/61fj1ACvUPL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/51xxaYTQeUL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/61QePkESJ0L._SX679_.jpg"
    ],
    sku: "FORM-0016",
    material: "Poly Wool",
    fit: "Tailored",
    productUrl: "https://www.louisphilippeindia.com",
    stock: 18,
    tags: ["blazer", "corporate", "business"]
  },

  // Fusion/Party Wear (New Batch 3)
  {
    _id: "fus15",
    name: "Denim Kurta Shirt",
    brand: "W for Men",
    description: "Indo-western kurta in denim style fabric.",
    price: 1299,
    match: 88,
    category: "Kurta Shirt",
    style: "Party Wear",
    imageUrl: "https://m.media-amazon.com/images/I/61qk2FhM2ML._SY741_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/61qk2FhM2ML._SY741_.jpg",
      "https://m.media-amazon.com/images/I/61pQSz-5fdL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/81-8x12Xv9L._SX679_.jpg"
    ],
    sku: "FUS-0015",
    material: "Denim Cotton",
    fit: "Regular",
    productUrl: "https://www.wformen.com",
    stock: 50,
    tags: ["kurta", "denim", "fusion"]
  },
  {
    _id: "fus16",
    name: "Indo-Western Party Set",
    brand: "Ethnix by Raymond",
    description: "Modern kurta + jacket party wear fusion set.",
    price: 9054,
    match: 94,
    category: "Party Set",
    style: "Party Wear",
    imageUrl: "https://m.media-amazon.com/images/I/619QMVHVTTL._SY741_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/619QMVHVTTL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/91569ThvqQL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/81gRchGe9oL._SY741_.jpg"
    ],
    sku: "FUS-0016",
    material: "Silk Blend",
    fit: "Tailored",
    productUrl: "https://www.ethnix.com",
    stock: 14,
    tags: ["partywear", "fusion", "modern"]
  },
  // Casual Batch (AI Generated 101-108)
  {
    _id: "cas101",
    name: "Slim Fit Graphic Cotton T-Shirt",
    brand: "Roadster",
    description: "Trendy slim-fit cotton T-shirt with a bold graphic print for everyday casual wear.",
    price: 399,
    match: 92,
    category: "T-Shirt",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/618VD2jvLoL._SY879_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/618VD2jvLoL._SY879_.jpg",
      "https://m.media-amazon.com/images/I/61oif5rQKmL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/61LquGR3r3L._SY741_.jpg"
    ],
    sku: "CAS-0101",
    material: "Cotton",
    fit: "Slim",
    productUrl: "https://example.com/cas101",
    stock: 45,
    tags: ["graphic", "summer", "streetwear"]
  },
  {
    _id: "cas102",
    name: "Relaxed Fit Linen Summer Shirt",
    brand: "Wrogn",
    description: "Lightweight relaxed-fit linen shirt ideal for casual summer outings and beach trips.",
    price: 1399,
    match: 87,
    category: "shirt",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/71nMh-+b12L._SY879_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/71nMh-+b12L._SY879_.jpg",
      "https://m.media-amazon.com/images/I/71QGue8Q+KL._SX569_.jpg",
      "https://m.media-amazon.com/images/I/81AjnGAuSGL._SX569_.jpg"
    ],
    sku: "CAS-0102",
    material: "Linen",
    fit: "Relaxed",
    productUrl: "https://example.com/cas102",
    stock: 65,
    tags: ["linen", "summer", "casual"]
  },
  {
    _id: "cas103",
    name: "Slim Fit Blue Denim Jeans",
    brand: "Flying Machine",
    description: "Classic slim-fit blue denim jeans with durable stitching for everyday casual wear.",
    price: 699,
    match: 90,
    category: "Jeans",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/61uJq-K18GL._SX679_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/61uJq-K18GL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/61unz4A-OwL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/61ROctyPr5L._SY741_.jpg"
    ],
    sku: "CAS-0103",
    material: "Denim",
    fit: "Slim",
    productUrl: "https://example.com/cas103",
    stock: 80,
    tags: ["denim", "slim-fit", "everyday"]
  },
  {
    _id: "cas104",
    name: "Olive Green Slim Chinos Pants",
    brand: "HRX",
    description: "Comfortable slim-fit chinos made of stretchable fabric suitable for casual wear.",
    price: 2843,
    match: 85,
    category: "Chinos",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/61RrSiFcSAL._SX679_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/61RrSiFcSAL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/91ordFmgU5L._SX679_.jpg",
      "https://m.media-amazon.com/images/I/51Qh+vqKAgL._SX679_.jpg"
    ],
    sku: "CAS-0104",
    material: "Cotton Blend",
    fit: "Slim",
    productUrl: "https://example.com/cas104",
    stock: 75,
    tags: ["chinos", "slim", "comfortable"]
  },
  {
    _id: "cas105",
    name: "Grey Joggers with Side Stripes",
    brand: "Puma",
    description: "Athletic grey joggers with stylish side stripes for workouts and casual streetwear.",
    price: 736,
    match: 88,
    category: "Joggers",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/612jkJuEuIL._SX679_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/612jkJuEuIL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/512ZS3CIRHL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/61XJhsnKXUL._SY741_.jpg"
    ],
    sku: "CAS-0105",
    material: "Polyester Cotton",
    fit: "Regular",
    productUrl: "https://example.com/cas105",
    stock: 60,
    tags: ["joggers", "athletic", "streetwear"]
  },
  {
    _id: "cas106",
    name: "Striped Short Sleeve T-Shirt",
    brand: "Adidas",
    description: "Casual striped short sleeve T-shirt made of breathable cotton for summer comfort.",
    price: 1159,
    match: 93,
    category: "T-Shirt",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/71iIwWJg0QL._SY879_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/71iIwWJg0QL._SY879_.jpg",
      "https://m.media-amazon.com/images/I/71nWAV6r2fL._SX569_.jpg",
      "https://m.media-amazon.com/images/I/91+Ti2lleML._SX569_.jpg"
    ],
    sku: "CAS-0106",
    material: "Cotton",
    fit: "Regular",
    productUrl: "https://example.com/cas106",
    stock: 50,
    tags: ["striped", "summer", "casual"]
  },
  {
    _id: "cas107",
    name: "Black Slim Fit Denim Jeans",
    brand: "Zara",
    description: "Trendy black denim slim fit jeans suitable for daily casual outfits and streetwear.",
    price: 587,
    match: 91,
    category: "Jeans",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/51eGrIsz8RL._SY879_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/51eGrIsz8RL._SY879_.jpg",
      "https://m.media-amazon.com/images/I/510iLcGheYL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/51LPf+ktx9L._SY741_.jpg"
    ],
    sku: "CAS-0107",
    material: "Denim",
    fit: "Slim",
    productUrl: "https://example.com/cas107",
    stock: 40,
    tags: ["denim", "slim", "streetwear"]
  },
  {
    _id: "cas108",
    name: "Beige Cotton Chinos Pants",
    brand: "Flying Machine",
    description: "Casual beige chinos with a regular fit perfect for summer outings and casual workdays.",
    price: 1699,
    match: 87,
    category: "Chinos",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/71jfMhZZLQL._SY879_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/71jfMhZZLQL._SY879_.jpg",
      "https://m.media-amazon.com/images/I/A1k0+ME6d+L._SX569_.jpg",
      "https://m.media-amazon.com/images/I/81AgrpT6AJL._SX569_.jpg"
    ],
    sku: "CAS-0108",
    material: "Cotton Blend",
    fit: "Regular",
    productUrl: "https://example.com/cas108",
    stock: 55,
    tags: ["chinos", "summer", "casual"]
  },
  {
    _id: "cas109",
    name: "Navy Blue Slim Fit Polo Shirt",
    brand: "Puma",
    description: "Classic navy polo shirt with soft cotton fabric ideal for casual and semi-formal wear.",
    price: 1839,
    match: 90,
    category: "T-Shirt",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/81+PwGS-KrL._SX569_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/81+PwGS-KrL._SX569_.jpg",
      "https://m.media-amazon.com/images/I/71arzPrxN3L._SY741_.jpg",
      "https://m.media-amazon.com/images/I/61MPb++PJdL._SY741_.jpg"
    ],
    sku: "CAS-0109",
    material: "Cotton",
    fit: "Slim",
    productUrl: "https://example.com/cas109",
    stock: 60,
    tags: ["polo", "casual", "summer"]
  },
  {
    _id: "cas110",
    name: "Light Grey Joggers with Drawstring",
    brand: "HRX",
    description: "Comfortable light grey joggers with adjustable waistband for casual and athletic wear.",
    price: 390,
    match: 88,
    category: "Joggers",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/41r3Yu+ZnOL._SY741_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/41r3Yu+ZnOL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/414NoB-6AcL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/41eMMW1iddL._SY741_.jpg"
    ],
    sku: "CAS-0110",
    material: "Polyester Cotton",
    fit: "Regular",
    productUrl: "https://example.com/cas110",
    stock: 50,
    tags: ["joggers", "comfortable", "athletic"]
  },
  {
    _id: "cas111",
    name: "Casual Red Checked Shirt",
    brand: "Wrogn",
    description: "Bold red checked casual shirt with slim fit perfect for daily outings and casual events.",
    price: 1449,
    match: 91,
    category: "shirt",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/81Wt6rOkYkL._SX569_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/81Wt6rOkYkL._SX569_.jpg",
      "https://m.media-amazon.com/images/I/81OGLibcPHL._SX569_.jpg",
      "https://m.media-amazon.com/images/I/71N8fWQ5O4L._SX569_.jpg"
    ],
    sku: "CAS-0111",
    material: "Cotton",
    fit: "Slim",
    productUrl: "https://example.com/cas111",
    stock: 55,
    tags: ["checked", "casual", "summer"]
  },
  {
    _id: "cas112",
    name: "Beige Slim Fit Cotton Chinos",
    brand: "Flying Machine",
    description: "Slim fit beige cotton chinos designed for casual office wear and weekend outings.",
    price: 849,
    match: 87,
    category: "Chinos",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/61GhOMUpj9L._SY879_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/61GhOMUpj9L._SY879_.jpg",
      "https://m.media-amazon.com/images/I/81Wp6XDPDpL._SX569_.jpg",
      "https://m.media-amazon.com/images/I/91q27osQRtL._SX569_.jpg"
    ],
    sku: "CAS-0112",
    material: "Cotton",
    fit: "Slim",
    productUrl: "https://example.com/cas112",
    stock: 40,
    tags: ["chinos", "casual", "slim-fit"]
  },
  {
    _id: "cas113",
    name: "Dark Grey Slim Joggers Pants",
    brand: "Adidas",
    description: "Dark grey slim joggers designed for gym, jogging, or comfortable casual wear.",
    price: 1215,
    match: 89,
    category: "Joggers",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/61HScLH9fQL._SX679_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/61HScLH9fQL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/61RjHQknC2L._SX679_.jpg",
      "https://m.media-amazon.com/images/I/61sNwIlBkTL._SX679_.jpg"
    ],
    sku: "CAS-0113",
    material: "Polyester Cotton",
    fit: "Slim",
    productUrl: "https://example.com/cas113",
    stock: 60,
    tags: ["joggers", "athletic", "casual"]
  },
  {
    _id: "cas114",
    name: "White Cotton Striped T-Shirt",
    brand: "Roadster",
    description: "Classic white T-shirt with thin navy stripes, soft cotton fabric for summer comfort.",
    price: 267,
    match: 92,
    category: "T-Shirt",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/81nl0fJ68dL._SY741_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/81nl0fJ68dL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/71KgQc5BAyL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/61rnV4iL3dL._SY741_.jpg"
    ],
    sku: "CAS-0114",
    material: "Cotton",
    fit: "Regular",
    productUrl: "https://example.com/cas114",
    stock: 50,
    tags: ["striped", "cotton", "summer"]
  },
  {
    _id: "cas115",
    name: "Light Blue Slim Fit Denim Jeans",
    brand: "Flying Machine",
    description: "Light blue slim-fit denim jeans with durable stitching for everyday casual wear.",
    price: 849,
    match: 90,
    category: "Jeans",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/616xchp1ECL._SY741_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/616xchp1ECL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/61W0Ucal3hL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/51j8-zllAhL._SY741_.jpg"
    ],
    sku: "CAS-0115",
    material: "Denim",
    fit: "Slim",
    productUrl: "https://example.com/cas115",
    stock: 55,
    tags: ["denim", "slim-fit", "casual"]
  },
  {
    _id: "cas116",
    name: "Beige Short Sleeve Polo Shirt",
    brand: "Zara",
    description: "Beige casual polo shirt made from soft cotton for summer outings and casual parties.",
    price: 549,
    match: 88,
    category: "T-Shirt",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/71+gHBc0L6L._SX569_.jpg",
    images: [
      "https://images.pexels.com/photos/1002639/pexels-photo-1002639.jpeg",
      "https://m.media-amazon.com/images/I/81q3BEHt47L._SX569_.jpg",
      "https://m.media-amazon.com/images/I/71LblIphWZL._SX569_.jpg"
    ],
    sku: "CAS-0116",
    material: "Cotton",
    fit: "Regular",
    productUrl: "https://example.com/cas116",
    stock: 65,
    tags: ["polo", "cotton", "summer"]
  },
  {
    _id: "cas117",
    name: "Charcoal Slim Fit Joggers Pants",
    brand: "HRX",
    description: "Charcoal grey slim joggers with comfortable stretch fabric suitable for casual wear.",
    price: 870,
    match: 86,
    category: "Joggers",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/611JMmkZbwL._SX679_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/611JMmkZbwL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/61hfd4iR-5L._SY741_.jpg",
      "https://m.media-amazon.com/images/I/519WMiIzo-L._SY741_.jpg"
    ],
    sku: "CAS-0117",
    material: "Polyester Cotton",
    fit: "Slim",
    productUrl: "https://example.com/cas117",
    stock: 40,
    tags: ["joggers", "slim", "athletic"]
  },
  {
    _id: "cas118",
    name: "Blue Relaxed Fit Chambray Shirt",
    brand: "H&M",
    description: "Relaxed fit chambray shirt in blue perfect for casual daywear and weekend outings.",
    price: 549,
    match: 89,
    category: "shirt",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/71oNSyd3gqL._SY879_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/71oNSyd3gqL._SY879_.jpg",
      "https://m.media-amazon.com/images/I/71Je6HcBXSL._SX569_.jpg",
      "https://m.media-amazon.com/images/I/81VrEaxy4iL._SX569_.jpg"
    ],
    sku: "CAS-0118",
    material: "Cotton",
    fit: "Relaxed",
    productUrl: "https://example.com/cas118",
    stock: 55,
    tags: ["chambray", "relaxed", "casual"]
  },
  {
    _id: "cas119",
    name: "Light Blue Slim Fit Denim Shirt",
    brand: "Zara",
    description: "Soft denim shirt in light blue with slim fit, perfect for casual outings and daily wear.",
    price: 949,
    match: 91,
    category: "shirt",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/71Pqceu4xsL._SY741_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/71Pqceu4xsL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/71IgiN1Y+iL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/71chLihK9TL._SY741_.jpg"
    ],
    sku: "CAS-0119",
    material: "Denim",
    fit: "Slim",
    productUrl: "https://example.com/cas119",
    stock: 60,
    tags: ["denim", "slim", "casual"]
  },
  {
    _id: "cas120",
    name: "Black Regular Fit Cargo Pants",
    brand: "H&M",
    description: "Functional and stylish black cargo pants with multiple pockets for a utilitarian look.",
    price: 2049,
    match: 88,
    category: "Jeans",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/61nhvrb05aL._SY879_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/61nhvrb05aL._SY879_.jpg",
      "https://m.media-amazon.com/images/I/71TF9KF2q3L._SX569_.jpg",
      "https://m.media-amazon.com/images/I/81BqEVgn7gL._SX569_.jpg"
    ],
    sku: "CAS-0120",
    material: "Cotton",
    fit: "Regular",
    productUrl: "https://example.com/cas120",
    stock: 45,
    tags: ["cargo", "black", "utility"]
  },
  {
    _id: "cas121",
    name: "White Premium Cotton Crew Neck T-Shirt",
    brand: "Uniqlo",
    description: "Essential white crew neck t-shirt made from premium cotton for everyday comfort.",
    price: 365,
    match: 95,
    category: "T-Shirt",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/51jL51wcFPL._SX679_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/51jL51wcFPL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/61TiH5PgBUL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/61dAwY8nCAL._SX679_.jpg"
    ],
    sku: "CAS-0121",
    material: "Cotton",
    fit: "Regular",
    productUrl: "https://example.com/cas121",
    stock: 100,
    tags: ["white", "basic", "cotton"]
  },
  {
    _id: "cas122",
    name: "Olive Green Classic Bomber Jacket",
    brand: "Zara",
    description: "Stylish olive green bomber jacket to layer up your casual outfits.",
    price: 1399,
    match: 92,
    category: "Jacket",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/71yCVVwEr6L._SX569_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/71yCVVwEr6L._SX569_.jpg",
      "https://m.media-amazon.com/images/I/71H3g-smfUL._SX569_.jpg",
      "https://m.media-amazon.com/images/I/81C7hvadm3L._SX569_.jpg"
    ],
    sku: "CAS-0122",
    material: "Polyester",
    fit: "Regular",
    productUrl: "https://example.com/cas122",
    stock: 30,
    tags: ["bomber", "jacket", "olive"]
  },
  {
    _id: "cas123",
    name: "Navy Blue Slim Fit Chinos",
    brand: "Levis",
    description: "Versatile navy chinos that pair well with both t-shirts and shirts.",
    price: 749,
    match: 89,
    category: "Chinos",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/61krYlviVXL._SY879_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/61krYlviVXL._SY879_.jpg",
      "https://m.media-amazon.com/images/I/81jdFFiNg4L._SX569_.jpg",
      "https://m.media-amazon.com/images/I/710WnV9IfxL._SX569_.jpg"
    ],
    sku: "CAS-0123",
    material: "Cotton Blend",
    fit: "Slim",
    productUrl: "https://example.com/cas123",
    stock: 50,
    tags: ["chinos", "navy", "casual"]
  },
  {
    _id: "cas124",
    name: "Grey Melange Hooded Sweatshirt",
    brand: "Nike",
    description: "Cozy grey hoodie perfect for athletic or relaxed casual wear.",
    price: 799,
    match: 90,
    category: "Jacket",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/61yNL4i5UvL._SX679_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/61yNL4i5UvL._SX679_.jpgg",
      "https://m.media-amazon.com/images/I/51iWwSPvcIL._SX569_.jpg",
      "https://m.media-amazon.com/images/I/716zf42S9pL._SX569_.jpg"
    ],
    sku: "CAS-0124",
    material: "Cotton Fleece",
    fit: "Relaxed",
    productUrl: "https://example.com/cas124",
    stock: 40,
    tags: ["hoodie", "grey", "winter"]
  },
  {
    _id: "cas125",
    name: "Red and Navy Striped Polo Shirt",
    brand: "US Polo Assn",
    description: "Classic striped polo shirt adding a pop of color to your wardrobe.",
    price: 839,
    match: 87,
    category: "T-Shirt",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/61B1GFIWgiL._SY741_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/61B1GFIWgiL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/61D6XdjVb6L._SY741_.jpg",
      "https://m.media-amazon.com/images/I/71ulgO8uXSL._SY741_.jpg"
    ],
    sku: "CAS-0125",
    material: "Cotton",
    fit: "Regular",
    productUrl: "https://example.com/cas125",
    stock: 55,
    tags: ["polo", "striped", "colorful"]
  },
  {
    _id: "cas126",
    name: "Beige Cotton Casual Shorts",
    brand: "H&M",
    description: "Lightweight beige shorts ideal for beachwear or summer days.",
    price: 496,
    match: 85,
    category: "Joggers",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/61fregVSyqL._SY879_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/61fregVSyqL._SY879_.jpg",
      "https://m.media-amazon.com/images/I/518Ml1sahgL._SX569_.jpg",
      "https://m.media-amazon.com/images/I/51j3E6oRpPL._SX569_.jpg"
    ],
    sku: "CAS-0126",
    material: "Cotton",
    fit: "Regular",
    productUrl: "https://example.com/cas126",
    stock: 70,
    tags: ["shorts", "beige", "summer"]
  },
  {
    _id: "cas127",
    name: "Red and Black Checked Flannel Shirt",
    brand: "Roadster",
    description: "Warm and stylish flannel shirt with a classic check pattern.",
    price: 549,
    match: 93,
    category: "shirt",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/81t7ENCjRaL._SY741_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/81t7ENCjRaL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/71eKIPZSH8L._SY741_.jpg",
      "https://m.media-amazon.com/images/I/81TaC8bD8dL._SY741_.jpg"
    ],
    sku: "CAS-0127",
    material: "Flannel",
    fit: "Regular",
    productUrl: "https://example.com/cas127",
    stock: 45,
    tags: ["flannel", "checked", "shirt"]
  },
  {
    _id: "cas128",
    name: "Blue Classic Denim Jacket",
    brand: "Levis",
    description: "Timeless denim jacket that never goes out of style.",
    price: 1109,
    match: 94,
    category: "Jacket",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/712UDW7pnEL._SY741_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/712UDW7pnEL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/51x6jJZiTlL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/51AVXwKz4pL._SX679_.jpg"
    ],
    sku: "CAS-0128",
    material: "Denim",
    fit: "Regular",
    productUrl: "https://example.com/cas128",
    stock: 25,
    tags: ["denim", "jacket", "classic"]
  },
  {
    _id: "cas129",
    name: "Black Stretchable Slim Fit Jeans",
    brand: "Wrangler",
    description: "Comfortable black jeans with stretch fabric for ease of movement.",
    price: 1499,
    match: 91,
    category: "Jeans",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/61zYTL6iyhL._SY879_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/61zYTL6iyhL._SY879_.jpg",
      "https://m.media-amazon.com/images/I/71wM4qi7+PL._SX569_.jpg",
      "https://m.media-amazon.com/images/I/81v9qR1csmL._SX569_.jpg"
    ],
    sku: "CAS-0129",
    material: "Denim",
    fit: "Slim",
    productUrl: "https://example.com/cas129",
    stock: 60,
    tags: ["jeans", "black", "stretch"]
  },
  {
    _id: "cas132",
    name: "Olive Green Slim Fit Cotton T-Shirt",
    brand: "HRX",
    description: "Slim fit cotton T-shirt in olive green, perfect for daily casual wear and summer outings.",
    price: 1999,
    match: 88,
    category: "T-Shirt",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/71gJtL0f+7L._SY741_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/71gJtL0f+7L._SY741_.jpg",
      "https://m.media-amazon.com/images/I/41rhjjBJ48L._SY741_.jpg",
      "https://m.media-amazon.com/images/I/51B4c8YssvL._SY741_.jpg"
    ],
    sku: "CAS-0132",
    material: "Cotton",
    fit: "Slim",
    productUrl: "https://example.com/cas132",
    stock: 60,
    tags: ["cotton", "slim", "summer"]
  },
  {
    _id: "cas133",
    name: "Dark Blue Slim Fit Denim Jeans",
    brand: "Levi's",
    description: "Classic dark blue slim-fit denim jeans with durable fabric for casual daily wear.",
    price: 1742,
    match: 90,
    category: "Jeans",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/51ObuTaSKdL._SX679_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/51ObuTaSKdL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/51ugU9twe4L._SX679_.jpg",
      "https://m.media-amazon.com/images/I/51HnY80pq9L._SX679_.jpg"
    ],
    sku: "CAS-0133",
    material: "Denim",
    fit: "Slim",
    productUrl: "https://example.com/cas133",
    stock: 55,
    tags: ["denim", "slim-fit", "casual"]
  },
  {
    _id: "cas134",
    name: "Light Grey Slim Fit Joggers Pants",
    brand: "Puma",
    description: "Slim fit light grey joggers with soft fabric, ideal for casual and gym wear.",
    price: 1819,
    match: 87,
    category: "Joggers",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/511ozYW2jfL._SX679_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/511ozYW2jfL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/61pZjLRXaiL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/61HwTQdDm4L._SY741_.jpg"
    ],
    sku: "CAS-0134",
    material: "Polyester Cotton",
    fit: "Slim",
    productUrl: "https://example.com/cas134",
    stock: 50,
    tags: ["joggers", "slim", "athletic"]
  },
  {
    _id: "cas135",
    name: "Beige Relaxed Fit Chinos Pants",
    brand: "Flying Machine",
    description: "Relaxed fit beige cotton chinos, perfect for casual office wear and weekend outings.",
    price: 1599,
    match: 90,
    category: "Chinos",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/71roJPdmbSL._SX569_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/71roJPdmbSL._SX569_.jpg",
      "https://m.media-amazon.com/images/I/71aG7zGkEML._SX569_.jpg",
      "https://m.media-amazon.com/images/I/91diLaWTjTL._SX569_.jpg"
    ],
    sku: "CAS-0135",
    material: "Cotton",
    fit: "Relaxed",
    productUrl: "https://example.com/cas135",
    stock: 55,
    tags: ["chinos", "relaxed", "casual"]
  },
  {
    _id: "cas136",
    name: "White Striped Cotton Polo T-Shirt",
    brand: "Adidas",
    description: "White cotton polo T-shirt with navy stripes, breathable fabric perfect for summer wear.",
    price: 799,
    match: 88,
    category: "T-Shirt",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/61-+NzepxgL._SY879_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/61-+NzepxgL._SY879_.jpg",
      "https://m.media-amazon.com/images/I/715j0Lim29L._SY741_.jpg",
      "https://m.media-amazon.com/images/I/81oZkjR9xqL._SY741_.jpg"
    ],
    sku: "CAS-0136",
    material: "Cotton",
    fit: "Regular",
    productUrl: "https://example.com/cas136",
    stock: 60,
    tags: ["polo", "striped", "cotton"]
  },
  {
    _id: "cas137",
    name: "Blue Slim Fit Denim Shirt",
    brand: "H&M",
    description: "Slim fit denim shirt in blue, suitable for casual outings and streetwear styling.",
    price: 1549,
    match: 90,
    category: "shirt",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/61OZq-JkXEL._SY879_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/61OZq-JkXEL._SY879_.jpg",
      "https://m.media-amazon.com/images/I/719ybT0uOML._SX569_.jpg",
      "https://m.media-amazon.com/images/I/71EAcqlkwEL._SX569_.jpg"
    ],
    sku: "CAS-0137",
    material: "Denim",
    fit: "Slim",
    productUrl: "https://example.com/cas137",
    stock: 55,
    tags: ["denim", "slim", "casual"]
  },
  {
    _id: "cas138",
    name: "Grey Relaxed Fit Cotton Joggers",
    brand: "HRX",
    description: "Relaxed fit cotton joggers in grey, ideal for gym sessions or relaxed casual wear.",
    price: 783,
    match: 87,
    category: "Joggers",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/514XmLNddZL._SX679_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/514XmLNddZL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/611x5Vl+GXL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/61gbcCu0cwL._SY741_.jpg"
    ],
    sku: "CAS-0138",
    material: "Cotton",
    fit: "Relaxed",
    productUrl: "https://example.com/cas138",
    stock: 50,
    tags: ["joggers", "relaxed", "casual"]
  },
  {
    _id: "cas139",
    name: "Beige Slim Fit Chinos Pants",
    brand: "Flying Machine",
    description: "Slim fit beige cotton chinos for casual workdays or weekend outings with comfort.",
    price: 999,
    match: 90,
    category: "Chinos",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/71pMz5+txOL._SY879_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/71pMz5+txOL._SY879_.jpg",
      "https://m.media-amazon.com/images/I/816-roh4BfL._SX569_.jpg",
      "https://m.media-amazon.com/images/I/71cjd-au9zL._SX569_.jpg0"
    ],
    sku: "CAS-0139",
    material: "Cotton",
    fit: "Slim",
    productUrl: "https://example.com/cas139",
    stock: 55,
    tags: ["chinos", "slim", "casual"]
  },
  {
    _id: "cas140",
    name: "Light Blue Cotton Short Sleeve Shirt",
    brand: "H&M",
    description: "Short sleeve light blue cotton shirt, perfect for casual summer outings and streetwear.",
    price: 599,
    match: 88,
    category: "shirt",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/51bVdpeyXOL._SX679_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/51bVdpeyXOL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/614ExE3aQmL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/71fqhpiZ7UL._SX679_.jpg"
    ],
    sku: "CAS-0140",
    material: "Cotton",
    fit: "Regular",
    productUrl: "https://example.com/cas140",
    stock: 60,
    tags: ["cotton", "summer", "casual"]
  },
  {
    _id: "cas141",
    name: "Dark Grey Slim Fit Denim Jeans",
    brand: "Levi's",
    description: "Dark grey slim-fit denim jeans with durable fabric for everyday casual styling.",
    price: 1499,
    match: 91,
    category: "Jeans",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/81cGjm7oyYL._SY879_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/81cGjm7oyYL._SY879_.jpg",
      "https://m.media-amazon.com/images/I/A1C2FTMB5yL._SX569_.jpg",
      "https://m.media-amazon.com/images/I/81fAzXY1HAL._SX569_.jpg"
    ],
    sku: "CAS-0141",
    material: "Denim",
    fit: "Slim",
    productUrl: "https://example.com/cas141",
    stock: 50,
    tags: ["denim", "slim", "casual"]
  },
  {
    _id: "cas142",
    name: "White Cotton Polo T-Shirt",
    brand: "Adidas",
    description: "White cotton polo T-shirt with breathable fabric suitable for casual daily wear.",
    price: 1799,
    match: 88,
    category: "T-Shirt",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/51zTbl+DO3L._SX679_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/51zTbl+DO3L._SX679_.jpg",
      "https://m.media-amazon.com/images/I/519xj8R2AcL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/51xmxKBmEUL._SX679_.jpg"
    ],
    sku: "CAS-0142",
    material: "Cotton",
    fit: "Regular",
    productUrl: "https://example.com/cas142",
    stock: 60,
    tags: ["polo", "cotton", "casual"]
  }
];
