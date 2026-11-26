# Lab 04 · Indexing & `EXPLAIN ANALYZE`

**Goal:** Measure how B-Tree column order, selectivity, and covering indexes transform query latency and buffer reads on 1,000,000 rows using PostgreSQL `EXPLAIN (ANALYZE, BUFFERS)`.
**Level:** Beginner → Intermediate
**Estimated effort:** 45–60 minutes

## Scenario and setup

An e-commerce service stores order history in PostgreSQL. Customers load their recent orders filtered by `customer_id` and `status`, sorted by `created_at DESC`, displaying only `id`, `created_at`, and `total_cents`. Under load, the database CPU hits 95% even though the table is only ~180 MB.

### Prerequisites & safety
- Local Docker Engine (or local PostgreSQL 15+ installation).
- Zero cloud cost: everything runs inside a disposable local container.

Start a disposable PostgreSQL 16 container:

```bash
docker run --name pg-lab04 -e POSTGRES_PASSWORD=labpass -p 5432:5432 -d postgres:16-alpine
sleep 3
psql postgresql://postgres:labpass@localhost:5432/postgres
```

Create and seed 1,000,000 synthetic rows:

```sql
CREATE TABLE orders (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id INT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  total_cents INT NOT NULL,
  shipping_notes TEXT NOT NULL
);

INSERT INTO orders (customer_id, status, created_at, total_cents, shipping_notes)
SELECT
  (random() * 50000)::int,
  (ARRAY['paid', 'shipped', 'delivered', 'cancelled'])[1 + (random() * 3)::int],
  now() - (random() * interval '365 days'),
  (100 + random() * 25000)::int,
  repeat('x', 100)
FROM generate_series(1, 1000000);

VACUUM ANALYZE orders;
```

## Starting assumptions

| Input | Value | How to validate |
|---|---:|---|
| Table row count | 1,000,000 rows | `SELECT count(*) FROM orders;` |
| Distinct `customer_id` values | ~50,001 (~20 rows/customer) | `SELECT count(DISTINCT customer_id) FROM orders;` |
| Distinct `status` values | 4 (~250,000 rows/status) | `SELECT status, count(*) FROM orders GROUP BY 1;` |
| Target query limit | `LIMIT 10` recent orders | Query returns `<= 10` rows |
| PostgreSQL shared page size | 8 KiB per buffer | `SHOW block_size;` |

## Tasks

- [ ] **Task 1 — Baseline Sequential Scan:** Run the target query with `EXPLAIN (ANALYZE, BUFFERS)`:
  ```sql
  EXPLAIN (ANALYZE, BUFFERS)
  SELECT id, created_at, total_cents
  FROM orders
  WHERE customer_id = 4242 AND status = 'paid'
  ORDER BY created_at DESC
  LIMIT 10;
  ```
  Record `Execution Time` (ms), `shared hit` + `shared read` pages, and multiply pages by `8 KiB` to compute bytes scanned.

- [ ] **Task 2 — Low-Selectivity Prefix Index (Anti-Pattern):** Create an index with `status` first, then run `EXPLAIN (ANALYZE, BUFFERS)` again:
  ```sql
  CREATE INDEX idx_orders_bad ON orders (status, customer_id, created_at DESC);
  ```
  Wait: why can `(status, customer_id, created_at DESC)` still look fast for equality on both columns, yet break completely if a query drops `status` (`WHERE customer_id = 4242 ORDER BY created_at DESC`)? Test dropping `status` from the `WHERE` clause and record the plan!

- [ ] **Task 3 — High-Selectivity Leftmost-Prefix + Sort Index:** Drop `idx_orders_bad` and create an index ordered by equality selectivity + sort column:
  ```sql
  DROP INDEX idx_orders_bad;
  CREATE INDEX idx_orders_cust_status_created ON orders (customer_id, status, created_at DESC);
  VACUUM ANALYZE orders;
  ```
  Re-run both queries (with `status` and without `status`) and verify whether a `Sort` node disappears.

- [ ] **Task 4 — Covering Index (`Index Only Scan`):** Notice that Task 3 still performs heap fetches (`Heap Fetches`) to read `id` and `total_cents`. Replace the index with a covering index:
  ```sql
  DROP INDEX idx_orders_cust_status_created;
  CREATE INDEX idx_orders_covering
    ON orders (customer_id, status, created_at DESC)
    INCLUDE (id, total_cents);
  VACUUM orders;
  ```
  Run `EXPLAIN (ANALYZE, BUFFERS)` twice (before and after `VACUUM`) and observe `Heap Fetches: 0` and the drop in `Buffers: shared hit`.

- [ ] **Task 5 — Break the Index (Non-Sargable Predicate):** Run a query wrapping `created_at` in a function (`WHERE date_trunc('day', created_at) = ...`) or leading wildcard `LIKE '%paid'` and observe PostgreSQL falling back to a `Seq Scan` or full index scan.

## Expected evidence

- Raw `EXPLAIN (ANALYZE, BUFFERS)` outputs for Tasks 1–5.
- A summary table comparing Execution Time (`ms`), Plan Node (`Seq Scan` vs `Index Scan` vs `Index Only Scan`), `Heap Fetches`, and data touched (`pages × 8 KiB`).
- Index size comparison via `SELECT pg_size_pretty(pg_relation_size('idx_orders_covering'));`.
- Short explanation of why `VACUUM` visibility map bits are required for `Index Only Scan` to skip heap lookups.

## Reflection

1. What did you expect `idx_orders_bad` to do when `status` was omitted from `WHERE`?
2. What actually happened to buffer reads (`shared hit`) between `Seq Scan`, `Index Scan`, and `Index Only Scan`?
3. Which assumption about `INCLUDE` index size vs write throughput penalty matters most for an insert-heavy ledger?
4. What would you change at 10× scale (10M rows) or 100× scale (100M rows, ~20 GB table) if indexes no longer fit in `shared_buffers`?

## Cleanup

```bash
docker stop pg-lab04 && docker rm pg-lab04
```

## References

- [PostgreSQL Docs · Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)
- [PostgreSQL Docs · Index-Only Scans and Covering Indexes](https://www.postgresql.org/docs/current/indexes-index-only-scans.html)
- [Use The Index, Luke · Composite Indexes](https://use-the-index-luke.com/sql/where-clause/the-and-operator/concatenated-indexes)
