import os
import json
import random
import pandas as pd
from faker import Faker

# Determine base path relative to this script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "high_popularity_spotify_data.csv")
JSON_PATH = os.path.join(BASE_DIR, "dummy_users.json")

# Define the 30 interests
INTERESTS_POOL = [
    "Music Production",
    "Concerts & Festivals",
    "Vinyl Collecting",
    "Podcasting",
    "Karaoke",
    "Songwriting",
    "Hiking & Outdoors",
    "Travel & Adventure",
    "Cooking & Baking",
    "Photography",
    "Gaming",
    "Cinema & Movies",
    "Reading & Literature",
    "Fitness & Gym",
    "Yoga & Meditation",
    "Coffee & Cafes",
    "Wine Tasting",
    "Art & Painting",
    "Fashion & Styling",
    "Gardening",
    "Board Games",
    "Anime & Manga",
    "Coding & Tech",
    "Writing & Journaling",
    "Dancing",
    "Volunteering",
    "History & Museums",
    "Science & Cosmos",
    "Stand-up Comedy",
    "Cycling"
]

def generate_dummy_users(csv_path: str, num_users: int = 50) -> list:
    """
    Generates a list of dummy users with sample track data from a CSV,
    along with randomized names, genders, interests, and personality vectors.
    """
    # Load tracks CSV
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Spotify CSV file not found at: {csv_path}")
        
    df = pd.read_csv(csv_path)
    
    # Initialize Faker
    fake = Faker()
    
    users = []
    for i in range(num_users):
        # Choose random gender
        gender = random.choice(["male", "female"])
        if gender == "male":
            name = fake.name_male()
        else:
            name = fake.name_female()
            
        # Sample 30 random tracks from the CSV
        sampled_tracks_df = df.sample(n=30)
        tracks = []
        for _, row in sampled_tracks_df.iterrows():
            tracks.append({
                "track_name": str(row["track_name"]) if not pd.isna(row["track_name"]) else "",
                "track_artist": str(row["track_artist"]) if not pd.isna(row["track_artist"]) else "",
                "track_album_name": str(row["track_album_name"]) if not pd.isna(row["track_album_name"]) else ""
            })
            
        # Select random number of interests (e.g., between 3 and 8)
        num_interests = random.randint(3, 8)
        user_interests = random.sample(INTERESTS_POOL, num_interests)
        
        # Generate personality vector of size 10
        # First 4 values: random float between -1.0 and 1.0
        # Last 6 values: random 0 or 1
        personality = [round(random.uniform(-1.0, 1.0), 4) for _ in range(4)] + [random.choice([0, 1]) for _ in range(6)]
        
        users.append({
            "id": i + 1,
            "name": name,
            "gender": gender,
            "tracks": tracks,
            "interests": user_interests,
            "personality": personality
        })
        
    return users

if __name__ == "__main__":
    
    with open("dummy_users.json", "r", encoding="utf-8") as f:
        dummy_users = json.load(f)
        
    print(f"Loaded {len(dummy_users)} dummy users from {JSON_PATH}")

    # num_to_generate = 100
    # print(f"Generating {num_to_generate} dummy users...")
    # try:
    #     dummy_users = generate_dummy_users(CSV_PATH, num_users=num_to_generate)
        
    #     # Save to JSON
    #     with open(JSON_PATH, "w", encoding="utf-8") as f:
    #         json.dump(dummy_users, f, indent=2, ensure_ascii=False)
            
    #     print(f"Successfully generated and saved {len(dummy_users)} dummy users to {JSON_PATH}")
        
    #     # Show sample output for verification
    #     sample_user = dummy_users[0]
    #     print("\n--- Sample User Output ---")
    #     print(f"Name: {sample_user['name']}")
    #     print(f"Gender: {sample_user['gender']}")
    #     print(f"Interests: {sample_user['interests']}")
    #     print(f"Personality Vector: {sample_user['personality']}")
    #     print(f"Tracks Sample (first 3):")
    #     for track in sample_user['tracks'][:3]:
    #         print(f"  - '{track['track_name']}' by {track['track_artist']} (Album: {track['track_album_name']})")
            
    # except Exception as e:
    #     print(f"Error generating dummy data: {e}")