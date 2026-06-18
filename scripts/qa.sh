#!/usr/bin/env sh
# Încarcă secretele QA din qa.env, apoi rulează comanda primită.
#   sh scripts/qa.sh npm test
[ -f qa.env ] || { echo "Lipsește qa.env — creează-l cu secretele QA (vezi README)."; exit 1; }
. ./qa.env
exec "$@"
