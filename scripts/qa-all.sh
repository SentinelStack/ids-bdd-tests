#!/usr/bin/env sh
# O singură comandă care face tot ce trebuie ca să rulezi suita BDD pe QA:
#   npm run qa                  # toate testele
#   npm run qa -- --grep @api   # filtrat (orice argument se pasează la playwright)
#   npm run qa -- --ui          # deschide UI-ul web Playwright
cd "$(dirname "$0")/.." || exit 1

echo "▶ 1/4 dependențe…"
[ -d node_modules ] || npm install || exit 1

echo "▶ 2/4 browser Chromium…"
npx playwright install chromium || exit 1

echo "▶ 3/4 secrete QA…"
[ -f qa.env ] || { echo "  ✗ Lipsește qa.env — creează-l cu secretele QA (vezi README)."; exit 1; }
. ./qa.env
echo "  mediu = $ENV  ·  operator = $OPERATOR_USER"

echo "▶ 4/4 generez spec-uri + rulez…"
npx bddgen || exit 1
npx playwright test "$@"
code=$?

echo ""
if [ "$code" -eq 0 ]; then
  echo "✓ Gata — totul a trecut.  Raport HTML:  npm run report"
else
  echo "✗ Au fost eșecuri (cod $code).  Raport HTML:  npm run report"
fi
exit $code
