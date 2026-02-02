import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import User from '@/models/User';
import Collection from '@/models/Collection';
import { hash } from 'bcryptjs';
import { PRODUCTS } from '@/data/products';

export async function GET() {
  try {
    await connectToDatabase();

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    await Collection.deleteMany({});

    // Create a demo user
    const hashedPassword = await hash('password123', 10);
    await User.create({
      name: 'Demo User',
      email: 'user@example.com',
      password: hashedPassword,
      image: 'https://placehold.co/100x100?text=User',
    });

    // Seed products
    // Remove _id from PRODUCTS to let MongoDB generate its own ObjectIds
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const productsToInsert = PRODUCTS.map(({ _id, ...rest }) => ({
      ...rest,
      stock: 50, // Default stock
      tags: [rest.category.toLowerCase(), "fashion", rest.brand.toLowerCase()] // Generate some tags
    }));

    await Product.insertMany(productsToInsert);

    // Seed Collections
    const uniqueCategories = Array.from(new Set(PRODUCTS.map(p => p.category)));
    
    const collectionsToInsert = uniqueCategories.map(category => {
      // Find a representative product for the image
      const representativeProduct = PRODUCTS.find(p => p.category === category);
      let imageUrl = representativeProduct?.imageUrl || 'https://placehold.co/600x400?text=Collection';
      
      // Override for Accessories
      if (category === 'Accessories') {
        imageUrl = 'https://plus.unsplash.com/premium_photo-1673285096761-79e49ff5b760?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
      }

      return {
        name: category,
        slug: category, // Using category name as slug for compatibility
        description: `Explore our ${category} collection`,
        imageUrl: imageUrl,
        featured: true
      };
    });

    await Collection.insertMany(collectionsToInsert);

    return NextResponse.json({ success: true, message: 'Database seeded successfully' }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to seed database', error: (error as Error).message },
      { status: 500 }
    );
  }
}
