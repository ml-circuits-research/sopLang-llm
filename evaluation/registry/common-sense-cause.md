# Common-sense: exact cause and proposals (2026-09-26)

## Diagnosis
All 50 common-sense holdout items are `units-and-rates` — a three-step FRACTIONAL chain:
rate = throughput x (100-overhead%)/100, quantity = rate x minutes/60, both rounded to
hundredths (round-half-to-even), then formatted ("20.9 useful cases."). The books every arm
solves well are integer slot arithmetic; the container abstraction transferred because it is
symbolic, while units-and-rates is decimal-chain arithmetic.

Two mechanisms:
1. The deep fractional-chain training data (dataVersion 2, "deep tranche", 9,495 rows) was
   REMOVED in dv7+. Only exp-014-deep-chains trained on it, and that is the only arm that
   computes units-and-rates (49/50 semantic, with only float-format misses).
2. The mixed-book plan style teaches strict integer probes (e.g. scientific-reasoning
   form-27: `probe(Number.isInteger(rate) && rate > 0, ...)`). The model copies those probes
   onto the one fractional book, so ~2/3 of dv12's common-sense rows die as execution_error
   ("must be a whole positive quantity") before the value is ever compared.

## Proposals
- P1 Restore a fractional-chain tranche to the SFT mix (re-export dv2's census deep-chain rows
  plus the 50 units-and-rates oracle plans as few-shot rows). Target: common-sense semantic
  >= 40/50, execution_error share < 10%.
- P2 Kill the integer-probe contamination at the data level: strip/relax Number.isInteger probes
  on non-common-sense plans, or add contrastive rows where fractional results pass mild probes.
  Target: zero "probe failed: ... whole" errors on common-sense.
- P3 Broaden or re-weight the common-sense holdout with a per-shape breakdown so a fix on one
  family is visible and overfitting is detectable.
- P4 Adopt the value-based scorer with rounding tolerance (already recommended in summary.md).
