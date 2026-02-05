import os
import json
import logging
import random
from datetime import datetime
from typing import List, Optional
from pathlib import Path
from fastapi import FastAPI, HTTPException, Body, Query, Depends, status
from pydantic import BaseModel, Field, BeforeValidator
from dotenv import load_dotenv

# Load environment variables
env_path = Path(__file__).resolve().parent.parent / '.env.local'
print(f"Loading env from: {env_path}")
print(f"File exists: {env_path.exists()}")
load_dotenv(dotenv_path=env_path)
load_dotenv()

import os
print(f"MONGODB_URI: {os.getenv('MONGODB_URI')}")

from google import genai
from google.genai import types
from bson import ObjectId
import bcrypt

from database import product_collection, cart_collection, user_collection, wishlist_collection, order_collection, collection_collection, outfit_collection, payment_collection
from models import (
    ProductModel, CartModel, CartItemModel, UserModel, UserCreate, UserLogin,
    WishlistModel, WishlistResponse, OrderModel, OrderCreate, CollectionModel, OutfitModel, OutfitCreate, UserProfileUpdate,
    PaymentMethodModel, PaymentMethodCreate, ChangePasswordRequest, SeedRequest
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI(title="Fashion Recommender AI API")

# Security
def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

# Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = None
if not GEMINI_API_KEY:
    logger.warning("GEMINI_API_KEY is not set.")
else:
    client = genai.Client(api_key=GEMINI_API_KEY)

# --- Helper Functions ---

def map_category(category: str) -> str:
    category = category.lower()
    
    # Full Body / Sets
    if any(x in category for x in ["set", "suit", "sherwani", "pajama", "co-ords", "overall", "jumpsuit"]):
        return "FullBody"
        
    # Bottoms
    if any(x in category for x in ["jeans", "trouser", "pant", "chinos", "jogger", "short", "bottom", "skirt", "legging"]):
        return "Bottoms"
        
    # Outerwear
    if any(x in category for x in ["jacket", "blazer", "coat", "bandhgala", "vest", "cardigan"]):
        return "Outerwear"
        
    # Tops (check this last to avoid matching "Kurta Set" as Top if not caught by FullBody)
    if any(x in category for x in ["shirt", "top", "tee", "t-shirt", "kurta", "tunic", "blouse"]):
        return "Tops"
        
    # Shoes
    if any(x in category for x in ["shoe", "sneaker", "boot", "sandal", "footwear", "heel", "flat"]):
        return "Shoes"
        
    return "Accessories"

# --- Auth Endpoints ---

@app.post("/auth/signup", response_model=UserModel)
async def signup(user: UserCreate):
    existing_user = await user_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    user_dict = user.dict()
    user_dict["password"] = hashed_password
    user_dict["createdAt"] = datetime.now()
    user_dict["updatedAt"] = datetime.now()
    
    new_user = await user_collection.insert_one(user_dict)
    created_user = await user_collection.find_one({"_id": new_user.inserted_id})
    return created_user

@app.post("/auth/login", response_model=UserModel)
async def login(user_credentials: UserLogin):
    user = await user_collection.find_one({"email": user_credentials.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(user_credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    return user

# --- Profile Endpoints ---

@app.get("/user/profile/{userId}", response_model=UserModel)
async def get_profile(userId: str):
    user = await user_collection.find_one({"_id": ObjectId(userId)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.put("/user/profile/{userId}", response_model=UserModel)
async def update_profile(userId: str, user_data: UserProfileUpdate):
    update_data = {k: v for k, v in user_data.dict().items() if v is not None}
    update_data["updatedAt"] = datetime.now()
    
    result = await user_collection.update_one({"_id": ObjectId(userId)}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
        
    user = await user_collection.find_one({"_id": ObjectId(userId)})
    return user

@app.put("/user/change-password")
async def change_password(password_data: ChangePasswordRequest, userId: str = Query(...)):
    user = await user_collection.find_one({"_id": ObjectId(userId)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if not verify_password(password_data.currentPassword, user["password"]):
        raise HTTPException(status_code=400, detail="Incorrect current password")
        
    hashed_password = get_password_hash(password_data.newPassword)
    await user_collection.update_one({"_id": ObjectId(userId)}, {"$set": {"password": hashed_password, "updatedAt": datetime.now()}})
    
    return {"message": "Password updated successfully"}

@app.delete("/user/delete")
async def delete_account(userId: str = Query(...)):
    result = await user_collection.delete_one({"_id": ObjectId(userId)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "Account deleted"}

# --- Collections & Products ---

@app.get("/collections", response_model=List[CollectionModel])
async def get_collections(featured: Optional[bool] = None):
    query = {}
    if featured is not None:
        query["featured"] = featured
    collections = await collection_collection.find(query).to_list(100)
    return collections

@app.get("/products", response_model=List[ProductModel])
async def get_products(
    category: Optional[str] = None,
    search: Optional[str] = None,
    sort: Optional[str] = None
):
    query = {}
    if category:
        query["category"] = category
    if search:
        query["name"] = {"$regex": search, "$options": "i"}
        
    cursor = product_collection.find(query)
    
    if sort == "price_asc":
        cursor = cursor.sort("price", 1)
    elif sort == "price_desc":
        cursor = cursor.sort("price", -1)
    elif sort == "newest":
        cursor = cursor.sort("createdAt", -1)
        
    products = await cursor.to_list(1000)
    return products

@app.get("/products/random", response_model=ProductModel)
async def get_random_product():
    pipeline = [
        {"$match": {"imageUrl": {"$exists": True, "$ne": ""}}},
        {"$sample": {"size": 1}}
    ]
    products = await product_collection.aggregate(pipeline).to_list(1)
    if not products:
        raise HTTPException(status_code=404, detail="No products found")
    return products[0]

@app.get("/products/{id}", response_model=ProductModel)
async def get_product(id: str):
    try:
        product = await product_collection.find_one({"_id": ObjectId(id)})
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product
    except:
        raise HTTPException(status_code=404, detail="Product not found")

# --- Cart ---

@app.get("/cart/{userId}", response_model=CartModel)
async def get_cart(userId: str):
    cart = await cart_collection.find_one({"userId": userId})
    if not cart:
        # Create empty cart
        cart_doc = {"userId": userId, "items": [], "createdAt": datetime.now(), "updatedAt": datetime.now()}
        result = await cart_collection.insert_one(cart_doc)
        cart = await cart_collection.find_one({"_id": result.inserted_id})
    return cart

@app.post("/cart/{userId}/add", response_model=CartModel)
async def add_to_cart(userId: str, item: CartItemModel):
    cart = await cart_collection.find_one({"userId": userId})
    if not cart:
        cart_doc = {"userId": userId, "items": [item.dict()], "createdAt": datetime.now(), "updatedAt": datetime.now()}
        await cart_collection.insert_one(cart_doc)
    else:
        # Check if item exists
        items = cart.get("items", [])
        existing_item = next((i for i in items if i["productId"] == item.productId), None)
        if existing_item:
            existing_item["quantity"] += item.quantity
        else:
            items.append(item.dict())
        
        await cart_collection.update_one({"userId": userId}, {"$set": {"items": items, "updatedAt": datetime.now()}})
        
    return await cart_collection.find_one({"userId": userId})

@app.put("/cart/{userId}/update", response_model=CartModel)
async def update_cart(userId: str, item: CartItemModel):
    cart = await cart_collection.find_one({"userId": userId})
    if not cart:
         raise HTTPException(status_code=404, detail="Cart not found")
         
    items = cart.get("items", [])
    
    new_items = []
    for i in items:
        if i["productId"] == item.productId:
            if item.quantity > 0:
                i["quantity"] = item.quantity
                if item.size: i["size"] = item.size
                if item.color: i["color"] = item.color
                new_items.append(i)
        else:
            new_items.append(i)
            
    await cart_collection.update_one({"userId": userId}, {"$set": {"items": new_items, "updatedAt": datetime.now()}})
    return await cart_collection.find_one({"userId": userId})

# --- Wishlist ---

@app.get("/wishlist/{userId}", response_model=WishlistResponse)
async def get_wishlist(userId: str):
    wishlist = await wishlist_collection.find_one({"userId": userId})
    if not wishlist:
        wishlist = {"userId": userId, "products": [], "createdAt": datetime.now(), "updatedAt": datetime.now()}
        await wishlist_collection.insert_one(wishlist)
        return wishlist

    # Populate products
    product_ids = wishlist.get("products", [])
    populated_products = []
    if product_ids:
        object_ids = []
        for pid in product_ids:
            try:
                object_ids.append(ObjectId(pid))
            except:
                continue
        
        if object_ids:
            populated_products = await product_collection.find({"_id": {"$in": object_ids}}).to_list(len(object_ids))

    return {
        "_id": wishlist.get("_id"),
        "userId": wishlist.get("userId"),
        "products": populated_products,
        "createdAt": wishlist.get("createdAt"),
        "updatedAt": wishlist.get("updatedAt")
    }

@app.post("/wishlist/{userId}/add")
async def add_to_wishlist(userId: str, body: dict = Body(...)):
    productId = body.get("productId")
    if not productId:
         raise HTTPException(status_code=400, detail="ProductId required")
         
    wishlist = await wishlist_collection.find_one({"userId": userId})
    if not wishlist:
        await wishlist_collection.insert_one({"userId": userId, "products": [productId], "createdAt": datetime.now(), "updatedAt": datetime.now()})
    else:
        if productId not in wishlist["products"]:
            await wishlist_collection.update_one({"userId": userId}, {"$push": {"products": productId}, "$set": {"updatedAt": datetime.now()}})
            
    return {"message": "Added to wishlist"}

@app.delete("/wishlist/{userId}/remove/{productId}")
async def remove_from_wishlist(userId: str, productId: str):
    await wishlist_collection.update_one({"userId": userId}, {"$pull": {"products": productId}, "$set": {"updatedAt": datetime.now()}})
    return {"message": "Removed from wishlist"}

# --- Orders & Checkout ---

@app.post("/checkout", response_model=OrderModel)
async def create_order(order_data: OrderCreate):
    order_id = f"#ORD-{random.randint(100000, 999999)}-{random.randint(100, 999)}"
    
    order_doc = order_data.dict()
    order_doc["orderId"] = order_id
    order_doc["status"] = "Processing"
    order_doc["paymentMethod"] = "Credit Card (Mock)"
    order_doc["createdAt"] = datetime.now()
    order_doc["updatedAt"] = datetime.now()
    
    result = await order_collection.insert_one(order_doc)
    
    # Clear Cart
    await cart_collection.update_one({"userId": order_data.userId}, {"$set": {"items": []}})
    
    created_order = await order_collection.find_one({"_id": result.inserted_id})
    return created_order

@app.get("/orders/user/{userId}", response_model=List[OrderModel])
async def get_user_orders(userId: str):
    orders = await order_collection.find({"userId": userId}).sort("createdAt", -1).to_list(100)
    return orders

@app.get("/orders/{id}", response_model=OrderModel)
async def get_order(id: str, userId: str = Query(...)):
    try:
        order = await order_collection.find_one({"_id": ObjectId(id)})
        if not order:
             order = await order_collection.find_one({"orderId": id})
        
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
            
        if order["userId"] != userId:
             raise HTTPException(status_code=403, detail="Unauthorized")
             
        return order
    except:
        # Fallback for invalid ObjectId
        order = await order_collection.find_one({"orderId": id})
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        if order["userId"] != userId:
             raise HTTPException(status_code=403, detail="Unauthorized")
        return order

# --- Payments ---

@app.get("/user/payments", response_model=List[PaymentMethodModel])
async def get_payment_methods(userId: str = Query(...)):
    methods = await payment_collection.find({"userId": userId}).to_list(100)
    return methods

@app.post("/user/payments", response_model=PaymentMethodModel)
async def add_payment_method(payment_data: PaymentMethodCreate, userId: str = Query(...)):
    # Create mock payment method
    method_doc = payment_data.dict()
    method_doc["userId"] = userId
    method_doc["type"] = "card"
    method_doc["last4"] = payment_data.cardNumber[-4:]
    method_doc["brand"] = "Visa" # Mock
    method_doc["isDefault"] = False
    method_doc["createdAt"] = datetime.now()
    
    # Remove sensitive data
    del method_doc["cardNumber"]
    del method_doc["cvc"]
    del method_doc["cardHolderName"] 
    
    result = await payment_collection.insert_one(method_doc)
    created_method = await payment_collection.find_one({"_id": result.inserted_id})
    return created_method

@app.delete("/user/payments/{id}")
async def delete_payment_method(id: str, userId: str = Query(...)):
    result = await payment_collection.delete_one({"_id": ObjectId(id), "userId": userId})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Payment method not found")
    return {"message": "Payment method removed"}

# --- Outfits ---

@app.get("/outfits", response_model=List[OutfitModel])
async def get_outfits(userId: str = Query(...)):
    outfits = await outfit_collection.find({"userId": userId}).sort("createdAt", -1).to_list(100)
    return outfits

@app.post("/outfits", response_model=OutfitModel)
async def create_outfit(outfit_data: OutfitCreate, userId: str = Query(...)):
    outfit_doc = outfit_data.dict()
    outfit_doc["userId"] = userId
    outfit_doc["createdAt"] = datetime.now()
    
    result = await outfit_collection.insert_one(outfit_doc)
    created_outfit = await outfit_collection.find_one({"_id": result.inserted_id})
    return created_outfit

@app.delete("/outfits/{id}")
async def delete_outfit(id: str, userId: str = Query(...)):
    result = await outfit_collection.delete_one({"_id": ObjectId(id), "userId": userId})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Outfit not found")
    return {"message": "Outfit deleted"}

# --- Recommend ---

class RecommendRequest(BaseModel):
    product: dict
    occasion: str
    gender: str

class RecommendationResponse(BaseModel):
    items: List[ProductModel]
    explanation: str
    style_tips: Optional[List[str]] = None

@app.post("/recommend", response_model=RecommendationResponse)
async def recommend_outfit(request: RecommendRequest):
    product = request.product
    occasion = request.occasion
    gender = request.gender
    
    category = map_category(product.get("category", ""))
    
    # 1. Identify candidate categories based on actual DB content
    # DB Categories:
    # Tops: "T-Shirt", "Formal Shirt", "shirt", "Kurta", "Short Kurta", "Kurta Shirt"
    # Bottoms: "Jeans", "Chinos", "Joggers", "Formal Trousers"
    # Outerwear: "Jacket", "Blazer", "Bandhgala", "Bandhgala Jacket"
    # FullBody: "Sherwani", "Kurta Pajama", "Pathani Suit", "Dhoti Set", "Kurta Set", "Co-ords", "Suit", "Fusion Set", "Party Set"
    
    db_tops = ["T-Shirt", "Formal Shirt", "shirt", "Kurta", "Short Kurta", "Kurta Shirt"]
    db_bottoms = ["Jeans", "Chinos", "Joggers", "Formal Trousers"]
    db_outerwear = ["Jacket", "Blazer", "Bandhgala", "Bandhgala Jacket"]
    
    complementary_categories = []
    
    if category == "Tops":
        complementary_categories = db_bottoms + db_outerwear
    elif category == "Bottoms":
        complementary_categories = db_tops + db_outerwear
    elif category == "Outerwear":
        complementary_categories = db_tops + db_bottoms
    elif category == "FullBody":
        # For sets, we can suggest outerwear or specific tops (like shirts for suits)
        complementary_categories = db_outerwear + ["Formal Shirt"]
    else:
        # Default fallback
        complementary_categories = db_tops + db_bottoms
    
    # 2. Fetch candidates from DB
    candidate_query = {"category": {"$in": complementary_categories}}
    
    # Filter by gender if possible (simple heuristic)
    if gender != "Unisex":
        # This assumes products have a 'gender' field or we rely on the user to filter. 
        # For now, we'll just fetch broadly to ensure we have candidates.
        pass

    candidate_docs = await product_collection.find(candidate_query).limit(40).to_list(40)
    
    # If no candidates found, fallback to existing logic (which fetches specific categories)
    if not candidate_docs:
        # Fallback logic
        recommendations = []
        if category == "Tops":
            bottoms = await product_collection.find({"category": {"$in": db_bottoms}}).limit(3).to_list(3)
            recommendations.extend(bottoms)
        elif category == "Bottoms":
            tops = await product_collection.find({"category": {"$in": db_tops}}).limit(3).to_list(3)
            recommendations.extend(tops)
        elif category == "Outerwear":
            inner = await product_collection.find({"category": {"$in": db_tops}}).limit(2).to_list(2)
            recommendations.extend(inner)
        else:
             # Try to find anything
            others = await product_collection.find({"category": {"$in": db_tops + db_bottoms}}).limit(3).to_list(3)
            recommendations.extend(others)
            
        return {"items": recommendations, "explanation": "Matched based on simple category rules (fallback).", "style_tips": ["Try mixing textures!", "Balance loose and tight fits."]}

    # 3. Use Gemini to select best outfit
    try:
        candidate_list_str = json.dumps([
            {
                "id": str(p["_id"]),
                "name": p["name"],
                "category": p["category"],
                "color": p.get("colors", ["Unknown"])[0] if p.get("colors") else "Unknown",
                "price": p.get("price", 0)
            } 
            for p in candidate_docs
        ])
        
        main_product_str = json.dumps({
            "name": product.get("name"),
            "category": product.get("category"),
            "color": product.get("colors", ["Unknown"])[0] if product.get("colors") else "Unknown",
            "description": product.get("description", "")
        })
        
        prompt = f"""
        You are a professional fashion stylist.
        I have a main product: {main_product_str}
        
        I have a list of candidate products:
        {candidate_list_str}
        
        Please select 3-4 items from the candidate list that form a complete, stylish outfit with the main product for a '{occasion}' occasion for {gender}.
        The outfit must be color-coordinated and appropriate for the occasion.
        
        Return ONLY a valid JSON object with this structure:
        {{
            "selected_ids": ["id1", "id2", "id3"],
            "style_tips": ["Tip 1", "Tip 2", "Tip 3"]
        }}
        Do not include any markdown formatting or explanations outside the JSON.
        """
        
        if client:
            response = client.models.generate_content(
                model='gemini-2.0-flash',
                contents=prompt
            )
            text = response.text.replace("```json", "").replace("```", "").strip()
            result = json.loads(text)
        else:
             # Mock AI response if key is missing (fallback)
             logger.warning("Gemini client not initialized. Using random selection.")
             result = {
                 "selected_ids": [str(c["_id"]) for c in random.sample(candidate_docs, min(3, len(candidate_docs)))],
                 "style_tips": ["This is a randomly generated suggestion as API key is missing."]
             }
        
        selected_ids = result.get("selected_ids", [])
        style_tips = result.get("style_tips", ["Great look!"])
        
        selected_products = [
            p for p in candidate_docs if str(p["_id"]) in selected_ids
        ]
        
        # Ensure we have at least 2 items
        if len(selected_products) < 2:
            raise Exception("AI selected too few items")
            
        return {
            "items": selected_products, 
            "explanation": " ".join(style_tips),
            "style_tips": style_tips
        }

    except Exception as e:
        logger.error(f"Gemini error: {e}")
        # Fallback to simple logic if AI fails
        recommendations = []
        if category == "Tops":
            bottoms = await product_collection.find({"category": {"$in": db_bottoms}}).limit(3).to_list(3)
            recommendations.extend(bottoms)
        elif category == "Bottoms":
            tops = await product_collection.find({"category": {"$in": db_tops}}).limit(3).to_list(3)
            recommendations.extend(tops)
        elif category == "Outerwear":
            inner = await product_collection.find({"category": {"$in": db_tops}}).limit(2).to_list(2)
            recommendations.extend(inner)
        else:
             # Try to find anything
            others = await product_collection.find({"category": {"$in": db_tops + db_bottoms}}).limit(3).to_list(3)
            recommendations.extend(others)
        
        return {"items": recommendations, "explanation": "Matched based on style rules.", "style_tips": ["Classic combination."]}

# --- Seed Endpoint ---

@app.post("/seed")
async def seed_database(seed_data: SeedRequest):
    # Clear existing data
    await product_collection.delete_many({})
    await user_collection.delete_many({})
    await collection_collection.delete_many({})
    
    # Insert Users
    if seed_data.users:
        for user in seed_data.users:
            if "password" in user:
                 user["password"] = get_password_hash(user["password"])
            
            user["createdAt"] = datetime.now()
            user["updatedAt"] = datetime.now()
            await user_collection.insert_one(user)
        
    # Insert Products
    if seed_data.products:
        # Prepare products
        products_to_insert = []
        for product in seed_data.products:
            p = product.copy()
            if "_id" in p:
                del p["_id"]
            if "id" in p:
                del p["id"]
            
            p["createdAt"] = datetime.now()
            products_to_insert.append(p)
            
        if products_to_insert:
            await product_collection.insert_many(products_to_insert)
        
    # Insert Collections
    if seed_data.collections:
        collections_to_insert = []
        for collection in seed_data.collections:
            c = collection.copy()
            if "_id" in c:
                del c["_id"]
            if "id" in c:
                del c["id"]
            c["createdAt"] = datetime.now()
            collections_to_insert.append(c)
            
        if collections_to_insert:
            await collection_collection.insert_many(collections_to_insert)
        
    return {"message": "Database seeded successfully"}
