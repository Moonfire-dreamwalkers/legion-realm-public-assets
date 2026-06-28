import urllib.request
import urllib.parse
import json
import re
import time
import os

# Prioritize independent mirrors that do not share overpass-api.de rate limits
OVERPASS_SERVERS = [
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass.nchc.org.tw/api/interpreter",
    "https://overpass-api.de/api/interpreter",
    "https://lz4.overpass-api.de/api/interpreter",
    "https://z.overpass-api.de/api/interpreter"
]

STATES = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", 
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", 
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", 
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", 
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"
]

def make_query(state_code):
    # Highly optimized state-by-state query to prevent gateway timeouts on wildcard amenity/shop searches
    return f"""[out:json][timeout:90];
    area["ISO3166-2"="US-{state_code}"]->.state;
    (
      // 1. Music / record shops
      node["shop"~"music|record"](area.state);
      way["shop"~"music|record"](area.state);
      
      // 2. Metaphysical / occult / crystal / herbalist / apothecary
      node["shop"~"metaphysical|witchcraft|occult|spells|magic|tarot|pagan|esoteric|new_age|psychic|spiritual|herbalist|crystals|gemstones|apothecary"](area.state);
      way["shop"~"metaphysical|witchcraft|occult|spells|magic|tarot|pagan|esoteric|new_age|psychic|spiritual|herbalist|crystals|gemstones|apothecary"](area.state);
      
      // 3. Horror / oddities / halloween
      node["shop"~"oddities|curiosities|horror|halloween"](area.state);
      way["shop"~"oddities|curiosities|horror|halloween"](area.state);
      
      // 4. Chains (Hot Topic & Spencer's)
      node["name"~"Hot Topic|Spencer's|Spencers|Spencer Gifts",i](area.state);
      way["name"~"Hot Topic|Spencer's|Spencers|Spencer Gifts",i](area.state);
      
      // 5. Alternative / Goth named clothes/gift/boutique shops
      node["shop"~"clothes|gift|variety_store|boutique"]["name"~"goth|gothic|horror|vampire|spooky|occult|witchcraft|oddities|macabre|creepy|metaphysical|wicca|wiccan|tarot|psychic|crystals|apothecary|esoteric|voodoo|halloween|haunted|monster|curiosity|curiosities|oddity|dolls kill|demonia|killstar|disturbia|blackcraft",i](area.state);
      way["shop"~"clothes|gift|variety_store|boutique"]["name"~"goth|gothic|horror|vampire|spooky|occult|witchcraft|oddities|macabre|creepy|metaphysical|wicca|wiccan|tarot|psychic|crystals|apothecary|esoteric|voodoo|halloween|haunted|monster|curiosity|curiosities|oddity|dolls kill|demonia|killstar|disturbia|blackcraft",i](area.state);
      
      // 6. Alternative / Goth named amenities (bars, pubs, nightclubs, cafes)
      node["amenity"~"bar|pub|cafe|nightclub"]["name"~"goth|gothic|horror|vampire|spooky|occult|witchcraft|oddities|macabre|creepy|metaphysical|wicca|wiccan|tarot|psychic|crystals|apothecary|esoteric|voodoo|halloween|haunted|monster|curiosity|curiosities|oddity|dolls kill|demonia|killstar|disturbia|blackcraft",i](area.state);
      way["amenity"~"bar|pub|cafe|nightclub"]["name"~"goth|gothic|horror|vampire|spooky|occult|witchcraft|oddities|macabre|creepy|metaphysical|wicca|wiccan|tarot|psychic|crystals|apothecary|esoteric|voodoo|halloween|haunted|monster|curiosity|curiosities|oddity|dolls kill|demonia|killstar|disturbia|blackcraft",i](area.state);
    );
    out center;"""

