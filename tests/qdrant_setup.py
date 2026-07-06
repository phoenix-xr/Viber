from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams
import dotenv
import os 

dotenv.load_dotenv()

client = QdrantClient(url=os.environ["QDRANT_ENDPOINT"],api_key=os.environ["QDRANT_KEY"])

# # Define separate geometric tracking for interests and personality
client.create_collection(
    collection_name="user_profiles",
    vectors_config={
        "music_vibe": VectorParams(size=768, distance=Distance.COSINE),
        "interests": VectorParams(size=768, distance=Distance.COSINE),
        "personality": VectorParams(size=10, distance=Distance.COSINE) # 5 sliders!
    }
)

print(client.get_collections())