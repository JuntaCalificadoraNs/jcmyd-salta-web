const API_KEY = process.env.GOOGLE_SHEETS_API_KEY; // Handled by Vercel env variables
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

async function buscarPorTitulo() {
    const titulo = document.getElementById('titulo-input').value.trim().toLowerCase();
    const results = document.getElementById('titulo-results');
    if (!titulo) {
        results.innerHTML = '<div class="result-item">Por favor, ingrese un título.</div>';
        return;
    }
    try {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Manual!A:C?key=${API_KEY}`);
        const data = await response.json();
        const filtered = data.values.filter(row => row[0].toLowerCase().includes(titulo));
        results.innerHTML = filtered.length
            ? filtered.map(row => `
                <div class="result-item">
                    <strong>Título:</strong> ${row[0]}<br>
                    <strong>Espacios Curriculares:</strong> ${row[1]}<br>
                    <strong>Códigos:</strong> ${row[2]}
                </div>`).join('')
            : '<div class="result-item">No se encontraron resultados.</div>';
    } catch (error) {
        results.innerHTML = '<div class="result-item">Error al buscar. Intente nuevamente.</div>';
    }
}

async function buscarPorOrientacion() {
    const orientacion = document.getElementById('orientacion-select').value;
    const results = document.getElementById('orientacion-results');
    if (!orientacion) {
        results.innerHTML = '<div class="result-item">Por favor, seleccione una orientación.</div>';
        return;
    }
    try {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Orientaciones!A:E?key=${API_KEY}`);
        const data = await response.json();
        const filtered = data.values.filter(row => row[1].toLowerCase() === orientacion.toLowerCase());
        results.innerHTML = filtered.length
            ? filtered.map(row => `
                <div class="result-item">
                    <strong>Colegio:</strong> ${row[0]}<br>
                    <strong>Orientación:</strong> ${row[1]}<br>
                    <strong>Dirección:</strong> ${row[2]}<br>
                    <strong>Localidad:</strong> ${row[3]}<br>
                    <strong>Departamento:</strong> ${row[4]}
                </div>`).join('')
            : '<div class="result-item">No se encontraron resultados.</div>';
    } catch (error) {
        results.innerHTML = '<div class="result-item">Error al buscar. Intente nuevamente.</div>';
    }
}

async function buscarPorUbicacion() {
    const ubicacion = document.getElementById('ubicacion-input').value.trim();
    const results = document.getElementById('ubicacion-results');
    if (!ubicacion) {
        results.innerHTML = '<div class="result-item">Por favor, ingrese una ubicación.</div>';
        return;
    }
    try {
        const geocodeResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(ubicacion + ', Salta, Argentina')}&key=${MAPS_API_KEY}`);
        const geocodeData = await geocodeResponse.json();
        if (!geocodeData.results.length) {
            results.innerHTML = '<div class="result-item">Ubicación no encontrada.</div>';
            return;
        }
        const userLocation = geocodeData.results[0].geometry.location;
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Ubicaciones!A:F?key=${API_KEY}`);
        const data = await response.json();
        const schools = data.values.map(row => ({
            name: row[0],
            address: row[1],
            locality: row[2],
            department: row[3],
            lat: parseFloat(row[4]),
            lng: parseFloat(row[5]),
            distance: calculateDistance(userLocation, { lat: parseFloat(row[4]), lng: parseFloat(row[5]) })
        }));
        const sortedSchools = schools
            .filter(school => !isNaN(school.lat) && !isNaN(school.lng))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 5);
        results.innerHTML = sortedSchools.length
            ? sortedSchools.map(school => `
                <div class="result-item">
                    <strong>Colegio:</strong> ${school.name}<br>
                    <strong>Dirección:</strong> ${school.address}<br>
                    <strong>Localidad:</strong> ${school.locality}<br>
                    <strong>Departamento:</strong> ${school.department}<br>
                    <strong>Distancia:</strong> ${school.distance.toFixed(2)} km
                </div>`).join('')
            : '<div class="result-item">No se encontraron colegios cercanos.</div>';
    } catch (error) {
        results.innerHTML = '<div class="result-item">Error al buscar. Intente nuevamente.</div>';
    }
}

function calculateDistance(loc1, loc2) {
    const R = 6371; // Earth's radius in km
    const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
    const dLon = (loc2.lng - loc1.lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Populate orientation dropdown dynamically
async function populateOrientations() {
    const select = document.getElementById('orientacion-select');
    try {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Orientaciones!B:B?key=${API_KEY}`);
        const data = await response.json();
        const orientations = [...new Set(data.values.slice(1).map(row => row[0]))]; // Unique orientations
        select.innerHTML = '<option value="">Seleccione una orientación...</option>' +
            orientations.map(orientation => `<option value="${orientation.toLowerCase()}">${orientation}</option>`).join('');
    } catch (error) {
        select.innerHTML += '<option value="">Error al cargar orientaciones</option>';
    }
}

// Tab switching
function showTab(tabName) {
    document.querySelectorAll('.search-form').forEach(form => form.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(button => button.setAttribute('aria-selected', 'false'));
    document.getElementById(tabName).classList.add('active');
    document.getElementById(`tab-${tabName}`).setAttribute('aria-selected', 'true');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    populateOrientations();
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector(anchor.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
        });
    });
});
