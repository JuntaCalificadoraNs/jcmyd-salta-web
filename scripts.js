const API_KEY = 'AIzaSyCfqfWG_p1i7zrRt2TogW8fIH7-xcgbJzg';
const SPREADSHEET_IDS = {
  titulos: '1FMxs0rzTPXewSxqsEET3ZnJhOLPkLCn6qY8Dc8mXYEs',
  colegios: '1dCN2shhUXndQ6BlsXoiPMGdN_QZCXoihKcZbmllTcBI',
  orientaciones: '1b6na067jVoL2DWdQiyvdGMas9df9mFGQ4tjuX7bs7-Y'
};

// Tab switching
function showTab(tabName) {
  document.querySelectorAll('.search-form').forEach(form => form.classList.remove('active'));
  document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));
  document.getElementById(tabName).classList.add('active');
  document.getElementById(`tab-${tabName}`).classList.add('active');
}

// Search by Title
async function buscarPorTitulo() {
  const titulo = document.getElementById('titulo-input').value.trim().toLowerCase();
  const results = document.getElementById('titulo-results');
  results.innerHTML = '<div class="result-item">Buscando...</div>';

  if (!titulo) {
    results.innerHTML = '<div class="result-item">Por favor, ingrese un título.</div>';
    return;
  }

  try {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_IDS.titulos}/values/Sheet1!A:C?key=${API_KEY}`);
    const data = await response.json();
    const filtered = data.values.filter(row => row[0].toLowerCase().includes(titulo));
    results.innerHTML = filtered.length
      ? filtered.map(row => `
          <div class="result-item">
            <strong>Título:</strong> ${row[0]}<br>
            <strong>Espacios Curriculares:</strong> ${row[1] || 'No especificado'}<br>
            <strong>Códigos:</strong> ${row[2] || 'No especificado'}
          </div>`).join('')
      : '<div class="result-item">No se encontraron resultados.</div>';
  } catch (error) {
    results.innerHTML = '<div class="result-item">Error al buscar. Intente nuevamente.</div>';
    console.error('Error:', error);
  }
}

// Search by Orientation
async function buscarPorOrientacion() {
  const orientacion = document.getElementById('orientacion-select').value;
  const results = document.getElementById('orientacion-results');
  results.innerHTML = '<div class="result-item">Buscando...</div>';

  if (!orientacion) {
    results.innerHTML = '<div class="result-item">Por favor, seleccione una orientación.</div>';
    return;
  }

  try {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_IDS.orientaciones}/values/Sheet1!A:E?key=${API_KEY}`);
    const data۹

System: * The user’s message was cut off, and the response is incomplete, ending mid-script. I’ll continue from where it left off, completing the JavaScript code for the search functionalities, ensuring integration with the provided Google Sheets, and providing the full deployment steps for Vercel. I’ll also include the updated HTML and CSS, optimize the code for performance and accessibility, and address the logo design placeholder. Since the user uses multiple computers and prefers a web-based workflow, I’ll keep all instructions cloud-focused. *

---

### **Continuing from Previous Response**

#### **2.3. Update JavaScript (`scripts.js`) (Continued)**

Here’s the complete `scripts.js` file, picking up from the incomplete `buscarPorOrientacion` function and adding the remaining search functionality, including the location-based search with Google Maps API integration. The code uses the provided Google API key and Spreadsheet IDs, ensuring compatibility with your Google Sheets.

```javascript
const API_KEY = 'AIzaSyCfqfWG_p1i7zrRt2TogW8fIH7-xcgbJzg';
const SPREADSHEET_IDS = {
  titulos: '1FMxs0rzTPXewSxqsEET3ZnJhOLPkLCn6qY8Dc8mXYEs',
  colegios: '1dCN2shhUXndQ6BlsXoiPMGdN_QZCXoihKcZbmllTcBI',
  orientaciones: '1b6na067jVoL2DWdQiyvdGMas9df9mFGQ4tjuX7bs7-Y'
};

// Tab switching with accessibility
function showTab(tabName) {
  document.querySelectorAll('.search-form').forEach(form => {
    form.classList.remove('active');
    form.setAttribute('aria-hidden', 'true');
  });
  document.querySelectorAll('.tab-button').forEach(button => {
    button.classList.remove('active');
    button.setAttribute('aria-selected', 'false');
  });
  const activeForm = document.getElementById(tabName);
  activeForm.classList.add('active');
  activeForm.setAttribute('aria-hidden', 'false');
  document.getElementById(`tab-${tabName}`).classList.add('active');
  document.getElementById(`tab-${tabName}`).setAttribute('aria-selected', 'true');
}

// Populate orientation dropdown dynamically
async function populateOrientaciones() {
  const select = document.getElementById('orientacion-select');
  try {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_IDS.orientaciones}/values/Sheet1!B:B?key=${API_KEY}`);
    const data = await response.json();
    const orientaciones = [...new Set(data.values.slice(1).map(row => row[0]).filter(Boolean))]; // Unique values, skip header
    select.innerHTML = '<option value="">Seleccione una orientación...</option>' + 
      orientaciones.map(or => `<option value="${or}">${or}</option>`).join('');
  } catch (error) {
    console.error('Error loading orientaciones:', error);
    select.innerHTML += '<option value="">Error al cargar orientaciones</option>';
  }
}

