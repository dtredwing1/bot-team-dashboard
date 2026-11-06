# Architecture
- Plain HTML/CSS/JS. `app.js` fetches `data/bots.json` and renders every section client-side (metrics, table, filter/sort, SVG diagram, operational team work cards).
- `title` is written to the visible heading, `document.title`, and the Open Graph title. `summary` is the subtitle.
- Headline figures are computed from the data: bot count, team count, bots whose `work` starts with `Current` or `Recurring`, and the Idle count (shown with the Idle display label). An Active bot is not counted as currently working unless its work text says so.
- Team cards list every bot on the team with that bot's `work` summary.
- The diagram is drawn as inline SVG with a simple left-to-right layered layout starting from the `person` node. It scrolls inside its own labelled region.
- Light/dark follows `prefers-color-scheme` via CSS variables. Under 640px the table becomes stacked cards, and long status labels wrap inside pills, cards, and filter controls.
- Filters cover team, raw status, and work view (all, current or recurring, last work, not started). The team filter can be deep-linked: `/?team=Community`.
- Served by `nginx:alpine`; the official image's template step substitutes `${PORT}` into the config at start.
- All links are relative; the only absolute URL is the canonical `https://bots.themottfamily.net/`. Never put a Cloud Run default, tag or revision URL in the site.
