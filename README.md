# PLATINO°

> Web social para gamers donde **solo opina quien ha jugado de verdad**.

Mockups visuales del producto. Cuatro páginas conectadas que muestran el flujo principal: home/feed, perfil de juego, perfil de usuario y sistema de temporadas/recompensas.

## El concepto

Anti-review-bombing. Los logros del jugador se verifican vía PSN/Steam/Xbox y desbloquean qué puede opinar de qué juego:

- **Comentar** un juego → necesitas mínimo 1 logro en él.
- **Reseñar** un juego → necesitas haberlo terminado o platinado.
- **Aportar a guías** → cualquier usuario verificado.

Esto elimina las reseñas de gente que no ha tocado el juego.

## Sistema de progresión

**Puntos PROEZA (PP)** — moneda interna, nunca comprable, solo se gana jugando o aportando:

| Acción | PP |
|---|---|
| Logro común | +50 |
| Logro raro (<10%) | +200 |
| Logro ultra raro (<5%) | +500 |
| Platino estándar | +2.000 |
| Platino raro (<10%) | +3.000 |
| Reseña verificada | +150 |
| Comentario útil | +20 |
| Edición aceptada en guía | +300 |
| Tu guía → "Guía del mes" | +5.000 |

**7 rangos permanentes** (no se pierden): Iniciado → Novato → Cazador → Veterano → Maestro → Leyenda → Mito.

**Temporadas de 3 meses** añaden un título temático sobre el rango (la actual: "Sinluz" / Las Tierras Sombrías). Con camino de 5 hitos, retos semanales y recompensas cosméticas (player cards animadas, marcos de avatar, insignias exclusivas).

**Reputación de contribución** 0–100 calculada por la comunidad. Mide calidad de reseñas, utilidad, diversidad, frecuencia. Visible en tu perfil.

## Estructura

```
├── index.html       # Home / feed social
├── juego.html       # Perfil de un juego (Elden Ring de ejemplo)
├── perfil.html      # Perfil de usuario (joancalibur)
└── temporada.html   # Sistema de temporadas / rangos / recompensas
```

Solo HTML+CSS, sin build. Abrir `index.html` en el navegador y navegar.

## Stack propuesto para producción

- **Next.js** + **PostgreSQL** + **Prisma** + **Redis** (caché de IGDB)
- **Auth**: Clerk o Auth.js con vinculación de cuentas PSN/Steam/Xbox
- **Catálogo de juegos**: IGDB API como fuente principal, RAWG como respaldo
- **Verificación de logros**:
  - Steam Web API (oficial)
  - PSN vía librería `psn-api` con tokens NPSSO
  - Xbox vía Microsoft Graph / OpenXBL
  - Nintendo Switch: screenshots verificados manualmente (no hay API pública)
- **Búsqueda**: empezar con Postgres FTS, escalar a Meilisearch

## Estado

Mockups visuales. No hay backend, no hay datos reales — todos los datos visibles (joancalibur, paula_wields, los retos, los rankings) son fixtures para validar el diseño.

## Identidad visual

- **Negro** `#0A0A0B` de fondo, **lima eléctrico** `#DFFF1F` como acento principal (no el morado/azul de PSN).
- **Anton** para titulares editoriales, **Manrope** para UI, **JetBrains Mono** para etiquetas/números.
- Estilo revista, asimétrico, números de sección "001/002/003", overlay de grain SVG.

---

Diseño 2026 · de jugadores · para jugadores.
