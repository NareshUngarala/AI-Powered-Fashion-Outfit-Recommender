import requests
import json

url = "http://localhost:8000/recommend"
payload = {
    "product": {
        "id": "dummy_id",
        "name": "Blue Denim Jacket",
        "description": "A classic blue denim jacket.",
        "category": "Jackets",
        "price": 59.99,
        "imageUrl": "http://example.com/image.jpg",
        "tags": ["casual", "denim"]
    },
    "occasion": "Casual Outing",
    "gender": "Female"
}

try:
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        print("Success!")
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"Failed with status code: {response.status_code}")
        print(response.text)
except Exception as e:
    print(f"Error: {e}")