def determine_type(name, tags):
    name_lower = name.lower()
    shop = tags.get("shop", "").lower()
    
    # 1. Hot Topic
    if "hot topic" in name_lower or "hottopic" in name_lower:
        return "HOT TOPIC"
        
    # 2. Spencer's
    if "spencer" in name_lower:
        return "SPENCER'S"

    # 3. Horror & Oddities
    if (shop in ["oddities", "curiosities", "horror", "halloween"] or 
        any(x in name_lower for x in ["horror", "monster", "spooky", "creepy", "oddity", "oddities", "curiosities", "vampire", "grave", "crypt", "coffin", "macabre", "halloween", "haunted", "curiosity"])):
        return "HORROR LOCATION"
        
    # 4. Metaphysical & Occult
    if (shop in ["metaphysical", "witchcraft", "occult", "spells", "magic", "tarot", "pagan", "esoteric", "new_age", "psychic", "spiritual", "herbalist", "crystals", "gemstones", "apothecary"] or 
        any(x in name_lower for x in ["occult", "witch", "witchcraft", "pagan", "magic", "esoteric", "tarot", "apothecary", "voodoo", "metaphysical", "psychic", "spiritual", "crystals", "mystical", "wicca", "wiccan", "shaman", "healing", "botanica", "herb", "incense", "gemstone", "alchemy", "goddess", "druid", "spiritist"])):
        return "OCCULT & METAPHYSICAL"
        
    # 5. Music / Records
    if shop in ["music", "record"] or any(x in name_lower for x in ["music", "record", "records", "vinyl", "sound", "cd", "cassette"]):
        return "MUSIC RECORD SHOP"

    # 6. Goth / Alternative Clothing / Novelty
    if (shop == "clothes" or 
        any(x in name_lower for x in ["goth", "gothic", "punk", "alternative", "metal", "rock", "emo", "clothing", "apparel", "dolls kill", "demonia", "killstar", "disturbia", "blackcraft"])):
        return "GOTHIC PARLOR"

    return "STORE LOCATION"

def fetch_state_raw(state_code):
    query = make_query(state_code)
    data = query.encode('utf-8')
    
    server_idx = 0
    max_retries = 3
    
    while server_idx < len(OVERPASS_SERVERS):
        url = OVERPASS_SERVERS[server_idx]
        for retry in range(1, max_retries + 1):
            print(f"[{state_code}] Requesting from {url} (Attempt {retry}/{max_retries})...")
            # CONTACT_EMAIL env var with fallback to public site contact
            contact = os.environ.get('CONTACT_EMAIL', 'Legiontv.info@gmail.com')
            req = urllib.request.Request(
                url,
                data=data,
                headers={'User-Agent': f'LegionRealmStoreSearchFetcher/2.0 ({contact})'}
            )
            try:
                # Optimized query timeout to 60s
                with urllib.request.urlopen(req, timeout=60) as response:
                    content = response.read().decode('utf-8')
                    res_json = json.loads(content)
                    elements = res_json.get("elements", [])
                    print(f"[{state_code}] Success! Fetched {len(elements)} elements.")
                    return elements
            except urllib.error.HTTPError as e:
                print(f"[{state_code}] HTTP Error {e.code}: {e.reason}")
                if e.code == 429:
                    sleep_time = 5 * retry
                    print(f"[{state_code}] Rate limited. Sleeping for {sleep_time} seconds before retry...")
                    time.sleep(sleep_time)
                else:
                    time.sleep(2)
            except Exception as e:
                print(f"[{state_code}] Connection error: {e}")
                time.sleep(2)
        
        # Try next server if this one failed completely
        print(f"[{state_code}] Server {url} failed. Trying next mirror...")
        server_idx += 1
        time.sleep(2)
        
    print(f"[{state_code}] All servers failed.")
    return None

def process_elements(elements, state_code):
    processed = []
    seen_keys = set()
    
    for el in elements:
        tags = el.get("tags", {})
        name = tags.get("name")
        if not name:
            continue
            
        lat = el.get("lat")
        lon = el.get("lon")
        if not lat or not lon:
            center = el.get("center", {})
            lat = center.get("lat")
            lon = center.get("lng") or center.get("lon")
            
        if not lat or not lon:
            continue
            
        dup_key = (name.lower(), round(lat, 3), round(lon, 3))
        if dup_key in seen_keys:
            continue
        seen_keys.add(dup_key)
        
        housenumber = tags.get("addr:housenumber", "").strip()
        street = tags.get("addr:street", "").strip()
        city = tags.get("addr:city", "").strip()
        state = tags.get("addr:state", "").strip() or state_code
        postcode = tags.get("addr:postcode", "").strip()
        
        if not name or not (city or street or postcode):
            continue
            
        addr_parts = []
        if housenumber and street:
            addr_parts.append(f"{housenumber} {street}".strip())
        elif street:
            addr_parts.append(street.strip())
            
        if city:
            addr_parts.append(city.strip())
            
        state_zip = []
        if state:
            state_zip.append(state.strip())
        if postcode:
            state_zip.append(postcode.strip())
            
        if state_zip:
            addr_parts.append(" ".join(state_zip).strip())
            
        address = ", ".join(addr_parts)
        if not address:
            address = f"{lat:.4f}, {lon:.4f}"
        
        url = tags.get("website") or tags.get("contact:website") or tags.get("facebook") or tags.get("contact:facebook")
        if not url:
            url = f"https://www.google.com/search?q={urllib.parse.quote(name + ' ' + (city or ''))}"
        elif not url.startswith("http"):
            url = "https://" + url

        description = tags.get("description") or tags.get("note") or ""
        description = description.strip()

        kicker = determine_type(name, tags)
        
        processed.append({
            "name": name,
            "address": address,
            "zip": postcode,
            "coords": [float(lat), float(lon)],
            "kicker": kicker,
            "description": description,
            "url": url
        })
        
    return processed

