import uuid

import jwt


class SupabaseTokenVerifier:
    def __init__(self, supabase_url: str, jwks_url: str) -> None:
        self.issuer = f"{supabase_url}/auth/v1"
        self.jwks_client = jwt.PyJWKClient(jwks_url)

    def verify(self, token: str) -> tuple[uuid.UUID, str]:
        signing_key = self.jwks_client.get_signing_key_from_jwt(token)
        claims = jwt.decode(token, signing_key.key, algorithms=["ES256"], audience="authenticated", issuer=self.issuer)
        return uuid.UUID(claims["sub"]), claims["email"]
