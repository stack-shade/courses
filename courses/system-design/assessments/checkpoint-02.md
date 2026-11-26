# Assessment 02 · Storage Internals, Transactions & Media Delivery

**Modules covered:** Module 01 (API Contracts) & Module 02 (Data Modeling, Storage Engines, Indexing, Transactions, Object Storage)
**Level:** Beginner → Intermediate
**Time:** 45 minutes

## Questions

1. You are designing an ingestion service receiving **40,000 sensor events/second** (`250 bytes/event`, immutable time-ordered appends, rare point lookups by `device_id + timestamp`). Would you pick a B+Tree engine (e.g., PostgreSQL) or an LSM-Tree engine (e.g., RocksDB / Cassandra), and why in terms of **write amplification**, **random vs sequential I/O**, and **space/read trade-offs**?
2. An application stores user profiles as nested JSON documents. Most reads fetch the entire profile, but **500×/second** a background counter updates only `last_seen_at`, while an admin query searches across `email` and `country`. What storage failure or write-amplification trap happens in a document store if profiles average 64 KB? How would you split the schema?
3. A PostgreSQL table `invoices(id, tenant_id, status, created_at, amount_cents)` has 50 million rows and an index `ON invoices (status, tenant_id, created_at DESC)`. Explain why:
   - `WHERE tenant_id = 91 AND status = 'unpaid' ORDER BY created_at DESC LIMIT 20` uses the index,
   - `WHERE tenant_id = 91 ORDER BY created_at DESC LIMIT 20` falls back to a sequential scan (or full index scan), and
   - Adding `INCLUDE (amount_cents)` does not automatically eliminate `Heap Fetches` unless another maintenance condition is met.
4. Two concurrent hotel reservation transactions run under PostgreSQL `REPEATABLE READ` (Snapshot Isolation). Room 304 is currently free (`SELECT count(*) ...` returns `0` for both transactions), and each transaction inserts a different reservation row for Room 304 for the same dates, then commits. Why does Snapshot Isolation allow both commits to succeed? Name this anomaly and explain two distinct fixes.
5. Why is `UUIDv4` (random 128-bit) hazardous as a clustered primary key in a 500M-row InnoDB B+Tree table compared to `UUIDv7` or a 64-bit monotonic ID? Explain using buffer pool hit ratio and page splits.
6. Calculate the minimum number of multipart upload parts and maximum object size implications for a **12 GiB** video upload if each part is **16 MiB**, and explain why the API server must issue **presigned `PUT` URLs** rather than proxying the body through `POST /videos`.
7. What happens if a client completes 9 out of 10 parts of a multipart upload and crashes before calling `CompleteMultipartUpload`? How do you prevent silent storage billing growth?
8. An API endpoint `POST /transfers` times out at the client after 3 seconds while the server actually committed the transfer. The client retries. Why does wrapping the database write in `SERIALIZABLE` isolation alone **not** prevent a duplicate transfer?

## Practical task

Design the persistence and upload architecture for a **Collaborative Design Asset Platform** (like a lightweight Figma/Drive) with:
- **1M DAU**, each uploading **2 design bundles/day** averaging **150 MB** (`50%` under 10 MB, `5%` over 1 GB).
- **20M metadata reads/day** (`GET /projects/{id}/assets` sorted by `updated_at DESC`, filtered by `folder_id`).
- Strict requirement: Two collaborators renaming or moving the same asset concurrently must never overwrite each other silently, and uploading a 1 GB bundle must survive Wi-Fi drops without re-uploading completed chunks.

Produce:
1. A separation of **Control Plane metadata** vs **Data Plane blob storage**, naming the exact data model for each.
2. Composite index definition(s) for the asset listing query.
3. Optimistic or pessimistic concurrency control mechanism for concurrent asset edits.
4. End-to-end upload state machine (`initiated → uploading → verifying → ready → expired/aborted`).

## Scoring rubric

| Criterion | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| Understanding | Missing | Partial | Correct | Precise |
| Application | No attempt | Weak fit | Sound fit | Defends alternatives |
| Reasoning | No rationale | Limited | Clear | Evidence and trade-offs |

## Answer guide

<details><summary>Reveal hints</summary>

