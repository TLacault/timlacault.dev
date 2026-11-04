#!/usr/bin/env bash
# Build the static site and ship it to the IONOS webspace (ssh host `ionos`, folder portfolio/).
# The previous version is kept on the server as portfolio-prev/; roll back with:
#   ssh ionos 'rm -rf portfolio && cp -a portfolio-prev portfolio'
# usage: scripts/deploy.sh [--dry-run]    (--dry-run builds and lists what would change, uploads nothing)
set -euo pipefail
cd "$(dirname "$0")/.."

DRY=""; [[ "${1:-}" == "--dry-run" ]] && DRY="--dry-run"
HOST=ionos DIR=portfolio URL=https://timlacault.dev

[[ -z "$(git status --porcelain)" ]] || { echo "Uncommitted changes: commit first, so what's live is in git." >&2; exit 1; }
echo "→ deploying $(git rev-parse --abbrev-ref HEAD)@$(git rev-parse --short HEAD)"

pnpm -s generate >/dev/null
# A running `nuxt dev` rewrites .output, so copy the build out right away.
OUT=$(mktemp -d); trap 'rm -rf "$OUT"' EXIT
cp -a .output/public/. "$OUT/"
grep -q '<title>' "$OUT/index.html" 2>/dev/null || { echo "Build looks broken (no index.html with a title)." >&2; exit 1; }

ssh -o BatchMode=yes "$HOST" true || { echo "Can't reach '$HOST' over SSH (key ~/.ssh/hosting)." >&2; exit 1; }
[[ -z "$DRY" ]] && ssh "$HOST" "rm -rf $DIR-prev && cp -a $DIR $DIR-prev"
# favicon.ico lives only on the server (the build has none), so keep it.
rsync -az --delete --exclude favicon.ico $DRY --itemize-changes "$OUT/" "$HOST:$DIR/" | grep -v '^\.' || true

[[ -n "$DRY" ]] && { echo "dry run: nothing uploaded"; exit 0; }
code=$(curl -s -o /dev/null -w '%{http_code}' "$URL/?v=$RANDOM")
[[ "$code" == 200 ]] && echo "✓ live: $URL ($code)" || { echo "✗ $URL answered $code" >&2; exit 1; }
