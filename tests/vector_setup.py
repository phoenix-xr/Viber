import json
import os
import sys
import numpy as np
import dotenv
from qdrant_client import QdrantClient
from qdrant_client import models

# Set up paths and load environment variables first so embedding.py has access to them
base_dir = os.path.dirname(os.path.abspath(__file__))
dotenv.load_dotenv(os.path.join(base_dir, ".env"))

# Import the embedding maker
sys.path.append(base_dir)
from embedding import get_text_embedding

# Constants
COLLECTION_NAME = "user_profiles"
MUSIC_VIBE_DIM = 768
INTERESTS_DIM = 768

# Initialize Qdrant Client with a 60-second timeout to handle remote server latency
client = QdrantClient(url=os.environ["QDRANT_ENDPOINT"], api_key=os.environ["QDRANT_KEY"], timeout=60.0)

# 3. Load & Populate Database
def populate_database(json_file_path):
    print(f"Loading users from {json_file_path}...")
    with open(json_file_path, "r", encoding="utf-8") as f:
        users = json.load(f)
        
    points = []
    
    for user in users:
        user_id = user["id"]
        name = user["name"]
        gender = user["gender"]
        interests = user.get("interests", [])
        narration = user.get("narration", "")
        
        print(f"Generating embeddings for user: {name} (ID: {user_id})...")
        
        # 1. Get embedding for narrative_music taste (narration field)
        if narration:
            music_embedding = get_text_embedding(narration)
        else:
            print(f"  Warning: No narration for {name}. Using zeros.")
            music_embedding = [0.0] * MUSIC_VIBE_DIM
            
        # 2. Get embedding for interests (joined as a single string)
        if interests:
            interests_text = ", ".join(interests)
            interests_embedding = get_text_embedding(interests_text)
        else:
            print(f"  Warning: No interests for {name}. Using zeros.")
            interests_embedding = [0.0] * INTERESTS_DIM
        
        # 3. Pull personality vector (size=10) directly
        personality_array = user["personality"]
        if len(personality_array) != 10:
            raise ValueError(f"User {name} has personality vector of size {len(personality_array)}, expected 10.")
        
        point = models.PointStruct(
            id=user_id,
            payload={
                "name": name,
                "gender": gender,
                "interests": interests,
                "narration": narration
            },
            vector={
                "music_vibe": music_embedding,
                "interests": interests_embedding,
                "personality": personality_array
            }
        )
        points.append(point)
        
    print(f"Upserting {len(points)} points into Qdrant collection '{COLLECTION_NAME}'...")
    client.upsert(collection_name=COLLECTION_NAME, points=points, timeout=60)
    print(f"Successfully indexed {len(points)} points into Qdrant.")

# 4. Engine-Level Fusion Matching Query
def find_matches_for_user(target_user_id, music_vec, interests_vec, personality_vec):
    """
    Finds the top matching profiles for a user utilizing engine-level 
    fusion over distinct vector spaces.
    """ 
    # Filter out the host user themselves from matching results
    exclude_self_filter = models.Filter(
        must_not=[
            models.HasIdCondition(has_id=[target_user_id])
        ]
    )
    
    # Execute Multi-Vector Query via Qdrant's universal endpoint
    response = client.query_points(
        collection_name=COLLECTION_NAME,
        prefetch=[
            models.Prefetch(
                query=music_vec,
                using="music_vibe",
                filter=exclude_self_filter,
                limit=25
            ),
            models.Prefetch(
                query=interests_vec,
                using="interests",
                filter=exclude_self_filter,
                limit=25
            ),
            models.Prefetch(
                query=personality_vec,
                using="personality",
                filter=exclude_self_filter,
                limit=25
            )
        ],
        query=models.FusionQuery(
            fusion=models.Fusion.DBSF
        ),
        limit=5,
        with_payload=True,
        timeout=60
    )
    
    return response.points

# ─── Execution Routine ───
if __name__ == "__main__":
    mock_file = os.path.join(base_dir, "dummy_users.json")
    # if not os.path.exists(mock_file):
    #     sample_data = [{
    #         "id": 1, "name": "Cynthia Reese", "gender": "female",
    #         "tracks": [{"track_name": "Back On 74", "track_artist": "Jungle", "track_album_name": "Volcano", "tags": ["soul"]}],
    #         "interests": ["Coding & Tech", "Podcasting"],
    #         "personality": [-0.53, -0.43, -0.53, -0.20, 1, 0, 0, 0, 0, 0],
    #         "narration": "The listening profile displays dark downtempo R&B paired with soul timbres."
    #     }]
    #     with open(mock_file, "w", encoding="utf-8") as f:
    #         json.dump(sample_data, f, indent=2, ensure_ascii=False)

    # 1. Load data inside your cluster
    populate_database(mock_file)
    
    # # 2. Simulate running a match calculation for a target male user
    # print("\nGenerating target embeddings for match query simulation...")
    # sample_target_music = get_text_embedding("The listening profile displays dark downtempo R&B paired with soul timbres.")
    # sample_target_interests = get_text_embedding("Coding & Tech, Podcasting")
    # sample_target_personality = [0.1, -0.9, 0.4, 0.8, 0, 1, 0, 0, 0, 0]
    
    # matches = find_matches_for_user(
    #     target_user_id=99,
    #     music_vec=sample_target_music,
    #     interests_vec=sample_target_interests,
    #     personality_vec=sample_target_personality
    # )
    
    # print("\n--- TOP MATCHES FOUND ---")
    # for rank, match in enumerate(matches, start=1):
    #     print(f"Rank {rank}: {match.payload['name']} ({match.payload['gender']}) | Calculated Fusion Score: {match.score:.4f}")