const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  try {
    const response = await axios.get('https://sga.edusalta.gov.ar/Frontend/Modulos/Noticias/Noticias.aspx');
    const $ = cheerio.load(response.data);
    const news = [];

    // Adjust selector based on page structure
    $('.noticia-item').each((i, el) => {
      const title = $(el).find('.noticia-titulo').text().trim();
      const description = $(el).find('.noticia-resumen').text().trim();
      const link = $(el).find('a').attr('href') || '#';
      const date = $(el).find('.noticia-fecha').text().trim();
      if (title) {
        news.push({
          title: title || 'Sin título',
          description: description || 'Sin descripción',
          link: link.startsWith('http') ? link : `https://sga.edusalta.gov.ar${link}`,
          date: date || 'Sin fecha'
        });
      }
    });

    res.json(news.slice(0, 6)); // Return up to 6 news items
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
};
