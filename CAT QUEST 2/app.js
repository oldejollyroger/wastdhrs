const container = document.getElementById('trophy-list');

function init() {
    // Comprobamos si la variable existe
    if (typeof STEAM_DATA !== 'undefined') {
        render(STEAM_DATA);
    } else {
        container.innerHTML = "❌ Error: No se encontró data.js. Ejecuta primero el script de Python.";
    }
}

function render(trophies) {
    container.innerHTML = trophies.map(t => {
        const isDone = localStorage.getItem('stat_' + t.id) === 'true';
        return `
            <div class="trophy-card ${isDone ? 'completed' : ''}" id="card-${t.id}">
                <img src="${t.icon}" class="trophy-img">
                <div class="trophy-info">
                    <h3>${t.name}</h3>
                    <p>${t.desc}</p>
                </div>
                <div class="check-circle ${isDone ? 'active' : ''}" onclick="toggle('${t.id}')">
                    ${isDone ? '✓' : ''}
                </div>
            </div>
        `;
    }).join('');
    updateStats(trophies);
}

function toggle(id) {
    const val = localStorage.getItem('stat_' + id) === 'true';
    localStorage.setItem('stat_' + id, !val);
    render(STEAM_DATA); // Refrescar vista
}

function updateStats(trophies) {
    const done = trophies.filter(t => localStorage.getItem('stat_' + t.id) === 'true').length;
    const percent = (done / trophies.length) * 100;
    document.getElementById('progress-bar').style.width = percent + '%';
    document.getElementById('progress-text').innerText = `${done} de ${trophies.length} trofeos`;
}

document.addEventListener('DOMContentLoaded', init);