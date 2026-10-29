# Architecture
- Plain HTML/CSS/JS. `app.js` fetches `data/bots.json` and renders every section client-side (metrics, table, filter/sort, SVG diagram, team cards, ideas).
- Headline figures are computed from the data: bot count, team count, `Active` count, and `Active + Recent` count.
- The diagram is drawn as inline SVG with a simple left-to-right layered layout starting from the `person` node.
- Light/dark follows `prefers-color-scheme` via CSS variables. Under 640px the table becomes stacked cards.
- The team filter can be deep-linked: `/?team=Community`.
- Served by `nginx:alpine`; the official image's template step substitutes `${PORT}` into the config at start.
- All links are relative; the only absolute URL is the canonical `https://bots.themottfamily.net/`. Never put a Cloud Run default, tag or revision URL in the site.
