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
  colors?: string[];
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
    tags: ["wedding", "festive", "ethnic", "embroidered"],
    colors: ["Ivory"]
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
    tags: ["cotton", "comfort", "dailywear", "festive"],
    colors: ["White"]
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
    tags: ["basic", "summer", "everyday"],
    colors: ["White"]
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
    tags: ["denim", "street", "casual"],
    colors: ["Blue"]
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
    tags: ["street", "graphic", "trendy"],
    colors: ["Black"]
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
    tags: ["chinos", "casual", "comfort"],
    colors: ["Olive"]
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
    tags: ["office", "workwear", "formal"],
    colors: ["White"]
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
    tags: ["office", "formal", "business"],
    colors: ["Navy"]
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
    tags: ["blazer", "office", "formal"],
    colors: ["Charcoal"]
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
    tags: ["officewear", "professional", "trousers"],
    colors: ["Grey"]
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
    tags: ["blazer", "corporate", "business"],
    colors: ["Navy"]
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

  // --- Footwear ---
  {
    _id: "shoe1",
    name: "Classic White Sneakers",
    brand: "Puma",
    description: "Versatile white sneakers for a clean casual look.",
    price: 3999,
    match: 95,
    category: "Sneakers",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/31TexuwyQwL._SY395_SX395_QL70_FMwebp_.jpg",
    images: ["https://m.media-amazon.com/images/I/31TexuwyQwL._SY395_SX395_QL70_FMwebp_.jpg"],
    sku: "SHOE-0001",
    material: "Leather",
    fit: "Regular",
    stock: 50,
    tags: ["shoes", "sneakers", "white"],
    colors: ["White"]
  },
  {
    _id: "shoe2",
    name: "Brown Leather Loafers",
    brand: "Hush Puppies",
    description: "Formal brown loafers for office and smart-casual wear.",
    price: 4500,
    match: 92,
    category: "Loafers",
    style: "Formal Wear",
    imageUrl: "https://m.media-amazon.com/images/I/61qS+w8tJDL._SY695_.jpg",
    images: ["https://m.media-amazon.com/images/I/61qS+w8tJDL._SY695_.jpg"],
    sku: "SHOE-0002",
    material: "Leather",
    fit: "Regular",
    stock: 30,
    tags: ["shoes", "loafers", "formal"],
    colors: ["Brown"]
  },
  {
    _id: "shoe3",
    name: "Black Oxford Shoes",
    brand: "Clarks",
    description: "Classic black lace-up shoes for formal occasions.",
    price: 5999,
    match: 94,
    category: "Formal Shoes",
    style: "Formal Wear",
    imageUrl: "https://m.media-amazon.com/images/I/718yI9hKA4L._SY695_.jpg",
    images: ["https://m.media-amazon.com/images/I/718yI9hKA4L._SY695_.jpg"],
    sku: "SHOE-0003",
    material: "Leather",
    fit: "Regular",
    stock: 25,
    tags: ["shoes", "formal", "black"],
    colors: ["Black"]
  },
  {
    _id: "shoe4",
    name: "Traditional Mojaris",
    brand: "Mochi",
    description: "Embroidered ethnic mojaris to complete your traditional look.",
    price: 1999,
    match: 90,
    category: "Mojaris",
    style: "Traditional Wear",
    imageUrl: "https://m.media-amazon.com/images/I/61M-q+F4JCL._SY695_.jpg",
    images: ["https://m.media-amazon.com/images/I/61M-q+F4JCL._SY695_.jpg"],
    sku: "SHOE-0004",
    material: "Synthetic",
    fit: "Regular",
    stock: 40,
    tags: ["shoes", "ethnic", "wedding"],
    colors: ["Gold"]
  },
  {
    _id: "shoe5",
    name: "Chunky Street Sneakers",
    brand: "Adidas",
    description: "Bold chunky sneakers for a trendy street style vibe.",
    price: 7999,
    match: 96,
    category: "Sneakers",
    style: "Casual Wear",
    imageUrl: "https://m.media-amazon.com/images/I/71j1R60xYyL._SY695_.jpg",
    images: ["https://m.media-amazon.com/images/I/71j1R60xYyL._SY695_.jpg"],
    sku: "SHOE-0005",
    material: "Mesh/Synthetic",
    fit: "Regular",
    stock: 20,
    tags: ["shoes", "street", "sneakers"],
    colors: ["Black", "White"]
  },

  // --- Accessories ---
  {
    _id: "acc1",
    name: "Silver Analog Watch",
    brand: "Titan",
    description: "Sleek silver watch suitable for both formal and casual outfits.",
    price: 3499,
    match: 88,
    category: "Watch",
    style: "Accessories",
    imageUrl: "https://m.media-amazon.com/images/I/71X7+zM4w-L._SX679_.jpg",
    images: ["https://m.media-amazon.com/images/I/71X7+zM4w-L._SX679_.jpg"],
    sku: "ACC-0001",
    material: "Steel",
    fit: "One Size",
    stock: 100,
    tags: ["accessories", "watch", "silver"],
    colors: ["Silver"]
  },
  {
    _id: "acc2",
    name: "Brown Leather Belt",
    brand: "Tommy Hilfiger",
    description: "Premium leather belt to match your shoes.",
    price: 1599,
    match: 85,
    category: "Belt",
    style: "Accessories",
    imageUrl: "https://m.media-amazon.com/images/I/81B-9hKqE9L._SX679_.jpg",
    images: ["https://m.media-amazon.com/images/I/81B-9hKqE9L._SX679_.jpg"],
    sku: "ACC-0002",
    material: "Leather",
    fit: "Regular",
    stock: 60,
    tags: ["accessories", "belt", "brown"],
    colors: ["Brown"]
  },
  {
    _id: "acc3",
    name: "Aviator Sunglasses",
    brand: "Ray-Ban",
    description: "Classic aviators for a cool, polished look.",
    price: 6590,
    match: 92,
    category: "Sunglasses",
    style: "Accessories",
    imageUrl: "https://m.media-amazon.com/images/I/61k1l-7bVUL._SX679_.jpg",
    images: ["https://m.media-amazon.com/images/I/61k1l-7bVUL._SX679_.jpg"],
    sku: "ACC-0003",
    material: "Metal",
    fit: "One Size",
    stock: 40,
    tags: ["accessories", "sunglasses", "summer"],
    colors: ["Gold"]
  },
  {
    _id: "acc4",
    name: "Leather Messenger Bag",
    brand: "Fossil",
    description: "Stylish bag for work and travel.",
    price: 8999,
    match: 89,
    category: "Bag",
    style: "Accessories",
    imageUrl: "https://m.media-amazon.com/images/I/91tA4a+EbfL._SY695_.jpg",
    images: ["https://m.media-amazon.com/images/I/91tA4a+EbfL._SY695_.jpg"],
    sku: "ACC-0004",
    material: "Leather",
    fit: "One Size",
    stock: 15,
    tags: ["accessories", "bag", "work"],
    colors: ["Brown"]
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
  },
  {
    _id: "new_1",
    brand: "Zara",
    name: "Classic White Cotton Shirt",
    description: "A timeless white cotton shirt designed for everyday comfort and effortless styling.",
    price: 1799,
    match: 92,
    imageUrl: "https://m.media-amazon.com/images/I/41xl7v-KEPL._SX679_.jpg",
    category: "Tops",
    style: "Casual",
    images: [
      "https://m.media-amazon.com/images/I/41xl7v-KEPL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/41Log11qdzL._SX522_.jpg",
      "https://m.media-amazon.com/images/I/413e7nq64tL._SX522_.jpg"
    ],
    sku: "TOP-001",
    material: "Cotton",
    fit: "Regular",
    productUrl: "https://www.amazon.in",
    stock: 45,
    tags: ["cotton", "white", "dailywear"],
    colors: ["White"]
  },
  {
    _id: "new_2",
    brand: "H&M",
    name: "Oversized Graphic T-Shirt",
    description: "Relaxed-fit graphic tee inspired by modern streetwear culture.",
    price: 1299,
    match: 88,
    imageUrl: "https://m.media-amazon.com/images/I/71f0Z1P8wDL._SY741_.jpg",
    category: "Tops",
    style: "Streetwear",
    images: [
      "https://m.media-amazon.com/images/I/71f0Z1P8wDL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/61qM2C6qgHL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/61w3vBzG1DL._SY741_.jpg"
    ],
    sku: "TOP-002",
    material: "Cotton",
    fit: "Oversized",
    productUrl: "https://www.amazon.in",
    stock: 60,
    tags: ["streetwear", "graphic", "oversized"],
    colors: ["Black"]
  },
  {
    _id: "new_3",
    brand: "Levi's",
    name: "Slim Fit Blue Jeans",
    description: "Classic slim-fit jeans crafted for durability and everyday versatility.",
    price: 2999,
    match: 94,
    imageUrl: "https://m.media-amazon.com/images/I/61U+oJ0G5ZL._SY741_.jpg",
    category: "Bottoms",
    style: "Casual",
    images: [
      "https://m.media-amazon.com/images/I/61U+oJ0G5ZL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/71Z4m3qk9ZL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/61m3bP8C8VL._SY741_.jpg"
    ],
    sku: "BOT-003",
    material: "Denim",
    fit: "Slim",
    productUrl: "https://www.amazon.in",
    stock: 38,
    tags: ["denim", "jeans", "slimfit"],
    colors: ["Blue"]
  },
  {
    _id: "new_4",
    brand: "Fabindia",
    name: "Handloom Cotton Palazzo Pants",
    description: "Breathable palazzo pants made from soft handloom cotton for all-day comfort.",
    price: 2199,
    match: 90,
    imageUrl: "https://m.media-amazon.com/images/I/61xP0Q9wGQL._SY741_.jpg",
    category: "Bottoms",
    style: "Traditional Wear",
    images: [
      "https://m.media-amazon.com/images/I/61xP0Q9wGQL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/71TgG6BqFhL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/61b6V8n6GXL._SY741_.jpg"
    ],
    sku: "BOT-004",
    material: "Cotton",
    fit: "Regular",
    productUrl: "https://www.amazon.in",
    stock: 25,
    tags: ["handloom", "ethnic", "palazzo"],
    colors: ["Beige"]
  },
  {
    _id: "new_5",
    brand: "Nike",
    name: "Air Max Running Shoes",
    description: "Lightweight running shoes engineered for comfort, grip, and everyday training.",
    price: 5499,
    match: 96,
    imageUrl: "https://m.media-amazon.com/images/I/71pKJ7Zp9ML._SY695_.jpg",
    category: "Shoes",
    style: "Casual",
    images: [
      "https://m.media-amazon.com/images/I/71pKJ7Zp9ML._SY695_.jpg",
      "https://m.media-amazon.com/images/I/61n7y8K8QJL._SY695_.jpg",
      "https://m.media-amazon.com/images/I/61YV0R9mE1L._SY695_.jpg"
    ],
    sku: "SHO-005",
    material: "Mesh",
    fit: "Regular",
    productUrl: "https://www.amazon.in",
    stock: 52,
    tags: ["running", "sportswear", "lightweight"],
    colors: ["Grey", "White"]
  },
  {
    _id: "new_6",
    brand: "Adidas",
    name: "Urban Street Sneakers",
    description: "Minimal sneakers designed for everyday street style and comfort.",
    price: 4799,
    match: 91,
    imageUrl: "https://m.media-amazon.com/images/I/71zKuNICJAL._SY695_.jpg",
    category: "Shoes",
    style: "Streetwear",
    images: [
      "https://m.media-amazon.com/images/I/71zKuNICJAL._SY695_.jpg",
      "https://m.media-amazon.com/images/I/61E9S7qzQRL._SY695_.jpg",
      "https://m.media-amazon.com/images/I/61M8J9wz8ZL._SY695_.jpg"
    ],
    sku: "SHO-006",
    material: "Synthetic",
    fit: "Regular",
    productUrl: "https://www.amazon.in",
    stock: 40,
    tags: ["sneakers", "urban", "streetstyle"],
    colors: ["Black"]
  },
  {
    _id: "new_7",
    brand: "ONLY",
    name: "Floral Summer Dress",
    description: "A breezy floral dress perfect for warm days and casual outings.",
    price: 2599,
    match: 89,
    imageUrl: "https://m.media-amazon.com/images/I/71w3bX8p1TL._SY741_.jpg",
    category: "Dresses",
    style: "Bohemian",
    images: [
      "https://m.media-amazon.com/images/I/71w3bX8p1TL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/61G5K9V8KJL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/61J9P8ZQZEL._SY741_.jpg"
    ],
    sku: "DRS-007",
    material: "Viscose",
    fit: "Regular",
    productUrl: "https://www.amazon.in",
    stock: 30,
    tags: ["floral", "summer", "boho"],
    colors: ["Yellow"]
  },
  {
    _id: "new_8",
    brand: "Allen Solly",
    name: "Tailored Navy Blazer",
    description: "Sharp tailored blazer designed to elevate your formal and business looks.",
    price: 6499,
    match: 97,
    imageUrl: "https://m.media-amazon.com/images/I/71xH0D8Z1qL._SY741_.jpg",
    category: "Outerwear",
    style: "Business",
    images: [
      "https://m.media-amazon.com/images/I/71xH0D8Z1qL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/61W7pFZK4ZL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/61Z8T6F3QJL._SY741_.jpg"
    ],
    sku: "OUT-008",
    material: "Polyester Blend",
    fit: "Tailored",
    productUrl: "https://www.amazon.in",
    stock: 22,
    tags: ["blazer", "formal", "officewear"],
    colors: ["Navy"]
  },
  {
    _id: "new_9",
    brand: "Manyavar",
    name: "Embroidered Festive Kurta",
    description: "Traditional embroidered kurta crafted for festive and cultural occasions.",
    price: 3499,
    match: 93,
    imageUrl: "https://m.media-amazon.com/images/I/71RZ6X8K9UL._SY741_.jpg",
    category: "Traditional Wear",
    style: "Traditional Wear",
    images: [
      "https://m.media-amazon.com/images/I/71RZ6X8K9UL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/61C8P9KX1ZL._SY741_.jpg",
      "https://m.media-amazon.com/images/I/61Z7K8M1TJL._SY741_.jpg"
    ],
    sku: "TRD-009",
    material: "Silk Blend",
    fit: "Regular",
    productUrl: "https://www.amazon.in",
    stock: 28,
    tags: ["festive", "ethnic", "kurta"],
    colors: ["Maroon"]
  },
  {
    _id: "new_10",
    brand: "Fossil",
    name: "Leather Analog Wrist Watch",
    description: "A refined leather-strap watch that blends classic design with modern appeal.",
    price: 7999,
    match: 95,
    imageUrl: "https://m.media-amazon.com/images/I/41o2f26hKkS._SY300_SX300_QL70_FMwebp_.jpg",
    category: "Accessories",
    style: "Formal",
    images: [
      "https://m.media-amazon.com/images/I/41o2f26hKkS._SY300_SX300_QL70_FMwebp_.jpg",
      "https://m.media-amazon.com/images/I/61rIH0Ts3ES._SX522_.jpg",
      "https://m.media-amazon.com/images/I/71Rwu+0RHES._SX522_.jpg"
    ],
    sku: "ACC-010",
    material: "Leather",
    productUrl: "https://www.amazon.in",
    stock: 15,
    tags: ["watch", "leather", "formal"],
    colors: ["Brown"]
  },

  // ========== NEW FOOTWEAR ==========
  {
    _id: "shoe6",
    name: "Navy Blue Canvas Sneakers",
    brand: "Puma",
    description: "Lightweight canvas sneakers in navy blue for casual everyday wear.",
    price: 2499,
    match: 91,
    category: "Sneakers",
    style: "Casual Wear",
    imageUrl: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "SHOE-0006",
    material: "Canvas",
    fit: "Regular",
    stock: 45,
    tags: ["sneakers", "canvas", "navy"],
    colors: ["Navy"]
  },
  {
    _id: "shoe7",
    name: "Black Running Sports Shoes",
    brand: "Nike",
    description: "High-performance black running shoes with cushioned sole for daily training.",
    price: 4999,
    match: 94,
    category: "Sneakers",
    style: "Casual Wear",
    imageUrl: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "SHOE-0007",
    material: "Mesh/Rubber",
    fit: "Regular",
    stock: 35,
    tags: ["running", "sports", "black"],
    colors: ["Black"]
  },
  {
    _id: "shoe8",
    name: "Grey Retro Sneakers",
    brand: "New Balance",
    description: "Classic retro-style grey sneakers that pair with any casual outfit.",
    price: 5499,
    match: 93,
    category: "Sneakers",
    style: "Casual Wear",
    imageUrl: "https://images.pexels.com/photos/1032110/pexels-photo-1032110.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/1032110/pexels-photo-1032110.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "SHOE-0008",
    material: "Suede/Mesh",
    fit: "Regular",
    stock: 25,
    tags: ["retro", "sneakers", "grey"],
    colors: ["Grey"]
  },
  {
    _id: "shoe9",
    name: "Tan Leather Loafers",
    brand: "Clarks",
    description: "Premium tan leather loafers for smart-casual and semi-formal occasions.",
    price: 5299,
    match: 92,
    category: "Loafers",
    style: "Formal Wear",
    imageUrl: "https://images.pexels.com/photos/293405/pexels-photo-293405.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/293405/pexels-photo-293405.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "SHOE-0009",
    material: "Leather",
    fit: "Regular",
    stock: 30,
    tags: ["loafers", "leather", "tan"],
    colors: ["Brown"]
  },
  {
    _id: "shoe10",
    name: "Black Suede Loafers",
    brand: "Hush Puppies",
    description: "Sleek black suede loafers for formal events and office wear.",
    price: 3999,
    match: 90,
    category: "Loafers",
    style: "Formal Wear",
    imageUrl: "https://images.pexels.com/photos/267301/pexels-photo-267301.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/267301/pexels-photo-267301.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "SHOE-0010",
    material: "Suede",
    fit: "Regular",
    stock: 20,
    tags: ["loafers", "suede", "black"],
    colors: ["Black"]
  },
  {
    _id: "shoe11",
    name: "Brown Derby Formal Shoes",
    brand: "Red Tape",
    description: "Classic brown derby shoes with genuine leather for office and formal occasions.",
    price: 2999,
    match: 91,
    category: "Formal Shoes",
    style: "Formal Wear",
    imageUrl: "https://images.pexels.com/photos/292999/pexels-photo-292999.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/292999/pexels-photo-292999.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "SHOE-0011",
    material: "Leather",
    fit: "Regular",
    stock: 35,
    tags: ["formal", "derby", "brown"],
    colors: ["Brown"]
  },
  {
    _id: "shoe12",
    name: "Black Monk Strap Shoes",
    brand: "Louis Philippe",
    description: "Elegant black monk strap shoes for premium formal styling.",
    price: 6499,
    match: 95,
    category: "Formal Shoes",
    style: "Formal Wear",
    imageUrl: "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "SHOE-0012",
    material: "Leather",
    fit: "Regular",
    stock: 18,
    tags: ["formal", "monk-strap", "premium"],
    colors: ["Black"]
  },
  {
    _id: "shoe13",
    name: "Brown Chelsea Boots",
    brand: "Clarks",
    description: "Versatile brown Chelsea boots that work for casual and semi-formal occasions.",
    price: 7499,
    match: 93,
    category: "Boots",
    style: "Casual Wear",
    imageUrl: "https://images.pexels.com/photos/1159670/pexels-photo-1159670.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/1159670/pexels-photo-1159670.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "SHOE-0013",
    material: "Leather",
    fit: "Regular",
    stock: 15,
    tags: ["boots", "chelsea", "brown"],
    colors: ["Brown"]
  },
  {
    _id: "shoe14",
    name: "Black Leather Ankle Boots",
    brand: "Red Tape",
    description: "Rugged black ankle boots for winter styling and casual wear.",
    price: 3499,
    match: 90,
    category: "Boots",
    style: "Casual Wear",
    imageUrl: "https://images.pexels.com/photos/1476430/pexels-photo-1476430.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/1476430/pexels-photo-1476430.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "SHOE-0014",
    material: "Leather",
    fit: "Regular",
    stock: 22,
    tags: ["boots", "ankle", "black"],
    colors: ["Black"]
  },
  {
    _id: "shoe15",
    name: "Gold Embroidered Mojaris",
    brand: "Mochi",
    description: "Handcrafted gold embroidered mojaris for wedding and festive occasions.",
    price: 2499,
    match: 91,
    category: "Mojaris",
    style: "Traditional Wear",
    imageUrl: "https://images.pexels.com/photos/3289663/pexels-photo-3289663.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/3289663/pexels-photo-3289663.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "SHOE-0015",
    material: "Synthetic/Embroidered",
    fit: "Regular",
    stock: 35,
    tags: ["mojaris", "ethnic", "gold"],
    colors: ["Gold"]
  },
  {
    _id: "shoe16",
    name: "White Slip-On Sneakers",
    brand: "Vans",
    description: "Minimalist white slip-on sneakers for effortless casual style.",
    price: 3299,
    match: 92,
    category: "Sneakers",
    style: "Casual Wear",
    imageUrl: "https://images.pexels.com/photos/1858404/pexels-photo-1858404.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/1858404/pexels-photo-1858404.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "SHOE-0016",
    material: "Canvas",
    fit: "Regular",
    stock: 40,
    tags: ["slip-on", "sneakers", "white"],
    colors: ["White"]
  },

  // ========== NEW ACCESSORIES ==========
  {
    _id: "acc5",
    name: "Black Chronograph Watch",
    brand: "Fossil",
    description: "Bold black chronograph watch with stainless steel band for a sporty-formal look.",
    price: 8999,
    match: 94,
    category: "Watch",
    style: "Accessories",
    imageUrl: "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "ACC-0005",
    material: "Stainless Steel",
    fit: "One Size",
    stock: 25,
    tags: ["watch", "chronograph", "black"],
    colors: ["Black"]
  },
  {
    _id: "acc6",
    name: "Rose Gold Analog Watch",
    brand: "Titan",
    description: "Elegant rose gold watch with leather strap for formal and party occasions.",
    price: 4999,
    match: 91,
    category: "Watch",
    style: "Accessories",
    imageUrl: "https://images.pexels.com/photos/280250/pexels-photo-280250.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/280250/pexels-photo-280250.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "ACC-0006",
    material: "Leather/Metal",
    fit: "One Size",
    stock: 20,
    tags: ["watch", "rose-gold", "formal"],
    colors: ["Gold"]
  },
  {
    _id: "acc7",
    name: "Digital Sports Watch",
    brand: "Casio",
    description: "Durable digital sports watch with water resistance for active lifestyles.",
    price: 2499,
    match: 88,
    category: "Watch",
    style: "Accessories",
    imageUrl: "https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "ACC-0007",
    material: "Resin/Rubber",
    fit: "One Size",
    stock: 50,
    tags: ["watch", "digital", "sports"],
    colors: ["Black"]
  },
  {
    _id: "acc8",
    name: "Black Leather Reversible Belt",
    brand: "Tommy Hilfiger",
    description: "Reversible black and brown leather belt - two looks in one.",
    price: 2199,
    match: 90,
    category: "Belt",
    style: "Accessories",
    imageUrl: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "ACC-0008",
    material: "Leather",
    fit: "Regular",
    stock: 40,
    tags: ["belt", "reversible", "leather"],
    colors: ["Black", "Brown"]
  },
  {
    _id: "acc9",
    name: "Tan Italian Leather Belt",
    brand: "Woodland",
    description: "Premium tan Italian leather belt with brass buckle for formal outfits.",
    price: 1799,
    match: 87,
    category: "Belt",
    style: "Accessories",
    imageUrl: "https://images.pexels.com/photos/45055/pexels-photo-45055.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/45055/pexels-photo-45055.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "ACC-0009",
    material: "Leather",
    fit: "Regular",
    stock: 35,
    tags: ["belt", "tan", "formal"],
    colors: ["Brown"]
  },
  {
    _id: "acc10",
    name: "Wayfarer Sunglasses",
    brand: "Ray-Ban",
    description: "Iconic wayfarer sunglasses with UV protection for a timeless look.",
    price: 7490,
    match: 93,
    category: "Sunglasses",
    style: "Accessories",
    imageUrl: "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "ACC-0010",
    material: "Acetate/Glass",
    fit: "One Size",
    stock: 30,
    tags: ["sunglasses", "wayfarer", "uv-protection"],
    colors: ["Black"]
  },
  {
    _id: "acc11",
    name: "Round Metal Sunglasses",
    brand: "Vincent Chase",
    description: "Trendy round metal-frame sunglasses with gradient lenses.",
    price: 1499,
    match: 86,
    category: "Sunglasses",
    style: "Accessories",
    imageUrl: "https://images.pexels.com/photos/46710/pexels-photo-46710.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/46710/pexels-photo-46710.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "ACC-0011",
    material: "Metal/Glass",
    fit: "One Size",
    stock: 45,
    tags: ["sunglasses", "round", "trendy"],
    colors: ["Gold"]
  },
  {
    _id: "acc12",
    name: "Canvas Laptop Backpack",
    brand: "Wildcraft",
    description: "Durable canvas backpack with laptop compartment for work and travel.",
    price: 2499,
    match: 88,
    category: "Bag",
    style: "Accessories",
    imageUrl: "https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "ACC-0012",
    material: "Canvas",
    fit: "One Size",
    stock: 30,
    tags: ["bag", "backpack", "laptop"],
    colors: ["Grey"]
  },
  {
    _id: "acc13",
    name: "Black Leather Briefcase",
    brand: "Hidesign",
    description: "Premium black leather briefcase for professionals and business meetings.",
    price: 6999,
    match: 92,
    category: "Bag",
    style: "Accessories",
    imageUrl: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "ACC-0013",
    material: "Leather",
    fit: "One Size",
    stock: 12,
    tags: ["bag", "briefcase", "formal"],
    colors: ["Black"]
  },
  {
    _id: "acc14",
    name: "Navy Blue Baseball Cap",
    brand: "Nike",
    description: "Classic navy baseball cap with embroidered logo for casual and sporty outfits.",
    price: 999,
    match: 85,
    category: "Hat",
    style: "Accessories",
    imageUrl: "https://images.pexels.com/photos/1878821/pexels-photo-1878821.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/1878821/pexels-photo-1878821.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "ACC-0014",
    material: "Cotton Twill",
    fit: "One Size",
    stock: 60,
    tags: ["cap", "baseball", "sports"],
    colors: ["Navy"]
  },
  {
    _id: "acc15",
    name: "Black Wool Fedora Hat",
    brand: "FabSeasons",
    description: "Stylish black wool fedora hat for a sophisticated casual look.",
    price: 799,
    match: 84,
    category: "Hat",
    style: "Accessories",
    imageUrl: "https://images.pexels.com/photos/984619/pexels-photo-984619.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/984619/pexels-photo-984619.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "ACC-0015",
    material: "Wool",
    fit: "One Size",
    stock: 25,
    tags: ["hat", "fedora", "stylish"],
    colors: ["Black"]
  },

  // ========== MORE FORMAL SHIRTS ==========
  {
    _id: "form20",
    name: "White Slim Fit Formal Shirt",
    brand: "Arrow",
    description: "Crisp white formal shirt with slim fit for office and business meetings.",
    price: 1599,
    match: 95,
    category: "Formal Shirt",
    style: "Formal Wear",
    imageUrl: "https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "FORM-0020",
    material: "Cotton Blend",
    fit: "Slim",
    stock: 70,
    tags: ["formal", "white", "office"],
    colors: ["White"]
  },
  {
    _id: "form21",
    name: "Light Blue Formal Shirt",
    brand: "Peter England",
    description: "Light blue formal shirt ideal for corporate environments and interviews.",
    price: 1299,
    match: 93,
    category: "Formal Shirt",
    style: "Formal Wear",
    imageUrl: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "FORM-0021",
    material: "Cotton",
    fit: "Regular",
    stock: 55,
    tags: ["formal", "blue", "corporate"],
    colors: ["Blue"]
  },
  {
    _id: "form22",
    name: "Pink Slim Fit Formal Shirt",
    brand: "Van Heusen",
    description: "Stylish pink formal shirt for a modern professional look.",
    price: 1449,
    match: 90,
    category: "Formal Shirt",
    style: "Formal Wear",
    imageUrl: "https://images.pexels.com/photos/3760514/pexels-photo-3760514.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/3760514/pexels-photo-3760514.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "FORM-0022",
    material: "Cotton Blend",
    fit: "Slim",
    stock: 40,
    tags: ["formal", "pink", "modern"],
    colors: ["Pink"]
  },
  {
    _id: "form23",
    name: "Navy Striped Formal Shirt",
    brand: "Louis Philippe",
    description: "Navy blue striped formal shirt for boardroom and executive meetings.",
    price: 1899,
    match: 94,
    category: "Formal Shirt",
    style: "Formal Wear",
    imageUrl: "https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "FORM-0023",
    material: "Cotton",
    fit: "Slim",
    stock: 35,
    tags: ["formal", "striped", "navy"],
    colors: ["Navy"]
  },
  {
    _id: "form24",
    name: "Black Formal Trousers",
    brand: "Blackberrys",
    description: "Sharp black formal trousers with perfect drape for professional settings.",
    price: 1799,
    match: 93,
    category: "Formal Trousers",
    style: "Formal Wear",
    imageUrl: "https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "FORM-0024",
    material: "Poly Viscose",
    fit: "Slim",
    stock: 45,
    tags: ["formal", "black", "office"],
    colors: ["Black"]
  },
  {
    _id: "form25",
    name: "Beige Formal Trousers",
    brand: "Arrow",
    description: "Classic beige formal trousers for a polished business-casual appearance.",
    price: 1599,
    match: 89,
    category: "Formal Trousers",
    style: "Formal Wear",
    imageUrl: "https://images.pexels.com/photos/3760514/pexels-photo-3760514.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/3760514/pexels-photo-3760514.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "FORM-0025",
    material: "Cotton Blend",
    fit: "Regular",
    stock: 38,
    tags: ["formal", "beige", "business-casual"],
    colors: ["Beige"]
  },

  // ========== MORE SUITS (was 1, need 4+) ==========
  {
    _id: "form30",
    name: "Navy Blue 2-Piece Slim Suit",
    brand: "Raymond",
    description: "Sharp navy blue slim-fit 2-piece suit for business meetings and formal events.",
    price: 8999,
    match: 96,
    category: "Suit",
    style: "Formal Wear",
    imageUrl: "https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "FORM-0030",
    material: "Poly Wool",
    fit: "Slim",
    stock: 18,
    tags: ["suit", "navy", "business"],
    colors: ["Navy"]
  },
  {
    _id: "form31",
    name: "Black Classic Fit Formal Suit",
    brand: "Van Heusen",
    description: "Timeless black formal suit ideal for weddings, galas, and corporate events.",
    price: 7499,
    match: 95,
    category: "Suit",
    style: "Formal Wear",
    imageUrl: "https://images.pexels.com/photos/2955376/pexels-photo-2955376.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/2955376/pexels-photo-2955376.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "FORM-0031",
    material: "Poly Viscose",
    fit: "Regular",
    stock: 15,
    tags: ["suit", "black", "wedding"],
    colors: ["Black"]
  },
  {
    _id: "form32",
    name: "Beige Linen Summer Suit",
    brand: "Arrow",
    description: "Lightweight beige linen suit perfect for summer weddings and outdoor events.",
    price: 6299,
    match: 92,
    category: "Suit",
    style: "Formal Wear",
    imageUrl: "https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "FORM-0032",
    material: "Linen Blend",
    fit: "Regular",
    stock: 12,
    tags: ["suit", "linen", "summer-wedding"],
    colors: ["Beige"]
  },

  // ========== MORE KURTA (was 1, need 4+) ==========
  {
    _id: "trad20",
    name: "Navy Blue Cotton Kurta",
    brand: "Fabindia",
    description: "Comfortable navy cotton kurta for daily ethnic wear and casual occasions.",
    price: 999,
    match: 91,
    category: "Kurta",
    style: "Traditional Wear",
    imageUrl: "https://images.pexels.com/photos/8872667/pexels-photo-8872667.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/8872667/pexels-photo-8872667.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "TRAD-0020",
    material: "Cotton",
    fit: "Regular",
    stock: 50,
    tags: ["kurta", "cotton", "daily"],
    colors: ["Navy"]
  },
  {
    _id: "trad21",
    name: "White Chikan Embroidered Kurta",
    brand: "Manyavar",
    description: "Elegant white chikankari embroidered kurta for festive and wedding events.",
    price: 1699,
    match: 94,
    category: "Kurta",
    style: "Traditional Wear",
    imageUrl: "https://images.pexels.com/photos/8872665/pexels-photo-8872665.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/8872665/pexels-photo-8872665.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "TRAD-0021",
    material: "Cotton",
    fit: "Regular",
    stock: 35,
    tags: ["kurta", "chikankari", "festive"],
    colors: ["White"]
  },
  {
    _id: "trad22",
    name: "Maroon Silk Festive Kurta",
    brand: "Sojanya",
    description: "Rich maroon silk kurta with subtle embroidery for celebrations and puja.",
    price: 1499,
    match: 93,
    category: "Kurta",
    style: "Traditional Wear",
    imageUrl: "https://images.pexels.com/photos/8872669/pexels-photo-8872669.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/8872669/pexels-photo-8872669.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "TRAD-0022",
    material: "Silk Blend",
    fit: "Regular",
    stock: 28,
    tags: ["kurta", "silk", "maroon"],
    colors: ["Maroon"]
  },
  {
    _id: "trad23",
    name: "Olive Green Casual Kurta",
    brand: "Anokhi",
    description: "Relaxed olive green kurta perfect for casual ethnic styling.",
    price: 849,
    match: 89,
    category: "Kurta",
    style: "Traditional Wear",
    imageUrl: "https://images.pexels.com/photos/8872670/pexels-photo-8872670.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/8872670/pexels-photo-8872670.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "TRAD-0023",
    material: "Cotton",
    fit: "Relaxed",
    stock: 40,
    tags: ["kurta", "olive", "casual"],
    colors: ["Olive"]
  },

  // ========== MORE SHORT KURTA (was 1) ==========
  {
    _id: "fus20",
    name: "Blue Printed Short Kurta",
    brand: "Manyavar",
    description: "Trendy blue printed short kurta for parties and casual ethnic events.",
    price: 1399,
    match: 90,
    category: "Short Kurta",
    style: "Party Wear",
    imageUrl: "https://images.pexels.com/photos/8872670/pexels-photo-8872670.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/8872670/pexels-photo-8872670.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "FUS-0020",
    material: "Cotton Silk",
    fit: "Regular",
    stock: 30,
    tags: ["short-kurta", "printed", "party"],
    colors: ["Blue"]
  },
  {
    _id: "fus21",
    name: "Black Embroidered Short Kurta",
    brand: "Ethnix by Raymond",
    description: "Sophisticated black short kurta with minimal embroidery for evening parties.",
    price: 1899,
    match: 93,
    category: "Short Kurta",
    style: "Party Wear",
    imageUrl: "https://images.pexels.com/photos/8872667/pexels-photo-8872667.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/8872667/pexels-photo-8872667.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "FUS-0021",
    material: "Silk Blend",
    fit: "Slim",
    stock: 22,
    tags: ["short-kurta", "black", "embroidered"],
    colors: ["Black"]
  },

  // ========== MORE KURTA SHIRT (was 1) ==========
  {
    _id: "fus22",
    name: "Beige Mandarin Collar Kurta Shirt",
    brand: "Fabindia",
    description: "Casual beige kurta shirt with mandarin collar for daily indo-western styling.",
    price: 1199,
    match: 89,
    category: "Kurta Shirt",
    style: "Casual Wear",
    imageUrl: "https://images.pexels.com/photos/8872665/pexels-photo-8872665.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/8872665/pexels-photo-8872665.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "FUS-0022",
    material: "Cotton Linen",
    fit: "Regular",
    stock: 45,
    tags: ["kurta-shirt", "mandarin", "indo-western"],
    colors: ["Beige"]
  },
  {
    _id: "fus23",
    name: "White Linen Kurta Shirt",
    brand: "Anokhi",
    description: "Breathable white linen kurta shirt for summer casual and beach vacations.",
    price: 999,
    match: 90,
    category: "Kurta Shirt",
    style: "Casual Wear",
    imageUrl: "https://images.pexels.com/photos/8872670/pexels-photo-8872670.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/8872670/pexels-photo-8872670.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "FUS-0023",
    material: "Linen",
    fit: "Relaxed",
    stock: 55,
    tags: ["kurta-shirt", "linen", "summer"],
    colors: ["White"]
  },

  // ========== MORE BLAZERS (was 3, need 5+) ==========
  {
    _id: "form33",
    name: "Black Slim Fit Velvet Blazer",
    brand: "Raymond",
    description: "Luxurious black velvet blazer for evening parties and receptions.",
    price: 7999,
    match: 96,
    category: "Blazer",
    style: "Party Wear",
    imageUrl: "https://images.pexels.com/photos/2955376/pexels-photo-2955376.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/2955376/pexels-photo-2955376.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "FORM-0033",
    material: "Velvet",
    fit: "Slim",
    stock: 12,
    tags: ["blazer", "velvet", "party"],
    colors: ["Black"]
  },
  {
    _id: "form34",
    name: "Beige Cotton Casual Blazer",
    brand: "H&M",
    description: "Relaxed beige cotton blazer for smart-casual and weekend dressing.",
    price: 3999,
    match: 91,
    category: "Blazer",
    style: "Casual Wear",
    imageUrl: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "FORM-0034",
    material: "Cotton Blend",
    fit: "Regular",
    stock: 20,
    tags: ["blazer", "beige", "casual"],
    colors: ["Beige"]
  },
  {
    _id: "form35",
    name: "Maroon Slim Fit Blazer",
    brand: "Peter England",
    description: "Bold maroon blazer for cocktail parties and festive celebrations.",
    price: 4999,
    match: 94,
    category: "Blazer",
    style: "Party Wear",
    imageUrl: "https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "FORM-0035",
    material: "Poly Viscose",
    fit: "Slim",
    stock: 16,
    tags: ["blazer", "maroon", "party"],
    colors: ["Maroon"]
  },

  // ========== MORE CO-ORDS (was 1) ==========
  {
    _id: "cas200",
    name: "Olive Green Shirt & Shorts Co-ord Set",
    brand: "Roadster",
    description: "Matching olive green co-ord set with shirt and shorts for vacation styling.",
    price: 1299,
    match: 90,
    category: "Co-ords",
    style: "Casual Wear",
    imageUrl: "https://images.pexels.com/photos/1232459/pexels-photo-1232459.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/1232459/pexels-photo-1232459.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "CAS-0200",
    material: "Cotton",
    fit: "Relaxed",
    stock: 35,
    tags: ["co-ords", "olive", "vacation"],
    colors: ["Olive"]
  },
  {
    _id: "cas201",
    name: "Navy Blue Printed Co-ord Set",
    brand: "H&M",
    description: "Tropical printed navy co-ord set with shirt and pants for resort wear.",
    price: 1599,
    match: 88,
    category: "Co-ords",
    style: "Casual Wear",
    imageUrl: "https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "CAS-0201",
    material: "Viscose",
    fit: "Relaxed",
    stock: 30,
    tags: ["co-ords", "printed", "resort"],
    colors: ["Navy"]
  },

  // ========== MORE BANDHGALA (was 1+1) ==========
  {
    _id: "fus30",
    name: "Navy Blue Silk Bandhgala",
    brand: "Manyavar",
    description: "Regal navy silk bandhgala for wedding receptions and formal ethnic events.",
    price: 5999,
    match: 95,
    category: "Bandhgala",
    style: "Party Wear",
    imageUrl: "https://images.pexels.com/photos/8872669/pexels-photo-8872669.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/8872669/pexels-photo-8872669.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "FUS-0030",
    material: "Silk Blend",
    fit: "Tailored",
    stock: 15,
    tags: ["bandhgala", "navy", "wedding"],
    colors: ["Navy"]
  },
  {
    _id: "fus31",
    name: "Black Velvet Bandhgala Jacket",
    brand: "Raymond",
    description: "Premium black velvet bandhgala jacket for grand celebrations.",
    price: 6499,
    match: 96,
    category: "Bandhgala Jacket",
    style: "Party Wear",
    imageUrl: "https://images.pexels.com/photos/8872667/pexels-photo-8872667.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/8872667/pexels-photo-8872667.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "FUS-0031",
    material: "Velvet",
    fit: "Tailored",
    stock: 10,
    tags: ["bandhgala", "velvet", "grand"],
    colors: ["Black"]
  },

  // ========== MORE T-SHIRTS (varied colors for recommendation engine) ==========
  {
    _id: "cas150",
    name: "Maroon Solid Crew Neck T-Shirt",
    brand: "Mufti",
    description: "Premium maroon cotton T-shirt for a bold casual look.",
    price: 499,
    match: 90,
    category: "T-Shirt",
    style: "Casual Wear",
    imageUrl: "https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "CAS-0150",
    material: "Cotton",
    fit: "Regular",
    stock: 80,
    tags: ["tshirt", "maroon", "solid"],
    colors: ["Maroon"]
  },
  {
    _id: "cas151",
    name: "Navy Blue V-Neck T-Shirt",
    brand: "Jockey",
    description: "Classic navy blue V-neck T-shirt in soft combed cotton.",
    price: 599,
    match: 92,
    category: "T-Shirt",
    style: "Casual Wear",
    imageUrl: "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "CAS-0151",
    material: "Cotton",
    fit: "Regular",
    stock: 90,
    tags: ["tshirt", "navy", "v-neck"],
    colors: ["Navy"]
  },
  {
    _id: "cas152",
    name: "Grey Melange Round Neck T-Shirt",
    brand: "HRX",
    description: "Versatile grey melange T-shirt that pairs with everything.",
    price: 449,
    match: 93,
    category: "T-Shirt",
    style: "Casual Wear",
    imageUrl: "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "CAS-0152",
    material: "Cotton Blend",
    fit: "Regular",
    stock: 100,
    tags: ["tshirt", "grey", "basic"],
    colors: ["Grey"]
  },
  {
    _id: "cas153",
    name: "Mustard Yellow Henley T-Shirt",
    brand: "Roadster",
    description: "Eye-catching mustard henley T-shirt for a fresh casual style.",
    price: 549,
    match: 88,
    category: "T-Shirt",
    style: "Casual Wear",
    imageUrl: "https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "CAS-0153",
    material: "Cotton",
    fit: "Slim",
    stock: 55,
    tags: ["tshirt", "mustard", "henley"],
    colors: ["Yellow"]
  },
  {
    _id: "cas154",
    name: "Black Solid Round Neck T-Shirt",
    brand: "Puma",
    description: "Essential black T-shirt for layering or standalone casual looks.",
    price: 699,
    match: 95,
    category: "T-Shirt",
    style: "Casual Wear",
    imageUrl: "https://images.pexels.com/photos/1813947/pexels-photo-1813947.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/1813947/pexels-photo-1813947.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "CAS-0154",
    material: "Cotton",
    fit: "Regular",
    stock: 120,
    tags: ["tshirt", "black", "essential"],
    colors: ["Black"]
  },

  // ========== MORE CASUAL SHIRTS (varied colors) ==========
  {
    _id: "cas160",
    name: "White Linen Casual Shirt",
    brand: "H&M",
    description: "Crisp white linen shirt for summer days and casual brunches.",
    price: 1299,
    match: 93,
    category: "shirt",
    style: "Casual Wear",
    imageUrl: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "CAS-0160",
    material: "Linen",
    fit: "Regular",
    stock: 50,
    tags: ["shirt", "white", "linen"],
    colors: ["White"]
  },
  {
    _id: "cas161",
    name: "Olive Green Oxford Shirt",
    brand: "Zara",
    description: "Smart olive green oxford shirt for smart-casual everyday wear.",
    price: 1499,
    match: 91,
    category: "shirt",
    style: "Casual Wear",
    imageUrl: "https://images.pexels.com/photos/1232459/pexels-photo-1232459.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/1232459/pexels-photo-1232459.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "CAS-0161",
    material: "Cotton Oxford",
    fit: "Slim",
    stock: 40,
    tags: ["shirt", "olive", "oxford"],
    colors: ["Olive"]
  },
  {
    _id: "cas162",
    name: "Navy Blue Printed Casual Shirt",
    brand: "Wrogn",
    description: "Trendy navy printed shirt for weekend outings and parties.",
    price: 1199,
    match: 89,
    category: "shirt",
    style: "Casual Wear",
    imageUrl: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "CAS-0162",
    material: "Cotton",
    fit: "Slim",
    stock: 45,
    tags: ["shirt", "navy", "printed"],
    colors: ["Navy"]
  },
  {
    _id: "cas163",
    name: "Black Slim Fit Cotton Shirt",
    brand: "US Polo Assn",
    description: "Sharp black cotton shirt suitable for casual dinners and semi-formal events.",
    price: 1399,
    match: 92,
    category: "shirt",
    style: "Casual Wear",
    imageUrl: "https://images.pexels.com/photos/1813947/pexels-photo-1813947.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/1813947/pexels-photo-1813947.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "CAS-0163",
    material: "Cotton",
    fit: "Slim",
    stock: 50,
    tags: ["shirt", "black", "slim"],
    colors: ["Black"]
  },

  // ========== MORE JEANS (varied washes) ==========
  {
    _id: "cas170",
    name: "Indigo Blue Regular Fit Jeans",
    brand: "Wrangler",
    description: "Classic indigo blue jeans with a comfortable regular fit.",
    price: 1299,
    match: 91,
    category: "Jeans",
    style: "Casual Wear",
    imageUrl: "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "CAS-0170",
    material: "Denim",
    fit: "Regular",
    stock: 70,
    tags: ["jeans", "indigo", "regular"],
    colors: ["Blue"]
  },
  {
    _id: "cas171",
    name: "Grey Slim Fit Denim Jeans",
    brand: "Levis",
    description: "Modern grey denim jeans for a contemporary casual outfit.",
    price: 1799,
    match: 90,
    category: "Jeans",
    style: "Casual Wear",
    imageUrl: "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "CAS-0171",
    material: "Denim",
    fit: "Slim",
    stock: 50,
    tags: ["jeans", "grey", "slim"],
    colors: ["Grey"]
  },

  // ========== MORE JACKETS ==========
  {
    _id: "cas180",
    name: "Black Quilted Puffer Jacket",
    brand: "Zara",
    description: "Warm black puffer jacket for winter styling and layered looks.",
    price: 2999,
    match: 92,
    category: "Jacket",
    style: "Casual Wear",
    imageUrl: "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "CAS-0180",
    material: "Polyester",
    fit: "Regular",
    stock: 25,
    tags: ["jacket", "puffer", "winter"],
    colors: ["Black"]
  },
  {
    _id: "cas181",
    name: "Navy Windbreaker Jacket",
    brand: "Nike",
    description: "Lightweight navy windbreaker for outdoor activities and travel.",
    price: 2499,
    match: 89,
    category: "Jacket",
    style: "Casual Wear",
    imageUrl: "https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "CAS-0181",
    material: "Nylon",
    fit: "Regular",
    stock: 30,
    tags: ["jacket", "windbreaker", "navy"],
    colors: ["Navy"]
  },
  {
    _id: "cas182",
    name: "Brown Suede Biker Jacket",
    brand: "Roadster",
    description: "Rugged brown suede jacket for an edgy casual look.",
    price: 3499,
    match: 93,
    category: "Jacket",
    style: "Casual Wear",
    imageUrl: "https://images.pexels.com/photos/1232459/pexels-photo-1232459.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/1232459/pexels-photo-1232459.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "CAS-0182",
    material: "Suede",
    fit: "Slim",
    stock: 18,
    tags: ["jacket", "suede", "biker"],
    colors: ["Brown"]
  },

  // ========== MORE CHINOS (khaki, black) ==========
  {
    _id: "cas190",
    name: "Khaki Slim Fit Chinos",
    brand: "US Polo Assn",
    description: "Classic khaki chinos that work for casual Fridays and weekend outings.",
    price: 1199,
    match: 91,
    category: "Chinos",
    style: "Casual Wear",
    imageUrl: "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "CAS-0190",
    material: "Cotton Stretch",
    fit: "Slim",
    stock: 55,
    tags: ["chinos", "khaki", "casual"],
    colors: ["Khaki"]
  },
  {
    _id: "cas191",
    name: "Black Stretch Slim Chinos",
    brand: "Zara",
    description: "Sleek black chinos with stretch comfort for versatile styling.",
    price: 1499,
    match: 92,
    category: "Chinos",
    style: "Casual Wear",
    imageUrl: "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "CAS-0191",
    material: "Cotton Stretch",
    fit: "Slim",
    stock: 50,
    tags: ["chinos", "black", "stretch"],
    colors: ["Black"]
  },

  // ========== MORE JOGGERS (navy, olive) ==========
  {
    _id: "cas195",
    name: "Navy Blue Slim Fit Joggers",
    brand: "Adidas",
    description: "Athletic navy joggers with tapered fit for sports and casual wear.",
    price: 1599,
    match: 90,
    category: "Joggers",
    style: "Casual Wear",
    imageUrl: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "CAS-0195",
    material: "Polyester",
    fit: "Slim",
    stock: 45,
    tags: ["joggers", "navy", "athletic"],
    colors: ["Navy"]
  },
  {
    _id: "cas196",
    name: "Olive Green Cargo Joggers",
    brand: "Puma",
    description: "Utility-style olive cargo joggers with multiple pockets.",
    price: 1399,
    match: 88,
    category: "Joggers",
    style: "Casual Wear",
    imageUrl: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "CAS-0196",
    material: "Cotton Blend",
    fit: "Regular",
    stock: 40,
    tags: ["joggers", "olive", "cargo"],
    colors: ["Olive"]
  },
  {
    _id: "cas197",
    name: "Black Track Pants with White Stripes",
    brand: "Adidas",
    description: "Classic black track pants with iconic white side stripes.",
    price: 1799,
    match: 91,
    category: "Joggers",
    style: "Casual Wear",
    imageUrl: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "CAS-0197",
    material: "Polyester",
    fit: "Regular",
    stock: 55,
    tags: ["trackpants", "black", "stripes"],
    colors: ["Black"]
  },

  // ========== MORE FORMAL SHIRTS (varied colors) ==========
  {
    _id: "form40",
    name: "Lavender Slim Fit Formal Shirt",
    brand: "Arrow",
    description: "Subtle lavender formal shirt for a fresh corporate look.",
    price: 1499,
    match: 90,
    category: "Formal Shirt",
    style: "Formal Wear",
    imageUrl: "https://images.pexels.com/photos/3760514/pexels-photo-3760514.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/3760514/pexels-photo-3760514.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "FORM-0040",
    material: "Cotton Blend",
    fit: "Slim",
    stock: 40,
    tags: ["formal", "lavender", "office"],
    colors: ["Pink"]
  },
  {
    _id: "form41",
    name: "Grey Checked Formal Shirt",
    brand: "Van Heusen",
    description: "Grey checked formal shirt for a smart office appearance.",
    price: 1599,
    match: 91,
    category: "Formal Shirt",
    style: "Formal Wear",
    imageUrl: "https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "FORM-0041",
    material: "Cotton",
    fit: "Regular",
    stock: 35,
    tags: ["formal", "grey", "checked"],
    colors: ["Grey"]
  },

  // ========== MORE SNEAKERS (for variety) ==========
  {
    _id: "shoe20",
    name: "Olive Green Sports Sneakers",
    brand: "Nike",
    description: "Trendy olive green sneakers for active lifestyle and casual pairing.",
    price: 4499,
    match: 91,
    category: "Sneakers",
    style: "Casual Wear",
    imageUrl: "https://images.pexels.com/photos/1240892/pexels-photo-1240892.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/1240892/pexels-photo-1240892.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "SHOE-0020",
    material: "Mesh/Rubber",
    fit: "Regular",
    stock: 28,
    tags: ["sneakers", "olive", "sports"],
    colors: ["Olive"]
  },
  {
    _id: "shoe21",
    name: "Red High-Top Sneakers",
    brand: "Converse",
    description: "Classic red high-top canvas sneakers for bold street style.",
    price: 3499,
    match: 89,
    category: "Sneakers",
    style: "Casual Wear",
    imageUrl: "https://images.pexels.com/photos/1261004/pexels-photo-1261004.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/1261004/pexels-photo-1261004.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "SHOE-0021",
    material: "Canvas",
    fit: "Regular",
    stock: 35,
    tags: ["sneakers", "red", "high-top"],
    colors: ["Red"]
  },

  // ========== MORE KURTA PAJAMA ==========
  {
    _id: "trad30",
    name: "Black Silk Kurta Pajama",
    brand: "Tasva",
    description: "Elegant black silk kurta pajama for evening festivities and celebrations.",
    price: 1599,
    match: 93,
    category: "Kurta Pajama",
    style: "Traditional Wear",
    imageUrl: "https://images.pexels.com/photos/8872667/pexels-photo-8872667.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/8872667/pexels-photo-8872667.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "TRAD-0030",
    material: "Silk Blend",
    fit: "Regular",
    stock: 30,
    tags: ["kurta-pajama", "black", "festive"],
    colors: ["Black"]
  },
  {
    _id: "trad31",
    name: "Beige Cotton Kurta Pajama",
    brand: "Fabindia",
    description: "Breezy beige cotton kurta pajama perfect for summer puja and daily wear.",
    price: 899,
    match: 90,
    category: "Kurta Pajama",
    style: "Traditional Wear",
    imageUrl: "https://images.pexels.com/photos/8872665/pexels-photo-8872665.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/8872665/pexels-photo-8872665.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "TRAD-0031",
    material: "Cotton",
    fit: "Relaxed",
    stock: 45,
    tags: ["kurta-pajama", "beige", "summer"],
    colors: ["Beige"]
  },

  // ========== MORE LOAFERS / FORMAL SHOES ==========
  {
    _id: "shoe22",
    name: "Navy Blue Suede Loafers",
    brand: "Aldo",
    description: "Stylish navy suede loafers for smart-casual dressing.",
    price: 4999,
    match: 91,
    category: "Loafers",
    style: "Casual Wear",
    imageUrl: "https://images.pexels.com/photos/1027130/pexels-photo-1027130.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/1027130/pexels-photo-1027130.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "SHOE-0022",
    material: "Suede",
    fit: "Regular",
    stock: 22,
    tags: ["loafers", "navy", "suede"],
    colors: ["Navy"]
  },
  {
    _id: "shoe23",
    name: "Tan Brogue Formal Shoes",
    brand: "Clarks",
    description: "Elegant tan brogue shoes with perforated detailing for formal occasions.",
    price: 6999,
    match: 94,
    category: "Formal Shoes",
    style: "Formal Wear",
    imageUrl: "https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "SHOE-0023",
    material: "Leather",
    fit: "Regular",
    stock: 18,
    tags: ["formal", "brogue", "tan"],
    colors: ["Brown"]
  },

  // ========== MORE ACCESSORIES (Wallet - new, Ties) ==========
  {
    _id: "acc20",
    name: "Black Leather Bi-fold Wallet",
    brand: "Tommy Hilfiger",
    description: "Classic black leather wallet with multiple card slots and coin pocket.",
    price: 1999,
    match: 87,
    category: "Bag",
    style: "Accessories",
    imageUrl: "https://images.pexels.com/photos/915915/pexels-photo-915915.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/915915/pexels-photo-915915.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "ACC-0020",
    material: "Leather",
    fit: "One Size",
    stock: 50,
    tags: ["wallet", "leather", "black"],
    colors: ["Black"]
  },
  {
    _id: "acc21",
    name: "Brown Leather Card Holder Wallet",
    brand: "Woodland",
    description: "Compact brown leather card holder for daily essentials.",
    price: 899,
    match: 85,
    category: "Bag",
    style: "Accessories",
    imageUrl: "https://images.pexels.com/photos/2079438/pexels-photo-2079438.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/2079438/pexels-photo-2079438.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "ACC-0021",
    material: "Leather",
    fit: "One Size",
    stock: 60,
    tags: ["wallet", "card-holder", "brown"],
    colors: ["Brown"]
  },

  // ========== MORE BOOTS ==========
  {
    _id: "shoe24",
    name: "Tan Suede Desert Boots",
    brand: "Clarks",
    description: "Iconic desert boots in tan suede for smart-casual and weekend styling.",
    price: 5999,
    match: 92,
    category: "Boots",
    style: "Casual Wear",
    imageUrl: "https://images.pexels.com/photos/1308188/pexels-photo-1308188.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/1308188/pexels-photo-1308188.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "SHOE-0024",
    material: "Suede",
    fit: "Regular",
    stock: 20,
    tags: ["boots", "desert", "tan"],
    colors: ["Brown"]
  },

  // ========== MORE SHERWANI ==========
  {
    _id: "trad40",
    name: "Gold Brocade Wedding Sherwani",
    brand: "Manyavar",
    description: "Opulent gold brocade sherwani designed for the groom on his big day.",
    price: 12999,
    match: 97,
    category: "Sherwani",
    style: "Traditional Wear",
    imageUrl: "https://images.pexels.com/photos/8872669/pexels-photo-8872669.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/8872669/pexels-photo-8872669.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "TRAD-0040",
    material: "Brocade Silk",
    fit: "Royal Fit",
    stock: 8,
    tags: ["sherwani", "gold", "groom"],
    colors: ["Gold"]
  },

  // ========== MORE WATCHES ==========
  {
    _id: "acc25",
    name: "Blue Dial Leather Strap Watch",
    brand: "Titan",
    description: "Elegant blue dial watch with brown leather strap for daily wear.",
    price: 2999,
    match: 89,
    category: "Watch",
    style: "Accessories",
    imageUrl: "https://images.pexels.com/photos/9978722/pexels-photo-9978722.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/9978722/pexels-photo-9978722.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "ACC-0025",
    material: "Leather/Steel",
    fit: "One Size",
    stock: 30,
    tags: ["watch", "blue-dial", "leather"],
    colors: ["Blue"]
  },

  // ========== MORE BELTS ==========
  {
    _id: "acc26",
    name: "Black Textured Leather Belt",
    brand: "Louis Philippe",
    description: "Premium black textured leather belt for formal suits.",
    price: 1999,
    match: 90,
    category: "Belt",
    style: "Accessories",
    imageUrl: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600",
    images: [
      "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    sku: "ACC-0026",
    material: "Leather",
    fit: "Regular",
    stock: 35,
    tags: ["belt", "black", "textured"],
    colors: ["Black"]
  }
];
