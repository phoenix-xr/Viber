import os
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_PATH = os.path.join(BASE_DIR, "dummy_users.json")
HTML_PATH = os.path.join(BASE_DIR, "dummy_users_visualizer.html")

HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Viber - Dummy Users Visualizer</title>
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  
  <style>
    :root {
      --bg-primary: #0a0d16;
      --bg-secondary: #0f1424;
      --bg-card: rgba(20, 26, 46, 0.6);
      --bg-card-hover: rgba(30, 39, 69, 0.85);
      --border-color: rgba(255, 255, 255, 0.06);
      --border-hover: rgba(139, 92, 246, 0.35);
      --border-active: #8b5cf6;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --accent-purple: #8b5cf6;
      --accent-indigo: #6366f1;
      --accent-cyan: #06b6d4;
      --accent-pink: #ec4899;
      --accent-green: #10b981;
      --accent-red: #ef4444;
      
      --gradient-primary: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      --glow-purple: 0 0 20px rgba(139, 92, 246, 0.25);
      --glow-cyan: 0 0 20px rgba(6, 182, 212, 0.25);
      --shadow-main: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    }

    html, body {
      height: 100vh;
      overflow: hidden;
      margin: 0;
      padding: 0;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      scrollbar-width: thin;
      scrollbar-color: rgba(255, 255, 255, 0.12) rgba(255, 255, 255, 0.02);
    }

    body {
      font-family: 'Plus Jakarta Sans', 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: var(--bg-primary);
      background-image: 
        radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.12) 0px, transparent 40%),
        radial-gradient(at 100% 0%, rgba(139, 92, 246, 0.12) 0px, transparent 40%),
        radial-gradient(at 50% 100%, rgba(6, 182, 212, 0.08) 0px, transparent 50%);
      color: var(--text-main);
      display: flex;
      flex-direction: column;
    }

    /* Layout */
    header {
      background: rgba(10, 13, 22, 0.8);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-color);
      padding: 1.25rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 10;
      flex-shrink: 0;
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .logo-badge {
      background: var(--gradient-primary);
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1.2rem;
      letter-spacing: -1px;
      box-shadow: var(--glow-purple);
    }

    .logo-text {
      font-family: 'Outfit', sans-serif;
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: -0.5px;
      background: linear-gradient(to right, #ffffff, #94a3b8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .header-stats {
      display: flex;
      gap: 1.5rem;
    }

    .stat-pill {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-color);
      padding: 0.5rem 1rem;
      border-radius: 50px;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .stat-pill strong {
      color: var(--accent-purple);
    }

    .main-container {
      display: flex;
      flex: 1;
      min-height: 0;
      overflow: hidden;
    }

    /* Sidebar */
    .sidebar {
      width: 380px;
      background: rgba(10, 13, 22, 0.4);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      overflow: hidden;
    }

    .sidebar-search-container {
      padding: 1.5rem;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .search-wrapper {
      position: relative;
    }

    .search-input {
      width: 100%;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border-color);
      border-radius: 0.75rem;
      padding: 0.75rem 1rem;
      color: var(--text-main);
      font-family: inherit;
      font-size: 0.9rem;
      outline: none;
      transition: all 0.25s ease;
    }

    .search-input:focus {
      border-color: var(--accent-purple);
      box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.15);
      background: rgba(255, 255, 255, 0.07);
    }

    .btn-dashboard {
      width: 100%;
      background: rgba(139, 92, 246, 0.1);
      border: 1px solid rgba(139, 92, 246, 0.25);
      border-radius: 0.75rem;
      padding: 0.75rem;
      color: var(--accent-purple);
      font-family: inherit;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 0.25s ease;
    }

    .btn-dashboard:hover, .btn-dashboard.active {
      background: var(--gradient-primary);
      color: white;
      border-color: transparent;
      box-shadow: var(--glow-purple);
    }

    .user-list {
      flex: 1;
      overflow-y: auto;
      padding: 1rem 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    /* Webkit Scrollbars */
    ::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }
    ::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.02);
      border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.12);
      border-radius: 10px;
      border: 2px solid transparent;
      background-clip: padding-box;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: rgba(139, 92, 246, 0.5);
      border: 2px solid transparent;
      background-clip: padding-box;
    }

    .user-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 0.75rem;
      padding: 1rem;
      cursor: pointer;
      transition: all 0.25s ease;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .user-card:hover {
      background: var(--bg-card-hover);
      border-color: var(--border-hover);
      transform: translateY(-2px);
    }

    .user-card.active {
      background: rgba(139, 92, 246, 0.08);
      border-color: var(--border-active);
      box-shadow: 0 0 15px rgba(139, 92, 246, 0.1);
    }

    .user-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .user-card-name {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-main);
    }

    .user-card-gender {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.15rem 0.5rem;
      border-radius: 50px;
      text-transform: uppercase;
    }

    .gender-male {
      background: rgba(6, 182, 212, 0.15);
      color: var(--accent-cyan);
    }

    .gender-female {
      background: rgba(236, 72, 153, 0.15);
      color: var(--accent-pink);
    }

    .user-card-interests {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
    }

    .user-card-interest-tag {
      font-size: 0.7rem;
      color: var(--text-muted);
      background: rgba(255, 255, 255, 0.02);
      padding: 0.1rem 0.35rem;
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.04);
    }

    /* Content Area */
    .content-area {
      flex: 1;
      overflow-y: auto;
      background: rgba(10, 13, 22, 0.1);
      display: flex;
      flex-direction: column;
    }

    .dashboard-view, .detail-view {
      padding: 2rem;
      max-width: 1100px;
      width: 100%;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 2rem;
      animation: fadeIn 0.4s ease forwards;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Dashboard UI Elements */
    .kpi-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.5rem;
    }

    .kpi-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 1rem;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      position: relative;
      overflow: hidden;
      box-shadow: var(--shadow-main);
    }

    .kpi-card.cyan::before { background: var(--accent-cyan); }
    .kpi-card.pink::before { background: var(--accent-pink); }
    .kpi-card.green::before { background: var(--accent-green); }

    .kpi-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: var(--accent-purple);
    }

    .kpi-title {
      font-size: 0.85rem;
      color: var(--text-muted);
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .kpi-value {
      font-size: 2.25rem;
      font-weight: 800;
      color: var(--text-main);
      font-family: 'Outfit', sans-serif;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(480px, 1fr));
      gap: 1.5rem;
    }

    .chart-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 1rem;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      box-shadow: var(--shadow-main);
    }

    .card-title {
      font-size: 1.1rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 0.75rem;
    }

    .card-title span {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-weight: 400;
    }

    .rank-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .rank-item {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .rank-name {
      width: 150px;
      font-size: 0.85rem;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .rank-bar-bg {
      flex: 1;
      height: 0.75rem;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .rank-bar-fill {
      height: 100%;
      background: var(--gradient-primary);
      border-radius: 10px;
      transition: width 1s ease-in-out;
    }

    .rank-val {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--accent-cyan);
      width: 30px;
      text-align: right;
    }

    /* Detail View UI Elements */
    .profile-header {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 1rem;
      padding: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      box-shadow: var(--shadow-main);
    }

    .profile-info {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .profile-name {
      font-size: 2rem;
      font-weight: 800;
      font-family: 'Outfit', sans-serif;
    }

    .profile-badges {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    .badge {
      font-size: 0.8rem;
      font-weight: 600;
      padding: 0.25rem 0.75rem;
      border-radius: 50px;
    }

    .badge-purple {
      background: rgba(139, 92, 246, 0.15);
      color: #a78bfa;
      border: 1px solid rgba(139, 92, 246, 0.3);
    }

    .gender-male {
      background: rgba(6, 182, 212, 0.15);
      color: var(--accent-cyan);
    }

    .gender-female {
      background: rgba(236, 72, 153, 0.15);
      color: var(--accent-pink);
    }

    .narration-box {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%);
      border: 1px solid rgba(139, 92, 246, 0.25);
      border-radius: 1rem;
      padding: 2rem;
      position: relative;
      box-shadow: var(--shadow-main), var(--glow-purple);
    }

    .narration-box::before {
      content: '“';
      position: absolute;
      top: -0.5rem;
      left: 1.5rem;
      font-size: 5rem;
      font-family: Georgia, serif;
      color: rgba(139, 92, 246, 0.25);
      line-height: 1;
    }

    .narration-title {
      font-size: 0.75rem;
      text-transform: uppercase;
      font-weight: 800;
      letter-spacing: 1.5px;
      color: var(--accent-purple);
      margin-bottom: 0.75rem;
    }

    .narration-text {
      font-size: 1.1rem;
      line-height: 1.7;
      color: var(--text-main);
      font-style: italic;
      position: relative;
      z-index: 1;
      font-weight: 500;
    }

    .profile-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    @media (max-width: 900px) {
      .profile-grid {
        grid-template-columns: 1fr;
      }
    }

    .detail-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 1rem;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      box-shadow: var(--shadow-main);
    }

    .interests-container {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
    }

    .interest-pill {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-color);
      padding: 0.4rem 0.9rem;
      border-radius: 50px;
      font-size: 0.85rem;
      font-weight: 500;
      transition: all 0.25s ease;
    }

    .interest-pill:hover {
      background: rgba(139, 92, 246, 0.1);
      border-color: var(--accent-purple);
      color: white;
      transform: translateY(-1px);
    }

    /* Personality Visualizer */
    .personality-sliders {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .slider-container {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .slider-header {
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .slider-title {
      color: var(--text-main);
    }

    .slider-value {
      color: var(--accent-cyan);
      font-family: monospace;
    }

    .custom-slider-bg {
      position: relative;
      height: 0.6rem;
      background: rgba(255, 255, 255, 0.04);
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.06);
    }

    .custom-slider-mid {
      position: absolute;
      left: 50%;
      top: 0;
      width: 1px;
      height: 100%;
      background: rgba(255, 255, 255, 0.15);
    }

    .custom-slider-pointer {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 1rem;
      height: 1rem;
      background: var(--gradient-primary);
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 0 8px rgba(139, 92, 246, 0.8);
      transition: left 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .custom-slider-bar {
      position: absolute;
      top: 0;
      height: 100%;
      background: rgba(139, 92, 246, 0.2);
      border-radius: 10px;
      transition: all 0.3s ease;
    }

    .binary-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
    }

    .binary-pill {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--border-color);
      padding: 0.75rem;
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: all 0.25s ease;
    }

    .binary-pill.active {
      background: rgba(16, 185, 129, 0.08);
      border-color: rgba(16, 185, 129, 0.35);
      box-shadow: 0 0 10px rgba(16, 185, 129, 0.05);
    }

    .binary-pill.inactive {
      opacity: 0.65;
    }

    .binary-label {
      font-size: 0.8rem;
      font-weight: 600;
    }

    .binary-pill.active .binary-label {
      color: white;
    }

    .binary-status {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
      text-transform: uppercase;
    }

    .status-on {
      background: rgba(16, 185, 129, 0.2);
      color: #34d399;
    }

    .status-off {
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-muted);
    }

    /* Track List */
    .tracks-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 1rem;
      padding: 1.5rem;
      box-shadow: var(--shadow-main);
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .tracks-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 0.75rem;
    }

    .tracks-title {
      font-size: 1.1rem;
      font-weight: 700;
    }

    .tracks-search {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-color);
      border-radius: 0.5rem;
      padding: 0.4rem 0.75rem;
      color: var(--text-main);
      font-size: 0.8rem;
      outline: none;
      width: 200px;
      transition: all 0.25s ease;
    }

    .tracks-search:focus {
      width: 250px;
      border-color: var(--accent-purple);
      background: rgba(255, 255, 255, 0.06);
    }

    .tracks-table-container {
      max-height: 500px;
      overflow-y: auto;
      border-radius: 0.5rem;
      border: 1px solid var(--border-color);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    th {
      background: rgba(15, 20, 36, 0.95);
      padding: 0.75rem 1rem;
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      position: sticky;
      top: 0;
      z-index: 2;
      border-bottom: 1px solid var(--border-color);
    }

    td {
      padding: 0.85rem 1rem;
      font-size: 0.85rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.03);
      vertical-align: top;
    }

    tr:hover td {
      background: rgba(255, 255, 255, 0.015);
    }

    .song-name {
      font-weight: 600;
      color: white;
    }

    .song-artist {
      color: var(--text-muted);
      font-size: 0.8rem;
      margin-top: 0.15rem;
    }

    .song-album {
      color: var(--text-muted);
    }

    .song-tags-container {
      display: flex;
      flex-wrap: wrap;
      gap: 0.3rem;
    }

    .song-tag {
      font-size: 0.7rem;
      color: var(--accent-cyan);
      background: rgba(6, 182, 212, 0.08);
      border: 1px solid rgba(6, 182, 212, 0.15);
      padding: 0.1rem 0.4rem;
      border-radius: 4px;
      font-weight: 500;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 5rem 2rem;
      gap: 1rem;
      color: var(--text-muted);
    }

    .empty-icon {
      font-size: 3rem;
      opacity: 0.3;
    }
  </style>
