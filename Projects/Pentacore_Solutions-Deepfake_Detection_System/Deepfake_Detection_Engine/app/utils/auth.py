import os
import time
import json
from typing import Optional, Dict, Any

import requests
from jose import jwt


class CognitoVerifier:
    def __init__(self) -> None:
        self.enforce = os.environ.get("COGNITO_ENFORCE", "false").lower() in {"1", "true", "yes", "on"}
        self.region = os.environ.get("COGNITO_REGION")
        self.user_pool_id = os.environ.get("COGNITO_USER_POOL_ID")
        self.client_id = os.environ.get("COGNITO_USER_POOL_CLIENT_ID")
        self.issuer = f"https://cognito-idp.{self.region}.amazonaws.com/{self.user_pool_id}" if self.region and self.user_pool_id else None
        self._jwks: Optional[Dict[str, Any]] = None
        self._jwks_exp = 0.0

    def is_enabled(self) -> bool:
        return bool(self.enforce and self.region and self.user_pool_id and self.client_id)

    def _load_jwks(self) -> Dict[str, Any]:
        now = time.time()
        if self._jwks and now < self._jwks_exp:
            return self._jwks
        if not self.issuer:
            raise RuntimeError("Cognito issuer not configured")
        url = f"{self.issuer}/.well-known/jwks.json"
        resp = requests.get(url, timeout=5)
        resp.raise_for_status()
        data = resp.json()
        self._jwks = data
        self._jwks_exp = now + 3600  # cache 1 hour
        return data

    def _get_kid_key(self, kid: str) -> Optional[Dict[str, Any]]:
        jwks = self._load_jwks()
        for k in jwks.get("keys", []):
            if k.get("kid") == kid:
                return k
        return None

    def verify_bearer(self, auth_header: Optional[str]) -> Optional[Dict[str, Any]]:
        if not self.is_enabled():
            return None
        if not auth_header or not auth_header.lower().startswith("bearer "):
            raise ValueError("missing_bearer")
        token = auth_header.split(" ", 1)[1].strip()
        # Decode header to get kid
        try:
            header = jwt.get_unverified_header(token)
        except Exception as e:
            raise ValueError("invalid_token_header") from e
        kid = header.get("kid")
        if not kid:
            raise ValueError("missing_kid")
        key = self._get_kid_key(kid)
        if not key:
            raise ValueError("unknown_kid")
        # Verify
        try:
            claims = jwt.decode(
                token,
                key,
                algorithms=[key.get("alg", "RS256"), "RS256"],
                audience=self.client_id,
                issuer=self.issuer,
                options={"verify_at_hash": False},
            )
        except Exception as e:
            raise ValueError("invalid_token") from e
        return claims

    def derive_user_id(self, claims: Dict[str, Any]) -> str:
        # Prefer sub; else try username/email
        uid = claims.get("sub") or claims.get("username") or claims.get("cognito:username") or claims.get("email")
        if not uid:
            uid = "user"
        # sanitize similar to backend sanitize_user_id
        import re
        return re.sub(r"[^A-Za-z0-9_-]", "_", str(uid))[:64] or "user"


VERIFIER = CognitoVerifier()
