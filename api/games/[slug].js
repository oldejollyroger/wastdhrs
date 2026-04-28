// /api/games/[slug]
// Devuelve detalle del juego + screenshots + trailers en paralelo.
// Vercel lee el archivo `[slug].js` y lo expone como ruta dinámica.

export default async function handler(req, res) {
  const apiKey = process.env.RAWG_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: 'RAWG_API_KEY no configurada en el servidor.',
    });
  }

  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ error: 'Slug requerido.' });
  }

  const baseUrl = `https://api.rawg.io/api/games/${encodeURIComponent(slug)}`;
  const keyParam = `key=${apiKey}`;

  try {
    // Paralelizamos las 3 llamadas — RAWG no penaliza esto.
    const [detailRes, shotsRes, moviesRes] = await Promise.all([
      fetch(`${baseUrl}?${keyParam}`),
      fetch(`${baseUrl}/screenshots?${keyParam}`),
      fetch(`${baseUrl}/movies?${keyParam}`),
    ]);

    if (!detailRes.ok) {
      return res.status(detailRes.status).json({
        error: `Juego no encontrado (status ${detailRes.status}).`,
      });
    }

    const detail = await detailRes.json();
    const shots = shotsRes.ok ? await shotsRes.json() : { results: [] };
    const movies = moviesRes.ok ? await moviesRes.json() : { results: [] };

    // Limpieza de la descripción HTML que viene de RAWG (suele tener <p>, <br>, <h*>)
    const stripHtml = (html) => {
      if (!html) return '';
      return html
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\n{3,}/g, '\n\n')
        .trim();
    };

    const game = {
      id: detail.id,
      slug: detail.slug,
      name: detail.name,
      nameOriginal: detail.name_original,
      released: detail.released,
      tba: detail.tba,
      description: stripHtml(detail.description),
      descriptionShort: stripHtml(detail.description).slice(0, 280),
      cover: detail.background_image,
      coverAdditional: detail.background_image_additional,
      rating: detail.rating,
      ratingTop: detail.rating_top,
      ratingsCount: detail.ratings_count,
      metacritic: detail.metacritic,
      playtime: detail.playtime,
      esrb: detail.esrb_rating?.name || null,
      website: detail.website,
      reddit: detail.reddit_url,
      developers: (detail.developers || []).map((d) => d.name),
      publishers: (detail.publishers || []).map((p) => p.name),
      genres: (detail.genres || []).map((g) => g.name),
      tags: (detail.tags || []).slice(0, 8).map((t) => t.name),
      platforms: (detail.platforms || []).map((p) => ({
        name: p.platform.name,
        slug: p.platform.slug,
        released: p.released_at,
      })),
      stores: (detail.stores || []).map((s) => ({
        name: s.store.name,
        slug: s.store.slug,
      })),
      screenshots: (shots.results || []).map((s) => ({
        id: s.id,
        image: s.image,
        width: s.width,
        height: s.height,
      })),
      movies: (movies.results || []).map((m) => ({
        id: m.id,
        name: m.name,
        preview: m.preview,
        // RAWG ofrece varias resoluciones: 480 / max
        video: m.data?.max || m.data?.['480'] || null,
      })),
    };

    // Cache larga: el detalle de un juego cambia muy poco
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');
    res.status(200).json(game);
  } catch (err) {
    res.status(500).json({
      error: 'Error contactando con RAWG: ' + err.message,
    });
  }
}
