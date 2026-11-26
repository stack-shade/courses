# Lab 13 · Threat Modeling & OAuth 2.1 + PKCE Audit

**Goal:** construct a STRIDE threat model for a multi-tenant B2B API, implement and verify OAuth 2.1 Authorization Code + PKCE (`S256`) validation locally, and close three realistic authorization/token vulnerabilities.
**Level:** Advanced
**Estimated effort:** 60–90 minutes

## Scenario and setup

You are reviewing a new **Team Billing & Workspace API** before launch. It uses a Single Page App (SPA), a Backend-for-Frontend (BFF) or public client, an Authorization Server (IdP), and a Resource API backed by PostgreSQL. Security review flagged three risks: authorization code interception on mobile/SPA callbacks, missing audience/issuer checks on JWT verification, and Broken Object Level Authorization (BOLA / IDOR) on `/v1/invoices/{invoice_id}`.

**Prerequisites & tools:**
- Python 3.10+ (or Node.js / Go) + `openssl` or `cryptography` / `pyjwt` library for local RS256/EdDSA signing & PKCE `S256` verification.
- Optional: `curl` and `jq` to test token exchange and replay attacks locally.
- Safety note: Generate ephemeral local test keys only; never commit private keys or real client secrets.

## Starting assumptions

| Input | Value | How to validate |
|---|---:|---|
| PKCE method | `S256` (`BASE64URL(SHA256(code_verifier))`) | Reject `plain` or missing `code_challenge` at `/authorize` |
| Access token TTL | `300 s` (`5 min`), asymmetric `RS256` / `EdDSA` signed | Resource API verifies `iss`, `aud`, `exp`, `nbf`, `scope` via JWKS |
| Refresh token policy | Single-use rotation + reuse detection | Replaying a rotated refresh token revokes the entire token family |
| Tenant isolation rule | Every query filters `WHERE id = $1 AND org_id = $2` | Integration test attempts cross-tenant ID access and expects `403`/`404` |

## Tasks

- [ ] **Task 1 — Build a STRIDE threat table across trust boundaries:** Draw the trust boundaries from [oauth-pkce-and-trust-boundaries.mmd](../diagrams/oauth-pkce-and-trust-boundaries.mmd) and map at least 6 concrete threats (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege) with specific mitigations.
- [ ] **Task 2 — Implement and test OAuth 2.1 + PKCE (`S256`) locally:** Write a minimal local script/server demonstrating: (a) generating a 64-byte `code_verifier` and `S256` `code_challenge`, (b) exchanging the auth code with the valid `code_verifier` (`200 OK`), and (c) replaying the same auth code or submitting a wrong `code_verifier` (`400 invalid_grant`).
- [ ] **Task 3 — Harden JWT + Resource API authorization:** Implement a Resource API middleware that validates `alg` allowlist (blocking `alg: none` and HS256/RS256 key-confusion), `iss`, `aud`, `exp`, required `scope`, and enforces **object-level authorization** (`org_id` from verified token claims, never from request body/query).
- [ ] **Task 4 — Verify refresh token reuse detection:** Simulate a stolen refresh token being replayed after legitimate rotation; verify the server revokes the token family and rejects subsequent refreshes.

## Expected evidence

- Completed STRIDE threat matrix covering all 3 trust boundaries.
- Working local test output (CLI logs or `pytest` / `go test` output) proving:
  - Valid PKCE `S256` flow succeeds; wrong `code_verifier` and replayed `code` fail.
  - `alg=none` and wrong-`aud` JWTs return `401 Unauthorized`.
  - Cross-tenant `GET /v1/invoices/{other_org_invoice}` returns `403` / `404` (never `200`).
  - Rotated refresh token replay triggers family revocation.

## Reflection

1. What did you expect when switching from Implicit flow / plain OAuth 2.0 to OAuth 2.1 + PKCE (`S256`)?
2. What actually happens if an attacker intercepts the redirect `code` on a mobile deep link when PKCE is enforced vs. omitted?
3. Which assumption about "validating the JWT signature is enough" failed in Task 3?
4. What would you change at 10× scale (10,000 tenants, fine-grained document sharing where simple RBAC roles explode into per-resource ACLs)?

## Cleanup

Delete temporary RSA/Ed25519 keypairs created in `/tmp` and stop any local test HTTP servers.

## References

- [Lesson 35 · System Security, Identity & Abuse Prevention](../lessons/35-security-identity.md)
- [RFC 9700 · Best Current Practice for OAuth 2.0 Security](https://www.rfc-editor.org/rfc/rfc9700)
- [RFC 7636 · Proof Key for Code Exchange (PKCE)](https://www.rfc-editor.org/rfc/rfc7636)
- [OWASP API Security Top 10 (BOLA / Broken Auth)](https://owasp.org/API-Security/)
