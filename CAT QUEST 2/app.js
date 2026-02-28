// URL de la API de Steam (Cat Quest 2 AppID: 914710)
const API_KEY = '7A6BCC47D8A321BF4751C3E524531C78';
const APP_ID = '914710';
const steamURL = `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${API_KEY}&appid=${APP_ID}&l=spanish`;

// Usamos el proxy AllOrigins para que GitHub no bloquee la petición
const finalURL = `https://api.allorigins.win/get?url=${encodeURIComponent(steamURL)}`;

async function fetchTrophies() {
    try {
        const response = await fetch(finalURL);
        const data = await response.json();
        // AllOrigins devuelve un string, hay que parsearlo a JSON
        const steamData = JSON.parse(data.contents);
        const achievements = steamData.game.availableGameStats.achievements;
        
        render(achievements);
    } catch (error) {
        console.error("Error cargando trofeos:", error);
    }
}