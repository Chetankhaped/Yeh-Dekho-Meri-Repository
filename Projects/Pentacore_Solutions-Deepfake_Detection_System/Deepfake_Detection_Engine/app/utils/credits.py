import os
from typing import Optional

import requests


class CreditsClient:
    def __init__(self, base_url: Optional[str], enabled: bool):
        self.base_url = (base_url or "").rstrip("/") if enabled else None
        self.enabled = bool(enabled and self.base_url)

    @classmethod
    def from_env(cls) -> "CreditsClient":
        enabled = os.environ.get("CREDITS_ENABLED", "false").lower() in {"1", "true", "yes", "on"}
        base = os.environ.get("CREDITS_API_URL", "http://credits:8002")
        return cls(base, enabled)

    def is_enabled(self) -> bool:
        return self.enabled

    def get_price(self) -> int:
        if not self.enabled:
            return 0
        try:
            r = requests.get(f"{self.base_url}/price", timeout=5)
            r.raise_for_status()
            data = r.json()
            return int(data.get("price", 1))
        except Exception:
            # Fallback to 1 if service unavailable
            return 1

    def ensure_balance(self, user_id: str, required: int) -> bool:
        if not self.enabled:
            return True
        try:
            r = requests.get(f"{self.base_url}/credits/{user_id}", timeout=5)
            if r.status_code == 404:
                return required <= 0
            r.raise_for_status()
            bal = int(r.json().get("balance", 0))
            return bal >= required
        except Exception:
            return False

    def charge(self, user_id: str, amount: int, reason: str = "charge") -> bool:
        if not self.enabled or amount <= 0:
            return True
        try:
            r = requests.post(
                f"{self.base_url}/credits/charge",
                json={"user_id": user_id, "amount": int(amount), "reason": reason},
                timeout=8,
            )
            return r.ok
        except Exception:
            return False

    def register(self, user_id: str) -> bool:
        if not self.enabled:
            return True
        try:
            r = requests.post(
                f"{self.base_url}/users/register",
                json={"user_id": user_id},
                timeout=6,
            )
            return r.ok
        except Exception:
            return False
