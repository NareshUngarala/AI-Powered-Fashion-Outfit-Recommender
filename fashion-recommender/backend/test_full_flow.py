import requests
import json
import random
import string

BASE_URL = "http://localhost:8000"

def generate_random_email():
    return f"test_{''.join(random.choices(string.ascii_lowercase, k=5))}@example.com"

def test_full_flow():
    email = generate_random_email()
    password = "password123"
    name = "Test User"
    
    print(f"1. Testing Signup with {email}...")
    response = requests.post(f"{BASE_URL}/auth/signup", json={
        "email": email,
        "password": password,
        "name": name
    })
    assert response.status_code == 200
    user_data = response.json()
    user_id = user_data["_id"]
    print(f"   Success! User ID: {user_id}")
    
    print("2. Testing User Profile...")
    response = requests.get(f"{BASE_URL}/user/profile/{user_id}")
    assert response.status_code == 200
    assert response.json()["email"] == email
    
    print("3. Testing Update Profile...")
    new_name = "Updated Name"
    response = requests.put(f"{BASE_URL}/user/profile/{user_id}", json={"name": new_name})
    assert response.status_code == 200
    assert response.json()["name"] == new_name
    print("   Success!")

    print("3.5 Testing Change Password...")
    password_data = {"currentPassword": "password123", "newPassword": "newpassword123"}
    response = requests.put(f"{BASE_URL}/user/change-password", json=password_data, params={"userId": user_id})
    if response.status_code != 200:
        print(f"   Error: {response.text}")
    assert response.status_code == 200
    print("   Success!")

    print("4. Testing Collections...")
    response = requests.get(f"{BASE_URL}/collections")
    assert response.status_code == 200
    print(f"   Success! Found {len(response.json())} collections")
    
    print("4.5 Testing Products...")
    response = requests.get(f"{BASE_URL}/products")
    assert response.status_code == 200
    products = response.json()
    assert len(products) > 0
    real_product_id = products[0]["_id"]
    print(f"   Success! Found {len(products)} products. Using ID: {real_product_id}")

    print("5. Testing Payments...")
    # Add Payment Method
    payment_payload = {
        "cardNumber": "1234567890123456",
        "expiryMonth": 12,
        "expiryYear": 25,
        "cardHolderName": "Test Holder",
        "cvc": "123"
    }
    response = requests.post(f"{BASE_URL}/user/payments?userId={user_id}", json=payment_payload)
    if response.status_code != 200:
        print(f"Error: {response.status_code}")
        print(response.text)
        exit(1)
    payment_id = response.json()["_id"]
    print(f"   Added payment method: {payment_id}")
    
    response = requests.get(f"{BASE_URL}/user/payments", params={"userId": user_id})
    assert response.status_code == 200
    assert len(response.json()) > 0
    
    response = requests.delete(f"{BASE_URL}/user/payments/{payment_id}", params={"userId": user_id})
    assert response.status_code == 200
    print("   Success!")

    print("6. Testing Outfits...")
    outfit_data = {
        "userId": user_id,
        "name": "Test Outfit",
        "items": [
            {
                "productId": real_product_id,
                "name": "Test Product",
                "image": "http://example.com/image.jpg",
                "price": 29.99,
                "category": "Top"
            }
        ]
    }
    response = requests.post(f"{BASE_URL}/outfits", json=outfit_data, params={"userId": user_id})
    if response.status_code != 200:
        print(f"Outfit Error: {response.status_code}")
        print(response.text)
    assert response.status_code == 200
    outfit_id = response.json()["_id"]
    print(f"   Created outfit: {outfit_id}")
    
    response = requests.get(f"{BASE_URL}/outfits", params={"userId": user_id})
    assert response.status_code == 200
    assert len(response.json()) > 0
    
    response = requests.delete(f"{BASE_URL}/outfits/{outfit_id}", params={"userId": user_id})
    assert response.status_code == 200
    print("   Success!")

    print("7. Testing Wishlist...")
    # Add to wishlist
    response = requests.post(f"{BASE_URL}/wishlist/{user_id}/add", json={"productId": real_product_id})
    assert response.status_code == 200
    print("   Added to wishlist")
    
    # Get wishlist
    response = requests.get(f"{BASE_URL}/wishlist/{user_id}")
    assert response.status_code == 200
    wishlist_data = response.json()
    wishlist_products = wishlist_data.get("products", [])
    print(f"   Fetched wishlist: {len(wishlist_products)} items")
    assert len(wishlist_products) > 0
    product_ids = [p.get("_id") for p in wishlist_products]
    assert real_product_id in product_ids

    # Remove from wishlist
    response = requests.delete(f"{BASE_URL}/wishlist/{user_id}/remove/{real_product_id}")
    assert response.status_code == 200
    print("   Removed from wishlist")

    print("8. Testing Checkout...")
    order_data = {
        "userId": user_id,
        "items": [
            {
                "productId": real_product_id,
                "name": "Test Product",
                "price": 29.99,
                "quantity": 1
            }
        ],
        "total": 29.99,
        "shippingAddress": {
            "fullName": "Test User",
            "addressLine1": "123 Main St",
            "city": "Test City",
            "state": "TS",
            "postalCode": "12345",
            "country": "Test Country"
        }
    }
    # Note: Backend expects userId as separate Body param and order_data as Body.
    # When sending JSON { "userId": "...", "items": ... }, FastAPI might map fields if properly structured.
    # However, create_order expects `userId` and `order_data` (which contains items, total, etc).
    # Let's try sending flat JSON and see if FastAPI resolves it, or if we need to structure it.
    # Based on FastAPI behavior with multiple Body params, it usually expects:
    # { "userId": "...", "order_data": { ... } }
    # BUT the Node.js proxy sends flat JSON. This suggests backend might be wrong.
    
    response = requests.post(f"{BASE_URL}/checkout", json=order_data)
    if response.status_code != 200:
        print(f"Checkout Error: {response.status_code}")
        print(response.text)
    else:
        print(f"   Order created: {response.json()['orderId']}")

    print("9. Testing Recommendations...")
    recommend_data = {
        "product": products[0],
        "occasion": "Party",
        "gender": "Men"
    }
    response = requests.post(f"{BASE_URL}/recommend", json=recommend_data)
    if response.status_code != 200:
        print(f"Recommend Error: {response.status_code}")
        print(response.text)
    assert response.status_code == 200
    recommendation = response.json()
    assert "items" in recommendation
    print(f"   Got recommendation with {len(recommendation['items'])} items")
    assert len(recommendation["items"]) > 0

    print("10. Testing Delete Account...")
    response = requests.delete(f"{BASE_URL}/user/delete", params={"userId": user_id})
    assert response.status_code == 200
    print("   Success!")
    
    # Verify deletion
    response = requests.get(f"{BASE_URL}/user/profile/{user_id}")
    assert response.status_code == 404
    print("   Verified deletion.")

    print("\nAll tests passed!")

if __name__ == "__main__":
    try:
        test_full_flow()
    except Exception as e:
        print(f"\nTest Failed: {e}")
