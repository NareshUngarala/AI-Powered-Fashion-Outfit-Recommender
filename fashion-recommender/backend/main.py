import os  # reload: new HF token
import json
import logging
import random
import base64
import io
import time
import asyncio
import tempfile
import requests
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from datetime import datetime
from typing import List, Optional
from pathlib import Path
from fastapi import FastAPI, HTTPException, Body, Query, Depends, status
from pydantic import BaseModel, Field, BeforeValidator
from dotenv import load_dotenv
from gradio_client import Client as GradioClient, handle_file

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

# Configure HuggingFace (FREE image generation)
HUGGINGFACE_TOKEN = os.getenv("HUGGINGFACE_TOKEN")
if HUGGINGFACE_TOKEN:
    logger.info("HuggingFace token configured (free image generation)")
else:
    logger.warning("HUGGINGFACE_TOKEN is not set - image generation will use fallback.")

# Stock male model image for IDM-VTON virtual try-on
STOCK_MODEL_DIR = os.path.join(os.path.dirname(__file__), "assets")
STOCK_MODEL_PATH = os.path.join(STOCK_MODEL_DIR, "stock_male_model.jpg")
STOCK_MODEL_URLS = [
    "https://huggingface.co/spaces/yisol/IDM-VTON/resolve/main/example/human/Jensen.jpeg",
    "https://huggingface.co/spaces/yisol/IDM-VTON/resolve/main/example/human/00034_00.jpg",
]

# Upper body categories that work with virtual try-on
UPPER_BODY_KEYWORDS = [
    "shirt", "top", "tee", "t-shirt", "kurta", "tunic", "blouse",
    "jacket", "blazer", "coat", "bandhgala", "vest", "cardigan",
    "hoodie", "sweater", "polo", "henley", "nehru",
]

def is_upper_body_garment(category: str) -> bool:
    """Check if a product category is an upper body garment (suitable for virtual try-on)"""
    cat_lower = (category or "").lower()
    return any(kw in cat_lower for kw in UPPER_BODY_KEYWORDS)

def ensure_stock_male_model() -> str:
    """Get cached standing full-body male model image for virtual try-on.
    If missing, generate one using FLUX text-to-image."""
    if os.path.exists(STOCK_MODEL_PATH):
        return STOCK_MODEL_PATH
    
    os.makedirs(STOCK_MODEL_DIR, exist_ok=True)
    
    # Try downloading from known sources first
    for url in STOCK_MODEL_URLS:
        try:
            logger.info(f"Downloading stock male model from: {url}")
            resp = requests.get(url, timeout=30)
            resp.raise_for_status()
            img = Image.open(io.BytesIO(resp.content)).convert("RGB")
            img = img.resize((768, 1024), Image.Resampling.LANCZOS)
            img.save(STOCK_MODEL_PATH, "JPEG", quality=95)
            logger.info(f"Stock male model saved: {STOCK_MODEL_PATH}")
            return STOCK_MODEL_PATH
        except Exception as e:
            logger.warning(f"Failed to download from {url}: {e}")
            continue
    
    # Fallback: generate with FLUX
    if HUGGINGFACE_TOKEN:
        try:
            logger.info("Generating stock male model image with FLUX...")
            headers = {"Authorization": f"Bearer {HUGGINGFACE_TOKEN}", "Content-Type": "application/json"}
            prompt = ("A full body photo of a young Indian male model, standing straight, front facing, "
                      "arms slightly at sides, wearing a plain white t-shirt and blue jeans, "
                      "neutral expression, white studio background, head to toe visible, "
                      "fashion catalog style, clean lighting, high quality, 4k")
            resp = requests.post(
                "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell",
                headers=headers, json={"inputs": prompt}, timeout=180
            )
            if resp.status_code == 200 and "image" in resp.headers.get("content-type", ""):
                img = Image.open(io.BytesIO(resp.content)).convert("RGB")
                img = img.resize((768, 1024), Image.Resampling.LANCZOS)
                img.save(STOCK_MODEL_PATH, "JPEG", quality=95)
                logger.info(f"Generated stock male model: {STOCK_MODEL_PATH}")
                return STOCK_MODEL_PATH
        except Exception as e:
            logger.error(f"Failed to generate stock model: {e}")
    
    logger.error("Could not obtain stock male model image")
    return None

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

# --- Image Helper Functions ---

