import requests
import os
import json
import dotenv
import requests
import pprint

dotenv.load_dotenv()

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
        album_artist = album["artists"][0]["name"]
        album_name = album["name"]
        
        params.update({
            "method": "album.gettoptags",
            "artist": album_artist,
            "album": album_name
        })
        # Clean track param out so it doesn't pollute the album call
        params.pop("track", None) 
        print(f"got from album tag : {album_name} by {album_artist}")
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
        tags = [tag["name"] for tag in tag_list[:7]]
    

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


