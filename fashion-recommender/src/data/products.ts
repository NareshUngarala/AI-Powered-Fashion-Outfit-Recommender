export interface Product {
  _id: string;
  brand: string;
  name: string;
  description: string;
  price: number;
  match: number;
  imageUrl: string;
  category: string;
}

export const PRODUCTS: Product[] = [
  {
    _id: "p1",
    brand: "ARKET",
    name: "Relaxed Oxford Shirt",
    description: "A breathable cotton Oxford shirt designed for effortless everyday wear.",
    price: 75.0,
    match: 96,
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518",
    category: "Tops"
  },
  {
    _id: "p2",
    brand: "COS",
    name: "Minimal Poplin Shirt",
    description: "Clean-lined poplin shirt with a contemporary relaxed fit.",
    price: 89.0,
    match: 94,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    category: "Tops"
  },
  {
    _id: "p3",
    brand: "ZARA",
    name: "Oversized Graphic Tee",
    description: "Statement graphic T-shirt with an oversized streetwear silhouette.",
    price: 39.0,
    match: 90,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?&sat=-20",
    category: "New Arrivals"
  },
  {
    _id: "p4",
    brand: "UNIQLO",
    name: "Supima Cotton Tee",
    description: "Ultra-soft Supima cotton T-shirt built for daily comfort.",
    price: 19.9,
    match: 97,
    imageUrl: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
    category: "Essentials"
  },
  {
    _id: "p5",
    brand: "COS",
    name: "Tailored Wool Trousers",
    description: "Sharp tailored trousers with a refined modern silhouette.",
    price: 145.0,
    match: 95,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?&crop=faces&fit=crop",
    category: "Bottoms"
  },
  {
    _id: "p6",
    brand: "LEVI'S",
    name: "501 Original Jeans",
    description: "Iconic straight-leg jeans with durable premium denim.",
    price: 98.0,
    match: 99,
    imageUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063",
    category: "Best Sellers"
  },
  {
    _id: "p7",
    brand: "MANGO",
    name: "Slim Fit Chinos",
    description: "Versatile chinos designed for both casual and smart outfits.",
    price: 79.0,
    match: 93,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?&h=900",
    category: "Bottoms"
  },
  {
    _id: "p8",
    brand: "ZARA",
    name: "Lightweight Bomber Jacket",
    description: "Minimal bomber jacket ideal for transitional weather.",
    price: 119.0,
    match: 92,
    imageUrl: "https://images.unsplash.com/photo-1514996937319-344454492b37",
    category: "Outerwear"
  },
  {
    _id: "p9",
    brand: "PATAGONIA",
    name: "Insulated Down Vest",
    description: "Packable insulated vest for outdoor layering.",
    price: 179.0,
    match: 94,
    imageUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?&sat=-30",
    category: "Seasonal"
  },
  {
    _id: "p10",
    brand: "H&M",
    name: "Classic Trench Coat",
    description: "Timeless trench coat with a clean structured design.",
    price: 159.0,
    match: 91,
    imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f",
    category: "Outerwear"
  },
  {
    _id: "p11",
    brand: "NIKE",
    name: "Dri-FIT Training Tee",
    description: "Performance T-shirt designed to keep you cool during workouts.",
    price: 45.0,
    match: 90,
    imageUrl: "https://images.unsplash.com/photo-1542215712-3f5f70b2e263",
    category: "Activewear"
  },
  {
    _id: "p12",
    brand: "ADIDAS",
    name: "Essential Jogger Pants",
    description: "Comfortable joggers with a modern tapered fit.",
    price: 55.0,
    match: 91,
    imageUrl: "https://images.unsplash.com/photo-1542213493895-edf5b94f5a33",
    category: "Activewear"
  },
  {
    _id: "p13",
    brand: "PUMA",
    name: "Zip Training Hoodie",
    description: "Lightweight hoodie for gym and casual layering.",
    price: 69.0,
    match: 89,
    imageUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b",
    category: "Activewear"
  },
  {
    _id: "p14",
    brand: "HUGO BOSS",
    name: "Slim Fit Wool Suit",
    description: "Modern wool suit tailored for business and formal events.",
    price: 599.0,
    match: 98,
    imageUrl: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59",
    category: "Formalwear"
  },
  {
    _id: "p15",
    brand: "BROOKS BROTHERS",
    name: "Classic White Dress Shirt",
    description: "Formal dress shirt with a crisp structured finish.",
    price: 120.0,
    match: 96,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?&bw=0",
    category: "Formalwear"
  },
  {
    _id: "p16",
    brand: "COMMON PROJECTS",
    name: "Achilles Low Sneakers",
    description: "Minimal leather sneakers with a luxury finish.",
    price: 410.0,
    match: 97,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    category: "Footwear"
  },
  {
    _id: "p17",
    brand: "CLARKS",
    name: "Leather Desert Boots",
    description: "Classic suede desert boots for everyday wear.",
    price: 130.0,
    match: 94,
    imageUrl: "https://images.unsplash.com/photo-1528701800489-20be3c30c1d5",
    category: "Footwear"
  },
  {
    _id: "p18",
    brand: "NIKE",
    name: "Air Lifestyle Sneakers",
    description: "Street-inspired sneakers with cushioned comfort.",
    price: 140.0,
    match: 92,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?&sat=-15",
    category: "Footwear"
  },
  {
    _id: "p19",
    brand: "RAY-BAN",
    name: "Classic Aviator Sunglasses",
    description: "Timeless aviator sunglasses with polarized lenses.",
    price: 155.0,
    match: 93,
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?&crop=faces&fit=crop",
    category: "Accessories"
  },
  {
    _id: "p20",
    brand: "FOSSIL",
    name: "Minimal Leather Watch",
    description: "Elegant leather strap watch with a clean dial.",
    price: 199.0,
    match: 95,
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    category: "Accessories"
  },
  {
    _id: "p21",
    brand: "HERMÈS",
    name: "Classic Leather Belt",
    description: "Premium leather belt with refined craftsmanship.",
    price: 250.0,
    match: 98,
    imageUrl: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad",
    category: "Accessories"
  },
  {
    _id: "p22",
    brand: "HERSCHEL",
    name: "City Backpack",
    description: "Sleek backpack designed for everyday urban use.",
    price: 89.0,
    match: 91,
    imageUrl: "https://images.unsplash.com/photo-1516478177764-9fe5bdc5aff3",
    category: "Bags"
  },
  {
    _id: "p23",
    brand: "RAINS",
    name: "Waterproof Rolltop Bag",
    description: "Modern waterproof backpack with rolltop closure.",
    price: 110.0,
    match: 90,
    imageUrl: "https://images.unsplash.com/photo-1521017432531-fbd92d768814",
    category: "Bags"
  },
  {
    _id: "p24",
    brand: "MUJI",
    name: "Cotton Lounge Shorts",
    description: "Soft cotton shorts designed for comfort at home.",
    price: 29.0,
    match: 92,
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d",
    category: "Essentials"
  },
  {
    _id: "p25",
    brand: "MR PORTER",
    name: "Smart Casual Office Look",
    description: "A curated outfit combining tailoring and relaxed pieces.",
    price: 0.0,
    match: 96,
    imageUrl: "https://images.unsplash.com/photo-1496167117681-944f702be1f4",
    category: "Style Guides"
  }
];
