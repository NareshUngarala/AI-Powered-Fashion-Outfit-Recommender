import { GoogleGenerativeAI } from "@google/generative-ai";
import { Product } from '@/data/products';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export interface RecommendationItem {
  category: string;
  name: string;
  color: string;
  reason: string;
}

export interface OutfitRecommendation {
  items: RecommendationItem[];
  styleAdvice: string;
}

export async function getOutfitRecommendation(product: Product): Promise<OutfitRecommendation> {
  if (!GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is not set. Returning mock data.");
    return getMockRecommendation();
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      I am a fashion stylist. I have a product:
      Name: ${product.name}
      Description: ${product.description}
      Category: ${product.category}
      
      Please suggest a complete outfit to go with this item. 
      Suggest 3 matching items (e.g., if shirt, suggest pants, shoes, accessory).
      
      Return the response in strictly JSON format without markdown code blocks.
      The JSON should be an object with:
      1. "items": an array of 3 objects, each having "category", "name" (a specific catchy name), "color", and "reason" (why it matches).
      2. "styleAdvice": a short paragraph giving overall style advice for this outfit.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up potential markdown formatting if Gemini includes it
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanText) as OutfitRecommendation;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return getMockRecommendation();
  }
}

function getMockRecommendation(): OutfitRecommendation {
  return {
    items: [
      {
        category: "Pants",
        name: "Classic Chinos",
        color: "Beige",
        reason: "Neutral color matches well with the item."
      },
      {
        category: "Shoes",
        name: "Minimalist Sneakers",
        color: "White",
        reason: "Clean look suitable for casual wear."
      },
      {
        category: "Accessory",
        name: "Leather Watch",
        color: "Brown",
        reason: "Adds a touch of sophistication."
      }
    ],
    styleAdvice: "This is a mock recommendation because the AI API key is missing or failed. Please configure GEMINI_API_KEY in .env.local."
  };
}
