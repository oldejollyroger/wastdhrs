// /api/games/trending
// Devuelve los juegos más populares de los últimos 30 días.

export default async function handler(req, res) {
  const apiKey = process.env.RAWG_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: 'RAWG_API_KEY no configurada en el servidor.',
    });
  }

  // Rango: últimos 90 días → top añadidos (proxy de popularidad real)
  const today = new Date();
  const past = new Date(today);
  past.setDate(today.getDate() - 90);

  const fmt = (d) => d.toISOString().slice(0, 10);

  const url = new URL('https://api.rawg.io/api/games');
  url.searchParams.set('key', apiKey);
  url.searchParams.set('dates', `${fmt(past)},${fmt(today)}`);
  url.searchParams.set('ordering', '-added');
  url.searchParams.set('page_size', '10');

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      return res.status(response.status).json({
        error: `RAWG respondió con status ${response.status}`,
      });
    }

    const data = await response.json();

    const results = (data.results || []).map((g) => ({
      id: g.id,
      slug: g.slug,
      name: g.name,
      released: g.released,
      cover: g.background_image,
      rating: g.rating,
      metacritic: g.metacritic,
      added: g.added,
      platforms: (g.parent_platforms || []).map((p) => p.platform.name),
      genres: (g.genres || []).map((gn) => gn.name),
    }));

    // Cache 30 min en CDN
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=86400');
    res.status(200).json({ results });
  } catch (err) {
    res.status(500).json({
      error: 'Error contactando con RAWG: ' + err.message,
    });
  }
}
