Credits & Payment Service

Overview
- Lightweight FastAPI microservice to manage user credits and simple payment-like charging for the Deepfake Detection Engine.
- Uses SQLite for persistence with a simple balance + ledger model.

Key Endpoints
- GET `/health` → `{ status: "ok" }`
- GET `/price` → `{ price: <int> }` from env `PRICE_PER_ANALYSIS` (default: 1)
- GET `/credits/{user_id}` → `{ user_id, balance, currency: "credits" }` (auto-creates user with 0 balance)
- POST `/credits/grant` → increment balance. Body: `{ user_id: string, amount: int, reason?: string }`
- POST `/credits/charge` → decrement balance if sufficient. Body: `{ user_id: string, amount: int, reason?: string }`
- POST `/users/register` → idempotent; creates user if needed and grants welcome credits once. Body: `{ user_id: string }`
- POST `/credits/earn/ad` → grant ad reward credits. Body: `{ user_id: string, ref?: string }` (if `ref` provided, one-time per `(user, ref)`).

Run locally (Python)
```powershell
cd "Credits_And_Payment"
python -m venv .venv; .\.venv\Scripts\Activate.ps1
pip install -r app\requirements.txt
$env:PRICE_PER_ANALYSIS="1"
$env:WELCOME_CREDITS="3"
$env:AD_REWARD_CREDITS="1"
uvicorn app.main:app --host 0.0.0.0 --port 8002 --reload
```

Docker
This service is included in the root `docker-compose.yml` as `credits`. To run in Compose:
```powershell
docker compose up -d credits
```

Default ports
- Inside container the service listens on `8002`.
- On the host, Compose maps `${CREDITS_HOST_PORT:-8003} -> 8002` by default.

Environment (.env)
- Place a `.env` file in this folder (`Credits_And_Payment/.env`) to configure the container via Compose:
  - `PRICE_PER_ANALYSIS=1`
  - `WELCOME_CREDITS=3`
  - `AD_REWARD_CREDITS=1`
  - `DATABASE_PATH=/data/credits.db`  # container path; volume `credits_data` is mounted at `/data`

Local run (without Docker) can set these via PowerShell `$env:` variables (see example above).

Common operations (examples)
```powershell
# Register a user (idempotent) → grants welcome credits once
Invoke-RestMethod -Method Post -ContentType 'application/json' `
  -Uri 'http://localhost:8003/users/register' `
  -Body '{"user_id":"user-123"}'

# Grant 5 credits manually
Invoke-RestMethod -Method Post -ContentType 'application/json' `
  -Uri 'http://localhost:8003/credits/grant' `
  -Body '{"user_id":"user-123","amount":5,"reason":"promo"}'

# Earn ad reward (with idempotent reference)
Invoke-RestMethod -Method Post -ContentType 'application/json' `
  -Uri 'http://localhost:8003/credits/earn/ad' `
  -Body '{"user_id":"user-123","ref":"ad-impression-abc"}'

# Check balance
Invoke-RestMethod -Method Get -Uri 'http://localhost:8003/credits/user-123'
```

Data Model
- `balances(user_id PRIMARY KEY, balance INTEGER NOT NULL)`
- `ledger(id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT, delta INTEGER, reason TEXT, created_ts INTEGER)`
- `awards(id, user_id, code UNIQUE per user)` for welcome credits idempotency
- `ad_rewards(id, user_id, ref UNIQUE per user)` for ad reward idempotency

Environment
- `PRICE_PER_ANALYSIS` (default `1`): integer credits charged per analysis
- `DATABASE_PATH` (default `data/credits.db`): SQLite file path
- `WELCOME_CREDITS` (default `3`): one-time welcome credits on registration
- `AD_REWARD_CREDITS` (default `1`): credits per ad view reward

Notes
- This service is intentionally simple and not a real payment processor. Integrate with your billing as needed.
- The Deepfake Detection Engine can be configured to require credits via `CREDITS_ENABLED=true` and `CREDITS_API_URL=http://credits:8002`.

## Disable credits during testing

If you want to test the engine without requiring user credits, set the feature flag off and recreate the engine container.

- In Docker Compose (root `.env` or service env):
  - `CREDITS_ENABLED=false`
- Then rebuild/restart the engine:
  ```powershell
  docker compose up -d --build detection_engine
  ```

Behavior when disabled:
- The engine skips pre-charge and does not call the credits service.
- API responses won’t return HTTP 402 (Payment Required).
