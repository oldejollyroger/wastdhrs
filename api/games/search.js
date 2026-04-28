// /api/games/search?q=elden+ring&page=1
// Proxy a RAWG.io que protege la API key.
// La key vive en process.env.RAWG_API_KEY (configurar en Vercel).

export default async function handler(req, res) {
  const apiKey = process.env.RAWG_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: 'RAWG_API_KEY no configurada en el servidor.',
    });
  }

  const { q = '', page = 1, page_size = 12 } = req.query;

  if (!q || q.trim().length < 2) {
    return res.status(400).json({
      error: 'La búsqueda necesita al menos 2 caracteres.',
    });
  }

  const url = new URL('https://api.rawg.io/api/games');
  url.searchParams.set('key', apiKey);
  url.searchParams.set('search', q.trim());
  url.searchParams.set('page', String(page));
  url.searchParams.set('page_size', String(Math.min(40, Number(page_size) || 12)));
  url.searchParams.set('search_precise', 'true');

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      return res.status(response.status).json({
        error: `RAWG respondió con status ${response.status}`,
      });
    }

    const data = await response.json();

    // Solo devolvemos los campos que necesitamos al frontend
    const results = (data.results || []).map((g) => ({
      id: g.id,
      slug: g.slug,
      name: g.name,
      released: g.released,
      cover: g.background_image,
      rating: g.rating,
      ratingTop: g.rating_top,
      metacritic: g.metacritic,
      platforms: (g.platforms || []).map((p) => p.platform.name),
      genres: (g.genres || []).map((gn) => gn.name),
      esrb: g.esrb_rating?.name || null,
      added: g.added, // proxy de popularidad en RAWG
    }));

    // Cache de 1 hora en CDN, 1 minuto en navegador
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    res.status(200).json({
      count: data.count,
      page: Number(page),
      results,
    });
  } catch (err) {
    res.status(500).json({
      error: 'Error contactando con RAWG: ' + err.message,
    });
  }
}
