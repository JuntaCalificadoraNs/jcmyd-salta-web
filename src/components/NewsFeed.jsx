import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './NewsFeed.css';

const GOOGLE_SHEET_NEWS_URL = 'https://docs.google.com/spreadsheets/d/.../pub?output=csv'; // Reemplaza con tu URL

const NewsFeed = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const processNewsContent = (content) => {
    if (!content) return <p>Sin contenido.</p>;

    const lines = content.split('\n').map(line => line.trim()).filter(line => line !== '');
    let inList = false;
    const elements = [];

    lines.forEach((line, index) => {
      if (line.startsWith('·') || line.startsWith('-')) {
        const listItem = line.replace(/^[·-]\s*/, '');
        if (!inList) {
          inList = true;
          elements.push(<ul className="news-list" key={`ul-${index}`}>);
        }
        const processedLine = processLinksInLine(listItem);
        elements.push(<li key={`li-${index}`}>{processedLine}</li>);
      } else {
        if (inList) {
          elements.push(</ul>);
          inList = false;
        }
        const processedLine = processLinksInLine(line);
        elements.push(<p key={`p-${index}`}>{processedLine}</p>);
      }
    });

    if (inList) {
      elements.push(</ul>);
    }

    return elements;
  };

  const processLinksInLine = (line) => {
    const links = [
      {
        text: 'Declaración Jurada de Empleos Públicos. (DESCARGAR)',
        url: 'https://drive.google.com/uc?export=download&id=1mYh9yAY1CwfSnvRQZfrwobk13ldydJqi'
      },
      {
        text: 'Formulario ST 04. (DESCARGAR)',
        url: 'https://drive.google.com/uc?export=download&id=1WtrVXUwKrrixgzEO9oVCla5XbGEc0OpZ'
      },
      {
        text: 'Circular 02/2025 Completa',
        url: 'https://drive.google.com/uc?export=download&id=1U02ord_9mwyJPkrqHe_8FIJz0YIhyaft'
      },
      {
        text: 'Anexo I - Circular 02/2025',
        url: 'https://drive.google.com/uc?export=download&id=1f8AJGb6KL-wK8c6FerYGna3KCbu0JrVD'
      }
    ];

    let processedLine = line;
    links.forEach(link => {
      const regex = new RegExp(link.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      processedLine = processedLine.replace(regex, `<a href="${link.url}" class="inline-link" target="_blank" rel="noopener noreferrer">${link.text}</a>`);
    });

    return <span dangerouslySetInnerHTML={{ __html: processedLine }} />;
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch(GOOGLE_SHEET_NEWS_URL);
        if (!response.ok) {
          throw new Error(`Error HTTP! Estado: ${response.status}`);
        }
        const csvText = await response.text();
        const parsed = Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          quoteChar: '"',
          escapeChar: '"',
          transform: value => value.trim()
        });
        console.log('Datos parseados en React:', JSON.stringify(parsed.data, null, 2));
        setNewsData(parsed.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <section id="dynamic-news-feed">
        <h3>Últimas Noticias</h3>
        <p className="no-results">Cargando noticias...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section id="dynamic-news-feed">
        <h3>Últimas Noticias</h3>
        <p className="no-results">Error al cargar las noticias: {error}</p>
      </section>
    );
  }

  if (newsData.length === 0) {
    return (
      <section id="dynamic-news-feed">
        <h3>Últimas Noticias</h3>
        <p className="no-results">No hay noticias disponibles en este momento.</p>
      </section>
    );
  }

  return (
    <section id="dynamic-news-feed">
      <h3>Últimas Noticias</h3>
      {newsData.map((newsItem, index) => {
        const rawDateString = newsItem.Fecha ? String(newsItem.Fecha).trim() : '';
        const dateParts = rawDateString.split('/');
        let displayDate = 'Fecha desconocida';

        if (dateParts.length === 3) {
          const day = parseInt(dateParts[0], 10);
          const month = parseInt(dateParts[1], 10) - 1;
          const year = parseInt(dateParts[2], 10);
          if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            const d = new Date(year, month, day);
            if (!isNaN(d.getTime())) {
              displayDate = d.toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' });
            }
          }
        }

        return (
          <div className="news-item" key={index}>
            <h4>{newsItem.Titulo || 'Sin título'}</h4>
            <span className="news-date">{displayDate}</span>
            <div className="news-content">{processNewsContent(newsItem.Contenido)}</div>
            {newsItem.Titulo.toLowerCase().includes('traslado de docentes 2025') && (
              <>
                <a
                  href="https://drive.google.com/uc?export=download&id=1WtrVXUwKrrixgzEO9oVCla5XbGEc0OpZ"
                  className="read-more"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Descargar Formulario ST 04
                </a>
                <br />
                <a
                  href="https://drive.google.com/uc?export=download&id=1U02ord_9mwyJPkrqHe_8FIJz0YIhyaft"
                  className="read-more"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Descargar Circular 02/2025
                </a>
                <br />
                <a
                  href="https://drive.google.com/uc?export=download&id=1f8AJGb6KL-wK8c6FerYGna3KCbu0JrVD"
                  className="read-more"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Descargar Anexo I
                </a>
              </>
            )}
          </div>
        );
      })}
    </section>
  );
};

export default NewsFeed;