</head>
<body>

  <header>
    <div class="logo-container">
      <div class="logo-badge">V</div>
      <div class="logo-text">Viber Data Hub</div>
    </div>
    
    <div class="header-stats">
      <div class="stat-pill">
        <span>Users Loaded:</span>
        <strong id="header-total-users">0</strong>
      </div>
      <div class="stat-pill">
        <span>Male:</span>
        <strong id="header-male-users" style="color: var(--accent-cyan);">0</strong>
      </div>
      <div class="stat-pill">
        <span>Female:</span>
        <strong id="header-female-users" style="color: var(--accent-pink);">0</strong>
      </div>
    </div>
  </header>

  <div class="main-container">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="sidebar-search-container">
        <div class="search-wrapper">
          <input type="text" id="user-search" class="search-input" placeholder="Search users by name or interests...">
        </div>
        <button id="dashboard-toggle-btn" class="btn-dashboard active">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
          Overview Dashboard
        </button>
      </div>

      <div class="user-list" id="user-list-element">
        <!-- Rendered dynamically -->
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="content-area" id="main-content-element">
      <!-- Swapped dynamically between Dashboard and Detail views -->
    </div>
  </div>

  <script>
    // Embedded JSON data injected by generation script
    const USERS_DATA = __USERS_JSON_INJECTION__;

    // Dimensions labels for the personality array
    const PERSONALITY_LABELS = [
      { name: "Introversion vs Extroversion", desc: "Energy directed inward vs outward", left: "Introverted", right: "Extroverted" },
      { name: "Analytical vs Intuitive", desc: "Rational logic vs gut feeling / emotion", left: "Analytical", right: "Intuitive" },
      { name: "Calm vs Energetic", desc: "Muted, chill pacing vs high BPM / aggression", left: "Chill", right: "Energetic" },
      { name: "Somber vs Vibrant", desc: "Melancholic tones vs happy / dance textures", left: "Somber", right: "Vibrant" }
    ];

    const BINARY_LABELS = [
      "Live Concert Enthusiast",
      "Vinyl Collector",
      "Lyric Focused",
      "Dancefloor Oriented",
      "Discovery Driven",
      "Vibe Curator"
    ];

    // State management
    let activeUserId = null; // null represents Dashboard view
    let userSearchQuery = "";
    let trackSearchQuery = "";

    // DOM Elements
    const userSearchInput = document.getElementById("user-search");
    const dashboardBtn = document.getElementById("dashboard-toggle-btn");
    const userListContainer = document.getElementById("user-list-element");
    const mainContentContainer = document.getElementById("main-content-element");

    // Initialize Header stats
    function initHeaderStats() {
      const total = USERS_DATA.length;
      const male = USERS_DATA.filter(u => u.gender === "male").length;
      const female = USERS_DATA.filter(u => u.gender === "female").length;
      
      document.getElementById("header-total-users").textContent = total;
      document.getElementById("header-male-users").textContent = male;
      document.getElementById("header-female-users").textContent = female;
    }

    // Search and filter users
    function getFilteredUsers() {
      if (!userSearchQuery.trim()) return USERS_DATA;
      
      const q = userSearchQuery.toLowerCase().trim();
      return USERS_DATA.filter(user => {
        const matchesName = user.name.toLowerCase().includes(q);
        const matchesInterests = user.interests.some(interest => interest.toLowerCase().includes(q));
        return matchesName || matchesInterests;
      });
    }

    // Render User List in Sidebar
    function renderUserList() {
      const filtered = getFilteredUsers();
      userListContainer.innerHTML = "";
      
      if (filtered.length === 0) {
        userListContainer.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">🔍</div>
            <p>No users found matching your search.</p>
          </div>
        `;
        return;
      }

      filtered.forEach(user => {
        const isActive = user.id === activeUserId;
        const card = document.createElement("div");
        card.className = `user-card ${isActive ? 'active' : ''}`;
        card.dataset.id = user.id;
        
        const genderClass = user.gender === "male" ? "gender-male" : "gender-female";
        
        card.innerHTML = `
          <div class="user-card-header">
            <span class="user-card-name">${user.name}</span>
            <span class="user-card-gender ${genderClass}">${user.gender}</span>
          </div>
          <div class="user-card-interests">
            ${user.interests.slice(0, 3).map(interest => `<span class="user-card-interest-tag">${interest}</span>`).join('')}
            ${user.interests.length > 3 ? `<span class="user-card-interest-tag">+${user.interests.length - 3}</span>` : ''}
          </div>
        `;
        
        card.addEventListener("click", () => {
          selectUser(user.id);
        });
        
        userListContainer.appendChild(card);
      });
    }

    // Handle User Selection
    function selectUser(id) {
      activeUserId = id;
      trackSearchQuery = ""; // Reset track search on user change
      
      // Update sidebar styling
      dashboardBtn.classList.remove("active");
      document.querySelectorAll(".user-card").forEach(card => {
        if (Number(card.dataset.id) === id) {
          card.classList.add("active");
        } else {
          card.classList.remove("active");
        }
      });
      
      if (id === null) {
        dashboardBtn.classList.add("active");
        renderDashboard();
      } else {
        renderDetailView();
      }
    }

    // Calculate aggregated statistics for Dashboard
    function computeAggregateStats() {
      const stats = {
        totalUsers: USERS_DATA.length,
        maleCount: USERS_DATA.filter(u => u.gender === "male").length,
        femaleCount: USERS_DATA.filter(u => u.gender === "female").length,
        interestFrequencies: {},
        artistFrequencies: {},
        tagFrequencies: {},
        avgPersonality: Array(10).fill(0)
      };

      USERS_DATA.forEach(user => {
        // Interests frequency
        user.interests.forEach(interest => {
          stats.interestFrequencies[interest] = (stats.interestFrequencies[interest] || 0) + 1;
        });

        // Track level stats (artists, tags)
        user.tracks.forEach(track => {
          const artist = track.track_artist;
          stats.artistFrequencies[artist] = (stats.artistFrequencies[artist] || 0) + 1;
          
          if (track.tags && Array.isArray(track.tags)) {
            track.tags.forEach(tag => {
              // Normalize tag string
              const normTag = tag.toLowerCase().trim();
              if (normTag) {
                stats.tagFrequencies[normTag] = (stats.tagFrequencies[normTag] || 0) + 1;
              }
            });
          }
        });

        // Sum personality scores
        user.personality.forEach((val, idx) => {
          stats.avgPersonality[idx] += val;
        });
      });

      // Average the personality scores
      stats.avgPersonality = stats.avgPersonality.map(sum => sum / USERS_DATA.length);

      // Convert frequencies to sorted arrays
      stats.topInterests = Object.entries(stats.interestFrequencies)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
        
      stats.topArtists = Object.entries(stats.artistFrequencies)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

      stats.topTags = Object.entries(stats.tagFrequencies)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

      return stats;
    }

    // Render Overview Dashboard
    function renderDashboard() {
      const stats = computeAggregateStats();
      
      mainContentContainer.innerHTML = `
        <div class="dashboard-view">
          <div>
            <h1 style="font-size: 2rem; font-weight: 800; font-family: 'Outfit'; margin-bottom: 0.5rem;">Overview Dashboard</h1>
            <p style="color: var(--text-muted); font-size: 0.95rem;">Aggregated insights across all ${stats.totalUsers} generated dummy users</p>
          </div>
          
          <div class="kpi-container">
            <div class="kpi-card">
              <span class="kpi-title">Total Profiles</span>
              <span class="kpi-value">${stats.totalUsers}</span>
            </div>
            <div class="kpi-card cyan">
              <span class="kpi-title">Male Profiles</span>
              <span class="kpi-value">${stats.maleCount}</span>
            </div>
            <div class="kpi-card pink">
              <span class="kpi-title">Female Profiles</span>
              <span class="kpi-value">${stats.femaleCount}</span>
            </div>
            <div class="kpi-card green">
              <span class="kpi-title">Unique Interests</span>
              <span class="kpi-value">${Object.keys(stats.interestFrequencies).length}</span>
            </div>
          </div>
          
          <div class="dashboard-grid">
            <!-- Top Interests -->
            <div class="chart-card">
              <h2 class="card-title">Top 10 User Interests <span>Count of occurrences</span></h2>
              <div class="rank-list">
                ${stats.topInterests.map(([name, count]) => {
                  const percentage = (count / stats.totalUsers) * 100;
                  return `
                    <div class="rank-item">
                      <span class="rank-name" title="${name}">${name}</span>
                      <div class="rank-bar-bg">
                        <div class="rank-bar-fill" style="width: ${percentage}%"></div>
                      </div>
                      <span class="rank-val">${count}</span>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Top Artists -->
            <div class="chart-card">
              <h2 class="card-title">Top 10 Sampled Artists <span>Appearances in tracklists</span></h2>
              <div class="rank-list">
                ${stats.topArtists.map(([name, count]) => {
                  // max count for normalization
                  const maxCount = stats.topArtists[0][1];
                  const percentage = (count / maxCount) * 100;
                  return `
                    <div class="rank-item">
                      <span class="rank-name" title="${name}">${name}</span>
                      <div class="rank-bar-bg">
                        <div class="rank-bar-fill" style="width: ${percentage}%; background: linear-gradient(135deg, #06b6d4 0%, #6366f1 100%);"></div>
                      </div>
                      <span class="rank-val">${count}</span>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>

          <div class="dashboard-grid">
            <!-- Top Tags -->
            <div class="chart-card">
              <h2 class="card-title">Top 10 Last.fm Crowd Tags <span>Associated with songs</span></h2>
              <div class="rank-list">
                ${stats.topTags.map(([name, count]) => {
                  const maxCount = stats.topTags[0][1];
                  const percentage = (count / maxCount) * 100;
                  return `
                    <div class="rank-item">
                      <span class="rank-name" style="text-transform: capitalize;" title="${name}">${name}</span>
                      <div class="rank-bar-bg">
                        <div class="rank-bar-fill" style="width: ${percentage}%; background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);"></div>
                      </div>
                      <span class="rank-val">${count}</span>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Average Personality Map -->
            <div class="chart-card">
              <h2 class="card-title">Average Personality Vector <span>Mean dimensions</span></h2>
              <div class="personality-sliders" style="margin-top: 0.5rem;">
                ${PERSONALITY_LABELS.map((item, idx) => {
                  const val = stats.avgPersonality[idx];
                  // Map [-1, 1] to [0%, 100%]
                  const leftPercentage = ((val + 1) / 2) * 100;
                  return `
                    <div class="slider-container">
                      <div class="slider-header">
                        <span class="slider-title" title="${item.desc}">${item.name}</span>
                        <span class="slider-value">${val > 0 ? '+' : ''}${val.toFixed(2)}</span>
                      </div>
                      <div class="custom-slider-bg">
                        <div class="custom-slider-mid"></div>
                        <div class="custom-slider-bar" style="left: ${Math.min(50, leftPercentage)}%; width: ${Math.abs(leftPercentage - 50)}%;"></div>
                        <div class="custom-slider-pointer" style="left: ${leftPercentage}%;"></div>
                      </div>
                      <div style="display: flex; justify-content: space-between; font-size: 0.65rem; color: var(--text-muted); margin-top: 0.15rem;">
                        <span>${item.left}</span>
                        <span>${item.right}</span>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // Render Single User Detail View
    function renderDetailView() {
      const user = USERS_DATA.find(u => u.id === activeUserId);
      if (!user) return;
      
      const genderClass = user.gender === "male" ? "gender-male" : "gender-female";
      
      mainContentContainer.innerHTML = `
        <div class="detail-view">
          <!-- Profile Header -->
          <div class="profile-header">
            <div class="profile-info">
              <span style="color: var(--accent-purple); font-size: 0.75rem; text-transform: uppercase; font-weight: 800; letter-spacing: 1px;">User Profile #${user.id}</span>
              <h1 class="profile-name">${user.name}</h1>
              <div class="profile-badges">
                <span class="badge ${genderClass}">${user.gender}</span>
                <span class="badge badge-purple">${user.tracks.length} Tracks Sampled</span>
              </div>
            </div>
            
            <div style="font-size: 3rem;">
              ${user.gender === "male" ? "👨‍💻" : "👩‍💻"}
            </div>
          </div>
          
          <!-- Narration Box -->
          ${user.narration ? `
            <div class="narration-box">
              <div class="narration-title">AI Taste Narrative Summary</div>
              <p class="narration-text">${user.narration}</p>
            </div>
          ` : `
            <div class="narration-box" style="border-color: var(--accent-red); background: rgba(239, 68, 68, 0.05); box-shadow: none;">
              <div class="narration-title" style="color: var(--accent-red);">Missing Taste Narrative</div>
              <p class="narration-text" style="color: var(--text-muted); font-size: 0.95rem;">No music taste narrative profile has been generated for this user yet.</p>
            </div>
          `}
          
          <div class="profile-grid">
            <!-- Left Card: Interests -->
            <div class="detail-card">
              <h2 class="card-title">Interests & Hobbies <span>Selected from pool</span></h2>
              <div class="interests-container">
                ${user.interests.map(interest => `<span class="interest-pill">${interest}</span>`).join('')}
              </div>
            </div>
            
            <!-- Right Card: Personality Vector -->
            <div class="detail-card">
              <h2 class="card-title">Personality Dimension Vector <span>Hybrid Latent Space (Length 10)</span></h2>
              
              <!-- Continuums (1-4) -->
              <div class="personality-sliders">
                ${PERSONALITY_LABELS.map((item, idx) => {
                  const val = user.personality[idx];
                  const leftPercentage = ((val + 1) / 2) * 100;
                  return `
                    <div class="slider-container">
                      <div class="slider-header">
                        <span class="slider-title" title="${item.desc}">${item.name}</span>
                        <span class="slider-value">${val > 0 ? '+' : ''}${val.toFixed(4)}</span>
                      </div>
                      <div class="custom-slider-bg">
                        <div class="custom-slider-mid"></div>
                        <div class="custom-slider-bar" style="left: ${Math.min(50, leftPercentage)}%; width: ${Math.abs(leftPercentage - 50)}%;"></div>
                        <div class="custom-slider-pointer" style="left: ${leftPercentage}%;"></div>
                      </div>
                      <div style="display: flex; justify-content: space-between; font-size: 0.65rem; color: var(--text-muted); margin-top: 0.15rem;">
                        <span>${item.left}</span>
                        <span>${item.right}</span>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>

              <!-- Binary Values (5-10) -->
              <div style="border-top: 1px solid var(--border-color); padding-top: 1rem; margin-top: 0.5rem;">
                <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 0.75rem;">Behavioral Flags & Taste Curations</span>
                <div class="binary-grid">
                  ${BINARY_LABELS.map((label, index) => {
                    const arrayIdx = index + 4; // Starts from 4th index
                    const val = user.personality[arrayIdx];
                    const isActive = val === 1;
                    return `
                      <div class="binary-pill ${isActive ? 'active' : 'inactive'}">
                        <span class="binary-label">${label}</span>
                        <span class="binary-status ${isActive ? 'status-on' : 'status-off'}">${isActive ? 'On' : 'Off'}</span>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            </div>
          </div>
          
          <!-- Bottom Card: Sampled Tracks Table -->
          <div class="tracks-card">
            <div class="tracks-header">
              <h2 class="tracks-title">Top 30 Sampled Tracks</h2>
              <input type="text" id="track-search-input" class="tracks-search" placeholder="Search tracks or artists..." value="${trackSearchQuery}">
            </div>
            
            <div class="tracks-table-container">
              <table id="tracks-table">
                <thead>
                  <tr>
                    <th style="width: 5%">#</th>
                    <th style="width: 40%">Track & Artist</th>
                    <th style="width: 30%">Album Name</th>
                    <th style="width: 25%">Crowdsourced Tags</th>
                  </tr>
                </thead>
                <tbody id="tracks-table-body">
                  <!-- Rendered dynamically -->
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;

      // Set up track search listener
      const trackSearch = document.getElementById("track-search-input");
      trackSearch.addEventListener("input", (e) => {
        trackSearchQuery = e.target.value;
        filterAndRenderTracks(user);
      });

      filterAndRenderTracks(user);
    }

    // Filter and Render Tracks inside active user view
    function filterAndRenderTracks(user) {
      const body = document.getElementById("tracks-table-body");
      if (!body) return;
      
      const q = trackSearchQuery.toLowerCase().trim();
      const filtered = user.tracks.filter(track => {
        if (!q) return true;
        const matchesName = track.track_name.toLowerCase().includes(q);
        const matchesArtist = track.track_artist.toLowerCase().includes(q);
        const matchesAlbum = track.track_album_name.toLowerCase().includes(q);
        return matchesName || matchesArtist || matchesAlbum;
      });

      body.innerHTML = "";
      
      if (filtered.length === 0) {
        body.innerHTML = `
          <tr>
            <td colspan="4" style="text-align: center; padding: 3rem; color: var(--text-muted);">
              No tracks match the search term.
            </td>
          </tr>
        `;
        return;
      }

      filtered.forEach((track, idx) => {
        const row = document.createElement("tr");
        
        // Tags rendering
        let tagsHtml = `<span style="color: var(--text-muted); font-size: 0.75rem;">None</span>`;
        if (track.tags && Array.isArray(track.tags) && track.tags.length > 0) {
          tagsHtml = `
            <div class="song-tags-container">
              ${track.tags.map(t => `<span class="song-tag">${t}</span>`).join('')}
            </div>
          `;
        }

        row.innerHTML = `
          <td style="color: var(--text-muted); font-weight: 700; padding-top: 1rem;">${idx + 1}</td>
          <td>
            <div class="song-name">${track.track_name}</div>
            <div class="song-artist">${track.track_artist}</div>
          </td>
          <td class="song-album" style="padding-top: 1.1rem;">${track.track_album_name}</td>
          <td style="padding-top: 1rem;">${tagsHtml}</td>
        `;
        body.appendChild(row);
      });
    }

    // Event Listeners
    userSearchInput.addEventListener("input", (e) => {
      userSearchQuery = e.target.value;
      renderUserList();
    });

    dashboardBtn.addEventListener("click", () => {
      selectUser(null);
    });

    // App Initialization
    function init() {
      initHeaderStats();
      renderUserList();
      selectUser(null); // start on dashboard
    }

    window.onload = init;
  </script>
</body>
</html>"""

def run():
    print(f"Reading user data from {JSON_PATH}...")
    if not os.path.exists(JSON_PATH):
        print(f"Error: JSON file not found at {JSON_PATH}")
        return
        
    with open(JSON_PATH, "r", encoding="utf-8") as f:
        # Load and dump to compact string representation for JS injection
        users = json.load(f)
        json_injection = json.dumps(users, ensure_ascii=False)
        
    print("Generating HTML content...")
    # Inject the JSON into the template
    full_html = HTML_TEMPLATE.replace("__USERS_JSON_INJECTION__", json_injection)
    
    print(f"Writing visualizer to {HTML_PATH}...")
    with open(HTML_PATH, "w", encoding="utf-8") as f:
        f.write(full_html)
        
    print(f"Success! Visualizer HTML file generated at: {HTML_PATH}")

if __name__ == "__main__":
    run()
