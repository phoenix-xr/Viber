import json
import os
import sys
import dotenv
from qdrant_client import QdrantClient

# Ensure stdout supports printing unicode characters/emojis on Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Resolve paths
base_dir = os.path.dirname(os.path.abspath(__file__))
dotenv.load_dotenv(os.path.join(base_dir, ".env"))

# Add tests to path and import vector setup details
sys.path.append(base_dir)
from vector_setup import find_matches_for_user, populate_database, COLLECTION_NAME

# Initialize Qdrant Client with a 60-second timeout
client = QdrantClient(url=os.environ["QDRANT_ENDPOINT"], api_key=os.environ["QDRANT_KEY"], timeout=60.0)

def main():
    mock_file = os.path.join(base_dir, "dummy_users.json")
    if not os.path.exists(mock_file):
        print(f"Error: {mock_file} does not exist. Run vector_setup.py first or ensure the file is present.")
        return

    # Load users from JSON
    with open(mock_file, "r", encoding="utf-8") as f:
        dummy_users = json.load(f)

    # Build user tracks dictionary (slicing to top 30 tracks)
    user_tracks_map = {u["id"]: u.get("tracks", [])[:30] for u in dummy_users}

    # Pick 3 diverse users as hosts (aiming for gender diversity to demonstrate matchmaking)
    females = [u for u in dummy_users if u.get("gender") == "female"]
    males = [u for u in dummy_users if u.get("gender") == "male"]

    hosts = []
    if females:
        hosts.append(females[0])  # Cynthia Reese
    if males:
        hosts.append(males[0])    # First male user
    if len(females) > 1:
        hosts.append(females[1])  # Second female user
    elif len(males) > 1:
        hosts.append(males[1])

    hosts = hosts[:3]
    print(f"Selected {len(hosts)} host users for matchmaking analysis:")
    for h in hosts:
        print(f" - {h['name']} ({h['gender']}, ID: {h['id']})")

    # Ensure collection has points, if empty, run populate_database
    try:
        count_res = client.count(collection_name=COLLECTION_NAME, timeout=60)
        points_count = count_res.count
        print(f"Current collection '{COLLECTION_NAME}' point count: {points_count}")
    except Exception as e:
        print(f"Error checking collection count: {e}")
        points_count = 0

    if points_count == 0:
        print("Qdrant collection is empty. Running database population first...")
        populate_database(mock_file)

    # Retrieve host users' vectors from Qdrant
    host_ids = [u["id"] for u in hosts]
    print(f"Retrieving vectors for host IDs {host_ids} from Qdrant...")
    try:
        retrieved_hosts = client.retrieve(
            collection_name=COLLECTION_NAME,
            ids=host_ids,
            with_vectors=True,
            with_payload=True,
            timeout=60
        )
    except Exception as e:
        print(f"Retrieve failed: {e}. Attempting database repopulation...")
        populate_database(mock_file)
        retrieved_hosts = client.retrieve(
            collection_name=COLLECTION_NAME,
            ids=host_ids,
            with_vectors=True,
            with_payload=True,
            timeout=60
        )

    retrieved_map = {point.id: point for point in retrieved_hosts}

    visualization_data = []

    for host_user in hosts:
        host_id = host_user["id"]
        if host_id not in retrieved_map or not retrieved_map[host_id].vector:
            print(f"Warning: Host user {host_user['name']} (ID: {host_id}) has no vector data. Skipping.")
            continue

        point = retrieved_map[host_id]
        music_vec = point.vector.get("music_vibe")
        interests_vec = point.vector.get("interests")
        personality_vec = point.vector.get("personality")

        print(f"Querying top matches for {host_user['name']}...")
        # Find matches based on the matchmaking logic (excluding gender)
        raw_matches = find_matches_for_user(
            target_user_id=host_id,
            music_vec=music_vec,
            interests_vec=interests_vec,
            personality_vec=personality_vec
        )

        # Slice to top 3 matches
        top_matches = raw_matches[:3]
        print(f"Found {len(top_matches)} matches for {host_user['name']}.")

        # Retrieve vectors for matched users to display their personality sliders
        matched_ids = [m.id for m in top_matches]
        if matched_ids:
            retrieved_matches = client.retrieve(
                collection_name=COLLECTION_NAME,
                ids=matched_ids,
                with_vectors=True,
                with_payload=True,
                timeout=60
            )
            retrieved_matches_map = {m.id: m for m in retrieved_matches}
        else:
            retrieved_matches_map = {}

        matches_list = []
        for rank, match in enumerate(top_matches, start=1):
            m_id = match.id
            m_point = retrieved_matches_map.get(m_id)
            m_personality = m_point.vector.get("personality") if m_point and m_point.vector else []

            matches_list.append({
                "rank": rank,
                "id": m_id,
                "name": match.payload.get("name", "Unknown"),
                "gender": match.payload.get("gender", "Unknown"),
                "interests": match.payload.get("interests", []),
                "narration": match.payload.get("narration", ""),
                "personality": m_personality,
                "score": match.score,
                "tracks": user_tracks_map.get(m_id, [])
            })

        visualization_data.append({
            "host": {
                "id": host_id,
                "name": host_user["name"],
                "gender": host_user["gender"],
                "interests": host_user.get("interests", []),
                "narration": host_user.get("narration", ""),
                "personality": personality_vec,
                "tracks": user_tracks_map.get(host_id, [])
            },
            "matches": matches_list
        })

    # Generate HTML file content
    generate_html(visualization_data)