def main():
    start_time = time.time()
    
    data_dir = r"c:\Users\lunas\Documents\Something Outta Nothing\src\data"
    progress_path = os.path.join(data_dir, "fetch_state_progress.json")
    stores_path = os.path.join(data_dir, "stores.json")
    curated_path = os.path.join(data_dir, "curated_stores.json")
    
    # Load progress cache if available
    progress = {"completed_states": [], "stores": {}}
    if os.path.exists(progress_path):
        try:
            with open(progress_path, "r", encoding="utf-8") as f:
                progress = json.load(f)
            print(f"Loaded progress from cache. {len(progress['completed_states'])} states completed.")
        except Exception as e:
            print(f"Error loading progress cache: {e}")
            
    # Crawl each state systematically
    for state in STATES:
        if state in progress["completed_states"]:
            print(f"[{state}] Already completed. Skipping.")
            continue
            
        print(f"[{state}] Starting query...")
        elements = fetch_state_raw(state)
        
        if elements is not None:
            processed_stores = process_elements(elements, state)
            progress["stores"][state] = processed_stores
            progress["completed_states"].append(state)
            
            # Save progress immediately
            try:
                with open(progress_path, "w", encoding="utf-8") as f:
                    json.dump(progress, f, indent=2, ensure_ascii=False)
            except Exception as e:
                print(f"Error saving progress cache: {e}")
                
            print(f"[{state}] Saved {len(processed_stores)} processed stores to progress cache.")
        else:
            print(f"[{state}] FAILED. Will retry next run.")
            
        # Polite pause between state queries
        time.sleep(2)
        
    # Compile everything
    all_compiled = []
    for state_code, state_stores in progress["stores"].items():
        all_compiled.extend(state_stores)
        
    print(f"Compiled {len(all_compiled)} stores from state progress cache.")
    
    # Load existing stores from src/data/stores.json (to preserve legacy manual entries)
    existing_stores = []
    if os.path.exists(stores_path):
        try:
            with open(stores_path, "r", encoding="utf-8") as f:
                existing_stores = json.load(f)
            print(f"Loaded {len(existing_stores)} existing stores from {stores_path} for merging.")
        except Exception as e:
            print(f"Error loading existing database: {e}")
            
    # Load curated stores if available
    curated_stores = []
    if os.path.exists(curated_path):
        try:
            with open(curated_path, "r", encoding="utf-8") as f:
                curated_stores = json.load(f)
            print(f"Loaded {len(curated_stores)} curated stores from {curated_path}.")
        except Exception as e:
            print(f"Error loading curated stores: {e}")
            
    # Re-evaluate kickers for curated and existing stores if they match Hot Topic or Spencer's
    for store in curated_stores + existing_stores:
        name = store.get("name", "")
        # Dummy tags structure for recheck
        tags = {"shop": "clothes" if any(x in name.lower() for x in ["hot topic", "hottopic", "spencer"]) else ""}
        store["kicker"] = determine_type(name, tags)
            
    # Combine list: curated_stores (highest priority/custom) + all_compiled (new crawl) + existing_stores (fallback)
    combined_stores = curated_stores + all_compiled + existing_stores
    
    # Deduplicate: priority goes to elements processed earlier in combined_stores
    final_stores = []
    seen_keys = set()
    for s in combined_stores:
        name = s.get("name", "").strip()
        coords = s.get("coords", [0, 0])
        lat, lon = coords[0], coords[1]
        
        dup_key = (name.lower(), round(lat, 3), round(lon, 3))
        if dup_key in seen_keys:
            continue
        seen_keys.add(dup_key)
        final_stores.append(s)
        
    # Sort stores by name alphabetically
    final_stores.sort(key=lambda s: s["name"].lower())
    
    # Save output to src/data/stores.json
    try:
        with open(stores_path, "w", encoding="utf-8") as f:
            json.dump(final_stores, f, indent=2, ensure_ascii=False)
        print(f"Successfully wrote {len(final_stores)} final stores to {stores_path}.")
    except Exception as e:
        print(f"Error saving final stores: {e}")
        
    # Cleanup progress cache file if fully completed all 51 states
    if len(progress["completed_states"]) >= len(STATES):
        try:
            os.remove(progress_path)
            print("Successfully completed all states. Cleaned up progress cache.")
        except Exception as e:
            print(f"Error cleaning up progress cache: {e}")
            
    duration = time.time() - start_time
    print(f"Finished script execution in {duration:.1f} seconds.")

if __name__ == "__main__":
    main()
