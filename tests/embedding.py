import os
import json
import sys
import dotenv
import vertexai
from vertexai.generative_models import GenerativeModel
from vertexai.language_models import TextEmbeddingModel
import google.auth
import google.auth.transport.requests
import openai

# Load environment variables from .env file
dotenv.load_dotenv()

# Ensure stdout supports printing unicode characters/emojis on Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Initialize Vertex AI
vertexai.init()

def get_text_embedding(text: str) -> list:
    """
    Generates a vector embedding for the input text using Vertex AI's 'text-embedding-004'.
    """
    print("Using Vertex AI for embedding generation (text-embedding-004)...")
    try:
        model = TextEmbeddingModel.from_pretrained("text-embedding-004")
        embeddings = model.get_embeddings([text])
        return embeddings[0].values
    except Exception as e:
        print(f"Vertex AI embedding generation failed: {e}")
        raise e

def generate_music_narration(track_data):
    track_data_json = json.dumps(track_data, indent=2)

    system_prompt = """You are an expert musicologist and psychometric profiler. Your task is to analyze a user's Top 50 recently played tracks—including Spotify genres and Last.fm crowdsourced emotional tags—and synthesize their musical identity into a highly dense, 2-sentence narrative profile.

    CRITICAL INSTRUCTIONS:
    1. DO NOT simply list artists or generic genres (e.g., "They like pop and rock").
    2. Focus on emotional resonance, acoustic textures, energy levels, and cultural "vibes" (e.g., "introspective, melancholy acoustic textures", "high-BPM aggressive gym anthems").
    3. Identify contrasts or dualities. If they listen to extreme metal AND soft classical, explicitly describe this bifurcated/dual preference.
    4. Keep the tone clinical, objective, and highly descriptive.
    5. Do not censor or soften the description. If the track data indicates mature, explicit, or aggressive themes (e.g., explicit lyrics, horrorcore, intense aggression), describe them explicitly and accurately to reflect the user's true taste.
    6. Output EXACTLY two sentences. No intro, no outro, no conversational filler."""

    user_prompt = f"""Analyze the following user track data and generate the 2-sentence narrative synthesis.

    USER TRACK DATA:
    {track_data_json}"""

    # Instantiate Model
    model = GenerativeModel(
        "publishers/openai/models/gpt-oss-120b-maas",
        system_instruction=system_prompt
    )

    # Call model
    print("Calling OpenAI GPT-OSS-120B on Vertex AI...")
    response = model.generate_content(user_prompt)

    narrative = response.text.strip()
    print("\n--- Narrative Profile ---")
    print(narrative)

    # Print Token Usage
    if hasattr(response, 'usage_metadata') and response.usage_metadata:
        print(f"\n[Token Usage]")
        print(f"Input Tokens: {response.usage_metadata.prompt_token_count}")
        print(f"Output Tokens: {response.usage_metadata.candidates_token_count}")
        print(f"Total Tokens: {response.usage_metadata.total_token_count}")
    else:
        print("\nToken usage metadata not available.")

    return narrative



def generate_narrations_for_users():
    with open("dummy_users.json", "r", encoding="utf-8") as f:
        users = json.load(f)

    print(f"Loaded {len(users)} users from dummy_users.json.")
    
    for i, user in enumerate(users):
        if "narration" in user and user["narration"]:
            print(f"User {i+1}/{len(users)}: {user['name']} already has narration. Skipping.")
            continue
            
        print(f"\n[{i+1}/{len(users)}] Generating narration for user: {user['name']}...")
        try:
            narration = generate_music_narration(user["tracks"])
            user["narration"] = narration
            
            # Save progress after each user is processed
            with open("dummy_users.json", "w", encoding="utf-8") as f:
                json.dump(users, f, indent=2, ensure_ascii=False)
                
            print(f"Saved narration for {user['name']}")
        except Exception as e:
            print(f"Failed to generate narration for {user['name']}: {e}")
            break

    print("\nNarration generation process complete.")

if __name__ == "__main__":
    generate_narrations_for_users()

