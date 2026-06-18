# Git hooks

The scripts under `scripts/git-hooks/node/` enforce conventions:
- `branch-name-check.mjs` — branch naming;
- `commit-message-check.mjs` — Conventional Commits;
- `pre-push-check.mjs` — typecheck + lint before pushing.

Install (example): link them from `.git/hooks` or via a tool like Husky.
