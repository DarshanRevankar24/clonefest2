import faiss
import numpy as np

# 512-dim vectors from CLIP model
index = faiss.IndexFlatL2(512)
id_map = {}  # FAISS index -> post_id

def add_embedding(post_id: int, embedding: list):
    """
    Add a vector embedding for a post into FAISS.
    """
    vec = np.array(embedding, dtype="float32").reshape(1, -1)
    idx = index.ntotal
    index.add(vec)
    id_map[idx] = post_id

def search(embedding: list, k: int = 5):
    """
    Search FAISS for nearest embeddings.
    """
    if index.ntotal == 0:
        return []

    vec = np.array(embedding, dtype="float32").reshape(1, -1)
    D, I = index.search(vec, k)
    results = []
    for score, idx in zip(D[0], I[0]):
        if idx in id_map:
            # Convert L2 distance -> similarity
            sim = float(1 / (1 + score))
            results.append({"post_id": id_map[idx], "similarity": sim})
    return results
