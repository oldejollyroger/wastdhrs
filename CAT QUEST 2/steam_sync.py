import requests
import json

API_KEY = "7A6BCC47D8A321BF4751C3E524531C78"
APP_ID = "914710" 

def get_steam_trophies():
    url = f"https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key={API_KEY}&appid={APP_ID}&l=spanish"
    try:
        response = requests.get(url)
        data = response.json()
        raw_trophies = data['game']['availableGameStats']['achievements']
        
        formatted = []
        for ach in raw_trophies:
            formatted.append({
                "id": ach['name'],
                "name": ach['displayName'],
                "desc": ach.get('description', 'Trofeo secreto'),
                "icon": ach['icon']
            })
            
        # AQUÍ ESTÁ EL TRUCO: Guardamos como variable JS
        with open('data.js', 'w', encoding='utf-8') as f:
            f.write("const STEAM_DATA = " + json.dumps(formatted, indent=2, ensure_ascii=False) + ";")
            
        print("✅ Archivo data.js creado con éxito. Ya puedes abrir el index.html")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    get_steam_trophies()