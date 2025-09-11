import os, base64, requests
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/generate", tags=["generate"])

HF_TOKEN = os.getenv("HF_TOKEN")
MODEL_ID = "stabilityai/stable-diffusion-2-1"  # or "stabilityai/stable-diffusion-xl-base-1.0"
API_URL = f"https://api-inference.huggingface.co/models/{MODEL_ID}"

headers = {"Authorization": f"Bearer {HF_TOKEN}"}

class Prompt(BaseModel):
    prompt: str

@router.post("/")
def generate(payload: Prompt):
    if not HF_TOKEN:
        raise HTTPException(status_code=500, detail="Missing HF_TOKEN in .env")
    
    response = requests.post(API_URL, headers=headers, json={"inputs": payload.prompt})
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail=response.text)
    
    image_bytes = response.content
    b64 = base64.b64encode(image_bytes).decode("utf-8")

    return {"url": f"data:image/png;base64,{b64}", "prompt": payload.prompt, "model": MODEL_ID}
