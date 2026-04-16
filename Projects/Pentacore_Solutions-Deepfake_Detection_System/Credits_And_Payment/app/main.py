import os
import time
import sqlite3
from typing import Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware


DB_PATH = os.environ.get("DATABASE_PATH", os.path.join("data", "credits.db"))
PRICE_PER_ANALYSIS = int(os.environ.get("PRICE_PER_ANALYSIS", "1"))
WELCOME_CREDITS = int(os.environ.get("WELCOME_CREDITS", "3"))
AD_REWARD_CREDITS = int(os.environ.get("AD_REWARD_CREDITS", "1"))

app = FastAPI(title="Credits & Payment Service")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_conn():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        "CREATE TABLE IF NOT EXISTS balances (user_id TEXT PRIMARY KEY, balance INTEGER NOT NULL)"
    )
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS ledger (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            delta INTEGER NOT NULL,
            reason TEXT,
            created_ts INTEGER NOT NULL
        )
        """
    )
    # Track one-time awards by code (e.g., 'welcome') to ensure idempotency
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS awards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            code TEXT NOT NULL,
            created_ts INTEGER NOT NULL,
            UNIQUE(user_id, code)
        )
        """
    )
    # Track ad reward references to avoid duplicate credits per ad view
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS ad_rewards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            ref TEXT NOT NULL,
            created_ts INTEGER NOT NULL,
            UNIQUE(user_id, ref)
        )
        """
    )
    return conn


class GrantBody(BaseModel):
    user_id: str
    amount: int
    reason: Optional[str] = None


class ChargeBody(BaseModel):
    user_id: str
    amount: int
    reason: Optional[str] = None


class RegisterBody(BaseModel):
    user_id: str


class AdRewardBody(BaseModel):
    user_id: str
    ref: Optional[str] = None  # Optional ad reference/id to ensure idempotency


@app.get("/health")
def health():
    return {"status": "ok"}

# Support ALB path-based routing under /credits/* by exposing a prefixed health endpoint
@app.get("/credits/health")
def health_prefixed():
    return health()


@app.get("/price")
def price():
    return {"price": PRICE_PER_ANALYSIS}

# Prefixed variant for ALB path-based routing
@app.get("/credits/price")
def price_prefixed():
    return price()


@app.get("/credits/{user_id}")
def get_credits(user_id: str):
    user_id = sanitize(user_id)
    with get_conn() as conn:
        cur = conn.execute("SELECT balance FROM balances WHERE user_id=?", (user_id,))
        row = cur.fetchone()
        if row is None:
            conn.execute("INSERT INTO balances(user_id, balance) VALUES(?, 0)", (user_id,))
            balance = 0
        else:
            balance = int(row[0])
    return {"user_id": user_id, "balance": balance, "currency": "credits"}


@app.post("/credits/grant")
def grant(body: GrantBody):
    if body.amount <= 0:
        raise HTTPException(status_code=400, detail="amount must be positive")
    uid = sanitize(body.user_id)
    ts = int(time.time())
    with get_conn() as conn:
        cur = conn.execute("SELECT balance FROM balances WHERE user_id=?", (uid,))
        row = cur.fetchone()
        bal = int(row[0]) if row else 0
        new_bal = bal + int(body.amount)
        conn.execute("INSERT OR REPLACE INTO balances(user_id, balance) VALUES(?, ?)", (uid, new_bal))
        conn.execute(
            "INSERT INTO ledger(user_id, delta, reason, created_ts) VALUES(?, ?, ?, ?)",
            (uid, int(body.amount), body.reason or "grant", ts),
        )
    return {"user_id": uid, "balance": new_bal}


@app.post("/credits/charge")
def charge(body: ChargeBody):
    if body.amount <= 0:
        raise HTTPException(status_code=400, detail="amount must be positive")
    uid = sanitize(body.user_id)
    ts = int(time.time())
    with get_conn() as conn:
        cur = conn.execute("SELECT balance FROM balances WHERE user_id=?", (uid,))
        row = cur.fetchone()
        bal = int(row[0]) if row else 0
        if bal < body.amount:
            raise HTTPException(status_code=402, detail="insufficient_credits")
        new_bal = bal - int(body.amount)
        conn.execute("UPDATE balances SET balance=? WHERE user_id=?", (new_bal, uid))
        conn.execute(
            "INSERT INTO ledger(user_id, delta, reason, created_ts) VALUES(?, ?, ?, ?)",
            (uid, -int(body.amount), body.reason or "charge", ts),
        )
    return {"user_id": uid, "balance": new_bal}


@app.post("/users/register")
def register_user(body: RegisterBody):
    """Idempotent registration endpoint: creates user balance row if needed and grants welcome credits once."""
    uid = sanitize(body.user_id)
    ts = int(time.time())
    awarded = False
    with get_conn() as conn:
        # Ensure balance row exists
        cur = conn.execute("SELECT balance FROM balances WHERE user_id=?", (uid,))
        row = cur.fetchone()
        if row is None:
            conn.execute("INSERT INTO balances(user_id, balance) VALUES(?, 0)", (uid,))
            bal = 0
        else:
            bal = int(row[0])
        # Try to insert award marker (unique)
        try:
            conn.execute(
                "INSERT INTO awards(user_id, code, created_ts) VALUES(?, ?, ?)",
                (uid, "welcome", ts),
            )
            # Grant welcome credits
            new_bal = bal + max(0, int(WELCOME_CREDITS))
            if new_bal != bal:
                conn.execute("UPDATE balances SET balance=? WHERE user_id=?", (new_bal, uid))
                conn.execute(
                    "INSERT INTO ledger(user_id, delta, reason, created_ts) VALUES(?, ?, ?, ?)",
                    (uid, int(WELCOME_CREDITS), "welcome", ts),
                )
                bal = new_bal
                awarded = True
        except sqlite3.IntegrityError:
            # Already awarded
            pass
    return {"user_id": uid, "balance": bal, "awarded": awarded, "welcome_credits": int(WELCOME_CREDITS)}

# Prefixed variant for ALB path-based routing (optional convenience)
@app.post("/credits/users/register")
def register_user_prefixed(body: RegisterBody):
    return register_user(body)


@app.post("/credits/earn/ad")
def earn_ad(body: AdRewardBody):
    """Grant ad reward credits. If ref provided, ensures one-time reward per (user, ref)."""
    uid = sanitize(body.user_id)
    ts = int(time.time())
    amount = max(0, int(AD_REWARD_CREDITS))
    awarded = False
    ref = body.ref.strip() if body.ref else None
    with get_conn() as conn:
        # Ensure user exists
        cur = conn.execute("SELECT balance FROM balances WHERE user_id=?", (uid,))
        row = cur.fetchone()
        if row is None:
            conn.execute("INSERT INTO balances(user_id, balance) VALUES(?, 0)", (uid,))
            bal = 0
        else:
            bal = int(row[0])
        if amount <= 0:
            return {"user_id": uid, "balance": bal, "awarded": False, "amount": amount, "ref": ref}
        # If ref provided, enforce uniqueness
        if ref:
            try:
                conn.execute(
                    "INSERT INTO ad_rewards(user_id, ref, created_ts) VALUES(?, ?, ?)",
                    (uid, ref, ts),
                )
                new_bal = bal + amount
                conn.execute("UPDATE balances SET balance=? WHERE user_id=?", (new_bal, uid))
                conn.execute(
                    "INSERT INTO ledger(user_id, delta, reason, created_ts) VALUES(?, ?, ?, ?)",
                    (uid, amount, "ad_reward", ts),
                )
                bal = new_bal
                awarded = True
            except sqlite3.IntegrityError:
                # Duplicate ad ref -> no-op
                awarded = False
        else:
            # No ref: always grant
            new_bal = bal + amount
            conn.execute("UPDATE balances SET balance=? WHERE user_id=?", (new_bal, uid))
            conn.execute(
                "INSERT INTO ledger(user_id, delta, reason, created_ts) VALUES(?, ?, ?, ?)",
                (uid, amount, "ad_reward", ts),
            )
            bal = new_bal
            awarded = True
    return {"user_id": uid, "balance": bal, "awarded": awarded, "amount": amount, "ref": ref}


def sanitize(uid: str) -> str:
    import re
    s = re.sub(r"[^A-Za-z0-9_-]", "_", uid)[:64]
    return s or "user"
