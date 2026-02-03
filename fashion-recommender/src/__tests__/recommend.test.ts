import { NextRequest } from 'next/server';

// Mock mongoose BEFORE importing anything else to prevent BSON/ESM errors
jest.mock('mongoose', () => ({
  Schema: class {
    constructor() {}
  },
  model: jest.fn(() => ({
    findOne: jest.fn(),
  })),
  models: {},
  connect: jest.fn(),
  connection: {
    isConnected: false
  }
}));

// Mock dependencies
jest.mock('@/lib/ai-stylist');
jest.mock('@/lib/mongodb', () => jest.fn()); // Mock database connection
jest.mock('@/models/Product'); // Mock Mongoose model

// Mock Next.js server components
jest.mock('next/server', () => {
  return {
    NextResponse: {
      json: (body: unknown, init?: { status?: number }) => {
        return {
          json: async () => body,
          status: init?.status || 200,
        };
      },
    },
    NextRequest: jest.fn(),
  };
});

// Import the route handler AFTER mocks
import { POST } from '@/app/api/recommend/route';
import { getOutfitRecommendation } from '@/lib/ai-stylist';
import Product from '@/models/Product';

describe('Recommendation API Integration Test', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully generate an outfit and link to real products', async () => {
    // --- 1. Mock AI Response ---
    const mockAiResponse = {
      styleAdvice: "A perfect casual look for the weekend.",
      items: [
        { 
          name: "Slim Fit Chinos", 
          category: "Bottoms", 
          color: "Beige", 
          reason: "Contrasts well with the dark shirt." 
        }
      ]
    };
    (getOutfitRecommendation as jest.Mock).mockResolvedValue(mockAiResponse);

    // --- 2. Mock Database Product Lookup ---
    const mockDbProduct = {
      _id: "real-product-id-123",
      name: "Premium Beige Chinos",
      price: 49.99,
      imageUrl: "/images/chinos.jpg",
      category: "Bottoms",
      description: "Comfortable slim fit chinos."
    };
    
    // Make Product.findOne return our mock product
    // The API calls findOne twice (specific match, then fallback), we can just return the same one
    (Product.findOne as jest.Mock).mockResolvedValue(mockDbProduct);

    // --- 3. Simulate API Request ---
    const inputProduct = {
      _id: "source-product-1",
      name: "Navy Polo Shirt",
      category: "Tops",
      price: 29.99,
      imageUrl: "/images/polo.jpg"
    };

    const req = {
      json: async () => ({ product: inputProduct })
    } as unknown as NextRequest;

    // --- 4. Execute the API Route Handler ---
    const response = await POST(req);
    
    // --- 5. Verify Response ---
    expect(response.status).toBe(200);
    
    const data = await response.json();
    
    // Check if AI advice is passed through
    expect(data.styleAdvice).toBe(mockAiResponse.styleAdvice);
    
    // Check if the item was "enhanced" with DB data
    const recommendedItem = data.items[0];
    expect(recommendedItem.id).toBe(mockDbProduct._id); // Should be linked to DB ID
    expect(recommendedItem.name).toBe(mockDbProduct.name); // Should use DB Name
    expect(recommendedItem.price).toBe(mockDbProduct.price); // Should use DB Price
    
    // Check if dependencies were called
    expect(getOutfitRecommendation).toHaveBeenCalledWith(inputProduct, undefined, undefined);
    expect(Product.findOne).toHaveBeenCalled();
  });

  it('should pass personalization preferences to AI', async () => {
    // --- 1. Mock AI Response ---
    (getOutfitRecommendation as jest.Mock).mockResolvedValue({
      styleAdvice: "Formal look.",
      items: []
    });

    // --- 2. Simulate API Request with Preferences ---
    const inputProduct = { name: "Suit" };
    const req = {
      json: async () => ({ 
        product: inputProduct,
        occasion: "Formal",
        gender: "Men"
      })
    } as unknown as NextRequest;

    // --- 3. Execute ---
    await POST(req);
    
    // --- 4. Verify ---
    expect(getOutfitRecommendation).toHaveBeenCalledWith(inputProduct, "Formal", "Men");
  });

  it('should handle errors gracefully', async () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Mock AI failure
    (getOutfitRecommendation as jest.Mock).mockRejectedValue(new Error("AI Service Down"));

    const req = {
      json: async () => ({ product: { name: "Test" } })
    } as unknown as NextRequest;

    const response = await POST(req);
    
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe('Failed to generate recommendation');

    // Restore console.error
    consoleSpy.mockRestore();
  });
});
