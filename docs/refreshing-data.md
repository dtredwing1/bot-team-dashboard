# Refreshing data
Everything is in `site/data/bots.json`.

- `asOf` (YYYY-MM-DD) and `asOfLabel` (shown text).
- `teams`: ordered team list. Each bot's `team` must match one exactly.
- `bots[]`: `name`, `team`, `role`, `work`, `lastActive` (YYYY-MM-DD or ""), `status` (`Active` = last 7 days, `Recent` = 8–30 days, `Idle` = over 30 days, `Not started`), optional `highlight` (shown on team cards).
- `diagram.nodes[]` (`id`, `label`, optional `detail`, `kind: "person"` for the root) and `diagram.edges[]` (`from`, `to`, optional `label`, `dashed`).
- `ideas[]` (`title`, `detail`) and `tip`.

Privacy rules (the site is public): no kids' names or schools, emails, addresses, account numbers, dollar amounts, network details, employer names or bot ids. Describe things generically ("dance schedule manager", not the studio's name). Run `./scripts/privacy-check.sh` before committing.
