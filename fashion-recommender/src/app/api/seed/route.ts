import { NextResponse } from 'next/server';
import { PRODUCTS } from '@/data/products';

export async function POST() {
  try {
    // Prepare seed data
    const demoUser = {
      name: 'Demo User',
      email: 'user@example.com',
      password: 'password123', // Backend will hash this
      image: 'https://placehold.co/100x100?text=User',
    };

    const styleCollections = [
      {
        name: 'Casual Wear',
        slug: 'Casual Wear',
        description: 'Daily Life & Comfort',
        imageUrl: 'https://media.istockphoto.com/id/649340288/photo/sharing-business-experience.jpg?s=612x612&w=0&k=20&c=yGbcV8z_zKjJi_bGcIGcYWhTX5WVGYA0ePsk5w2PFVo=',
        featured: true
      },
      {
        name: 'Traditional Wear',
        slug: 'Traditional Wear',
        description: 'Festivals & Weddings',
        imageUrl: 'https://img.freepik.com/free-photo/two-indian-stylish-mans-friends-traditional-clothes-posed-outdoor_627829-2531.jpg?semt=ais_hybrid&w=740&q=80',
        featured: true
      },
      {
        name: 'Formal Wear',
        slug: 'Formal Wear',
        description: 'Office & Business',
        imageUrl: 'https://img.freepik.com/free-photo/confident-young-businessman-suit-standing-with-arms-folded_171337-18599.jpg',
        featured: true
      },
      {
        name: 'Party Wear',
        slug: 'Party Wear',
        description: 'Trendy & Fusion Styles',
        imageUrl: 'https://c4.wallpaperflare.com/wallpaper/1011/374/434/group-of-people-men-men-outdoors-fashion-photography-wallpaper-preview.jpg',
        featured: true
      }
    ];

    const productsToInsert = PRODUCTS.map(({ _id, ...rest }) => ({
      ...rest,
      images: rest.images || [rest.imageUrl],
      tags: rest.tags || [rest.category.toLowerCase(), rest.style.toLowerCase(), rest.brand.toLowerCase()],
      stock: rest.stock || 50,
      match: rest.match || 90
    }));

    const seedData = {
      users: [demoUser],
      products: productsToInsert,
      collections: styleCollections
    };

    const response = await fetch(`${process.env.PYTHON_BACKEND_URL || 'http://localhost:8000'}/seed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(seedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to seed database via Python backend');
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 200 });

  } catch (error: unknown) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to seed database', error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET() {
    return POST();
}
