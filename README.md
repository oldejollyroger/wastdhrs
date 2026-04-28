# Wastdhrs°

> *Wasted on purpose.* Web social para gamers donde **solo opina quien ha invertido las horas**.

Mockups visuales del producto con datos reales de juegos vía RAWG.

## Configurar la API key (IMPORTANTE)

El catálogo de juegos viene de [RAWG.io](https://rawg.io). La key NUNCA va en el código.

1. **Sacar la key**: ve a [rawg.io/apidocs](https://rawg.io/apidocs) y crea cuenta gratis. Te dan una key tipo `a1b2c3...`
2. **Añadirla en Vercel**:
   - Vercel Dashboard → tu proyecto → **Settings → Environment Variables**
   - Name: `RAWG_API_KEY`
   - Value: tu key
   - Aplicar a Production, Preview y Development
3. **Redeploy**: Deployments → último deploy → ⋯ → Redeploy

## Endpoints disponibles

| Ruta | Devuelve |
|---|---|
| `/api/games/search?q=elden` | Hasta 12 resultados de búsqueda |
| `/api/games/trending` | Top 10 juegos más añadidos (últimos 90 días) |
| `/api/games/[slug]` | Detalle completo + screenshots + trailers |

Caché en CDN (1h búsqueda, 24h detalle) para no quemar la cuota gratis (20K req/mes).

## Páginas

- `/` — feed de actividad + trending real + buscador con autocomplete
- `/juego.html?slug=elden-ring` — perfil del juego cargado dinámicamente
- `/perfil.html` — perfil del usuario (joancalibur, datos mockup)
- `/temporada.html` — sistema de temporadas, rangos, recompensas, leaderboard

## Estado

- ✅ Maquetación de las 4 páginas
- ✅ Sistema de progresión: 7 rangos + temporadas + retos + insignias + leaderboard
- ✅ Sistema de contribuciones: reputación, comentarios premiados, guías destacadas
- ✅ Catálogo real de juegos vía RAWG
- ⏳ Backend de logros (PSN/Steam/Xbox)
- ⏳ Auth, base de datos, comentarios persistentes

## Stack futuro

- **Next.js** (migrar HTMLs a páginas / App Router)
- **PostgreSQL** + **Prisma** + **Redis** (caché de catálogo)
- **Auth**: Clerk o Auth.js con vinculación PSN/Steam/Xbox
- **Catálogo**: migrar a IGDB y cachear en BD propia
- **Logros**: Steam Web API · `psn-api` · Microsoft Graph/OpenXBL · Switch manual

## Identidad

- Fondo negro `#0A0A0B`, acento lima eléctrico `#DFFF1F`.
- **Anton** para titulares, **Manrope** para UI, **JetBrains Mono** para etiquetas.
- Estilo revista: asimétrico, números de sección "001/002/003", grain SVG overlay.

---

*Wastdhrs° · de jugadores · para jugadores · 2026*