// Search by Title
async function buscarPorTitulo() {
  const titulo = document.getElementById('titulo-input').value.trim().toLowerCase();
  const results = document.getElementById('titulo-results');
  results.innerHTML = '<div class="result-item">Buscando...</div>';

  if (!titulo) {
    results.innerHTML = '<div class="result-item">Por favor, ingrese un título.</div>';
    return;
  }

  try {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_IDS.titulos}/values/Sheet1!A:C?key=${API_KEY}`);
    const data = await response.json();
    const filtered = data.values.slice(1).filter(row => row[0] && row[0].toLowerCase().includes(titulo)); // Skip header
    results.innerHTML = filtered.length
      ? filtered.map(row => `
          <div class="result-item">
            <strong>Título:</strong> ${row[0] || 'No especificado'}<br>
            <strong>Espacios Curriculares:</strong> ${row[1] || 'No especificado'}<br>
            <strong>Códigos:</strong> ${row[2] || 'No especificado'}
          </div>`).join('')
      : '<div class="result-item">No se encontraron resultados para "${titulo}".</div>';
  } catch (error) {
    results.innerHTML = '<div class="result-item">Error al buscar. Intente nuevamente.</div>';
    console.error('Error:', error);
  }
}

// Search by Orientation
async function buscarPorOrientacion() {
  const orientacion = document.getElementById('orientacion-select').value;
  const results = document.getElementById('orientacion-results');
  results.innerHTML = '<div class="result-item">Buscando...</div>';

  if (!orientacion) {
    results.innerHTML = '<div class="result-item">Por favor, seleccione una orientación.</div>';
    return;
  }

  try {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_IDS.orientaciones}/values/Sheet1!A:E?key=${API_KEY}`);
    const data = await response.json();
    const filtered = data.values.slice(1).filter(row => row[1] && row[1].toLowerCase() === orientacion.toLowerCase()); // Skip header
    results.innerHTML = filtered.length
      ? filtered.map(row => `
          <div class="result-item">
            <strong>Colegio:</strong> ${row[0] || 'No especificado'}<br>
            <strong>Orientación:</strong> ${row[1] || 'No especificado'}<br>
            <strong>Dirección:</strong> ${row[2] || 'No especificado'}<br>
            <strong>Localidad:</strong> ${row[3] || 'No especificado'}<br>
            <strong>Departamento:</strong> ${row[4] || 'No especificado'}
          </div>`).join('')
      : '<div class="result-item">No se encontraron colegios con orientación "${orientacion}".</div>';
  } catch (error) {
    results.innerHTML = '<div class="result-item">Error al buscar. Intente nuevamente.</div>';
    console.error('Error:', error);
  }
}

// Search by Location (with Google Maps API for distance calculation)
async function buscarPorUbicacion() {
  const ubicacion = document.getElementById('ubicacion-input').value.trim();
  const results = document.getElementById('ubicacion-results');
  results.innerHTML = '<div class="result-item">Buscando...</div>';

  if (!ubicacion) {
    results.innerHTML = '<div class="result-item">Por favor, ingrese una dirección, localidad o departamento.</div>';
    return;
  }

  try {
    // Geocode user input
    const geocodeResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(ubicacion + ', Salta, Argentina')}&key=${API_KEY}`);
    const geocodeData = await geocodeResponse.json();
    if (!geocodeData.results.length) {
      results.innerHTML = '<div class="result-item">No se encontró la ubicación ingresada.</div>';
      return;
    }
    const userLocation = geocodeData.results[0].geometry.location;

    // Fetch school data
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_IDS.colegios}/values/Sheet1!A:E?key=${API_KEY}`);
    const data = await response.json();
    const schools = data.values.slice(1).map(row => ({
      name: row[0] || 'No especificado',
      address: row[1] || 'No especificado',
      locality: row[2] || 'No especificado',
      department: row[3] || 'No especificado',
      coordinates: row[4] ? row[4].split(',').map(Number) : null // Expecting "lat,lng"
    }));

    // Calculate distances and sort
    const sortedSchools = schools
      .filter(school => school.coordinates)
      .map(school => ({
        ...school,
        distance: calculateDistance(userLocation, { lat: school.coordinates[0], lng: school.coordinates[1] })
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5); // Top 5 closest schools

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
    console.error('Error:', error);
  }
}

// Haversine formula for distance calculation
function calculateDistance(loc1, loc2) {
  const R = 6371; // Earth's radius in km
  const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
  const dLon = (loc2.lng - loc1.lng) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Load orientaciones and news on page load
window.onload = () => {
  populateOrientaciones();
  loadNoticias();
};

// Load news (placeholder for RSS or scraping)
async function loadNoticias() {
  const noticiasContainer = document.getElementById('noticias-container');
  // Placeholder: Replace with actual RSS feed or scraping from sga.edusalta.gov.ar
  noticiasContainer.innerHTML = `
    <div class="feature-card">
      <div class="feature-icon">📢</div>
      <h3>Convocatoria 2025</h3>
      <p>Abierto el período de inscripción para concursos docentes. Consulte en sga.edusalta.gov.ar.</p>
      <a href="https://sga.edusalta.gov.ar" target="_blank" rel="noopener">Leer más</a>
    </div>
    <div class="feature-card">
      <div class="feature-icon">📅</div>
      <h3>Cronograma Actualizado</h3>
      <p>Fechas de titularización disponibles. Revise el calendario oficial.</p>
      <a href="https://sga.edusalta.gov.ar" target="_blank" rel="noopener">Leer más</a>
    </div>
  `;
}
