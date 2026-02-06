
import os
from dotenv import load_dotenv
from google import genai

load_dotenv(dotenv_path='.env.local')
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

try:
    print("Listing models...")
    for model in client.models.list(config={"page_size": 100}):
        if "generate" in model.supported_actions or "imagen" in model.name:
            print(f"Model: {model.name}")
            print(f"  Supported Actions: {model.supported_actions}")
except Exception as e:
    print(f"Error: {e}")
