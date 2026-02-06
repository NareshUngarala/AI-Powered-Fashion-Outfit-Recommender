
import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(dotenv_path='.env.local')

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("No API key found")
    exit(1)

client = genai.Client(api_key=api_key)

try:
    print("Attempting to generate image...")
    response = client.models.generate_images(
        model='imagen-3.0-generate-001',
        prompt='A realistic photo of a fashion model wearing a red t-shirt and blue jeans, standing in a studio.',
        config=types.GenerateImagesConfig(
            number_of_images=1,
        )
    )
    if response.generated_images:
        print("Success! Image generated.")
        # print(response.generated_images[0].image.image_bytes) # This would be the data
    else:
        print("No images returned.")
except Exception as e:
    print(f"Error: {e}")
