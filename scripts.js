const API_KEY = 'AIzaSyCfqfWG_p1i7zrRt2TogW8fIH7-xcgbJzg';
const SPREADSHEET_IDS = {
  titulos: '1FMxs0rzTPXewSxqsEET3ZnJhOLPkLCn6qY8Dc8mXYEs',
  colegios: '1dCN2shhUXndQ6BlsXoiPMGdN_QZCXoihKcZbmllTcBI',
  orientaciones: '1b6na067jVoL2DWdQiyvdGMas9df9mFGQ4tjuX7bs7-Y',
  noticias: 'YOUR_NEWS_SHEET_ID' // Replace with actual ID
};

// Sanitize input to prevent XSS
function sanitizeInput(input) {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

// Tab switching
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

// Populate orientation dropdown
async function populateOrientaciones() {
  const select = document.getElementById('orientacion-select');
  try {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_IDS.orientaciones}/values/Sheet1!B:B?key=${API_KEY}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!data.values) throw new Error('No data returned');
    const orientaciones = [...new Set(data.values.slice(1).map(row => row[0]).filter(Boolean))];
    select.innerHTML = '<option value="">Seleccione una orientación...</option>' + 
      orientaciones.map(or => `<option value="${or}">${or}</option>`).join('');
  } catch (error) {
    select.innerHTML = '<option value="">Error al cargar orientaciones</option>';
    console.error('Error:', error);
  }
}

// Search by Title
async function buscarPorTitulo() {
  const titulo = sanitizeInput(document.getElementById('titulo-input').value.trim().toLowerCase());
  const results = document.getElementById('titulo-results');
  results.innerHTML = '<div class="result-item">Buscando...</div>';

  if (!titulo) {
    results.innerHTML = '<div class="result-item">Por favor, ingrese un título.</div>';
    return;
  }

  try {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_IDS.titulos}/values/Sheet1!A:D?key=${API_KEY}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!data.values) throw new Error('No data returned');
    const filtered = data.values.slice(1).filter(row => row[0] && row[0].toLowerCase().includes(titulo));
    results.innerHTML = filtered.length
      ? filtered.map(row => `
          <div class="result-item">
            <strong>Título:</strong> ${sanitizeInput(row[0] || 'No especificado')}<br>
            <strong>Espacio Curricular:</strong> ${sanitizeInput(row[1] || 'No especificado')}<br>
            <strong>Código/Módulo:</strong> ${sanitizeInput(row[2] || 'No especificado')}<br>
            <strong>Alcance/Incumbencia:</strong> ${sanitizeInput(row[3] || 'No especificado')}
          </div>`).join('')
      : '<div class="result-item">No se encontraron resultados para "${titulo}".</div>';
  } catch (error) {
    results.innerHTML = '<div class="result-item">Error al buscar. Intente nuevamente.</div>';
    console.error('Error:', error);
  }
}

// Search by Orientation
async function buscarPorOrientacion() {
  const orientacion = sanitizeInput(document.getElementById('orientacion-select').value);
  const results = document.getElementById('orientacion-results');
  results.innerHTML = '<div class="result-item">Buscando...</div>';

  if (!orientacion) {
    results.innerHTML = '<div class="result-item">Por favor, seleccione una orientación.</div>';
    return;
  }

  try {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_IDS.orientaciones}/values/Sheet1!A:C?key=${API_KEY}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!data.values) throw new Error('No data returned');
    const filtered = data.values.slice(1).filter(row => row[1] && row[1].toLowerCase() === orientacion.toLowerCase());
    results.innerHTML = filtered.length
      ? filtered.map(row => `
          <div class="result-item">
            <strong>Unidad Educativa:</strong> ${sanitizeInput(row[0] || 'No especificado')}<br>
            <strong>Orientación:</strong> ${sanitizeInput(row[1] || 'No especificado')}<br>
            <strong>Área Geográfica:</strong> ${sanitizeInput(row[2] || 'No especificado')}
          </div>`).join('')
      : '<div class="result-item">No se encontraron colegios con orientación "${orientacion}".</div>';
  } catch (error) {
    results.innerHTML = '<div class="result-item">Error al buscar. Intente nuevamente.</div>';
    console.error('Error:', error);
  }
}

// Search by Location
async function buscarPorUbicacion() {
  const ubicacion = sanitizeInput(document.getElementById('ubicacion-input').value.trim().toLowerCase());
  const results = document.getElementById('ubicacion-results');
  results.innerHTML = '<div class="result-item">Buscando...</div>';

  if (!ubicacion) {
    results.innerHTML = '<div class="result-item">Por favor, ingrese una dirección, localidad o departamento.</div>';
    return;
  }

  try {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_IDS.colegios}/values/Sheet1!A:E?key=${API_KEY}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!data.values) throw new Error('No data returned');
    const filtered = data.values.slice(1).filter(row => 
      (row[2] && row[2].toLowerCase().includes(ubicacion)) ||
      (row[3] && row[3].toLowerCase().includes(ubicacion)) ||
      (row[1] && row[1].toLowerCase().includes(ubicacion))
    );
    results.innerHTML = filtered.length
      ? filtered.map(row => `
          <div class="result-item">
            <strong>Colegio:</strong> ${sanitizeInput(row[0] || 'No especificado')}<br>
            <strong>Dirección:</strong> ${sanitizeInput(row[1] || 'No especificado')}<br>
            <strong>Localidad:</strong> ${sanitizeInput(row[2] || 'No especificado')}<br>
            <strong>Departamento:</strong> ${sanitizeInput(row[3] || 'No especificado')}<br>
            <strong>Código Postal:</strong> ${sanitizeInput(row[4] || 'No especificado')}
          </div>`).join('')
      : '<div class="result-item">No se encontraron colegios para "${ubicacion}".</div>';
  } catch (error) {
    results.innerHTML = '<div class="result-item">Error al buscar. Intente nuevamente.</div>';
    console.error('Error:', error);
  }
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// Load orientaciones and news
window.onload = () => {
  populateOrientaciones();
  loadNoticias();
};

// Load news from Google Sheet
async function loadNoticias() {
  const noticiasContainer = document.getElementById('noticias-container');
  try {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_IDS.noticias}/values/Sheet1!A:D?key=${API_KEY}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!data.values) throw new Error('No data returned');
    const news = data.values.slice(1);
    noticiasContainer.innerHTML = news.length
      ? news.map(row => `
          <div class="feature-card">
            <div class="feature-icon">📢</div>
            <h3>${sanitizeInput(row[0] || 'Sin título')}</h3>
            <p>${sanitizeInput(row[1] ? row[1].substring(0, 100) + (row[1].length > 100 ? '...' : '') : 'Sin descripción')}</p>
            <a href="${sanitizeInput(row[2] || '#')}" target="_blank" rel="noopener">Leer más</a>
          </div>`).join('')
      : '<div class="feature-card">No hay noticias disponibles.</div>';
  } catch (error) {
    noticiasContainer.innerHTML = '<div class="feature-card">Error al cargar noticias.</div>';
    console.error('Error:', error);
  }
}
