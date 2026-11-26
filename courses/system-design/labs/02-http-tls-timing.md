# Lab 02 · HTTP, TLS 1.3 & Protocol Timing Inspection

**Goal:** Measure real-world DNS, TCP, TLS, and server-processing phases from the command line, and compare HTTP/1.1 vs. HTTP/2 vs. TLS session resumption with concrete timing units.
**Level:** Beginner → Intermediate
**Estimated effort:** 30–45 minutes

## Scenario and setup

Modern browsers hide network setup behind fast connection reuse. When debugging slow mobile clients or cross-region APIs, you need to separate **DNS resolution**, **TCP handshake**, **TLS negotiation**, and **server Time-To-First-Byte (TTFB)**.

**Prerequisites:**
- `curl` (version `7.68+` compiled with HTTP/2 support; check `curl --version`).
- `openssl` (`1.1.1+` or `3.x`) for inspecting TLS 1.3 negotiation and certificates.
- Optional: a local NGINX or Caddy server if running offline, or a single low-rate test against a public reference endpoint such as `https://example.com` or `https://cloudflare.com` (keep requests manual and under 10 total).

> **Safety note:** Only run manual single-request `curl` checks against endpoints you own or public test domains. Never run load-testing loops against third-party sites.

## Starting assumptions

| Input | Value | How to validate |
|---|---|---|
| Local `curl` supports HTTP/2 & TLS 1.3 | Yes | `curl --version` lists `HTTP2` and OpenSSL/BoringSSL `1.1.1+` / `3.x` |
| Cold connection setup cost | `2–3` RTTs (TCP + TLS) | Compare `time_appconnect` vs. `time_starttransfer` |
| Reused connection setup cost | `0` extra TCP/TLS RTTs | Send two requests over one `curl` command |

## Tasks

- [ ] **Task 1 · Measure phase-by-phase timings on a cold connection**
  Create a `curl` format string (or run inline) to print each phase in seconds (`s`) and convert to milliseconds (`ms`):
  ```bash
  curl -o /dev/null -sS -w \
    "protocol=%{http_version}\ndns=%{time_namelookup}s\ntcp=%{time_connect}s\ntls=%{time_appconnect}s\nttfb=%{time_starttransfer}s\ntotal=%{time_total}s\n" \
    https://example.com
  ```
  Note that `curl` timing variables are **cumulative** from request start:
  - `DNS duration = time_namelookup`
  - `TCP handshake = time_connect - time_namelookup`
  - `TLS handshake = time_appconnect - time_connect`
  - `Server processing + 1 RTT = time_starttransfer - time_appconnect`

- [ ] **Task 2 · Compare HTTP/1.1 vs. HTTP/2 over the same target**
  Run the same format command forcing `--http1.1` vs. `--http2` (`curl --http2 ...`), and then fetch **two URLs in one invocation** (`curl --http2 ... https://example.com https://example.com`) to observe `time_connect = 0` / `time_appconnect = 0` on the second reused stream.

- [ ] **Task 3 · Inspect the negotiated TLS version and cipher**
  Run a verbose TLS check:
  ```bash
  curl -vI --tlsv1.3 https://example.com 2>&1 | grep -E "SSL connection|ALPN|TLSv1"
  ```
  Record the negotiated TLS version (`TLSv1.3`), cipher suite, and ALPN protocol (`h2` vs. `http/1.1`).

- [ ] **Task 4 · Measure HTTP/3 (QUIC) if supported by your `curl` build**
  Check if `curl --version` includes `HTTP3`. If supported, compare `curl --http3-only` vs. `--http2` cold handshake times; if not supported locally, note the build limitation in your evidence and inspect `Alt-Svc` headers returned over HTTP/2.

## Expected evidence

- Raw terminal output of your `curl -w` runs for HTTP/1.1, HTTP/2 (cold + reused), and verbose TLS/ALPN lines.
- A small summary table converting cumulative timestamps into **individual stage durations in `ms`**:
  - DNS (`ms`), TCP (`ms`), TLS (`ms`), TTFB wait (`ms`), Total (`ms`).
- One concise paragraph explaining why the second request in a pooled connection was dramatically faster than the first.

## Reflection

1. What did you expect the ratio of TLS handshake time to server processing time to be?
2. What actually happened across cold vs. reused connections?
3. Which assumption about connection latency (e.g., DNS vs. TLS vs. backend time) would change most for a user on a `180 ms` cellular RTT?
4. What would you change at `10×` scale (e.g., TLS session resumption, connection pooling, keep-alive tuning, or moving static assets to HTTP/3)?

## Cleanup

No persistent cloud resources or background daemons were started. If you spun up a local NGINX/Caddy container for offline testing, stop and remove it (for example, `docker stop <container> && docker rm <container>`).

## References

- [RFC 9110 · HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110)
- [RFC 8446 · The Transport Layer Security (TLS) Protocol Version 1.3](https://www.rfc-editor.org/rfc/rfc8446)
- [curl manpage · `--write-out` timing variables](https://curl.se/docs/manpage.html#-w)
