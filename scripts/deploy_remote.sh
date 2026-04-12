#!/usr/bin/env bash

set -Eeuo pipefail

APP_DIR=${APP_DIR:-$(pwd)}
RELEASE_DIR=${RELEASE_DIR:-}
ENV_FILE=${ENV_FILE:-.env.production}
COMPOSE_FILE=${COMPOSE_FILE:-docker-compose.deploy.yml}
APP_PORT=${APP_PORT:-9997}
APP_VERSION=${APP_VERSION:-0.1.90}
GIT_COMMIT=${GIT_COMMIT:-unknown}

log() {
  printf '[deploy] %s\n' "$*"
}

docker_cmd() {
  if docker info >/dev/null 2>&1; then
    docker "$@"
  else
    sudo docker "$@"
  fi
}

set_or_append() {
  local key=$1
  local value=$2

  if grep -q "^${key}=" "$ENV_FILE"; then
    python3 - "$ENV_FILE" "$key" "$value" <<'PY'
from pathlib import Path
import sys

path = Path(sys.argv[1])
key = sys.argv[2]
value = sys.argv[3]
lines = path.read_text().splitlines()
for index, line in enumerate(lines):
    if line.startswith(f"{key}="):
        lines[index] = f"{key}={value}"
        break
path.write_text("\n".join(lines) + "\n")
PY
  else
    printf '%s=%s\n' "$key" "$value" >> "$ENV_FILE"
  fi
}

ensure_docker() {
  if command -v docker >/dev/null 2>&1 && docker_cmd compose version >/dev/null 2>&1; then
    return
  fi

  log "Installing Docker and Compose plugin"
  sudo apt-get update
  sudo apt-get install -y ca-certificates curl gnupg
  sudo install -m 0755 -d /etc/apt/keyrings
  if [ ! -f /etc/apt/keyrings/docker.asc ]; then
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo tee /etc/apt/keyrings/docker.asc >/dev/null
    sudo chmod a+r /etc/apt/keyrings/docker.asc
  fi
  if [ ! -f /etc/apt/sources.list.d/docker.list ]; then
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo \"$VERSION_CODENAME\") stable" | sudo tee /etc/apt/sources.list.d/docker.list >/dev/null
  fi
  sudo apt-get update
  sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
}

ensure_env_file() {
  if [ ! -f "$ENV_FILE" ]; then
    log "Creating $ENV_FILE from template"
    cp .env.production.example "$ENV_FILE"
  fi

  if ! grep -q '^POSTGRES_PASSWORD=' "$ENV_FILE" || [ -z "$(sed -n 's/^POSTGRES_PASSWORD=//p' "$ENV_FILE")" ]; then
    set_or_append POSTGRES_PASSWORD "$(openssl rand -hex 24)"
  fi

  if ! grep -q '^JWT_SECRET=' "$ENV_FILE" || [ -z "$(sed -n 's/^JWT_SECRET=//p' "$ENV_FILE")" ]; then
    set_or_append JWT_SECRET "$(openssl rand -hex 32)"
  fi

  if ! grep -q '^FRONTEND_ORIGIN=' "$ENV_FILE" || [ -z "$(sed -n 's/^FRONTEND_ORIGIN=//p' "$ENV_FILE")" ]; then
    set_or_append FRONTEND_ORIGIN "http://127.0.0.1:${APP_PORT}"
  fi

  if ! grep -q '^MULTICA_APP_URL=' "$ENV_FILE" || [ -z "$(sed -n 's/^MULTICA_APP_URL=//p' "$ENV_FILE")" ]; then
    set_or_append MULTICA_APP_URL "http://127.0.0.1:${APP_PORT}"
  fi
}

promote_release_dir() {
  if [ -z "$RELEASE_DIR" ] || [ "$RELEASE_DIR" = "$APP_DIR" ]; then
    return
  fi

  log "Promoting release payload from $RELEASE_DIR to $APP_DIR"
  mkdir -p "$APP_DIR"
  find "$APP_DIR" -mindepth 1 -maxdepth 1 \
    ! -name '.env.production' \
    ! -name '.env.production.local' \
    -exec rm -rf {} +
  cp -a "$RELEASE_DIR"/. "$APP_DIR"/
}

stop_existing_listener() {
  local pids
  pids=$(sudo fuser -n tcp "$APP_PORT" 2>/dev/null || true)
  if [ -n "$pids" ]; then
    log "Stopping existing listener(s) on 127.0.0.1:${APP_PORT}: $pids"
    sudo kill -9 $pids || true
  fi
}

deploy_stack() {
  export APP_PORT APP_VERSION GIT_COMMIT

  log "Stopping previous containers"
  docker_cmd compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" down --remove-orphans || true

  stop_existing_listener

  log "Starting containers"
  docker_cmd compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d --build --remove-orphans
}

healthcheck() {
  local url="http://127.0.0.1:${APP_PORT}"
  local attempt

  for attempt in $(seq 1 30); do
    if curl --silent --fail "$url" >/dev/null; then
      log "Frontend is reachable at $url"
      return 0
    fi
    sleep 2
  done

  log "Deployment healthcheck failed"
  docker_cmd compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" ps
  return 1
}

main() {
  promote_release_dir
  cd "$APP_DIR"
  ensure_docker
  ensure_env_file
  deploy_stack
  healthcheck
}

main "$@"