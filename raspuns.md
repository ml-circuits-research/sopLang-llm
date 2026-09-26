# Status — semantic re-evaluation (2026-09-26)

The answer comparison was exact-phrase based, which hid real computation. A meaning-based
judge re-scored every trained model. Below are the semantic percentages (same values and
verdict, wording ignored). Execution errors stay failed.

## Percentage per model (semantic)
- dv7 containers: 77.2% (best)
- dv12 simplified statements: 70.9%
- dv9 containers-on-stuck-books: 69.5%
- dv11 compact answers: 67.1%
- dv8 modular: 66.4%
- dv5: 66.0%
- qwen3-17b: 64.8%
- dv4: 64.3%
- deep-chains: 62.1%
- 1.5b: 58.1%
(Full 24-model table in summary.md.)

## Are there still books at 0%?
Semantically, decompose-to-solve is no longer zero: 66/100 under the containers arm. The one
book still effectively stuck is common-sense: 0 to 13 out of 50 across arms (0/50 on the
latest arm). scientific-reasoning, adult-reasoning, and logical-reasoning stay near zero
(0-8 of 25 or 0-5 of 10).

## Bottom line
One word: the comparator. The container arm reaches 77.2% once the scorer judges meaning
instead of exact phrasing; only common-sense remains genuinely unsolved.

## Common-sense: cause found (2026-09-26)
The 50 common-sense holdout items are all units-and-rates, a three-step FRACTIONAL chain.
Only exp-014-deep-chains trained on fractional-chain data (dataVersion 2, since removed),
so it alone computes it (49/50 semantic). Later arms lost that data AND the model copies
integer-only probes from other books onto this fractional book, turning correct math into
execution errors. Fix (see evaluation/registry/common-sense-cause.md): restore the
fractional-chain data, relax the integer probes, and adopt the value-based scorer.
