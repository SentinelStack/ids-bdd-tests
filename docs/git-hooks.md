# Git hooks

Scripturile din `scripts/git-hooks/node/` impun convenții:
- `branch-name-check.mjs` — denumirea ramurii;
- `commit-message-check.mjs` — Conventional Commits;
- `pre-push-check.mjs` — typecheck + lint înainte de push.

Instalare (exemplu): leagă-le din `.git/hooks` sau printr-un util ca Husky.