1. **LSM-Tree wins for 40k appends/sec:** B+Trees modify fixed 8–16 KiB pages in place, causing random I/O and frequent page splits/dirty-page flushes at `40,000 × 250 B = 10 MB/s` raw writes (amplified heavily by full-page WAL images + page rewrites). LSM-Trees append to a sequential WAL and in-memory MemTable, flushing sorted SSTables sequentially; the trade-off is background compaction CPU/disk I/O and higher read amplification (mitigated by Bloom filters and time-windowed compaction).
2. **Whole-document rewrite trap:** Updating a tiny 8-byte `last_seen_at` field inside a 64 KB BSON/JSON document forces the engine to rewrite the full 64 KB document plus WAL/replication (`500 × 64 KB = 32 MB/s` write amplification) and bloats secondary indexes. Fix: keep immutable/rarely changing profile attributes separate from high-churn telemetry (`user_presence` table or Redis), and index `(country, email)` explicitly.
3. **Leftmost-prefix & visibility map:**
   - The first query constrains both leading columns (`status`, `tenant_id`), so the planner seeks directly into `('unpaid', 91, ...)` in `created_at DESC` order.
   - Dropping `status` leaves the leftmost column unconstrained; the B-Tree is partitioned first by the 4 statuses, so rows for `tenant_id = 91` are scattered across all status subtrees. Fix: order the index `(tenant_id, status, created_at DESC)` since `tenant_id` has far higher cardinality.
   - `Index Only Scan` still checks the heap unless the table's **visibility map** confirms the page is `all-visible` (updated by `VACUUM`).
4. **Write Skew under Snapshot Isolation:** Both transactions read from the same `t_start` snapshot, see `0` rows, and insert *disjoint* new rows (no write-write conflict on the same row!). Both commit cleanly, violating the invariant ("at most 1 booking per room/date"). Fixes: (a) enforce a database exclusion/unique constraint (`EXCLUDE USING gist` or `UNIQUE (room_id, stay_date)`), (b) use `SERIALIZABLE` (`SSI`), or (c) lock a parent `rooms` row with `SELECT ... FOR UPDATE`.
5. **UUIDv4 vs UUIDv7:** Random UUIDv4 inserts scatter across the entire B+Tree leaf keyspace. Once the index exceeds RAM, every insert triggers random disk page reads, dirty evictions, and 50%-full page splits (high write amplification and cache thrashing). `UUIDv7` embeds a 48-bit millisecond timestamp prefix so new keys append monotonically to the rightmost leaf pages, keeping working-set pages hot in RAM.
6. **12 GiB @ 16 MiB parts:** `12 GiB = 12,288 MiB`; `12,288 ÷ 16 = 768` parts (well under S3's 10,000-part limit, and `16 MiB >= 5 MiB` minimum). Proxying 12 GiB through `POST /videos` pins API worker threads/memory, doubles network egress/ingress cost on the API tier, and breaks on single-request timeouts. Presigned URLs push bytes directly from client to object store.
7. **Orphaned multipart uploads:** Incomplete parts sit in hidden staging storage and still incur GB-month billing indefinitely. Configure a bucket lifecycle rule (`AbortIncompleteMultipartUpload`, e.g., after 7 days) and track sessions in the metadata DB for sweep/audit.
8. **Idempotency vs Isolation:** `SERIALIZABLE` isolates *concurrent* transactions; a client retry arrives as a *brand new* transaction after the first committed! Prevent duplicate side effects with an `Idempotency-Key` header enforced by a `UNIQUE` constraint on `(account_id, idempotency_key)` inside the same atomic transaction as the balance update.
9. **Practical task guidance:**
   - Control plane: PostgreSQL (`projects`, `folders`, `assets`, `asset_versions`, `upload_sessions`) with `UNIQUE (folder_id, name)` and `version INT` optimistic locking (`UPDATE assets SET name = $1, version = version + 1 WHERE id = $2 AND version = $3` -> `0` rows affected returns `409 Conflict`).
   - Data plane: S3-compatible object storage addressed by content hash or immutable `asset_versions/{asset_id}/{version_uuid}`, uploaded via presigned multipart URLs (e.g., 8–16 MiB chunks, `ListParts` resume).
   - Listing index: `(folder_id, updated_at DESC) INCLUDE (id, name, current_version, size_bytes)`.

</details>
