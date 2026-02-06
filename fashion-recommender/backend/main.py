import os
import json
import logging
import random
import base64
import io
import requests
from PIL import Image, ImageDraw, ImageFont
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

class GenerateLookRequest(BaseModel):
    userId: str
    items: List[dict]
    mainProductId: str

# Hugging Face Token for Virtual Try-On
HUGGINGFACE_TOKEN = os.getenv("HUGGINGFACE_TOKEN")
# Segmind API Key for reliable Virtual Try-On
SEGMIND_API_KEY = os.getenv("SEGMIND_API_KEY")

def download_image_as_base64(url: str) -> str:
    """Download image from URL and return as base64 string"""
    try:
        clean_url = url.strip().strip("`'\" ")
        if not clean_url:
            return None
        
        # Handle base64 data URLs
        if clean_url.startswith("data:image"):
            # Extract base64 part
            return clean_url.split(",")[1] if "," in clean_url else None
            
        response = requests.get(clean_url, timeout=10)
        response.raise_for_status()
        return base64.b64encode(response.content).decode()
    except Exception as e:
        logger.error(f"Failed to download image: {e}")
        return None

def download_image_pil(url: str) -> Image.Image:
    """Download image from URL and return as PIL Image"""
    try:
        clean_url = url.strip().strip("`'\" ")
        if not clean_url:
            return None
        
        # Handle base64 data URLs
        if clean_url.startswith("data:image"):
            base64_data = clean_url.split(",")[1] if "," in clean_url else None
            if base64_data:
                img_bytes = base64.b64decode(base64_data)
                return Image.open(io.BytesIO(img_bytes)).convert("RGBA")
            return None
            
        response = requests.get(clean_url, timeout=10)
        response.raise_for_status()
        return Image.open(io.BytesIO(response.content)).convert("RGBA")
    except Exception as e:
        logger.error(f"Failed to download image as PIL: {e}")
        return None

