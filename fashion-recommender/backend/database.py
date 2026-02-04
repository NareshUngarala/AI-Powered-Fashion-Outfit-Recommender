import os
import motor.motor_asyncio
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
env_path = Path(__file__).resolve().parent.parent / '.env.local'
load_dotenv(dotenv_path=env_path)
load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")

if not MONGODB_URI:
    raise ValueError("MONGODB_URI is not set in environment variables")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URI)
db = client.get_default_database()

# Collections
product_collection = db.get_collection("products")
cart_collection = db.get_collection("carts")
user_collection = db.get_collection("users")
wishlist_collection = db.get_collection("wishlists")
order_collection = db.get_collection("orders")
collection_collection = db.get_collection("collections")
outfit_collection = db.get_collection("outfits")
payment_collection = db.get_collection("paymentmethods")
