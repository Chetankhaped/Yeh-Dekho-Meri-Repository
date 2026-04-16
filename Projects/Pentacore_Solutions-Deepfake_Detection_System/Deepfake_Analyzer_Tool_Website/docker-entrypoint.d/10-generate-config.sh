#!/bin/sh
set -eu

HTML_ROOT="/usr/share/nginx/html"

# Generate runtime-config.json if relevant env vars are provided
if [ -n "${ENGINE_BASE_URL:-}" ] || [ -n "${CREDITS_BASE_URL:-}" ]; then
  ENGINE="${ENGINE_BASE_URL:-http://localhost:8001}"
  ENGINE_UPLOAD="${ENGINE_UPLOAD_BASE_URL:-$ENGINE}"
  CREDITS="${CREDITS_BASE_URL:-http://localhost:8003}"
  cat >"${HTML_ROOT}/runtime-config.json" <<EOF
{
  "engine_base_url": "${ENGINE}",
  "engine_upload_base_url": "${ENGINE_UPLOAD}",
  "credits_base_url": "${CREDITS}"
}
EOF
  echo "[entrypoint] Wrote runtime-config.json"
fi

# Generate config.json (OIDC) only if key env vars provided; otherwise keep existing file
if [ -n "${COGNITO_AUTHORITY:-}" ] || [ -n "${COGNITO_CLIENT_ID:-}" ] || [ -n "${COGNITO_LOGOUT_DOMAIN:-}" ] || [ -n "${OIDC_REDIRECT_PATH:-}" ]; then
  AUTHORITY="${COGNITO_AUTHORITY:-}"
  CLIENT_ID="${COGNITO_CLIENT_ID:-}"
  # Default logout domain to Cognito Hosted UI for this deployment if not provided
  LOGOUT_DOMAIN="${COGNITO_LOGOUT_DOMAIN:-https://deepfake-tool-demo.auth.ap-south-1.amazoncognito.com}"
  REDIRECT_PATH="${OIDC_REDIRECT_PATH:-/index.html}"
  # Minimal validation: require authority and client_id to emit OIDC file
  if [ -n "$AUTHORITY" ] && [ -n "$CLIENT_ID" ]; then
    cat >"${HTML_ROOT}/config.json" <<EOF
{
  "oidc": {
    "authority": "${AUTHORITY}",
    "client_id": "${CLIENT_ID}",
    "logout_domain": "${LOGOUT_DOMAIN}",
    "redirect_path": "${REDIRECT_PATH}"
  }
}
EOF
    echo "[entrypoint] Wrote config.json (OIDC)"
  else
    echo "[entrypoint] Skipping config.json: missing COGNITO_AUTHORITY or COGNITO_CLIENT_ID"
  fi
fi

exit 0