async def call_segmind_tryon(person_image_url: str, garment_image_url: str, garment_category: str = "Upper body") -> str:
    """
    Call Segmind Try-On Diffusion API - Supports FULL BODY!
    Categories: "Upper body", "Lower body", "Dress"
    Cost: ~$0.011 per request
    """
    if not SEGMIND_API_KEY:
        logger.error("SEGMIND_API_KEY not set")
        return None
    
    try:
        logger.info(f"Calling Segmind Try-On Diffusion API (category: {garment_category})...")
        
        # Correct endpoint for Try-On Diffusion
        url = "https://api.segmind.com/v1/try-on-diffusion"
        
        headers = {
            "x-api-key": SEGMIND_API_KEY,
            "Content-Type": "application/json"
        }
        
        payload = {
            "model_image": person_image_url,
            "cloth_image": garment_image_url,
            "category": garment_category,
            "num_inference_steps": 35,
            "guidance_scale": 2,
            "seed": 42,
            "base64": True
        }
        
        logger.info(f"Segmind request to: {url}")
        
        response = requests.post(url, json=payload, headers=headers, timeout=120)
        
        logger.info(f"Segmind response status: {response.status_code}")
        
        if response.status_code == 200:
            content_type = response.headers.get('content-type', '')
            
            if 'image' in content_type:
                return base64.b64encode(response.content).decode()
            else:
                try:
                    result = response.json()
                    if isinstance(result, dict) and 'image' in result:
                        return result['image']
                    elif isinstance(result, str):
                        return result
                except:
                    return base64.b64encode(response.content).decode()
        elif response.status_code == 406:
            logger.error(f"Segmind insufficient credits: {response.text}")
            return None
        else:
            logger.error(f"Segmind error: {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        logger.error(f"Segmind try-on failed: {e}")
        import traceback
        traceback.print_exc()
        return None

async def call_miragic_tryon(person_image_url: str, garment_image_url: str) -> str:
    """
    Call Miragic Virtual Try-On API - Full body support
    """
    if not HUGGINGFACE_TOKEN:
        logger.error("HUGGINGFACE_TOKEN not set")
        return None
    
    try:
        from gradio_client import Client, handle_file
        import tempfile
        
        os.environ["HF_TOKEN"] = HUGGINGFACE_TOKEN
        logger.info("Connecting to Miragic Virtual Try-On...")
        
        person_img = download_image_pil(person_image_url)
        garment_img = download_image_pil(garment_image_url)
        
        if not person_img or not garment_img:
            logger.error("Failed to download images for Miragic")
            return None
        
        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as f:
            person_img.convert("RGB").save(f.name, "PNG")
            person_path = f.name
            
        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as f:
            garment_img.convert("RGB").save(f.name, "PNG")
            garment_path = f.name
        
        client = Client("Miragic-AI/Miragic-Virtual-Try-On")
        logger.info("Calling Miragic API...")
        
        # Try fn_index=0 (first function) since /tryon doesn't exist
        try:
            result = client.predict(
                handle_file(person_path),
                handle_file(garment_path),
                fn_index=0
            )
        except Exception as e1:
            logger.warning(f"fn_index=0 failed: {e1}, trying fn_index=1")
            try:
                result = client.predict(
                    handle_file(person_path),
                    handle_file(garment_path),
                    fn_index=1
                )
            except Exception as e2:
                logger.error(f"fn_index=1 also failed: {e2}")
                return None
        
        logger.info(f"Miragic result: {result}")
        
        if result:
            output_path = result[0] if isinstance(result, (tuple, list)) else result
            if isinstance(output_path, str) and os.path.exists(output_path):
                with open(output_path, "rb") as f:
                    return base64.b64encode(f.read()).decode()
        return None
        
    except Exception as e:
        logger.error(f"Miragic try-on failed: {e}")
        import traceback
        traceback.print_exc()
        return None

# RapidAPI key for texelmoda (free tier: 100/month) - Full body virtual try-on!
RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")
logger.info(f"RAPIDAPI_KEY loaded: {'Yes' if RAPIDAPI_KEY else 'No'}")

def is_public_url(url: str) -> bool:
    """Check if URL is a publicly accessible HTTP(S) URL (not base64 or local)"""
    if not url:
        return False
    # Skip base64 data URLs
    if url.startswith('data:'):
        return False
    # Skip localhost/local URLs
    if 'localhost' in url or '127.0.0.1' in url:
        return False
    # Must be HTTP(S)
    if url.startswith('http://') or url.startswith('https://'):
        return True
    return False

async def call_texelmoda_tryon(person_image_url: str, garment_image_url: str) -> str:
    """
    Call texelmoda Virtual Try-On API via RapidAPI
    FREE: 100 requests/month
    Full body support!
    NOTE: Requires publicly accessible image URLs (not base64)
    """
    if not RAPIDAPI_KEY:
        logger.info("RAPIDAPI_KEY not set, skipping texelmoda")
        return None
    
    # Check if both URLs are publicly accessible
    if not is_public_url(person_image_url):
        logger.info(f"texelmoda: Person image is not a public URL, skipping (starts with: {person_image_url[:30] if person_image_url else 'None'})")
        return None
    
    if not is_public_url(garment_image_url):
        logger.info(f"texelmoda: Garment image is not a public URL, skipping (starts with: {garment_image_url[:30] if garment_image_url else 'None'})")
        return None
    
    try:
        logger.info("Calling texelmoda Virtual Try-On API (FULL BODY)...")
        
        url = "https://try-on-diffusion.p.rapidapi.com/try-on-url"
        
        headers = {
            "x-rapidapi-host": "try-on-diffusion.p.rapidapi.com",
            "x-rapidapi-key": RAPIDAPI_KEY,
            "Content-Type": "application/json"
        }
        
        payload = {
            "avatar_image_url": person_image_url,
            "clothing_image_url": garment_image_url
        }
        
        logger.info(f"texelmoda request to: {url}")
        logger.info(f"texelmoda avatar URL: {person_image_url[:100]}...")
        logger.info(f"texelmoda clothing URL: {garment_image_url[:100]}...")
        
        response = requests.post(url, json=payload, headers=headers, timeout=120)
        
        logger.info(f"texelmoda response status: {response.status_code}")
        
        if response.status_code == 200:
            content_type = response.headers.get('content-type', '')
            if 'image' in content_type:
                return base64.b64encode(response.content).decode()
            else:
                try:
                    result = response.json()
                    if isinstance(result, dict) and 'image' in result:
                        return result['image']
                except:
                    return base64.b64encode(response.content).decode()
        else:
            logger.error(f"texelmoda error: {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        logger.error(f"texelmoda try-on failed: {e}")
        import traceback
        traceback.print_exc()
        return None

async def call_kolors_tryon(person_image_url: str, garment_image_url: str) -> str:
    """
    Call Kolors Virtual Try-On API for FULL BODY try-on
    Returns base64 encoded image or None on failure
    """
    if not HUGGINGFACE_TOKEN:
        logger.error("HUGGINGFACE_TOKEN not set")
        return None
    
    try:
        from gradio_client import Client, handle_file
        import tempfile
        
        os.environ["HF_TOKEN"] = HUGGINGFACE_TOKEN
        
        logger.info("Connecting to Kolors Virtual Try-On (Full Body)...")
        
        # Download images
        person_img = download_image_pil(person_image_url)
        garment_img = download_image_pil(garment_image_url)
        
        if not person_img or not garment_img:
            logger.error("Failed to download person or garment image")
            return None
        
        # Save to temp files
        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as person_file:
            person_img.convert("RGB").save(person_file.name, "PNG")
            person_path = person_file.name
            
        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as garment_file:
            garment_img.convert("RGB").save(garment_file.name, "PNG")
            garment_path = garment_file.name
        
        logger.info(f"Saved temp files: person={person_path}, garment={garment_path}")
        
        # Connect to Kolors Virtual Try-On Space
        client = Client("Kwai-Kolors/Kolors-Virtual-Try-On")
        
        logger.info("Calling Kolors Virtual Try-On API...")
        result = client.predict(
            person_img=handle_file(person_path),
            garment_img=handle_file(garment_path),
            seed=42,
            randomize_seed=False,
            api_name="/tryon"
        )
        
        logger.info(f"Kolors result: {result}")
        
        # Result is typically a tuple (output_image_path, seed)
        if result and len(result) > 0:
            output_path = result[0] if isinstance(result, tuple) else result
            
            with open(output_path, "rb") as f:
                img_bytes = f.read()
                return base64.b64encode(img_bytes).decode()
        
        return None
        
    except Exception as e:
        logger.error(f"Kolors try-on failed: {e}")
        import traceback
        traceback.print_exc()
        return None

async def call_huggingface_tryon(person_image_url: str, garment_image_url: str) -> str:
    """
    Call Hugging Face virtual try-on API (IDM-VTON - Upper Body)
    Returns base64 encoded image or None on failure
    """
    if not HUGGINGFACE_TOKEN:
        logger.error("HUGGINGFACE_TOKEN not set")
        return None
    
    try:
        from gradio_client import Client, handle_file
        import tempfile
        import httpx
        
        # Set HF token as environment variable for gradio_client
        os.environ["HF_TOKEN"] = HUGGINGFACE_TOKEN
        
        logger.info("Connecting to Hugging Face IDM-VTON...")
        
        # Download images to temporary files
        person_img = download_image_pil(person_image_url)
        garment_img = download_image_pil(garment_image_url)
        
        if not person_img or not garment_img:
            logger.error("Failed to download person or garment image")
            return None
        
        # Save to temp files
        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as person_file:
            person_img.convert("RGB").save(person_file.name, "PNG")
            person_path = person_file.name
            
        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as garment_file:
            garment_img.convert("RGB").save(garment_file.name, "PNG")
            garment_path = garment_file.name
        
        logger.info(f"Saved temp files: person={person_path}, garment={garment_path}")
        
        # Connect to Hugging Face Space (token is read from HF_TOKEN env var)
        client = Client("yisol/IDM-VTON")
        
        # Call the API
        logger.info("Calling IDM-VTON API...")
        result = client.predict(
            dict={"background": handle_file(person_path), "layers": [], "composite": None},
            garm_img=handle_file(garment_path),
            garment_des="A stylish fashion garment",
            is_checked=True,
            is_checked_crop=False,
            denoise_steps=30,
            seed=42,
            api_name="/tryon"
        )
        
        logger.info(f"IDM-VTON result: {result}")
        
        # Result is typically a tuple with the output image path
        if result and len(result) > 0:
            output_path = result[0] if isinstance(result, tuple) else result
            
            # Read the output image
            with open(output_path, "rb") as f:
                img_bytes = f.read()
                return base64.b64encode(img_bytes).decode()
        
        return None
        
    except Exception as e:
        logger.error(f"Hugging Face try-on failed: {e}")
        import traceback
        traceback.print_exc()
        return None

def create_fallback_composition(user_img_url: str, main_product: dict, items: List[dict]) -> str:
    """Create a fallback composition image when AI try-on fails"""
    width, height = 1200, 800
    canvas = Image.new('RGB', (width, height), (248, 249, 250))
    draw = ImageDraw.Draw(canvas)
    
    # Add title
    draw.text((width // 2 - 150, 20), "YOUR OUTFIT LOOK", fill=(50, 50, 50))
    
    # 1. Place User Image (Left Side)
    user_img = download_image_pil(user_img_url) if user_img_url else None
    
    if user_img:
        u_width, u_height = user_img.size
        aspect = u_width / u_height
        target_h = height - 150
        target_w = int(target_h * aspect)
        if target_w > width * 0.4:
            target_w = int(width * 0.4)
            target_h = int(target_w / aspect)
        user_resized = user_img.resize((target_w, target_h), Image.Resampling.LANCZOS)
        y_pos = (height - target_h) // 2 + 30
        x_pos = 50
        canvas.paste(user_resized, (x_pos, y_pos), user_resized if user_resized.mode == 'RGBA' else None)
        draw.text((x_pos, y_pos - 25), "YOUR PROFILE", fill=(100, 100, 100))
    else:
        draw.rectangle([50, 100, 400, 650], fill=(220, 220, 220), outline=(200, 200, 200))
        draw.text((150, 370), "No Profile Photo", fill=(150, 150, 150))
    
    # 2. Place Main Product
    main_product_img = None
    if main_product and main_product.get("imageUrl"):
        main_product_img = download_image_pil(main_product["imageUrl"])
    
    current_x = int(width * 0.5)
    current_y = 80
    
    if main_product_img:
        main_product_img.thumbnail((300, 300), Image.Resampling.LANCZOS)
        canvas.paste(main_product_img, (current_x, current_y), main_product_img if main_product_img.mode == 'RGBA' else None)
        draw.text((current_x, current_y + 310), "SELECTED ITEM", fill=(0, 120, 0))
        current_y += 350
    
    # 3. Matching Items
    draw.text((current_x, current_y), "MATCHING ITEMS", fill=(80, 80, 80))
    current_y += 30
    
    item_x = current_x
    for idx, item in enumerate(items[:4]):
        item_url = item.get("image")
        if item_url:
            img = download_image_pil(item_url)
            if img:
                img.thumbnail((150, 150), Image.Resampling.LANCZOS)
                x_offset = (idx % 2) * 170
                y_offset = (idx // 2) * 170
                canvas.paste(img, (item_x + x_offset, current_y + y_offset), img if img.mode == 'RGBA' else None)
    
    # Convert to Base64
    buffered = io.BytesIO()
    canvas.save(buffered, format="JPEG", quality=85)
    return base64.b64encode(buffered.getvalue()).decode()

def create_full_outfit_composition(tryon_image_b64: str, all_items: List[dict], used_garment_id: str = None) -> str:
    """
    Create a full outfit composition showing:
    - The try-on result (user wearing one garment) - LARGE on left
    - All other selected items displayed on the right side
    """
    width, height = 1400, 900
    canvas = Image.new('RGB', (width, height), (255, 255, 255))
    draw = ImageDraw.Draw(canvas)
    
    # 1. Place Try-On Image (Left Side - Large)
    if tryon_image_b64:
        try:
            tryon_img = Image.open(io.BytesIO(base64.b64decode(tryon_image_b64)))
            
            # Make the try-on image large (60% of width)
            tryon_width = int(width * 0.58)
            tryon_height = height - 40
            
            # Resize maintaining aspect ratio
            t_w, t_h = tryon_img.size
            aspect = t_w / t_h
            
            if aspect > (tryon_width / tryon_height):
                new_w = tryon_width
                new_h = int(new_w / aspect)
            else:
                new_h = tryon_height
                new_w = int(new_h * aspect)
            
            tryon_resized = tryon_img.resize((new_w, new_h), Image.Resampling.LANCZOS)
            
            # Center vertically
            x_pos = 20
            y_pos = (height - new_h) // 2
            
            canvas.paste(tryon_resized, (x_pos, y_pos))
            
            # Add label
            draw.rectangle([x_pos, y_pos + new_h + 5, x_pos + new_w, y_pos + new_h + 30], fill=(139, 92, 246))
            draw.text((x_pos + 10, y_pos + new_h + 8), "AI VIRTUAL TRY-ON", fill=(255, 255, 255))
        except Exception as e:
            logger.error(f"Failed to place try-on image: {e}")
    
    # 2. Place Selected Items on Right Side (Vertically stacked)
    right_x = int(width * 0.62)
    right_width = width - right_x - 20
    
    # Title for items section
    draw.text((right_x, 15), "YOUR COMPLETE OUTFIT", fill=(50, 50, 50))
    
    # Filter out the garment that was used for try-on
    other_items = []
    for item in all_items:
        item_id = item.get("id") or item.get("_id")
        if item_id != used_garment_id:
            other_items.append(item)
    
    # If no other items, show all items
    if not other_items:
        other_items = all_items
    
    # Calculate item sizes based on count
    item_count = min(len(other_items), 4)
    if item_count == 0:
        return base64.b64encode(io.BytesIO(canvas.tobytes()).getvalue()).decode()
    
    # Layout items in a 2x2 or 1xN grid
    item_size = min(200, (right_width - 20) // 2)
    start_y = 50
    
    for idx, item in enumerate(other_items[:4]):
        item_url = item.get("image") or item.get("imageUrl")
        if item_url:
            img = download_image_pil(item_url)
            if img:
                # Resize to fit
                img.thumbnail((item_size, item_size), Image.Resampling.LANCZOS)
                
                # Calculate position (2 columns)
                col = idx % 2
                row = idx // 2
                x = right_x + col * (item_size + 15)
                y = start_y + row * (item_size + 60)
                
                # Draw item background
                draw.rectangle([x - 5, y - 5, x + item_size + 5, y + item_size + 45], 
                             fill=(248, 249, 250), outline=(230, 230, 230))
                
                # Paste image centered in its box
                img_w, img_h = img.size
                img_x = x + (item_size - img_w) // 2
                img_y = y + (item_size - img_h) // 2
                
                if img.mode == 'RGBA':
                    canvas.paste(img, (img_x, img_y), img)
                else:
                    canvas.paste(img, (img_x, img_y))
                
                # Add item name
                item_name = item.get("name", "Item")[:20]
                draw.text((x, y + item_size + 5), item_name, fill=(60, 60, 60))
                
                # Add price if available
                price = item.get("price")
                if price:
                    draw.text((x, y + item_size + 22), f"₹{price}", fill=(22, 163, 74))
    
    # Add footer
    draw.rectangle([0, height - 35, width, height], fill=(249, 250, 251))
    draw.text((width // 2 - 100, height - 25), "Complete Your Look Today!", fill=(100, 100, 100))
    
    # Convert to Base64
    buffered = io.BytesIO()
    canvas.save(buffered, format="PNG", quality=95)
    return base64.b64encode(buffered.getvalue()).decode()

@app.post("/generate-look")
async def generate_look(request: GenerateLookRequest):
    logger.info(f"Generating look for user {request.userId} with {len(request.items)} items")
    logger.info(f"Main product ID: {request.mainProductId}")
    
    # 1. Fetch User
    try:
        user = await user_collection.find_one({"_id": ObjectId(request.userId)})
    except Exception as e:
        logger.error(f"Invalid user ID: {e}")
        raise HTTPException(status_code=400, detail="Invalid user ID")
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # 2. Fetch Main Product - handle both ObjectId and string IDs
    main_product = None
    garment_image_url = None
    
    try:
        # Try as ObjectId first
        if len(request.mainProductId) == 24:
            main_product = await product_collection.find_one({"_id": ObjectId(request.mainProductId)})
    except Exception as e:
        logger.warning(f"Could not parse mainProductId as ObjectId: {e}")
    
    # If not found, try to get garment image from items
    if not main_product:
        logger.info("Main product not found in DB, trying to get image from items")
        # Look for garment image in the items array
        for item in request.items:
            if item.get("image"):
                garment_image_url = item.get("image")
                logger.info(f"Using garment image from items: {garment_image_url[:50]}...")
                break
    else:
        garment_image_url = main_product.get("imageUrl")
    
    user_image_url = user.get("image")
    
    if not user_image_url:
        logger.warning("User has no profile image, using fallback composition")
        img_b64 = create_fallback_composition(None, main_product, request.items)
        return {
            "message": "Please upload a profile photo for virtual try-on",
            "imageUrl": f"data:image/jpeg;base64,{img_b64}"
        }
    
    if not garment_image_url:
        logger.warning("No garment image available")
        img_b64 = create_fallback_composition(user_image_url, None, request.items)
        return {
            "message": "No garment image available",
            "imageUrl": f"data:image/jpeg;base64,{img_b64}"
        }
    
    # Detect garment category for Segmind API
    garment_category = "Upper body"  # Default
    
    # Get product category from main_product or items
    product_category = ""
    product_name = ""
    
    if main_product:
        product_category = str(main_product.get("category", "")).lower()
        product_name = str(main_product.get("name", "")).lower()
    elif request.items:
        for item in request.items:
            if item.get("id") == request.mainProductId or item.get("image") == garment_image_url:
                product_category = str(item.get("category", "")).lower()
                product_name = str(item.get("name", "")).lower()
                break
    
    # Determine Segmind category based on product type
    lower_body_keywords = ["pants", "pant", "jeans", "trousers", "shorts", "skirt", "leggings", "bottom", "lower"]
    dress_keywords = ["dress", "gown", "jumpsuit", "romper", "overall", "onepiece"]
    
    combined_text = f"{product_category} {product_name}"
    
    if any(keyword in combined_text for keyword in dress_keywords):
        garment_category = "Dress"
    elif any(keyword in combined_text for keyword in lower_body_keywords):
        garment_category = "Lower body"
    else:
        garment_category = "Upper body"
    
    logger.info(f"Detected garment category: {garment_category} (from: {combined_text[:50]})")
    
    # Pre-download images to base64 to avoid external URL access issues
    # This ensures AI services can access images even from rate-limited sources
    logger.info("Pre-downloading user and garment images as base64...")
    
    user_image_b64 = download_image_as_base64(user_image_url)
    garment_image_b64 = download_image_as_base64(garment_image_url)
    
    # Convert to data URLs for AI services
    if user_image_b64:
        user_image_for_api = f"data:image/png;base64,{user_image_b64}"
        logger.info("User image successfully converted to base64")
    else:
        user_image_for_api = user_image_url
        logger.warning("Could not convert user image to base64, using URL directly")
    
    if garment_image_b64:
        garment_image_for_api = f"data:image/png;base64,{garment_image_b64}"
        logger.info("Garment image successfully converted to base64")
    else:
        garment_image_for_api = garment_image_url
        logger.warning("Could not convert garment image to base64, using URL directly")
    
    # 2. Try Segmind Virtual Try-On FIRST (paid, but reliable full body)
    logger.info(f"Attempting virtual try-on with Segmind API...")
    result_b64 = await call_segmind_tryon(user_image_for_api, garment_image_for_api, garment_category)
    
    if result_b64:
        logger.info("Segmind try-on successful!")
        
        # If there are multiple items selected, create a full outfit composition
        if len(request.items) > 1:
            logger.info(f"Creating full outfit composition with {len(request.items)} items")
            used_garment_id = request.mainProductId
            full_outfit_b64 = create_full_outfit_composition(result_b64, request.items, used_garment_id)
            return {
                "message": "Full body outfit look generated with AI virtual try-on",
                "imageUrl": f"data:image/png;base64,{full_outfit_b64}"
            }
        
        # Single item - return the try-on result
        return {
            "message": "Look generated with Segmind AI virtual try-on",
            "imageUrl": f"data:image/png;base64,{result_b64}"
        }
    
    # 3. Try texelmoda (RapidAPI - 100 free/month, FULL BODY)
    logger.info("Segmind failed, trying texelmoda...")
    result_b64 = await call_texelmoda_tryon(user_image_for_api, garment_image_for_api)
    
    if result_b64:
        logger.info("texelmoda try-on successful!")
        if len(request.items) > 1:
            used_garment_id = request.mainProductId
            full_outfit_b64 = create_full_outfit_composition(result_b64, request.items, used_garment_id)
            return {
                "message": "Full body outfit look generated with texelmoda AI",
                "imageUrl": f"data:image/png;base64,{full_outfit_b64}"
            }
        return {
            "message": "Look generated with texelmoda AI virtual try-on (full body)",
            "imageUrl": f"data:image/png;base64,{result_b64}"
        }
    
    # 4. Try Miragic (Hugging Face - separate quota)
    logger.info("texelmoda failed, trying Miragic...")
    result_b64 = await call_miragic_tryon(user_image_for_api, garment_image_for_api)
    
    if result_b64:
        logger.info("Miragic try-on successful!")
        if len(request.items) > 1:
            used_garment_id = request.mainProductId
            full_outfit_b64 = create_full_outfit_composition(result_b64, request.items, used_garment_id)
            return {
                "message": "Full body outfit look generated with Miragic AI",
                "imageUrl": f"data:image/png;base64,{full_outfit_b64}"
            }
        return {
            "message": "Look generated with Miragic AI virtual try-on",
            "imageUrl": f"data:image/png;base64,{result_b64}"
        }
    
    # 5. Try Kolors (may have runtime issues)
    logger.info("Miragic failed, trying Kolors...")
    result_b64 = await call_kolors_tryon(user_image_for_api, garment_image_for_api)
    
    if result_b64:
        logger.info("Kolors try-on successful!")
        if len(request.items) > 1:
            used_garment_id = request.mainProductId
            full_outfit_b64 = create_full_outfit_composition(result_b64, request.items, used_garment_id)
            return {
                "message": "Full body outfit look generated with Kolors AI",
                "imageUrl": f"data:image/png;base64,{full_outfit_b64}"
            }
        return {
            "message": "Look generated with Kolors AI virtual try-on",
            "imageUrl": f"data:image/png;base64,{result_b64}"
        }
    
    # 6. Fallback to IDM-VTON (Upper Body Only)
    logger.info("Kolors failed, trying IDM-VTON (upper body)...")
    result_b64 = await call_huggingface_tryon(user_image_for_api, garment_image_for_api)
    
    if result_b64:
        logger.info("IDM-VTON try-on successful (upper body only)")
        
        # If there are multiple items selected, create a full outfit composition
        if len(request.items) > 1:
            logger.info(f"Creating full outfit composition with {len(request.items)} items")
            used_garment_id = request.mainProductId
            full_outfit_b64 = create_full_outfit_composition(result_b64, request.items, used_garment_id)
            return {
                "message": "Full outfit look generated with AI virtual try-on",
                "imageUrl": f"data:image/png;base64,{full_outfit_b64}"
            }
        
        # Single item - just return the try-on result
        return {
            "message": "Look generated successfully with AI virtual try-on",
            "imageUrl": f"data:image/png;base64,{result_b64}"
        }
    
    # 7. Fallback to Imagen (Text-based generation)
    logger.info("All virtual try-on methods failed, trying Imagen...")
    
    try:
        if client:
            # Analyze user appearance
            user_description = "a fashion model"
            try:
                user_image_bytes = requests.get(user_image_url.strip().strip("`'\" "), timeout=5).content
                analyze_response = client.models.generate_content(
                    model='gemini-1.5-flash',
                    contents=[
                        types.Part.from_bytes(data=user_image_bytes, mime_type="image/jpeg"),
                        "Describe this person's physical appearance briefly for a fashion photo prompt."
                    ]
                )
                if analyze_response.text:
                    user_description = analyze_response.text.strip()
            except:
                pass
            
            # Build outfit description
            outfit_desc = []
            if main_product:
                outfit_desc.append(f"{main_product.get('colors', [''])[0]} {main_product.get('name', '')}")
            for item in request.items:
                outfit_desc.append(f"{item.get('color', '')} {item.get('name', '')}")
            
            full_prompt = (
                f"A realistic full-body fashion photo of {user_description} wearing {', '.join(outfit_desc)}. "
                "Modern studio setting, high quality, photorealistic."
            )
            
            imagen_response = client.models.generate_images(
                model='imagen-3.0-generate-001',
                prompt=full_prompt,
                config=types.GenerateImagesConfig(number_of_images=1, aspect_ratio="3:4")
            )
            
            if imagen_response.generated_images:
                img_bytes = imagen_response.generated_images[0].image.image_bytes
                return {
                    "message": "Look generated with AI image generation",
                    "imageUrl": f"data:image/jpeg;base64,{base64.b64encode(img_bytes).decode()}"
                }
    except Exception as e:
        logger.error(f"Imagen fallback failed: {e}")
    
    # 4. Final fallback - Composition
    logger.info("All AI methods failed, using composition fallback")
    img_b64 = create_fallback_composition(user_image_url, main_product, request.items)
    return {
        "message": "AI try-on unavailable, showing outfit composition",
        "imageUrl": f"data:image/jpeg;base64,{img_b64}"
    }

@app.post("/recommend", response_model=RecommendationResponse)
async def recommend_outfit(request: RecommendRequest):
    product = request.product
    occasion = request.occasion
    gender = request.gender
    
    category = map_category(product.get("category") or "")
    
    # 1. Identify candidate categories based on actual DB content
    # DB Categories:
    # Tops: "T-Shirt", "Formal Shirt", "shirt", "Kurta", "Short Kurta", "Kurta Shirt"
    # Bottoms: "Jeans", "Chinos", "Joggers", "Formal Trousers"
    # Outerwear: "Jacket", "Blazer", "Bandhgala", "Bandhgala Jacket"
    # FullBody: "Sherwani", "Kurta Pajama", "Pathani Suit", "Dhoti Set", "Kurta Set", "Co-ords", "Suit", "Fusion Set", "Party Set"
    
    db_tops = ["T-Shirt", "Formal Shirt", "shirt", "Kurta", "Short Kurta", "Kurta Shirt"]
    db_bottoms = ["Jeans", "Chinos", "Joggers", "Formal Trousers"]
    db_outerwear = ["Jacket", "Blazer", "Bandhgala", "Bandhgala Jacket"]
    db_shoes = ["Sneakers", "Loafers", "Formal Shoes", "Mojaris", "Boots"]
    db_accessories = ["Watch", "Belt", "Sunglasses", "Bag", "Hat"]
    
    complementary_categories = []
    required_types = []

    if category == "Tops":
        complementary_categories = db_bottoms + db_shoes + db_accessories + db_outerwear
        required_types = ["Bottom", "Footwear", "Accessory"]
    elif category == "Bottoms":
        complementary_categories = db_tops + db_shoes + db_accessories + db_outerwear
        required_types = ["Top", "Footwear", "Accessory"]
    elif category == "Outerwear":
        complementary_categories = db_tops + db_bottoms + db_shoes + db_accessories
        required_types = ["Top", "Bottom", "Footwear", "Accessory"]
    elif category == "FullBody":
        # For sets, we need shoes and accessories
        complementary_categories = db_shoes + db_accessories + db_outerwear
        required_types = ["Footwear", "Accessory"]
    else:
        # Default fallback
        complementary_categories = db_tops + db_bottoms + db_shoes + db_accessories
        required_types = ["Top", "Bottom", "Footwear"]
    
    # 2. Fetch candidates from DB
    candidate_query = {"category": {"$in": complementary_categories}}
    
    # Filter by gender if possible (simple heuristic)
    if gender != "Unisex":
        # This assumes products have a 'gender' field or we rely on the user to filter. 
        # For now, we'll just fetch broadly to ensure we have candidates.
        pass

    candidate_docs = await product_collection.find(candidate_query).limit(60).to_list(60)
    
    # If no candidates found, fallback to existing logic (which fetches specific categories)
    if not candidate_docs:
        # Fallback logic
        recommendations = []
        if category == "Tops":
            bottoms = await product_collection.find({"category": {"$in": db_bottoms}}).limit(1).to_list(1)
            shoes = await product_collection.find({"category": {"$in": db_shoes}}).limit(1).to_list(1)
            acc = await product_collection.find({"category": {"$in": db_accessories}}).limit(1).to_list(1)
            recommendations.extend(bottoms + shoes + acc)
        elif category == "Bottoms":
            tops = await product_collection.find({"category": {"$in": db_tops}}).limit(1).to_list(1)
            shoes = await product_collection.find({"category": {"$in": db_shoes}}).limit(1).to_list(1)
            acc = await product_collection.find({"category": {"$in": db_accessories}}).limit(1).to_list(1)
            recommendations.extend(tops + shoes + acc)
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
        
        Your task is to create a SINGLE, COMPLETE outfit around the main product for a '{occasion}' occasion for {gender}.
        
        CRITICAL REQUIREMENT: You must select exactly ONE item from EACH of these missing types to complete the look: {', '.join(required_types)}.
        For example, if the main product is a Top, you MUST select 1 Bottom, 1 Footwear, and 1 Accessory.
        
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
    # Clear existing data (except users to preserve custom accounts)
    await product_collection.delete_many({})
    # await user_collection.delete_many({}) # Preserving users
    await collection_collection.delete_many({})
    
    # Insert Users (only if not exists)
    if seed_data.users:
        for user in seed_data.users:
            existing_user = await user_collection.find_one({"email": user.get("email")})
            if not existing_user:
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
