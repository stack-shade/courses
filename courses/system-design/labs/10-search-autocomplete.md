# Lab 10 · Inverted Index Search & Sub-50ms Autocomplete Engine

**Goal:** Implement a compact inverted index with BM25 ranking alongside a prefix Trie with precomputed top-K suggestions, and benchmark p95 query latency and memory footprint on 50,000 queries/documents.
**Level:** Intermediate → Advanced
**Estimated effort:** 75–90 minutes

## Scenario and setup

Your e-commerce and documentation platform needs two distinct search capabilities:
1. **Typeahead autocomplete** that returns the top-5 ranked completions as a user types each character within a **50 ms p95** server budget (ideally `< 10 ms` in memory).
2. **Full-text search** that ranks matching documents using BM25 (`k1 = 1.2`, `b = 0.75`) over tokenized, stopword-filtered text.

Prerequisites:
- Python 3.10+ (or Rust/Go/Node) with a sample dataset of 50,000 product/query strings (or synthetic generator using realistic Zipfian frequency weights).
- Zero external search cluster required (though you may optionally compare against SQLite FTS5).

## Starting assumptions

| Input | Value | How to validate |
|---|---:|---|
| Corpus size | 50,000 documents / query phrases | Generate or load dataset; print count & raw byte size |
| Query frequency distribution | Zipfian (`rank 1..50,000`) | Assign popularity scores `1_000_000 / rank` |
| Top-K autocomplete limit | `K = 5` completions per prefix | Return sorted by descending popularity |
| Latency target | `< 10 ms` p95 in-process (`< 50 ms` E2E) | Measure `10,000` random prefix queries (`1..6` chars) |
| BM25 parameters | `k1 = 1.2`, `b = 0.75` | Verify exact ranking order on multi-term queries |

## Tasks

- [ ] **Task 1 — Text analyzer & inverted index:** Implement a tokenizer (lowercase, strip punctuation, split whitespace, optional stopword/stemming toggle) and build `term -> posting list of (doc_id, term_freq)`. Measure index build time and RAM footprint.
- [ ] **Task 2 — BM25 scorer:** Implement BM25 scoring across multi-term queries using posting-list intersection (`AND`) vs union (`OR`). Compare query latency for 1-term, 2-term, and 4-term queries.
- [ ] **Task 3 — Naive Trie vs Top-K Cached Trie:** Build a prefix Trie for 50,000 weighted phrases. First measure DFS traversal on 1-character prefixes (e.g., `"s"` traversing thousands of leaves). Then precompute and store the **top-5 `(phrase, weight)`** at every Trie node during offline build, turning lookup into `O(prefix_len)`!
- [ ] **Task 4 — Latency & memory benchmark:** Run `10,000` prefix queries across lengths `1..8` and report `p50`, `p95`, and `p99` latency (`ms`) plus total memory (`MiB`) of the naive Trie vs Top-K Cached Trie.
- [ ] **Task 5 — Typo tolerance & async freshness:** Add a 1-edit-distance fallback (or bigram overlap) only when exact prefix lookup returns `< 5` results, and measure its latency penalty. Document how you would refresh the Trie offline and swap pointers atomically without blocking readers.

## Expected evidence

- Runnable code for both the inverted index (BM25) and the Top-K Trie.
- Benchmark table comparing:
  - Index/Trie build time (`s`) and memory (`MiB`)
  - 1-char prefix latency (`p50`, `p95`, `p99` ms): Naive DFS vs Precomputed Top-K
  - Multi-term BM25 lookup latency (`p50`, `p95` ms)
- Sample query outputs showing top-5 autocomplete results and top-5 BM25 document hits with scores.

## Reflection

1. What did you expect the 1-character prefix latency to be before caching top-K at every Trie node?
2. What actually happened to memory usage when every node stored a top-5 array (and how would a Compressed Trie / Radix Tree / FST change that)?
3. Which assumption about query length or stopword filtering changed result quality or speed the most?
4. What would you change at 10× scale (50 million phrases and personalized/geo-ranked autocomplete)?

## Cleanup

Delete temporary generated corpus files if created. No external servers or cloud costs remain.

## References

- [Apache Lucene · BM25Similarity](https://lucene.apache.org/core/9_0_0/core/org/apache/lucene/search/similarities/BM25Similarity.html) — production BM25 formula and length normalization.
- [BurntSushi · Index 1,600,000,000 Keys with Automata and Rust (FSTs)](https://burntsushi.net/transducers/) — memory-efficient Finite State Transducers for prefix search.
- [Probabilistic Relevance Framework: BM25 and Beyond (Robertson & Zaragoza)](https://www.staff.city.ac.uk/~sbrp622/papers/foundations_bm25_review.pdf) — formal derivation of BM25.
