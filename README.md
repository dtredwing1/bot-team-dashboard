# Bot Central

A small public, read-only operational roster of Alan's Grok bots: who is working, what is underway, and who is ready for action. The page shows headline figures, a filterable bot table of current, recurring, and last work, a collaboration diagram, and work summaries for every bot on each team.

Live: https://bots.themottfamily.net

## Layout
- `site/` – static files (`index.html`, `styles.css`, `app.js`). No build step, no framework.
- `site/data/bots.json` – **all content lives here.** Edit this one file to refresh the page.
- `Dockerfile`, `nginx.conf.template` – nginx container that listens on `$PORT` (Cloud Run).
- `scripts/privacy-check.sh` – run before every commit/deploy.
- `docs/` – [architecture](docs/architecture.md), [deploy](docs/deploy.md), [refreshing data](docs/refreshing-data.md).

## Refresh the data (short version)
1. Edit `site/data/bots.json` (update `asOf`/`asOfLabel`, bots, and work text).
2. `./scripts/privacy-check.sh`
3. Preview: `cd site && python3 -m http.server 8000`
4. Commit, push, then deploy from an approved machine (see docs/deploy.md). Git only syncs code.

No GitHub Actions: this repo is built and deployed by hand only. No secrets are needed or stored.