def generate_html(data):
    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Viberr - Match Analysis & Visualisation</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {{
      --bg-primary: #090b11;
      --bg-secondary: #0f121d;
      --bg-card: rgba(22, 28, 45, 0.45);
      --bg-card-hover: rgba(30, 38, 61, 0.7);
      --border-color: rgba(255, 255, 255, 0.05);
      --border-hover: rgba(139, 92, 246, 0.3);
      --border-active: #8b5cf6;
      --text-main: #f3f4f6;
      --text-muted: #9ca3af;
      --accent-purple: #8b5cf6;
      --accent-cyan: #06b6d4;
      --accent-green: #10b981;
      
      --gradient-host: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%);
      --gradient-match: linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%);
      --gradient-score: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%);
      
      --glow-purple: 0 0 20px rgba(139, 92, 246, 0.2);
      --glow-cyan: 0 0 20px rgba(6, 182, 212, 0.2);
      --shadow-main: 0 12px 40px 0 rgba(0, 0, 0, 0.4);
    }}

    * {{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }}

    body {{
      font-family: 'Plus Jakarta Sans', sans-serif;
      background-color: var(--bg-primary);
      background-image: 
        radial-gradient(at 0% 0%, rgba(139, 92, 246, 0.08) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(6, 182, 212, 0.08) 0px, transparent 50%);
      color: var(--text-main);
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }}

    header {{
      background: rgba(9, 11, 17, 0.7);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-color);
      padding: 1.5rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 10;
    }}

    .logo-container {{
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }}

    .logo-badge {{
      background: var(--gradient-score);
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1.4rem;
      font-family: 'Outfit', sans-serif;
      letter-spacing: -1px;
      box-shadow: var(--glow-purple);
    }}

    .logo-title {{
      font-family: 'Outfit', sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      background: linear-gradient(to right, #fff, #9ca3af);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }}

    .header-info {{
      font-size: 0.875rem;
      color: var(--text-muted);
      background: rgba(255, 255, 255, 0.03);
      padding: 0.5rem 1rem;
      border-radius: 2rem;
      border: 1px solid var(--border-color);
    }}

    .main-container {{
      display: flex;
      flex: 1;
      overflow: hidden;
      min-height: 0;
    }}

    /* Sidebar - Host Selection */
    .sidebar {{
      width: 320px;
      background: rgba(15, 18, 29, 0.6);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      padding: 1.5rem;
      gap: 1rem;
      overflow-y: auto;
      flex-shrink: 0;
    }}

    .section-title {{
      font-family: 'Outfit', sans-serif;
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
    }}

    .host-card {{
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 1rem;
      padding: 1.25rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }}

    .host-card:hover {{
      background: var(--bg-card-hover);
      border-color: var(--border-hover);
      transform: translateY(-2px);
    }}

    .host-card.active {{
      background: rgba(139, 92, 246, 0.1);
      border-color: var(--border-active);
      box-shadow: var(--glow-purple);
    }}

    .card-header-row {{
      display: flex;
      justify-content: space-between;
      align-items: center;
    }}

    .card-name {{
      font-weight: 600;
      font-size: 1.1rem;
    }}

    .gender-badge {{
      font-size: 0.75rem;
      padding: 0.25rem 0.6rem;
      border-radius: 1rem;
      font-weight: 500;
      text-transform: capitalize;
    }}

    .gender-badge.female {{
      background: rgba(236, 72, 153, 0.15);
      color: #f472b6;
      border: 1px solid rgba(236, 72, 153, 0.2);
    }}

    .gender-badge.male {{
      background: rgba(59, 130, 246, 0.15);
      color: #60a5fa;
      border: 1px solid rgba(59, 130, 246, 0.2);
    }}

    .card-snippet {{
      font-size: 0.8rem;
      color: var(--text-muted);
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }}

    /* Dashboard Main Workspace */
    .workspace {{
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }}

    .workspace-placeholder {{
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
      gap: 1rem;
    }}

    .workspace-placeholder svg {{
      width: 4rem;
      height: 4rem;
      stroke: var(--text-muted);
      opacity: 0.5;
    }}

    .workspace-content {{
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      padding: 1.5rem 2rem;
      gap: 1.5rem;
    }}

    /* Tabs for Matches Selection */
    .tabs-container {{
      display: flex;
      align-items: center;
      gap: 1rem;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 1rem;
      flex-shrink: 0;
    }}

    .tab-button {{
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--border-color);
      padding: 0.6rem 1.2rem;
      border-radius: 0.75rem;
      color: var(--text-muted);
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }}

    .tab-button:hover {{
      color: var(--text-main);
      border-color: rgba(255, 255, 255, 0.15);
    }}

    .tab-button.active {{
      background: var(--bg-secondary);
      color: var(--accent-cyan);
      border-color: var(--accent-cyan);
      box-shadow: var(--glow-cyan);
    }}

    .match-percentage-badge {{
      background: rgba(6, 182, 212, 0.15);
      color: var(--accent-cyan);
      padding: 0.1rem 0.4rem;
      font-size: 0.75rem;
      border-radius: 0.5rem;
      font-weight: 600;
    }}

    /* Panels Grid Layout */
    .comparison-grid {{
      flex: 1;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr auto;
      gap: 1.5rem;
      overflow: hidden;
      padding-right: 0.5rem;
    }}

    .glass-card {{
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 1.25rem;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.15rem;
      max-height: 700px;
      overflow: hidden;
    }}

    .panel-header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 0.5rem;
    }}

    .panel-title {{
      font-family: 'Outfit', sans-serif;
      font-size: 1.25rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }}

    .panel-title.host-color {{
      background: var(--gradient-host);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }}

    .panel-title.match-color {{
      background: var(--gradient-match);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }}

    .panel-label {{
      font-size: 0.8rem;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.05em;
      color: var(--text-muted);
    }}

    /* Sub-tabs Profile vs Tracks */
    .sub-tabs-container {{
      display: flex;
      gap: 0.5rem;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 0.5rem;
    }}

    .sub-tab-button {{
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 0.85rem;
      font-weight: 500;
      padding: 0.4rem 0.8rem;
      border-radius: 0.5rem;
      transition: all 0.2s ease;
      border: 1px solid transparent;
    }}

    .sub-tab-button:hover {{
      color: var(--text-main);
      background: rgba(255, 255, 255, 0.02);
    }}

    .sub-tab-button.active {{
      color: var(--text-main);
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.08);
      font-weight: 600;
    }}

    .profile-details-container {{
      display: flex;
      flex-direction: column;
      gap: 1.15rem;
      overflow-y: auto;
      flex: 1;
    }}

    .narration-box {{
      background: rgba(0, 0, 0, 0.15);
      border-radius: 0.75rem;
      padding: 1rem;
      border: 1px dashed rgba(255, 255, 255, 0.05);
      font-size: 0.925rem;
      line-height: 1.6;
      color: rgba(243, 244, 246, 0.95);
      min-height: 120px;
      flex-shrink: 0;
    }}

    /* Interest Pills */
    .interests-box {{
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex-shrink: 0;
    }}

    .interests-label {{
      font-size: 0.75rem;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.03em;
      color: var(--text-muted);
    }}

    .tags-container {{
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }}

    .tag-pill {{
      font-size: 0.8rem;
      padding: 0.35rem 0.75rem;
      border-radius: 0.75rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-color);
      color: var(--text-main);
    }}

    .tag-pill.shared {{
      background: rgba(16, 185, 129, 0.12);
      border-color: rgba(16, 185, 129, 0.25);
      color: #34d399;
      font-weight: 500;
    }}

    .tag-pill.unique {{
      color: var(--text-muted);
    }}

    /* Personality Visualisation */
    .personality-section {{
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      flex-shrink: 0;
    }}

    .personality-header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
    }}

    .chart-container {{
      background: rgba(0, 0, 0, 0.2);
      border-radius: 1rem;
      padding: 1.25rem;
      border: 1px solid rgba(255, 255, 255, 0.02);
    }}

    .chart-row {{
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      margin-bottom: 0.65rem;
    }}

    .chart-row:last-child {{
      margin-bottom: 0;
    }}

    .row-meta {{
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: var(--text-muted);
      font-weight: 500;
    }}

    .bar-wrapper {{
      height: 24px;
      position: relative;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.02);
      overflow: hidden;
    }}

    .bar-center-line {{
      position: absolute;
      left: 50%;
      top: 0;
      bottom: 0;
      width: 1px;
      background: rgba(255, 255, 255, 0.15);
      z-index: 2;
    }}

    .bar-fill {{
      position: absolute;
      top: 4px;
      bottom: 4px;
      border-radius: 3px;
      z-index: 1;
      opacity: 0.85;
      transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
    }}

    .bar-fill.host-fill {{
      background: var(--gradient-host);
      box-shadow: 0 0 10px rgba(139, 92, 246, 0.3);
    }}

    .bar-fill.match-fill {{
      background: var(--gradient-match);
      box-shadow: 0 0 10px rgba(6, 182, 212, 0.3);
    }}

    /* Tracks List CSS */
    .tracks-details-container {{
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      flex: 1;
      overflow: hidden;
    }}

    .tracks-list-scrollable {{
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding-right: 0.25rem;
      flex: 1;
    }}

    .track-item {{
      background: rgba(0, 0, 0, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.03);
      border-radius: 0.75rem;
      padding: 0.75rem 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      transition: all 0.2s ease;
    }}

    .track-item:hover {{
      background: rgba(255, 255, 255, 0.02);
      border-color: rgba(255, 255, 255, 0.06);
    }}

    .track-main-info {{
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 0.5rem;
    }}

    .track-title {{
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-main);
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }}

    .track-artist {{
      font-size: 0.775rem;
      color: var(--text-muted);
      margin-top: 0.1rem;
    }}

    .track-album {{
      font-size: 0.75rem;
      color: rgba(156, 163, 175, 0.55);
      font-style: italic;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      max-width: 60%;
    }}

    .track-tags {{
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
    }}

    .track-tag-pill {{
      font-size: 0.65rem;
      padding: 0.15rem 0.4rem;
      border-radius: 0.4rem;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.04);
      color: var(--text-muted);
    }}

    .track-item.shared-track {{
      border-color: rgba(16, 185, 129, 0.25);
      background: rgba(16, 185, 129, 0.04);
    }}

    .track-item.shared-artist {{
      border-color: rgba(139, 92, 246, 0.25);
      background: rgba(139, 92, 246, 0.03);
    }}

    .shared-badge {{
      font-size: 0.65rem;
      font-weight: 600;
      padding: 0.15rem 0.45rem;
      border-radius: 0.4rem;
      text-transform: uppercase;
      letter-spacing: 0.02em;
      white-space: nowrap;
      flex-shrink: 0;
    }}

    .shared-badge.track {{
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }}

    .shared-badge.artist {{
      background: rgba(139, 92, 246, 0.15);
      color: #c084fc;
      border: 1px solid rgba(139, 92, 246, 0.2);
    }}

    /* Global Comparative Panel (Affinity Score Card) */
    .affinity-panel {{
      grid-column: span 2;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: linear-gradient(135deg, rgba(22, 28, 45, 0.6) 0%, rgba(15, 18, 29, 0.8) 100%);
      border: 1px solid var(--border-color);
      border-radius: 1.25rem;
      padding: 1.5rem 2rem;
    }}

    .affinity-info {{
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-width: 60%;
    }}

    .affinity-title {{
      font-family: 'Outfit', sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }}

    .affinity-desc {{
      font-size: 0.875rem;
      color: var(--text-muted);
      line-height: 1.5;
    }}

    .score-circle-container {{
      position: relative;
      width: 110px;
      height: 110px;
      display: flex;
      align-items: center;
      justify-content: center;
    }}

    .circular-chart {{
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }}

    .circle-bg {{
      fill: none;
      stroke: rgba(255, 255, 255, 0.05);
      stroke-width: 3.2;
    }}

    .circle {{
      fill: none;
      stroke-width: 3.2;
      stroke-linecap: round;
      transition: stroke-dasharray 0.8s ease;
    }}

    .circle.purple-stroke {{
      stroke: url(#scoreGradient);
      filter: drop-shadow(0px 0px 8px rgba(139, 92, 246, 0.5));
    }}

    .score-text {{
      position: absolute;
      font-family: 'Outfit', sans-serif;
      font-size: 1.6rem;
      font-weight: 800;
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
    }}

    .score-label {{
      font-size: 0.65rem;
      text-transform: uppercase;
      font-weight: 600;
      color: var(--text-muted);
      letter-spacing: 0.05em;
    }}

    ::-webkit-scrollbar {{
      width: 6px;
      height: 6px;
    }}
    ::-webkit-scrollbar-track {{
      background: rgba(255, 255, 255, 0.01);
    }}
    ::-webkit-scrollbar-thumb {{
      background: rgba(255, 255, 255, 0.08);
      border-radius: 4px;
    }}
    ::-webkit-scrollbar-thumb:hover {{
      background: rgba(255, 255, 255, 0.15);
    }}

    @media (max-width: 1024px) {{
      body {{
        height: auto;
        overflow: auto;
      }}
      .main-container {{
        flex-direction: column;
        height: auto;
        overflow: visible;
      }}
      .sidebar {{
        width: 100%;
        border-right: none;
        border-bottom: 1px solid var(--border-color);
        max-height: 250px;
      }}
      .workspace {{
        overflow: visible;
      }}
      .workspace-content {{
        overflow: visible;
        height: auto;
      }}
      .comparison-grid {{
        grid-template-columns: 1fr;
        grid-template-rows: auto;
        overflow: visible;
      }}
      .affinity-panel {{
        grid-column: span 1;
        flex-direction: column;
        gap: 1.5rem;
        align-items: flex-start;
      }}
    }}
  </style>
</head>
<body>

  <header>
    <div class="logo-container">
      <div class="logo-badge">V</div>
      <div class="logo-title">Viberr Match Analysis</div>
    </div>
    <div class="header-info">
      Vector Engine: <strong>Qdrant (DBSF Fusion)</strong>
    </div>
  </header>

  <div class="main-container">
    <!-- Sidebar - Host Users Selector -->
    <div class="sidebar">
      <div class="section-title">Host Profile Analysis</div>
      <div id="host-list">
        <!-- Rendered via JS -->
      </div>
    </div>

    <!-- Main Content Workspace -->
    <div class="workspace">
      <div id="placeholder" class="workspace-placeholder">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.97 5.97 0 0 0-.75-2.906m-.173-4.059a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM3.74 18.72a9.094 9.094 0 0 1 3.741-.479 3 3 0 0 1-4.682-2.72m.94 3.198.002.031c0 .225-.012.447-.038.666A11.944 11.944 0 0 0 12 21c2.17 0 4.207-.576 5.963-1.584A6.062 6.062 0 0 0 18 18.72M3 18.72a5.97 5.97 0 0 1 .75-2.906m-.173-4.059a4.5 4.5 0 1 0-9 0 4.5 4.5 0 0 0 9 0Z" />
        </svg>
        <p>Select a host profile from the sidebar to visualize and analyze matches</p>
      </div>

      <div id="workspace-content" class="workspace-content" style="display: none;">
        <!-- Tabs bar for Matches selection -->
        <div class="tabs-container">
          <div class="interests-label" style="margin-right: 0.5rem;">Select Match:</div>
          <div id="match-tabs" style="display: flex; gap: 0.75rem;">
            <!-- Rendered via JS -->
          </div>
        </div>

        <!-- Comparative Columns -->
        <div class="comparison-grid">
          
          <!-- Host Panel -->
          <div class="glass-card">
            <div class="panel-header">
              <span class="panel-title host-color" id="host-title-name">Cynthia Reese</span>
              <span class="panel-label">Host Profile</span>
            </div>

            <!-- Sub-tabs Profile vs Tracks -->
            <div class="sub-tabs-container">
              <button class="sub-tab-button active" id="host-subtab-profile" onclick="toggleCardTab('host', 'profile')">Profile Analysis</button>
              <button class="sub-tab-button" id="host-subtab-tracks" onclick="toggleCardTab('host', 'tracks')">Top 30 Tracks</button>
            </div>
            
            <!-- Profile Info Container -->
            <div class="profile-details-container" id="host-profile-details">
              <div class="narration-box" id="host-narration">
                Loading...
              </div>
              
              <div class="interests-box">
                <span class="interests-label">Interests Profile</span>
                <div class="tags-container" id="host-interests-tags">
                  <!-- Rendered via JS -->
                </div>
              </div>

              <div class="personality-section">
                <div class="personality-header">
                  <span class="interests-label">Personality Coordinates</span>
                  <span class="gender-badge female" id="host-gender-tag">Female</span>
                </div>
                
                <div class="chart-container" id="host-personality-chart">
                  <!-- Bidirectional Bars Rendered via JS -->
                </div>
              </div>
            </div>

            <!-- Tracks List Container -->
            <div class="tracks-details-container" id="host-tracks-details" style="display: none;">
              <span class="interests-label">Tracks History (Top 30)</span>
              <div class="tracks-list-scrollable" id="host-tracks-list">
                <!-- Rendered via JS -->
              </div>
            </div>
          </div>

          <!-- Matched User Panel -->
          <div class="glass-card">
            <div class="panel-header">
              <span class="panel-title match-color" id="match-title-name">Rank 1 Match</span>
              <span class="panel-label">Best Fit Matched Profile</span>
            </div>

            <!-- Sub-tabs Profile vs Tracks -->
            <div class="sub-tabs-container">
              <button class="sub-tab-button active" id="match-subtab-profile" onclick="toggleCardTab('match', 'profile')">Profile Analysis</button>
              <button class="sub-tab-button" id="match-subtab-tracks" onclick="toggleCardTab('match', 'tracks')">Top 30 Tracks</button>
            </div>
            
            <!-- Profile Info Container -->
            <div class="profile-details-container" id="match-profile-details">
              <div class="narration-box" id="match-narration">
                Loading...
              </div>
              
              <div class="interests-box">
                <span class="interests-label">Interests Profile</span>
                <div class="tags-container" id="match-interests-tags">
                  <!-- Rendered via JS -->
                </div>
              </div>

              <div class="personality-section">
                <div class="personality-header">
                  <span class="interests-label">Personality Coordinates</span>
                  <span class="gender-badge male" id="match-gender-tag">Male</span>
                </div>
                
                <div class="chart-container" id="match-personality-chart">
                  <!-- Bidirectional Bars Rendered via JS -->
                </div>
              </div>
            </div>

            <!-- Tracks List Container -->
            <div class="tracks-details-container" id="match-tracks-details" style="display: none;">
              <span class="interests-label">Tracks History (Top 30)</span>
              <div class="tracks-list-scrollable" id="match-tracks-list">
                <!-- Rendered via JS -->
              </div>
            </div>
          </div>

          <!-- Affinity Score Card -->
          <div class="affinity-panel">
            <div class="affinity-info">
              <div class="affinity-title" id="affinity-score-heading">Calculated Fusion Affinity</div>
              <div class="affinity-desc" id="affinity-explanation">
                The DBSF Fusion query evaluates music vibes, interests alignment, and psychological coordinates.
              </div>
            </div>
            
            <div class="score-circle-container">
              <svg viewBox="0 0 36 36" class="circular-chart">
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#8b5cf6" />
                    <stop offset="100%" stop-color="#06b6d4" />
                  </linearGradient>
                </defs>
                <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path class="circle purple-stroke" id="score-circle-stroke" stroke-dasharray="0, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div class="score-text">
                <span id="affinity-score-percent">0.00</span>
                <span class="score-label">Affinity</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>

  <script>
    // Embedded Data from search_test.py
    const appData = {json.dumps(data, indent=2)};

    let activeHostIndex = null;
    let activeMatchIndex = 0;

    // Load Host Profiles
    function init() {{
      const hostList = document.getElementById("host-list");
      hostList.innerHTML = "";
      
      appData.forEach((hostData, idx) => {{
        const card = document.createElement("div");
        card.className = "host-card" + (activeHostIndex === idx ? " active" : "");
        card.onclick = () => selectHost(idx);
        
        // Shorten narration for card snippet
        let snippet = hostData.host.narration || "No narration profile available.";
        
        card.innerHTML = `
          <div class="card-header-row">
            <span class="card-name">${{hostData.host.name}}</span>
            <span class="gender-badge ${{hostData.host.gender}}">${{hostData.host.gender}}</span>
          </div>
          <div class="card-snippet">${{snippet}}</div>
        `;
        
        hostList.appendChild(card);
      }});

      if (appData.length > 0) {{
        selectHost(0);
      }}
    }}

    function selectHost(idx) {{
      activeHostIndex = idx;
      activeMatchIndex = 0;
      
      // Update sidebar active class
      const cards = document.querySelectorAll(".host-card");
      cards.forEach((c, cIdx) => {{
        if (cIdx === idx) {{
          c.classList.add("active");
        }} else {{
          c.classList.remove("active");
        }}
      }});

      document.getElementById("placeholder").style.display = "none";
      document.getElementById("workspace-content").style.display = "flex";

      renderMatchTabs();
      renderWorkspace();
    }}

    function selectMatch(mIdx) {{
      activeMatchIndex = mIdx;
      
      const buttons = document.querySelectorAll(".tab-button");
      buttons.forEach((b, idx) => {{
        if (idx === mIdx) {{
          b.classList.add("active");
        }} else {{
          b.classList.remove("active");
        }}
      }});

      renderWorkspace();
    }}

    function renderMatchTabs() {{
      const tabs = document.getElementById("match-tabs");
      tabs.innerHTML = "";

      const hostData = appData[activeHostIndex];
      hostData.matches.forEach((m, idx) => {{
        const btn = document.createElement("button");
        btn.className = "tab-button" + (idx === activeMatchIndex ? " active" : "");
        btn.onclick = () => selectMatch(idx);
        
        // Scale score to percent (assuming Cosine similarity around 0.5 to 1.0 or just a raw relative score)
        let pct = (m.score * 100).toFixed(1);
        
        btn.innerHTML = `
          Rank ${{m.rank}}: ${{m.name}}
          <span class="match-percentage-badge">${{pct}}%</span>
        `;
        tabs.appendChild(btn);
      }});
    }}

    // Toggle subtabs (Profile vs Tracks) inside cards
    function toggleCardTab(panel, tab) {{
      const profileBtn = document.getElementById(`${{panel}}-subtab-profile`);
      const tracksBtn = document.getElementById(`${{panel}}-subtab-tracks`);
      const profileDiv = document.getElementById(`${{panel}}-profile-details`);
      const tracksDiv = document.getElementById(`${{panel}}-tracks-details`);
      
      if (tab === 'profile') {{
        profileBtn.classList.add('active');
        tracksBtn.classList.remove('active');
        profileDiv.style.display = 'flex';
        tracksDiv.style.display = 'none';
      }} else {{
        profileBtn.classList.remove('active');
        tracksBtn.classList.add('active');
        profileDiv.style.display = 'none';
        tracksDiv.style.display = 'flex';
      }}
    }}

    const personalityTraits = [
      "Openness Coordinate A", "Openness Coordinate B",
      "Conscientiousness Coordinate A", "Conscientiousness Coordinate B",
      "Extraversion Coordinate A", "Extraversion Coordinate B",
      "Agreeableness Coordinate A", "Agreeableness Coordinate B",
      "Neuroticism Coordinate A", "Neuroticism Coordinate B"
    ];

    function renderWorkspace() {{
      const hostData = appData[activeHostIndex];
      const match = hostData.matches[activeMatchIndex];
      
      if (!hostData || !match) return;

      // Reset sub-tabs to Profile by default when loading new host/match
      toggleCardTab('host', 'profile');
      toggleCardTab('match', 'profile');

      // Update Host Panel HTML
      document.getElementById("host-title-name").innerText = hostData.host.name;
      document.getElementById("host-narration").innerText = hostData.host.narration || "No narration profile.";
      document.getElementById("host-gender-tag").className = "gender-badge " + hostData.host.gender;
      document.getElementById("host-gender-tag").innerText = hostData.host.gender;
      
      // Update Match Panel HTML
      document.getElementById("match-title-name").innerText = `Rank ${{match.rank}} Match: ${{match.name}}`;
      document.getElementById("match-narration").innerText = match.narration || "No narration profile.";
      document.getElementById("match-gender-tag").className = "gender-badge " + match.gender;
      document.getElementById("match-gender-tag").innerText = match.gender;

      // Update Interests comparison
      const hostInterests = hostData.host.interests;
      const matchInterests = match.interests;
      
      const hostTagsBox = document.getElementById("host-interests-tags");
      const matchTagsBox = document.getElementById("match-interests-tags");
      hostTagsBox.innerHTML = "";
      matchTagsBox.innerHTML = "";

      // Distinguish common and unique interests
      hostInterests.forEach(interest => {{
        const pill = document.createElement("span");
        if (matchInterests.some(m => m.toLowerCase() === interest.toLowerCase())) {{
          pill.className = "tag-pill shared";
          pill.innerHTML = `★ ${{interest}}`;
        }} else {{
          pill.className = "tag-pill unique";
          pill.innerText = interest;
        }}
        hostTagsBox.appendChild(pill);
      }});

      matchInterests.forEach(interest => {{
        const pill = document.createElement("span");
        if (hostInterests.some(h => h.toLowerCase() === interest.toLowerCase())) {{
          pill.className = "tag-pill shared";
          pill.innerHTML = `★ ${{interest}}`;
        }} else {{
          pill.className = "tag-pill unique";
          pill.innerText = interest;
        }}
        matchTagsBox.appendChild(pill);
      }});

      // Personality Bars Comparison
      const hostChart = document.getElementById("host-personality-chart");
      const matchChart = document.getElementById("match-personality-chart");
      hostChart.innerHTML = "";
      matchChart.innerHTML = "";

      personalityTraits.forEach((trait, i) => {{
        const hostVal = hostData.host.personality[i] || 0;
        const matchVal = match.personality[i] || 0;

        // Render Host Row
        hostChart.appendChild(createChartRow(trait, hostVal, true));
        // Render Match Row
        matchChart.appendChild(createChartRow(trait, matchVal, false));
      }});

      // Render Host Tracks list
      const hostTracks = hostData.host.tracks || [];
      const matchTracks = match.tracks || [];
      const hostTracksBox = document.getElementById("host-tracks-list");
      const matchTracksBox = document.getElementById("match-tracks-list");
      hostTracksBox.innerHTML = "";
      matchTracksBox.innerHTML = "";

      if (hostTracks.length === 0) {{
        hostTracksBox.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 2rem;">No recently played tracks.</div>`;
      }} else {{
        hostTracks.forEach(track => {{
          const isSharedTrack = matchTracks.some(mt => 
            mt.track_name.toLowerCase() === track.track_name.toLowerCase() && 
            mt.track_artist.toLowerCase() === track.track_artist.toLowerCase()
          );
          const isSharedArtist = matchTracks.some(mt => 
            mt.track_artist.toLowerCase() === track.track_artist.toLowerCase()
          );
          hostTracksBox.appendChild(createTrackItem(track, isSharedTrack, isSharedArtist));
        }});
      }}

      if (matchTracks.length === 0) {{
        matchTracksBox.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 2rem;">No recently played tracks.</div>`;
      }} else {{
        matchTracks.forEach(track => {{
          const isSharedTrack = hostTracks.some(ht => 
            ht.track_name.toLowerCase() === track.track_name.toLowerCase() && 
            ht.track_artist.toLowerCase() === track.track_artist.toLowerCase()
          );
          const isSharedArtist = hostTracks.some(ht => 
            ht.track_artist.toLowerCase() === track.track_artist.toLowerCase()
          );
          matchTracksBox.appendChild(createTrackItem(track, isSharedTrack, isSharedArtist));
        }});
      }}

      // Affinity Circle
      const affinityScore = match.score;
      const displayScore = (affinityScore * 100).toFixed(2);
      document.getElementById("affinity-score-percent").innerText = displayScore;
      
      // Update circular chart stroke dasharray
      const circleStroke = document.getElementById("score-circle-stroke");
      const clampedScore = Math.max(0, Math.min(1, affinityScore));
      circleStroke.setAttribute("stroke-dasharray", `${{(clampedScore * 100).toFixed(0)}}, 100`);

      // Match explanation text based on vectors
      let matchExpt = `DBSF query resolved an affinity of ${{displayScore}}% for ${{match.name}} to match ${{hostData.host.name}}. `;
      
      // Find mutual interests count
      const mutuals = hostInterests.filter(h => matchInterests.some(m => m.toLowerCase() === h.toLowerCase()));
      if (mutuals.length > 0) {{
        matchExpt += `They share ${{mutuals.length}} interest(s), including: ${{mutuals.slice(0, 3).join(", ")}}. `;
      }} else {{
        matchExpt += `While they don't share identical interest tags, their interest topics have high semantic alignment in the vector space. `;
      }}
      
      // Check shared tracks/artists
      const sharedTracksCount = hostTracks.filter(ht => 
        matchTracks.some(mt => mt.track_name.toLowerCase() === ht.track_name.toLowerCase() && mt.track_artist.toLowerCase() === ht.track_artist.toLowerCase())
      ).length;
      const hostArtists = [...new Set(hostTracks.map(t => t.track_artist.toLowerCase()))];
      const matchArtists = [...new Set(matchTracks.map(t => t.track_artist.toLowerCase()))];
      const sharedArtistsCount = hostArtists.filter(a => matchArtists.includes(a)).length;

      if (sharedTracksCount > 0) {{
        matchExpt += `Acoustically, they share ${{sharedTracksCount}} identical track(s) in their play histories. `;
      }} else if (sharedArtistsCount > 0) {{
        matchExpt += `Acoustically, they listen to ${{sharedArtistsCount}} of the same artist(s). `;
      }}
      
      // Check personality distance
      let personalityDiffSum = 0;
      for (let i = 0; i < 10; i++) {{
        personalityDiffSum += Math.abs((hostData.host.personality[i] || 0) - (match.personality[i] || 0));
      }}
      const avgPersonalityDiff = personalityDiffSum / 10;
      if (avgPersonalityDiff < 0.3) {{
        matchExpt += `Psychometrically, their personality coordinate systems map closely, indicating highly aligned behavioral traits (average distance: ${{avgPersonalityDiff.toFixed(2)}}).`;
      }} else if (avgPersonalityDiff > 0.7) {{
        matchExpt += `Their personality profiles show complementary oppositions, adding dynamic contrast and balance (average distance: ${{avgPersonalityDiff.toFixed(2)}}).`;
      }} else {{
        matchExpt += `Their personality profiles display balanced traits with complementary overlaps (average distance: ${{avgPersonalityDiff.toFixed(2)}}).`;
      }}

      document.getElementById("affinity-explanation").innerText = matchExpt;
    }}

    function createTrackItem(track, isSharedTrack, isSharedArtist) {{
      const item = document.createElement("div");
      
      let badgeHtml = "";
      let sharedClass = "";
      
      if (isSharedTrack) {{
        sharedClass = " shared-track";
        badgeHtml = `<span class="shared-badge track">★ Shared Track</span>`;
      }} else if (isSharedArtist) {{
        sharedClass = " shared-artist";
        badgeHtml = `<span class="shared-badge artist">Shared Artist</span>`;
      }}

      item.className = "track-item" + sharedClass;

      const tagsHtml = (track.tags || []).slice(0, 3).map(tag => 
        `<span class="track-tag-pill">${{tag}}</span>`
      ).join('');

      item.innerHTML = `
        <div class="track-main-info">
          <div>
            <div class="track-title">${{track.track_name}}</div>
            <div class="track-artist">${{track.track_artist}}</div>
          </div>
          ${{badgeHtml}}
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.15rem;">
          <div class="track-album">${{track.track_album_name || ""}}</div>
          <div class="track-tags">${{tagsHtml}}</div>
        </div>
      `;
      
      return item;
    }}

    function createChartRow(traitName, value, isHost) {{
      const row = document.createElement("div");
      row.className = "chart-row";
      
      const percentValue = value * 50; // range: -50 to 50
      
      let left = "50%";
      let width = "0%";
      
      if (percentValue >= 0) {{
        width = `${{percentValue}}%`;
        left = "50%";
      }} else {{
        width = `${{Math.abs(percentValue)}}%`;
        left = `${{50 - Math.abs(percentValue)}}%`;
      }}

      row.innerHTML = `
        <div class="row-meta">
          <span>${{traitName}}</span>
          <span style="font-family: monospace; color: ${{isHost ? 'var(--accent-purple)' : 'var(--accent-cyan)'}}">
            ${{value >= 0 ? '+' : ''}}${{value.toFixed(4)}}
          </span>
        </div>
        <div class="bar-wrapper">
          <div class="bar-center-line"></div>
          <div class="bar-fill ${{isHost ? 'host-fill' : 'match-fill'}}" style="left: ${{left}}; width: ${{width}}"></div>
        </div>
      `;
      
      return row;
    }}

    // Start Visualizer
    window.onload = init;
  </script>
</body>
</html>
"""
    # Write visualizer to tests/match_visualizer.html
    html_path = os.path.join(base_dir, "match_visualizer.html")
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    
    print(f"\nSuccessfully generated interactive comparison visualizer at:\n{html_path}")

if __name__ == "__main__":
    main()