def download_image_as_base64(url: str) -> str:
    """Download image from URL and return as base64 string"""
    try:
        clean_url = url.strip().strip("`'\" ")
        if not clean_url:
            return None
        
        # Handle base64 data URLs
        if clean_url.startswith("data:image"):
            return clean_url.split(",")[1] if "," in clean_url else None
            
        response = requests.get(clean_url, timeout=15)
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
            
        response = requests.get(clean_url, timeout=15)
        response.raise_for_status()
        return Image.open(io.BytesIO(response.content)).convert("RGBA")
    except Exception as e:
        logger.error(f"Failed to download image as PIL: {e}")
        return None

# --- FREE AI Image Generation (HuggingFace + PIL) ---

def generate_outfit_description_with_gemini(items: List[dict], gender: str = "person") -> str:
    """Use Gemini to create a detailed outfit description for image generation.
    Falls back to simple item names if Gemini is unavailable or rate-limited."""
    if not client:
        item_names = [item.get("name", "") for item in items if item.get("name")]
        return ", ".join(item_names) if item_names else "a stylish outfit"
    
    try:
        items_detail = []
        for item in items:
            name = item.get("name", "")
            category = item.get("category", "")
            color = item.get("color", "")
            if name:
                items_detail.append(f"{color} {name} ({category})".strip())
        
        items_text = ", ".join(items_detail)
        
        prompt = f"""You are a fashion stylist. Describe this outfit in one short sentence for an image prompt:
{items_text}
Include colors, materials and fit. Under 40 words. Output ONLY the description."""

        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=prompt
        )
        
        description = response.text.strip().strip('"')
        logger.info(f"Gemini outfit description: {description}")
        return description
        
    except Exception as e:
        logger.error(f"Gemini description failed (likely rate limit): {e}")
        # Fallback: build description from item names directly
        parts = []
        for item in items:
            color = item.get("color", "")
            name = item.get("name", "")
            if name:
                parts.append(f"{color} {name}".strip())
        return ", ".join(parts) if parts else "a stylish fashion outfit"


def generate_body_with_huggingface(outfit_description: str, gender: str = "person") -> str:
    """
    Generate a full-body fashion photo using HuggingFace FREE Inference API.
    Tries multiple free models with automatic fallback.
    Returns base64 encoded image or None.
    """
    if not HUGGINGFACE_TOKEN:
        logger.error("HUGGINGFACE_TOKEN not set")
        return None
    
    # Build prompt matching the spec format
    prompt = (
        f"A realistic full body fashion photo of a {gender} model standing, head to toe, "
        f"wearing {outfit_description}, "
        f"full body, full length, standing pose, studio lighting, "
        f"fashion photography, ultra high quality, sharp focus, 4k"
    )
    
    logger.info(f"HuggingFace image prompt: {prompt[:200]}...")
    
    headers = {
        "Authorization": f"Bearer {HUGGINGFACE_TOKEN}",
        "Content-Type": "application/json"
    }
    
    # Models to try with their provider base URLs (in order of quality)
    model_configs = [
        ("black-forest-labs/FLUX.1-schnell", "https://router.huggingface.co/hf-inference/models"),
        ("stabilityai/stable-diffusion-xl-base-1.0", "https://router.huggingface.co/hf-inference/models"),
        ("black-forest-labs/FLUX.1-dev", "https://router.huggingface.co/hf-inference/models"),
    ]
    
    for model_id, base_url in model_configs:
        logger.info(f"Trying HuggingFace model: {model_id}")
        
        for attempt in range(3):  # Max 3 attempts per model (for cold starts)
            try:
                url = f"{base_url}/{model_id}"
                response = requests.post(
                    url,
                    headers=headers,
                    json={"inputs": prompt},
                    timeout=180  # 3 min timeout
                )
                
                logger.info(f"HuggingFace response: {response.status_code} (model: {model_id}, attempt: {attempt+1})")
                
                if response.status_code == 200:
                    content_type = response.headers.get("content-type", "")
                    if "image" in content_type:
                        img_b64 = base64.b64encode(response.content).decode()
                        logger.info(f"Image generated with {model_id}! ({len(img_b64)} chars)")
                        return img_b64
                    else:
                        # Sometimes HF returns JSON even on 200
                        logger.warning(f"Got non-image content-type: {content_type}")
                        try:
                            data = response.json()
                            if isinstance(data, list) and len(data) > 0 and "generated_text" in data[0]:
                                logger.warning("Model returned text instead of image")
                        except:
                            pass
                        break  # Try next model
                
                elif response.status_code == 503:
                    # Model is loading (cold start) - wait and retry
                    try:
                        data = response.json()
                        wait_time = min(data.get("estimated_time", 20), 60)
                        logger.info(f"Model {model_id} is loading, waiting {wait_time:.0f}s...")
                        time.sleep(wait_time)
                        continue  # Retry this model
                    except:
                        logger.info(f"Model loading, waiting 20s...")
                        time.sleep(20)
                        continue
                
                elif response.status_code == 429:
                    logger.warning(f"Rate limited on {model_id}, trying next model...")
                    break  # Try next model
                
                else:
                    error_text = response.text[:300] if response.text else "No details"
                    logger.error(f"HuggingFace error {response.status_code}: {error_text}")
                    break  # Try next model
                    
            except requests.exceptions.Timeout:
                logger.error(f"HuggingFace timeout for {model_id}")
                break  # Try next model
            except Exception as e:
                logger.error(f"HuggingFace exception: {e}")
                break  # Try next model
    
    logger.error("All HuggingFace models failed")
    return None


