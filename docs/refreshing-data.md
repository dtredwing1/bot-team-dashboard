# Refreshing data
Everything is in `site/data/bots.json`.

- `asOf` (YYYY-MM-DD) and `asOfLabel` (shown text). Dates must come from a bot's actual activity, not from the day someone reads a profile.
- `title` and `summary`: page heading and subtitle.
- `intro`, `statusNote`, and `tip`: the intro (use `{count}` for the bot total), the activity-window note, and the short operational note beside the bot list.
- `teams`: ordered team list. Each bot's `team` must match one exactly.
- `bots[]`: `name`, `team`, `role`, `work`, `lastActive` (YYYY-MM-DD or ""), `status`.
  - Raw status values stay `Active`, `Recent`, `Idle`, and `Not started`.
  - Those values are activity windows, not proof a bot is executing right now. `Active` means activity in the last 7 days. `Recent` means 8–30 days. `Idle` means over 30 days, or no dated activity. `Not started` means no recorded work.
  - `work` starts with `Current`, `Recurring`, or `Last`. Bots with no recorded work use a plain not-started sentence and do not use those prefixes.
  - `statusLabels.Idle` must stay exactly `Getting bored, ready for action`. Pills, the status filter, and the idle headline use that display text. The raw value stays `Idle`.
- `diagram.nodes[]` (`id`, `label`, optional `detail`, `kind: "person"` for the root) and `diagram.edges[]` (`from`, `to`, optional `label`, `dashed`).

Privacy rules (the site is public): no kids' names or schools, emails, addresses, account numbers, dollar amounts, network details, employer names, or bot ids. Describe things generically ("dance schedule manager", not the studio's name). Run `./scripts/privacy-check.sh` before committing. Keep research notes and raw exports out of `site/` and the published image.
