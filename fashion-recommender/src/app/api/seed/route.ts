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
      // Ensure arrays and required fields have defaults if missing (though our new data has them)
      images: rest.images || [rest.imageUrl],
      tags: rest.tags || [rest.category.toLowerCase(), rest.style.toLowerCase(), rest.brand.toLowerCase()],
      stock: rest.stock || 50,
      match: rest.match || 90 // Default match score if not provided
    }));

    await Product.insertMany(productsToInsert);

    // Seed Style Collections
    // We want specifically: Casual Wear, Party Wear, Formal Wear, Traditional Wear
    const styleCollections = [
      {
        name: 'Traditional Wear',
        slug: 'Traditional Wear',
        description: 'Festivals & Weddings',
        imageUrl: 'https://img.freepik.com/free-photo/two-indian-stylish-mans-friends-traditional-clothes-posed-outdoor_627829-2531.jpg?semt=ais_hybrid&w=740&q=80', // Sherwani image
        featured: true
      },
      {
        name: 'Casual Wear',
        slug: 'Casual Wear',
        description: 'Daily Life & Comfort',
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', // Casual Shirt
        featured: true
      },
      {
        name: 'Formal Wear',
        slug: 'Formal Wear',
        description: 'Office & Business',
        imageUrl: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59', // Suit
        featured: true
      },
      {
        name: 'Party Wear',
        slug: 'Party Wear',
        description: 'Trendy & Fusion Styles',
        imageUrl: 'https://images.unsplash.com/photo-1514996937319-344454492b37', // Bomber Jacket/Party vibe
        featured: true
      }
    ];

    await Collection.insertMany(styleCollections);

    return NextResponse.json({ success: true, message: 'Database seeded successfully with Styles' }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to seed database', error: (error as Error).message },
      { status: 500 }
    );
  }
}