def overlay_face_on_body(body_image_b64: str, user_face_url: str) -> str:
    """
    Overlay user's face onto the generated body image using LOCAL PIL.
    Creates a circular face cutout with feathered edges and soft border.
    100% FREE - no external API needed.
    
    - body_image_b64: Base64 encoded generated body image
    - user_face_url: User's profile photo URL or data URI
    Returns base64 encoded final image or None.
    """
    try:
        logger.info("Performing local face overlay with PIL...")
        
        # 1. Load the generated body image
        body_bytes = base64.b64decode(body_image_b64)
        body_img = Image.open(io.BytesIO(body_bytes)).convert("RGBA")
        body_w, body_h = body_img.size
        logger.info(f"Body image size: {body_w}x{body_h}")
        
        # 2. Load user's face image
        user_img = download_image_pil(user_face_url)
        if not user_img:
            logger.error("Failed to load user face image")
            return None
        
        user_img = user_img.convert("RGBA")
        uw, uh = user_img.size
        logger.info(f"User image size: {uw}x{uh}")
        
        # 3. Crop face region (center of user photo, assuming portrait/selfie)
        face_size = min(uw, uh)
        left = (uw - face_size) // 2
        top_crop = max(0, int(uh * 0.02))  # Slightly below very top
        
        # Ensure crop stays in bounds
        if top_crop + face_size > uh:
            face_size = uh - top_crop
        if left + face_size > uw:
            face_size = min(face_size, uw - left)
        
        face_crop = user_img.crop((left, top_crop, left + face_size, top_crop + face_size))
        
        # 4. Create circular mask with feathered (soft) edges
        mask = Image.new("L", (face_size, face_size), 0)
        mask_draw = ImageDraw.Draw(mask)
        
        # Draw filled circle with small padding
        pad = max(2, int(face_size * 0.02))
        mask_draw.ellipse((pad, pad, face_size - pad, face_size - pad), fill=255)
        
        # Apply Gaussian blur for soft feathered edge
        blur_radius = max(2, int(face_size * 0.04))
        mask = mask.filter(ImageFilter.GaussianBlur(radius=blur_radius))
        
        # 5. Size the face to fit the head area of the body image
        # In a full-body fashion photo, the head is roughly 13-17% of image width
        target_face_size = int(body_w * 0.16)
        
        face_resized = face_crop.resize((target_face_size, target_face_size), Image.Resampling.LANCZOS)
        mask_resized = mask.resize((target_face_size, target_face_size), Image.Resampling.LANCZOS)
        
        # 6. Position: centered horizontally, near top of body image
        face_x = (body_w - target_face_size) // 2
        face_y = int(body_h * 0.035)  # ~3.5% from top
        
        # 7. Create a soft white border/glow behind the face
        border_padding = 4
        border_size = target_face_size + (border_padding * 2)
        border_img = Image.new("RGBA", (border_size, border_size), (0, 0, 0, 0))
        border_draw = ImageDraw.Draw(border_img)
        border_draw.ellipse(
            (0, 0, border_size, border_size), 
            fill=(255, 255, 255, 180)
        )
        # Soften border edge
        border_alpha = border_img.split()[3]
        border_alpha = border_alpha.filter(ImageFilter.GaussianBlur(radius=3))
        border_img.putalpha(border_alpha)
        
        # 8. Paste border, then face onto body
        body_img.paste(border_img, (face_x - border_padding, face_y - border_padding), border_img)
        body_img.paste(face_resized, (face_x, face_y), mask_resized)
        
        # 9. Convert to RGB JPEG and return as base64
        output = body_img.convert("RGB")
        buffered = io.BytesIO()
        output.save(buffered, format="JPEG", quality=92)
        result_b64 = base64.b64encode(buffered.getvalue()).decode()
        
        logger.info(f"Face overlay completed successfully ({len(result_b64)} chars)")
        return result_b64
        
    except Exception as e:
        logger.error(f"Face overlay failed: {e}")
        import traceback
        traceback.print_exc()
        return None


