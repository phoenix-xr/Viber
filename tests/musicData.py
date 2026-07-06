import requests
import os
import json
import dotenv
import sys
import pprint

dotenv.load_dotenv()

# Ensure stdout/stderr support printing unicode characters on Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

def getUserTopTracks(limit:int):
    data = requests.get(f"https://api.spotify.com/v1/me/top/tracks?limit={limit}", headers={
        "Authorization": f"Bearer {os.environ.get('SPOTIFY_ACCESS_TOKEN')}"
    })

    response_json = data.json()

    # Pipe response to a JSON file
    with open("spotify_response.json", "w", encoding="utf-8") as f:
        json.dump(response_json, f, indent=4)

    print("Response successfully written to spotify_response.json")

def getTags(song, artist, album):
    api_key = os.environ.get('LASTFM_API')
    base_url = "https://ws.audioscrobbler.com/2.0/"
    
    # 1. Try Track Level
    params = {
        "method": "track.gettoptags",
        "artist": artist,
        "track": song,
        "api_key": api_key,
        "autocorrect": 1,
        "format": "json"
    }
    
    res = requests.get(base_url, params=params).json()
    tag_list = res.get("toptags", {}).get("tag", [])
    
    # 2. Fallback to Album Level if track tags are empty OR error occurs
    if ("error" in res) or (not tag_list and album):
        # album_artist = album["artists"][0]["name"]
        # album_name = album["name"]
        params.update({
            "method": "album.gettoptags",
            "artist": artist,
            "album": album
        })
        # Clean track param out so it doesn't pollute the album call
        params.pop("track", None) 
        print(f"got from album tag : {album} by {artist}")
        res = requests.get(base_url, params=params).json()
        tag_list = res.get("toptags", {}).get("tag", [])
        
    # 3. Fallback to Artist Level if album tags are STILL empty OR error occurs
    if ("error" in res) or (not tag_list):
        params.update({
            "method": "artist.gettoptags",
            "artist": artist
        })
        params.pop("album", None)
        print(f"got from artist tag : {artist}")
        res = requests.get(base_url, params=params).json()
        tag_list = res.get("toptags", {}).get("tag", [])

    # Final string parsing safety check
    if isinstance(tag_list, dict):
        tags = [tag_list.get("name")]
    else:
        tags = [tag["name"] for tag in tag_list[:10]]
    

    return tags

def aggegate_music_data():
    with open("spotify_response.json", "r", encoding="utf-8") as f:
        data = json.load(f)        

    # getting only the track names and artists
    musicData = []
    for song in data["items"]:
        musicData.append(
            {
                "artist":song["artists"][0]["name"],
                "track":song["name"],
                "tags":getTags(song["name"],song["artists"][0]["name"],song["album"])
            }
        )

    with open("musicData.json", "w", encoding="utf-8") as f:
        json.dump(musicData, f, indent=4)

def add_tags_to_dummy_users():
    with open("dummy_users.json", "r", encoding="utf-8") as f:
        data = json.load(f)

    # Keep only the first 30 users, removing the rest
    data = data[:30]
    print(f"Keeping {len(data)} dummy users. Removing the rest.")

    for i, user in enumerate(data):
        print(f"\nProcessing user {i+1}/30: {user['name']}")
        tracks = user.get("tracks", [])
        
        for t, track in enumerate(tracks):
            # Check if tags already exist and are not empty
            if "tags" in track and track["tags"]:
                continue
            
            # Fetch tags
            try:
                tags = getTags(track["track_name"], track["track_artist"], track["track_album_name"])
                track["tags"] = tags
                print(f"  Track {t+1}/30 '{track['track_name']}' -> tags: {tags}")
            except Exception as e:
                print(f"  Error fetching tags for '{track['track_name']}': {e}")
                track["tags"] = []
                
        # Save progress after each user is processed
        with open("dummy_users.json", "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            
    print("\nDone processing tags for 30 dummy users.")

if __name__ == "__main__":
    add_tags_to_dummy_users()
