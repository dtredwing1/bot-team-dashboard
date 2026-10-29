# Bot Team Dashboard

A small public, read-only page showing Alan's team of Grok Bots: headline figures, a filterable bot table, a collaboration diagram, team highlights and "Ideas to steal."

Live: https://bots.themottfamily.net

## Layout
- `site/` – static files (`index.html`, `styles.css`, `app.js`). No build step, no framework.
- `site/data/bots.json` – **all content lives here.** Edit this one file to refresh the page.
- `Dockerfile`, `nginx.conf.template` – nginx container that listens on `$PORT` (Cloud Run).
- `scripts/privacy-check.sh` – run before every commit/deploy.
- `docs/` – [architecture](docs/architecture.md), [deploy](docs/deploy.md), [refreshing data](docs/refreshing-data.md).

## Refresh the data (short version)
1. Edit `site/data/bots.json` (update `asOf`/`asOfLabel`, bots, ideas).
2. `./scripts/privacy-check.sh`
3. Preview: `cd site && python3 -m http.server 8000`
4. Commit, push, then deploy from your workstation (see docs/deploy.md).

No GitHub Actions: this repo is built and deployed by hand only. No secrets are needed or stored.
