/**
 * Map / Globe Data Model — Legion Realm
 * =========================================
 * All data is privacy-safe — city/region/country level only.
 * No exact addresses, IPs, personal data, or individual sessions.
 * 
 * Field Reference:
 *   type       — traffic | artist | partner | submission | event | resource | campaign
 *   label      — human-readable name
 *   category   — sub-type for filtering: community | music | fabrication | art | print | media | merch
 *   city       — city name
 *   region     — state/province/region
 *   country    — ISO country code (US, CA, GB, etc.)
 *   latitude   — approximate (city center)
 *   longitude  — approximate (city center)
 *   count      — aggregated count (visits, artists, items, etc.)
 *   source     — for traffic points: referrer or UTM source
 *   medium     — for traffic points: UTM medium
 *   campaign   — for traffic/campaign points: UTM campaign
 *   url        — optional link
 *   timestamp  — ISO date for the most recent data point
 */
window.mapData = {
  "updated": "2026-06-20T00:00:00Z",
  "points": [
    // ── ARTIST LOCATIONS ────────────────────────────────────
    {
      "type": "artist",
      "label": "Somethin Outta Nothin (S.O.N)",
      "category": "music",
      "city": "Cleveland",
      "region": "Ohio",
      "country": "US",
      "latitude": 41.4993,
      "longitude": -81.6944,
      "count": 1,
      "url": "son.html",
      "timestamp": "2026-06-01T00:00:00Z"
    },
    {
      "type": "artist",
      "label": "Keagan Grimm",
      "category": "music",
      "city": "Youngstown",
      "region": "Ohio",
      "country": "US",
      "latitude": 41.0998,
      "longitude": -80.6495,
      "count": 1,
      "url": "nightowlprints.html",
      "timestamp": "2026-06-01T00:00:00Z"
    },
    {
      "type": "artist",
      "label": "Night Owl Prints",
      "category": "print",
      "city": "Youngstown",
      "region": "Ohio",
      "country": "US",
      "latitude": 41.0998,
      "longitude": -80.6495,
      "count": 1,
      "url": "nightowlprints.html",
      "timestamp": "2026-06-01T00:00:00Z"
    },
    {
      "type": "artist",
      "label": "Philbrix Studioz (Gravity Bleeds)",
      "category": "art",
      "city": "Columbus",
      "region": "Ohio",
      "country": "US",
      "latitude": 39.9612,
      "longitude": -82.9988,
      "count": 1,
      "url": "studio.html",
      "timestamp": "2026-06-01T00:00:00Z"
    },

    // ── PARTNER LOCATIONS ───────────────────────────────────
    {
      "type": "partner",
      "label": "Cult Divinity (Luna Serafina & Krystalyn Deneve)",
      "category": "fabrication",
      "city": "Detroit",
      "region": "Michigan",
      "country": "US",
      "latitude": 42.3314,
      "longitude": -83.0458,
      "count": 1,
      "url": "divinity.html",
      "timestamp": "2026-06-01T00:00:00Z"
    },
    {
      "type": "partner",
      "label": "Do It For The Underground (Robbie Pankow)",
      "category": "media",
      "city": "Toledo",
      "region": "Ohio",
      "country": "US",
      "latitude": 41.6528,
      "longitude": -83.5379,
      "count": 1,
      "url": "underground.html",
      "timestamp": "2026-06-01T00:00:00Z"
    },

    // ── EXAMPLE TRAFFIC (privacy-safe, city-level aggregated) ─
    {
      "type": "traffic",
      "label": "Detroit, Michigan",
      "category": "community",
      "city": "Detroit",
      "region": "Michigan",
      "country": "US",
      "latitude": 42.3314,
      "longitude": -83.0458,
      "count": 52,
      "source": "discord",
      "medium": "social",
      "campaign": "server_invite",
      "timestamp": "2026-06-15T00:00:00Z"
    },
    {
      "type": "traffic",
      "label": "Cleveland, Ohio",
      "category": "community",
      "city": "Cleveland",
      "region": "Ohio",
      "country": "US",
      "latitude": 41.4993,
      "longitude": -81.6944,
      "count": 38,
      "source": "instagram",
      "medium": "social",
      "campaign": "bio_link",
      "timestamp": "2026-06-15T00:00:00Z"
    },
    {
      "type": "traffic",
      "label": "Chicago, Illinois",
      "category": "community",
      "city": "Chicago",
      "region": "Illinois",
      "country": "US",
      "latitude": 41.8781,
      "longitude": -87.6298,
      "count": 27,
      "source": "youtube",
      "medium": "video",
      "campaign": "video_description",
      "timestamp": "2026-06-15T00:00:00Z"
    },
    {
      "type": "traffic",
      "label": "Columbus, Ohio",
      "category": "community",
      "city": "Columbus",
      "region": "Ohio",
      "country": "US",
      "latitude": 39.9612,
      "longitude": -82.9988,
      "count": 24,
      "source": "facebook",
      "medium": "social",
      "campaign": "group_post",
      "timestamp": "2026-06-15T00:00:00Z"
    },
    {
      "type": "traffic",
      "label": "New York, New York",
      "category": "community",
      "city": "New York",
      "region": "New York",
      "country": "US",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "count": 19,
      "source": "reddit",
      "medium": "social",
      "campaign": "subreddit_post",
      "timestamp": "2026-06-15T00:00:00Z"
    },
    {
      "type": "traffic",
      "label": "Los Angeles, California",
      "category": "community",
      "city": "Los Angeles",
      "region": "California",
      "country": "US",
      "latitude": 34.0522,
      "longitude": -118.2437,
      "count": 16,
      "source": "tiktok",
      "medium": "social",
      "campaign": "profile_bio",
      "timestamp": "2026-06-15T00:00:00Z"
    },
    {
      "type": "traffic",
      "label": "Toronto, Ontario",
      "category": "community",
      "city": "Toronto",
      "region": "Ontario",
      "country": "CA",
      "latitude": 43.6532,
      "longitude": -79.3832,
      "count": 14,
      "source": "discord",
      "medium": "social",
      "campaign": "server_invite",
      "timestamp": "2026-06-15T00:00:00Z"
    },
    {
      "type": "traffic",
      "label": "London, England",
      "category": "community",
      "city": "London",
      "region": "England",
      "country": "GB",
      "latitude": 51.5074,
      "longitude": -0.1278,
      "count": 11,
      "source": "youtube",
      "medium": "video",
      "campaign": "video_description",
      "timestamp": "2026-06-15T00:00:00Z"
    },
    {
      "type": "traffic",
      "label": "Pittsburgh, Pennsylvania",
      "category": "community",
      "city": "Pittsburgh",
      "region": "Pennsylvania",
      "country": "US",
      "latitude": 40.4406,
      "longitude": -79.9959,
      "count": 10,
      "source": "direct",
      "medium": "none",
      "campaign": "",
      "timestamp": "2026-06-15T00:00:00Z"
    },
    {
      "type": "traffic",
      "label": "Akron, Ohio",
      "category": "community",
      "city": "Akron",
      "region": "Ohio",
      "country": "US",
      "latitude": 41.0814,
      "longitude": -81.5190,
      "count": 9,
      "source": "facebook",
      "medium": "social",
      "campaign": "group_post",
      "timestamp": "2026-06-15T00:00:00Z"
    },
    {
      "type": "traffic",
      "label": "Dallas, Texas",
      "category": "community",
      "city": "Dallas",
      "region": "Texas",
      "country": "US",
      "latitude": 32.7767,
      "longitude": -96.7970,
      "count": 8,
      "source": "spotify",
      "medium": "music",
      "campaign": "artist_profile",
      "timestamp": "2026-06-15T00:00:00Z"
    },
    {
      "type": "traffic",
      "label": "Atlanta, Georgia",
      "category": "community",
      "city": "Atlanta",
      "region": "Georgia",
      "country": "US",
      "latitude": 33.7490,
      "longitude": -84.3880,
      "count": 7,
      "source": "direct",
      "medium": "none",
      "campaign": "",
      "timestamp": "2026-06-15T00:00:00Z"
    },

    // ── EXAMPLE EVENTS ───────────────────────────────────────
    {
      "type": "event",
      "label": "Horrorcore Gathering",
      "category": "community",
      "city": "Cleveland",
      "region": "Ohio",
      "country": "US",
      "latitude": 41.4993,
      "longitude": -81.6944,
      "count": 120,
      "url": "",
      "timestamp": "2026-10-31T00:00:00Z"
    },

    // ── EXAMPLE RESOURCES ────────────────────────────────────
    {
      "type": "resource",
      "label": "Custom 3D Fabrication Hub",
      "category": "fabrication",
      "city": "Detroit",
      "region": "Michigan",
      "country": "US",
      "latitude": 42.3314,
      "longitude": -83.0458,
      "count": 1,
      "url": "divinity.html",
      "timestamp": "2026-06-01T00:00:00Z"
    },
    {
      "type": "resource",
      "label": "Latex Mask Studio",
      "category": "art",
      "city": "Columbus",
      "region": "Ohio",
      "country": "US",
      "latitude": 39.9612,
      "longitude": -82.9988,
      "count": 1,
      "url": "studio.html",
      "timestamp": "2026-06-01T00:00:00Z"
    },
    {
      "type": "resource",
      "label": "Custom Apparel Printing",
      "category": "print",
      "city": "Youngstown",
      "region": "Ohio",
      "country": "US",
      "latitude": 41.0998,
      "longitude": -80.6495,
      "count": 1,
      "url": "nightowlprints.html",
      "timestamp": "2026-06-01T00:00:00Z"
    },

    // ── CAMPAIGN ACTIVITY FROM UTM LINKS ─────────────────────
    {
      "type": "campaign",
      "label": "Discord Server Invite",
      "category": "community",
      "city": "Detroit",
      "region": "Michigan",
      "country": "US",
      "latitude": 42.3314,
      "longitude": -83.0458,
      "count": 18,
      "source": "discord",
      "medium": "social",
      "campaign": "server_invite",
      "timestamp": "2026-06-15T00:00:00Z"
    },
    {
      "type": "campaign",
      "label": "Instagram Bio Link",
      "category": "community",
      "city": "Cleveland",
      "region": "Ohio",
      "country": "US",
      "latitude": 41.4993,
      "longitude": -81.6944,
      "count": 14,
      "source": "instagram",
      "medium": "social",
      "campaign": "bio_link",
      "timestamp": "2026-06-15T00:00:00Z"
    },
    {
      "type": "campaign",
      "label": "YouTube Video Description",
      "category": "community",
      "city": "Chicago",
      "region": "Illinois",
      "country": "US",
      "latitude": 41.8781,
      "longitude": -87.6298,
      "count": 12,
      "source": "youtube",
      "medium": "video",
      "campaign": "video_description",
      "timestamp": "2026-06-15T00:00:00Z"
    }
  ],

  // ── CATEGORY COLOR MAP ─────────────────────────────────────
  "categoryColors": {
    "community": "#c9a84c",
    "music": "#e74c3c",
    "fabrication": "#3498db",
    "art": "#9b59b6",
    "print": "#2ecc71",
    "media": "#e67e22",
    "merch": "#1abc9c"
  }
};