def virtual_try_on_idm_vton(garment_image_url: str, garment_description: str) -> str:
    """
    Virtual try-on using IDM-VTON (FREE HuggingFace Space).
    Uses the ACTUAL product image so clothes look exactly like the real product.
    
    - garment_image_url: URL or data URI of the product image
    - garment_description: Text description of the garment (e.g. "Blue Slim Fit Shirt")
    Returns base64 encoded result image or None.
    """
    garment_path = None
    try:
        logger.info("=== IDM-VTON Virtual Try-On START ===")
        
        # 1. Get stock male model image
        model_path = ensure_stock_male_model()
        if not model_path:
            logger.error("No stock model image available")
            return None
        
        # 2. Download garment (product) image to temp file
        logger.info(f"Downloading garment image...")
        garment_img = download_image_pil(garment_image_url)
        if not garment_img:
            logger.error("Failed to download garment image")
            return None
        
        garment_path = os.path.join(tempfile.gettempdir(), f"garment_{int(time.time())}.jpg")
        garment_img.convert("RGB").save(garment_path, "JPEG", quality=95)
        logger.info(f"Garment saved: {garment_path} ({garment_img.size})")
        
        # 3. Call IDM-VTON Space via Gradio API (FREE, runs on ZeroGPU)
        logger.info("Connecting to IDM-VTON Space (free virtual try-on)...")
        vton_client = GradioClient("yisol/IDM-VTON", token=HUGGINGFACE_TOKEN)
        
        logger.info("Sending try-on request (may take 1-2 minutes)...")
        # Submit job and wait with timeout
        job = vton_client.submit(
            dict={"background": handle_file(model_path), "layers": [], "composite": None},
            garm_img=handle_file(garment_path),
            garment_des=garment_description or "garment",
            is_checked=True,        # Auto-mask
            is_checked_crop=True,    # Auto-crop & paste back to preserve full body
            denoise_steps=30,
            seed=42,
            api_name="/tryon"
        )
        
        # Wait up to 3 minutes, then give up
        result = job.result(timeout=300)  # 5 min timeout for busy queue
        
        # 4. Process result - tuple of (output_image_path, masked_image_path)
        if result and len(result) > 0:
            output_path = result[0]
            logger.info(f"IDM-VTON output received: {output_path}")
            
            output_img = Image.open(output_path).convert("RGB")
            buffered = io.BytesIO()
            output_img.save(buffered, format="JPEG", quality=92)
            result_b64 = base64.b64encode(buffered.getvalue()).decode()
            
            logger.info(f"=== IDM-VTON Virtual Try-On COMPLETE ({len(result_b64)} chars) ===")
            return result_b64
        
        logger.error("IDM-VTON returned empty result")
        return None
        
    except Exception as e:
        logger.error(f"IDM-VTON failed: {e}")
        import traceback
        traceback.print_exc()
        return None
    finally:
        # Cleanup temp garment file
        try:
            if garment_path and os.path.exists(garment_path):
                os.remove(garment_path)
        except:
            pass


