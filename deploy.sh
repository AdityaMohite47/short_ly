#!/usr/bin/env bash
# Deploys short.ly ON THE SERVER: pulls the latest code, rebuilds the images and restarts the containers.
#
# Usage (on the server, inside the cloned repo):
#   ./deploy.sh            # deploy the current branch
#   ./deploy.sh main       # switch to a branch and deploy it
#
# Needs a .env.docker next to this script (copy .env.docker.example and fill it in).
# That file holds the secrets and is gitignored, so `git pull` never touches it.

set -euo pipefail   # stop on the first error, on unset variables, and on failures inside pipes

cd "$(dirname "$0")"   # always run from the repo root, wherever the script is called from

ENV_FILE=".env.docker"
COMPOSE="docker compose --env-file $ENV_FILE"
BRANCH="${1:-$(git rev-parse --abbrev-ref HEAD)}"

step() { printf '\n\033[1;34m==> %s\033[0m\n' "$*"; }
fail() { printf '\033[1;31mERROR: %s\033[0m\n' "$*" >&2; exit 1; }

step "Pre-flight checks"
command -v docker >/dev/null        || fail "docker is not installed"
docker compose version >/dev/null   || fail "the docker compose plugin is not installed"
docker info >/dev/null 2>&1         || fail "cannot talk to docker: is it running, and is $USER in the docker group?"
[ -f "$ENV_FILE" ]                  || fail "$ENV_FILE is missing. Run: cp .env.docker.example $ENV_FILE  and fill it in"
[ -z "$(git status --porcelain --untracked-files=no)" ] \
                                    || fail "tracked files were edited on the server; commit or discard them (git status)"

step "Pulling latest code ($BRANCH)"
PREVIOUS=$(git rev-parse --short HEAD)
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git merge --ff-only "origin/$BRANCH"   # refuses to create merge commits on the server
CURRENT=$(git rev-parse --short HEAD)
if [ "$PREVIOUS" = "$CURRENT" ]; then
  echo "Already at $CURRENT (no new commits); rebuilding anyway"
else
  echo "Updated $PREVIOUS -> $CURRENT"
  git log --oneline "$PREVIOUS..$CURRENT"
fi

step "Building images and restarting containers"
# Only containers whose image or config changed get recreated; postgres/redis data lives in volumes.
$COMPOSE up --build -d --remove-orphans

step "Removing old unused images to free disk space"
docker image prune -f >/dev/null

step "Container status"
$COMPOSE ps --format 'table {{.Service}}\t{{.Status}}\t{{.Ports}}'

step "Smoke test"
WEB_PORT=$(grep '^WEB_PORT=' "$ENV_FILE" | cut -d= -f2-)
for _ in {1..15}; do
  if curl -fsS -o /dev/null "http://localhost:$WEB_PORT/"; then
    printf '\033[1;32mDeployed %s successfully\033[0m\n' "$CURRENT"
    exit 0
  fi
  sleep 2
done
$COMPOSE logs --tail 30 backend web
fail "the site did not respond on port $WEB_PORT (logs above)"
