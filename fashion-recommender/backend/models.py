from typing import List, Optional, Any
from pydantic import BaseModel, Field, BeforeValidator, EmailStr
from datetime import datetime
from typing_extensions import Annotated

# Helper for ObjectId
PyObjectId = Annotated[str, BeforeValidator(str)]

class ProductModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str
    description: str
    price: float
    category: str
    brand: Optional[str] = None
    style: Optional[str] = "Casual Wear"
    match: Optional[float] = None
    imageUrl: str
    images: List[str] = []
    tags: List[str] = []
    stock: int = 0
    createdAt: datetime = Field(default_factory=datetime.now)

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "name": "Classic White T-Shirt",
                "description": "A comfortable cotton t-shirt",
                "price": 29.99,
                "category": "Tops",
                "imageUrl": "http://example.com/image.jpg"
            }
        }

class CartItemModel(BaseModel):
    productId: str
    name: Optional[str] = None
    price: Optional[float] = None
    image: Optional[str] = None
    size: Optional[str] = None
    color: Optional[str] = None
    quantity: int = 1

class CartModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    userId: str
    items: List[CartItemModel] = []
    createdAt: datetime = Field(default_factory=datetime.now)
    updatedAt: datetime = Field(default_factory=datetime.now)

    class Config:
        populate_by_name = True

class UserModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str
    email: EmailStr
    password: str
    image: Optional[str] = None
    role: str = "user"
    createdAt: datetime = Field(default_factory=datetime.now)
    updatedAt: datetime = Field(default_factory=datetime.now)

    class Config:
        populate_by_name = True

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    image: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class WishlistModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    userId: str
    products: List[str] = [] # List of Product IDs
    createdAt: datetime = Field(default_factory=datetime.now)
    updatedAt: datetime = Field(default_factory=datetime.now)

    class Config:
        populate_by_name = True

class WishlistResponse(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    userId: str
    products: List[ProductModel] = []
    createdAt: datetime = Field(default_factory=datetime.now)
    updatedAt: datetime = Field(default_factory=datetime.now)

    class Config:
        populate_by_name = True

class ShippingAddress(BaseModel):
    fullName: str
    addressLine1: str
    city: str
    state: str
    postalCode: str
    country: str

class OrderModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    userId: str
    orderId: str
    items: List[CartItemModel]
    total: float
    shippingAddress: ShippingAddress
    status: str
    paymentMethod: str
    createdAt: datetime = Field(default_factory=datetime.now)
    updatedAt: datetime = Field(default_factory=datetime.now)

    class Config:
        populate_by_name = True

class OrderCreate(BaseModel):
    userId: str
    items: List[CartItemModel]
    total: float
    shippingAddress: ShippingAddress

class CollectionModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str
    slug: str
    description: str
    imageUrl: str
    featured: bool = False
    createdAt: datetime = Field(default_factory=datetime.now)

    class Config:
        populate_by_name = True

class OutfitItemModel(BaseModel):
    productId: str
    name: str
    image: str
    price: float
    category: str

class OutfitModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    userId: str
    name: str
    items: List[OutfitItemModel]
    occasion: Optional[str] = None
    createdAt: datetime = Field(default_factory=datetime.now)

    class Config:
        populate_by_name = True

class OutfitCreate(BaseModel):
    userId: str # From query param in endpoint, but kept here for model consistency if needed
    name: str
    items: List[OutfitItemModel]
    occasion: Optional[str] = None

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    image: Optional[str] = None

class PaymentMethodModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    userId: str
    type: str = "card"
    last4: str
    brand: str
    expiryMonth: int
    expiryYear: int
    isDefault: bool = False
    createdAt: datetime = Field(default_factory=datetime.now)

    class Config:
        populate_by_name = True

class PaymentMethodCreate(BaseModel):
    cardNumber: str
    expiryMonth: int
    expiryYear: int
    cvc: str
    cardHolderName: str

class ChangePasswordRequest(BaseModel):
    currentPassword: str
    newPassword: str

class SeedRequest(BaseModel):
    products: List[dict]
    collections: List[dict]
    users: List[dict]
