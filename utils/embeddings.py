import os, requests
from typing import List
from dotenv import load_dotenv

load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")
# Hugging Face CLIP model for text + image embeddings
MODEL_ID = "openai/clip-vit-base-patch32"
API_URL = f"https://api-inference.huggingface.co/pipeline/feature-extraction/{MODEL_ID}"

headers = {"Authorization": f"Bearer {HF_TOKEN}"}

def get_text_embedding(text: str) -> List[float]:
    """
    Get text embedding from Hugging Face CLIP.
    """
    response = requests.post(API_URL, headers=headers, json={"inputs": text})
    response.raise_for_status()
    return response.json()[0]  # vector

def get_image_embedding(image_bytes: bytes) -> List[float]:
    """
    Get image embedding from Hugging Face CLIP.
    """
    response = requests.post(API_URL, headers=headers, data=image_bytes)
    response.raise_for_status()
    return response.json()[0]  # vector
