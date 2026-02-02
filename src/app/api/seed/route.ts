import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import User from '@/models/User';
import { hash } from 'bcryptjs';

export async function GET() {
  try {
    await connectToDatabase();

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});

    // Create a demo user
    const hashedPassword = await hash('password123', 10);
    await User.create({
      name: 'Demo User',
      email: 'user@example.com',
      password: hashedPassword,
      image: 'https://placehold.co/100x100?text=User',
    });

    // Seed products
    const products = [
      {
        name: "Classic White T-Shirt",
        description: "A versatile white t-shirt made from 100% cotton. Essential for any wardrobe.",
        price: 29.99,
        category: "shirt",
        imageUrl: "https://placehold.co/400x600?text=White+T-Shirt",
        tags: ["casual", "minimalist", "white", "cotton"],
        stock: 50,
      },
      {
        name: "Slim Fit Navy Chinos",
        description: "Comfortable slim fit chinos in navy blue. Perfect for casual or semi-formal occasions.",
        price: 59.99,
        category: "pants",
        imageUrl: "https://placehold.co/400x600?text=Navy+Chinos",
        tags: ["smart-casual", "navy", "pants"],
        stock: 30,
      },
      {
        name: "Denim Jacket",
        description: "Classic blue denim jacket. Rugged and stylish.",
        price: 89.99,
        category: "outerwear",
        imageUrl: "https://placehold.co/400x600?text=Denim+Jacket",
        tags: ["casual", "denim", "layering"],
        stock: 20,
      },
      {
        name: "Leather Chelsea Boots",
        description: "Sleek black leather Chelsea boots. Adds an edge to any outfit.",
        price: 120.00,
        category: "shoes",
        imageUrl: "https://placehold.co/400x600?text=Chelsea+Boots",
        tags: ["formal", "boots", "black", "leather"],
        stock: 15,
      },
      {
        name: "Floral Summer Dress",
        description: "Light and airy floral dress for summer days.",
        price: 49.99,
        category: "shirt", // Categorizing as top/body for simplicity or create 'dress' category
        imageUrl: "https://placehold.co/400x600?text=Floral+Dress",
        tags: ["summer", "floral", "casual"],
        stock: 25,
      },
      {
        name: "Running Sneakers",
        description: "High-performance running shoes with cushioning.",
        price: 99.99,
        category: "shoes",
        imageUrl: "https://placehold.co/400x600?text=Running+Shoes",
        tags: ["sport", "active", "comfortable"],
        stock: 40,
      },
       {
        name: "Leather Belt",
        description: "Genuine leather belt in brown.",
        price: 35.00,
        category: "accessory",
        imageUrl: "https://placehold.co/400x600?text=Leather+Belt",
        tags: ["accessory", "leather", "brown"],
        stock: 60,
      },
      {
        name: "Aviator Sunglasses",
        description: "Classic aviator style sunglasses.",
        price: 15.99,
        category: "accessory",
        imageUrl: "https://placehold.co/400x600?text=Sunglasses",
        tags: ["accessory", "summer", "cool"],
        stock: 100,
      }
    ];

    await Product.insertMany(products);

    return NextResponse.json({ message: 'Database seeded successfully', productsCount: products.length });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}