def create_fallback_composition(items: List[dict], user_img_url: str = None) -> str:
    """Create a fallback grid composition when AI generation fails"""
    width, height = 1200, 800
    canvas = Image.new('RGB', (width, height), (248, 249, 250))
    draw = ImageDraw.Draw(canvas)
    
    draw.text((width // 2 - 100, 20), "YOUR OUTFIT LOOK", fill=(50, 50, 50))
    
    # Place user image on left
    if user_img_url:
        user_img = download_image_pil(user_img_url)
        if user_img:
            user_img.thumbnail((350, 600), Image.Resampling.LANCZOS)
            uw, uh = user_img.size
            canvas.paste(user_img, (50, (height - uh) // 2), user_img if user_img.mode == 'RGBA' else None)
    
    # Place outfit items on right
    current_x = 450
    current_y = 80
    for idx, item in enumerate(items[:6]):
        item_url = item.get("image") or item.get("imageUrl")
        if item_url:
            img = download_image_pil(item_url)
            if img:
                img.thumbnail((200, 200), Image.Resampling.LANCZOS)
                col = idx % 3
                row = idx // 3
                x = current_x + col * 230
                y = current_y + row * 280
                
                draw.rectangle([x - 5, y - 5, x + 205, y + 245], fill=(255, 255, 255), outline=(230, 230, 230))
                iw, ih = img.size
                ix = x + (200 - iw) // 2
                iy = y + (200 - ih) // 2
                canvas.paste(img, (ix, iy), img if img.mode == 'RGBA' else None)
                
                item_name = item.get("name", "Item")[:25]
                draw.text((x, y + 210), item_name, fill=(60, 60, 60))
    
    buffered = io.BytesIO()
    canvas.save(buffered, format="JPEG", quality=85)
    return base64.b64encode(buffered.getvalue()).decode()


@app.post("/generate-look")
async def generate_look(request: GenerateLookRequest):
    """
    Generate Look Flow (100% FREE):
    Priority 1: IDM-VTON virtual try-on (uses ACTUAL product image → accurate clothes)
    Priority 2: HuggingFace text-to-image (generic but full body)
    Priority 3: Fallback composition with real product images
    """
    logger.info(f"=== GENERATE LOOK START ===")
    logger.info(f"User: {request.userId}, Items: {len(request.items)}, MainProduct: {request.mainProductId}")
    
    # 1. Fetch User
    try:
        user = await user_collection.find_one({"_id": ObjectId(request.userId)})
    except Exception as e:
        logger.error(f"Invalid user ID: {e}")
        raise HTTPException(status_code=400, detail="Invalid user ID")
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_image_url = user.get("image")
    gender_text = "male"  # Men's shopping project
    
    # 2. Find main product info (from items or DB)
    main_product = None
    for item in request.items:
        item_id = item.get("id") or item.get("_id") or ""
        if str(item_id) == str(request.mainProductId):
            main_product = item
            break
    
    # If main product not in items, fetch from DB
    if not main_product:
        try:
            db_product = await product_collection.find_one({"_id": ObjectId(request.mainProductId)})
            if db_product:
                main_product = {
                    "id": str(db_product["_id"]),
                    "name": db_product.get("name", ""),
                    "category": db_product.get("category", ""),
                    "color": db_product.get("colors", [""])[0] if db_product.get("colors") else "",
                    "image": db_product.get("imageUrl", ""),
                }
        except Exception as e:
            logger.warning(f"Could not fetch main product: {e}")
    
    main_product_image = None
    main_product_category = ""
    main_product_name = ""
    
    if main_product:
        main_product_image = main_product.get("image") or main_product.get("imageUrl") or ""
        main_product_category = main_product.get("category", "")
        main_product_name = main_product.get("name", "")
        logger.info(f"Main product: {main_product_name} ({main_product_category}), has image: {bool(main_product_image)}")
    
    # ======= STRATEGY 1: IDM-VTON Virtual Try-On (ACTUAL product image) =======
    # Always try with real product image for accurate clothing appearance
    if main_product_image:
        logger.info(f"Step 1: Trying IDM-VTON virtual try-on (product: {main_product_name})...")
        try:
            garment_desc = f"{main_product.get('color', '')} {main_product_name}".strip()
            vton_b64 = await asyncio.to_thread(
                virtual_try_on_idm_vton,
                main_product_image,
                garment_desc
            )
            
            if vton_b64:
                logger.info("=== GENERATE LOOK COMPLETE (IDM-VTON) ===")
                return {
                    "message": "Virtual try-on complete! The outfit matches the real product.",
                    "imageUrl": f"data:image/jpeg;base64,{vton_b64}"
                }
            else:
                logger.warning("IDM-VTON failed, falling back to text-to-image...")
        except Exception as e:
            logger.error(f"IDM-VTON error: {e}")
    else:
        logger.info("No product image available, using text-to-image...")
    
    # ======= STRATEGY 2: Text-to-Image with HuggingFace (FREE) =======
    logger.info("Step 2: Creating outfit description for text-to-image...")
    outfit_description = generate_outfit_description_with_gemini(request.items, gender_text)
    logger.info(f"Outfit description: {outfit_description}")
    
    logger.info("Step 3: Generating body image with HuggingFace (free)...")
    body_b64 = generate_body_with_huggingface(outfit_description, gender_text)
    
    if body_b64:
        logger.info("=== GENERATE LOOK COMPLETE (text-to-image) ===")
        return {
            "message": "Your AI outfit look is ready!",
            "imageUrl": f"data:image/jpeg;base64,{body_b64}"
        }
    
    # ======= STRATEGY 3: Fallback Composition =======
    logger.error("All AI generation failed, using fallback composition")
    img_b64 = create_fallback_composition(request.items, user_image_url)
    return {
        "message": "AI models are busy. Here's your outfit board with real product images.",
        "imageUrl": f"data:image/jpeg;base64,{img_b64}"
    }

# --- Color Coordination System ---

# Colors that go well together (fashion rules)
COLOR_COORDINATION = {
    "black":    ["white", "grey", "red", "beige", "cream", "navy", "blue", "khaki", "olive", "maroon", "pink"],
    "white":    ["black", "navy", "blue", "grey", "beige", "red", "green", "brown", "olive", "maroon", "khaki"],
    "navy":     ["white", "beige", "cream", "khaki", "grey", "brown", "tan", "light blue", "pink", "red"],
    "blue":     ["white", "beige", "grey", "brown", "khaki", "cream", "navy", "tan", "black"],
    "grey":     ["black", "white", "navy", "blue", "burgundy", "maroon", "pink", "red", "beige"],
    "beige":    ["navy", "white", "brown", "olive", "black", "blue", "cream", "maroon", "green"],
    "brown":    ["white", "beige", "cream", "navy", "olive", "blue", "khaki", "tan", "green"],
    "red":      ["black", "white", "navy", "grey", "blue", "beige", "cream"],
    "green":    ["beige", "brown", "white", "khaki", "cream", "black", "navy", "tan"],
    "olive":    ["beige", "brown", "white", "cream", "khaki", "black", "navy", "tan"],
    "maroon":   ["beige", "white", "grey", "cream", "navy", "khaki", "black"],
    "khaki":    ["navy", "white", "brown", "olive", "black", "blue", "maroon", "green", "beige"],
    "cream":    ["navy", "brown", "olive", "black", "blue", "maroon", "green", "beige"],
    "pink":     ["navy", "grey", "white", "black", "blue", "beige"],
    "yellow":   ["navy", "grey", "white", "black", "blue", "brown"],
    "charcoal": ["white", "beige", "cream", "blue", "navy", "pink", "red", "khaki"],
}

# Occasion → style mapping for smarter picks
OCCASION_STYLE_MAP = {
    "Casual":  {"tops": ["T-Shirt", "shirt", "Kurta Shirt", "Short Kurta"], "bottoms": ["Jeans", "Chinos", "Joggers"], "shoes": ["Sneakers", "Loafers"], "outerwear": ["Jacket"]},
    "Office":  {"tops": ["Formal Shirt", "shirt"], "bottoms": ["Formal Trousers", "Chinos"], "shoes": ["Formal Shoes", "Loafers"], "outerwear": ["Blazer"]},
    "Evening": {"tops": ["Formal Shirt", "Kurta", "shirt"], "bottoms": ["Formal Trousers", "Chinos"], "shoes": ["Formal Shoes", "Loafers", "Mojaris"], "outerwear": ["Blazer", "Bandhgala"]},
}

def extract_color_keyword(product_color: str) -> str:
    """Extract a matchable color keyword from product color string like 'Navy Blue Slim Fit'"""
    if not product_color:
        return ""
    color_lower = product_color.lower()
    # Check longer color names first
    for color in ["light blue", "dark blue", "navy blue"]:
        if color in color_lower:
            return color.split()[0] if color == "navy blue" else color
    for color in COLOR_COORDINATION.keys():
        if color in color_lower:
            return color
    return ""

def get_matching_colors(color: str) -> list:
    """Get list of colors that coordinate well with the given color"""
    key = extract_color_keyword(color)
    if key and key in COLOR_COORDINATION:
        return COLOR_COORDINATION[key]
    # Universal safe colors if unknown
    return ["black", "white", "grey", "navy", "beige"]

def color_match_score(product_colors: list, target_colors: list) -> int:
    """Score how well a product's color matches the target coordinating colors"""
    if not product_colors:
        return 0
    product_color = product_colors[0].lower() if product_colors else ""
    score = 0
    for target in target_colors:
        if target in product_color:
            score += 2  # Direct match
            break
    # Neutral colors always get a small bonus
    for neutral in ["black", "white", "grey", "navy"]:
        if neutral in product_color:
            score += 1
            break
    return score

def get_product_type(category: str, db_tops, db_bottoms, db_outerwear, db_shoes, db_accessories) -> str:
    """Map a DB category to a type label"""
    if category in db_tops: return "Top"
    if category in db_bottoms: return "Bottom"
    if category in db_outerwear: return "Outerwear"
    if category in db_shoes: return "Footwear"
    if category in db_accessories: return "Accessory"
    return "Other"

def smart_color_select(candidates: list, main_product: dict, required_types: list, 
                        occasion: str, db_tops, db_bottoms, db_outerwear, db_shoes, db_accessories) -> list:
    """
    Smart fallback: select ONE item per required type, prioritizing:
    1. Color coordination with main product
    2. Occasion appropriateness
    3. Price range similarity
    """
    main_color = ""
    if main_product.get("colors"):
        main_color = main_product["colors"][0] if isinstance(main_product["colors"], list) else str(main_product.get("colors", ""))
    elif main_product.get("name"):
        main_color = main_product["name"]  # Color is often in the name
    
    matching_colors = get_matching_colors(main_color)
    main_price = main_product.get("price", 0)
    occasion_styles = OCCASION_STYLE_MAP.get(occasion, {})
    
    # Group candidates by type
    type_buckets = {}
    for c in candidates:
        ptype = get_product_type(c["category"], db_tops, db_bottoms, db_outerwear, db_shoes, db_accessories)
        if ptype not in type_buckets:
            type_buckets[ptype] = []
        type_buckets[ptype].append(c)
    
    selected = []
    tips = []
    
    for req_type in required_types:
        bucket = type_buckets.get(req_type, [])
        if not bucket:
            continue
        
        # Score each candidate
        scored = []
        for item in bucket:
            score = 0
            item_colors = item.get("colors", [])
            
            # Color coordination (0-3 points)
            score += color_match_score(item_colors, matching_colors)
            
            # Occasion match (0-2 points)
            if occasion_styles:
                type_key = {"Top": "tops", "Bottom": "bottoms", "Footwear": "shoes", "Outerwear": "outerwear"}.get(req_type, "")
                if type_key and item["category"] in occasion_styles.get(type_key, []):
                    score += 2
            
            # Price similarity (0-1 point) - within 2x range
            item_price = item.get("price", 0)
            if main_price > 0 and item_price > 0:
                ratio = item_price / main_price if main_price > 0 else 1
                if 0.3 <= ratio <= 3.0:
                    score += 1
            
            scored.append((score, item))
        
        # Sort by score descending, pick best
        scored.sort(key=lambda x: x[0], reverse=True)
        best = scored[0][1]
        selected.append(best)
        
        # Generate a tip about why this was picked
        best_color = best.get("colors", [""])[0] if best.get("colors") else ""
        if best_color:
            tips.append(f"{best_color} {best['name']} pairs well with your {main_color.split()[0] if main_color else 'chosen'} outfit.")
    
    if not tips:
        tips = ["Color-coordinated outfit based on fashion rules.", "Balanced for style and occasion."]
    
    return selected, tips


def try_huggingface_llm_recommend(main_product_str: str, candidate_list_str: str, 
                                    occasion: str, gender: str, required_types: list) -> dict:
    """
    Backup LLM: Use HuggingFace free Inference API for outfit selection when Gemini is unavailable.
    """
    if not HUGGINGFACE_TOKEN:
        return None
    
    try:
        prompt = f"""You are a fashion stylist. Pick the best matching items for this outfit.

Main product: {main_product_str}

Candidates: {candidate_list_str}

Select exactly ONE item per type: {', '.join(required_types)} for a {occasion} occasion ({gender}).
Pick color-coordinated, style-matching items.

Return ONLY valid JSON: {{"selected_ids": ["id1","id2","id3"], "style_tips": ["tip1","tip2"]}}"""
        
        response = requests.post(
            "https://router.huggingface.co/hf-inference/models/HuggingFaceTB/SmolLM3-3B",
            headers={
                "Authorization": f"Bearer {HUGGINGFACE_TOKEN}",
                "Content-Type": "application/json"
            },
            json={
                "inputs": prompt,
                "parameters": {"max_new_tokens": 300, "temperature": 0.3, "return_full_text": False}
            },
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            text = ""
            if isinstance(data, list) and len(data) > 0:
                text = data[0].get("generated_text", "")
            elif isinstance(data, dict):
                text = data.get("generated_text", "")
            
            # Try to extract JSON from response
            if "{" in text and "}" in text:
                json_str = text[text.index("{"):text.rindex("}") + 1]
                result = json.loads(json_str)
                if result.get("selected_ids"):
                    logger.info(f"HuggingFace LLM selected: {result['selected_ids']}")
                    return result
        
        logger.warning(f"HuggingFace LLM response: {response.status_code}")
        return None
        
    except Exception as e:
        logger.warning(f"HuggingFace LLM fallback failed: {e}")
        return None


@app.post("/recommend", response_model=RecommendationResponse)
async def recommend_outfit(request: RecommendRequest):
    product = request.product
    occasion = request.occasion
    gender = request.gender
    
    category = map_category(product.get("category") or "")
    logger.info(f"=== RECOMMEND: {product.get('name')} ({category}) for {occasion} ===")
    
    # DB Categories
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
        complementary_categories = db_shoes + db_accessories + db_outerwear
        required_types = ["Footwear", "Accessory"]
    else:
        complementary_categories = db_tops + db_bottoms + db_shoes + db_accessories
        required_types = ["Top", "Bottom", "Footwear"]
    
    # Fetch more candidates for better selection
    candidate_query = {"category": {"$in": complementary_categories}}
    candidate_docs = await product_collection.find(candidate_query).limit(100).to_list(100)
    
    if not candidate_docs:
        logger.warning("No candidates found in DB")
        return {"items": [], "explanation": "No matching products found.", "style_tips": ["Add more products to the catalog."]}

    logger.info(f"Found {len(candidate_docs)} candidates across {len(set(c['category'] for c in candidate_docs))} categories")

    # === STRATEGY 1: Gemini AI (best quality) ===
    try:
        if client:
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
            
            prompt = f"""You are a professional fashion stylist.
Main product: {main_product_str}

Candidates: {candidate_list_str}

Create a COMPLETE outfit for '{occasion}' occasion ({gender}).
Select exactly ONE item per type: {', '.join(required_types)}.
The outfit MUST be color-coordinated and occasion-appropriate.

Return ONLY valid JSON:
{{"selected_ids": ["id1", "id2", "id3"], "style_tips": ["Tip 1", "Tip 2", "Tip 3"]}}"""
            
            response = client.models.generate_content(model='gemini-2.0-flash', contents=prompt)
            text = response.text.replace("```json", "").replace("```", "").strip()
            result = json.loads(text)
            
            selected_products = [p for p in candidate_docs if str(p["_id"]) in result.get("selected_ids", [])]
            
            if len(selected_products) >= 2:
                logger.info(f"Gemini selected {len(selected_products)} items")
                return {
                    "items": selected_products,
                    "explanation": " ".join(result.get("style_tips", ["AI-styled outfit."])),
                    "style_tips": result.get("style_tips", ["Great look!"])
                }
            else:
                raise Exception("Gemini selected too few items")
    except Exception as e:
        logger.warning(f"Gemini failed: {e}")

    # === STRATEGY 2: HuggingFace free LLM backup ===
    try:
        logger.info("Trying HuggingFace LLM backup...")
        candidate_list_str = json.dumps([
            {"id": str(p["_id"]), "name": p["name"], "category": p["category"],
             "color": p.get("colors", ["Unknown"])[0] if p.get("colors") else "Unknown"}
            for p in candidate_docs[:30]  # Smaller list for smaller model
        ])
        main_product_str = json.dumps({
            "name": product.get("name"), "category": product.get("category"),
            "color": product.get("colors", ["Unknown"])[0] if product.get("colors") else "Unknown"
        })
        
        hf_result = try_huggingface_llm_recommend(main_product_str, candidate_list_str, occasion, gender, required_types)
        if hf_result:
            selected_products = [p for p in candidate_docs if str(p["_id"]) in hf_result.get("selected_ids", [])]
            if len(selected_products) >= 2:
                logger.info(f"HF LLM selected {len(selected_products)} items")
                return {
                    "items": selected_products,
                    "explanation": " ".join(hf_result.get("style_tips", ["AI-matched outfit."])),
                    "style_tips": hf_result.get("style_tips", ["Stylish combination!"])
                }
    except Exception as e:
        logger.warning(f"HF LLM backup failed: {e}")

    # === STRATEGY 3: Smart color-coordinated fallback (no AI needed) ===
    logger.info("Using smart color-matching fallback...")
    selected, tips = smart_color_select(
        candidate_docs, product, required_types, occasion,
        db_tops, db_bottoms, db_outerwear, db_shoes, db_accessories
    )
    
    if selected:
        logger.info(f"Smart fallback selected {len(selected)} items: {[s['name'] for s in selected]}")
        return {
            "items": selected,
            "explanation": " ".join(tips),
            "style_tips": tips
        }
    
    # === STRATEGY 4: Last resort - any items from each type ===
    logger.warning("Last resort: picking any available items")
    recommendations = []
    for req_type in required_types:
        type_cats = {"Top": db_tops, "Bottom": db_bottoms, "Footwear": db_shoes, 
                     "Accessory": db_accessories, "Outerwear": db_outerwear}.get(req_type, [])
        items = [c for c in candidate_docs if c["category"] in type_cats]
        if items:
            recommendations.append(random.choice(items))
    
    return {"items": recommendations, "explanation": "Basic outfit suggestion.", "style_tips": ["Mix and match to find your style!"]}

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
