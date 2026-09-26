# 4. Results

Every number here is reproduced from the experiment's own registry folder (`report.md`, `items/holdout.jsonl`, `run-manifest.json`) or from the analysis command `node evaluation/analyze-holdout.mjs --experiment <id>`. Percentages carry their counts. "Exact" is the benchmark's original phrase-matcher; "semantic" is the meaning-based re-score of the same holdout (chapter 2), which never rescues an execution error.

## The untrained bases, in prose

Each base answered the eval statements directly; the completion was compared against the printed answer.

| base | items | matched | rate |
| --- | --- | --- | --- |
| 0.5B code base | 585 | 63 | 10.8% |
| 1.5B code base | 585 | 30 | 5.1% |
| 1.5B general base | 705 | 80 | 11.3% |
| Qwen3-1.7B base | 705 | 357 | 50.6% |

The point of the floor: no untrained base reliably solves these statements in prose, and the 1.7B base's prose number is inflated by the procedural-arithmetic book (70.2% there) while it fails the reasoning books almost entirely. The compiled student is measured against this floor, not against zero.

## The measured arms

The suite grew as the procedural generator entered the tree: the census arms measured 585 holdout rows (425 for the first composition run), and every arm from `exp-014` onward measured 705. Parse and graph validity are 100.0% on every arm in the table.

| arm | change under test | items | exec errors | runtime completion | exact | semantic |
| --- | --- | --- | --- | --- | --- | --- |
| `exp-011-compositions` | first composition inventory | 425 | 210 | 50.6% | 161/425 (37.9%) | 163/425 (38.4%) |
| `exp-012-census` | census operations | 585 | 283 | 51.6% | 258/585 (44.1%) | 262/585 (44.8%) |
| `exp-013-1.5b` | 1.5B base | 585 | 162 | 72.3% | 322/585 (55.0%) | 340/585 (58.1%) |
| `exp-014-deep-chains` | deeper operator chains | 705 | 201 | 71.5% | 379/705 (53.8%) | 438/705 (62.1%) |
| `exp-015-deep-chains-05` | small base (exact model not recorded in the surviving manifest) | 705 | 229 | 67.5% | 362/705 (51.3%) | 372/705 (52.8%) |
| `exp-016-wires` | declarative wires | 705 | 175 | 75.2% | 440/705 (62.4%) | 445/705 (63.1%) |
| `exp-017-qwen3-17b` | 17B base | 705 | 152 | 78.4% | 442/705 (62.7%) | 457/705 (64.8%) |
| `exp-018-1.7b-qwen3-dv4` | Qwen3-1.7B, dv4 | 705 | 186 | 73.6% | 436/705 (61.8%) | 453/705 (64.3%) |
| `exp-019-1.7b-qwen3-dv5` | Qwen3-1.7B, dv5 | 705 | 110 | 84.4% | 442/705 (62.7%) | 465/705 (66.0%) |
| `exp-021-1.7b-qwen3-dv7` | **container abstraction** | 705 | 57 | 91.9% | 460/705 (65.2%) | **544/705 (77.2%)** |
| `exp-022-1.7b-qwen3-dv8` | **modular multi-wire targets** | 705 | 135 | 80.9% | 448/705 (63.5%) | 468/705 (66.4%) |
| `exp-023-1.7b-qwen3-dv9` | containers on the stuck books | 705 | 92 | 87.0% | 428/705 (60.7%) | 490/705 (69.5%) |
| `exp-024-1.7b-qwen3-dv11` | compact answers | 705 | 112 | 84.1% | 439/705 (62.3%) | 473/705 (67.1%) |
| `exp-025-1.7b-qwen3-dv12` | simplified statements | 705 | 136 | 80.7% | 432/705 (61.3%) | 500/705 (70.9%) |

The ceiling is the finding before containers: after the wires arm reached 62.4%, neither a 17B base (62.7%) nor the dv4/dv5 data revisions (61.8%, 62.7%) moved the exact-match rate meaningfully. What *did* move across the later arms is where the failure sits: by dv5, runtime completion reached 84.4% and execution errors fell to 110, so the residual error is answering the wrong question, not breaking. The container arm then moved both the aggregate (65.2% exact) and the failure distribution (57 execution errors, 91.9% completion).

## The first series, for completeness

Before the composition inventory, the series established the coverage law on the book suite (225 holdout rows) and the widened suite (265). The ladder is worth keeping in view: `exp-003-sft-lr1e-4` scored 98.8% plan-seen and 0/225 holdout; widening the plan set (`exp-005`) produced the first non-zero holdout (1/265); teaching intermediate structure (`exp-007`, `exp-008`) raised runtime completion from 12.8% to 30.9% on unseen families without buying correctness (still 1/265). The contrastive arm (`exp-010`) taught the sharpest lexical distinction (7 of 8 "above" vs "at least" pairs) and nothing else (0 of 8 direction pairs). These arms are the reason the census turned to whole-composition structural splits.

## The container win and the modularity null

The structure experiment is the paper's controlled pair. Holding the base, the recipe, the statements, the oracles, and the printed answers identical, it changed only the structure of the training targets.

- **dv7, monolithic (containers):** 460/705 (65.2%) exact, 544/705 (77.2%) semantic, 22/225 reasoning-book items, 57 execution errors, 91.9% runtime completion, world-as-a-system 20/20.
- **dv8, modular multi-wire refactor of the same content:** 448/705 (63.5%) exact, 468/705 (66.4%) semantic, 20/225 reasoning-book items, 135 execution errors, 80.9% runtime completion, world-as-a-system 20/20.

The modular arm moved the bloat indicator (2.81 wires per plan, 5.5 `jsEval` lines per wire, against dv7's 2.19 and 7.0) and kept parse/graph validity at 100%, but the model lost 12 answers and execution errors doubled. More wires widen the execution-failure surface; the measured sweet spot is the compact plan (2–3 wires, few lines), which is exactly the container-family style that lifted world-as-a-system to 20/20.

## The comparison: 1.7B + loop vs the project's own 17B

The claim is per-book, and it survives both scorers. Under the exact-phrase scorer the 17B (`exp-017-qwen3-17b`) and the 1.7B-with-containers (`exp-021-1.7b-qwen3-dv7`) are near-tied overall (442/705 vs 460/705), but diverge completely on the reasoning books:

| book | 17B exact | 17B semantic | 1.7B+containers exact | 1.7B+containers semantic |
| --- | --- | --- | --- | --- |
| world-as-a-system | 0/20 | 0/20 | 20/20 | 20/20 |
| decompose-to-solve | 0/100 | 0/100 | 0/100 | 66/100 |

The 17B reaches 91.5% on procedural-arithmetic and then stops: on the two hardest reasoning books it is zero under *both* scorers. The 1.7B that ran one more turn of the loop solves all of world-as-a-system and, once scored by meaning, two-thirds of decompose-to-solve. Scale did not buy the reasoning books; the container abstraction did.

## The exact-phrase scorer hid computation: the semantic re-score

The agent-eval sanity check ran a competent circuit-writer against 20 holdout items of the two stuck books (10 decompose-to-solve, 10 common-sense), with the recorded answers withheld. The writer computed about 18 of 20 correctly, but scored **2 of 20** — 10 items print the exact same numbers and differ only in unit words, punctuation, or sentence wrapper, and the rest print the correct final value plus extra intermediate numbers. The two passing items are the families whose recorded answers were already compressed to a bare value form. The zero-book scores therefore measured phrase reproduction, not computation.

That finding triggered a full re-score: every `answer_mismatch` row of every model's holdout (2,264 rows across 24 models) was re-judged by meaning — same values and same verdict/selection as the oracle, wording ignored. A deterministic pre-filter rejected any row missing an oracle number (1,431 rows); the remaining 833 were judged by four independent subagents (440 semantically correct). Per-book, exact → semantic, for the headline arms:

| arm | procedural | world | decompose-to-solve | common-sense | scientific |
| --- | --- | --- | --- | --- | --- |
| dv7 containers | 438→443/480 | 20→20/20 | 0→66/100 | 0→6/50 | 0→2/25 |
| dv12 simplified statements | 409→413/480 | 20→20/20 | 0→54/100 | 0→0/50 | 0→1/25 |
| dv9 containers-on-stuck | 410→414/480 | 16→16/20 | 0→36/100 | 0→13/50 | 0→5/25 |
| dv11 compact answers | 416→418/480 | 20→20/20 | 0→7/100 | 0→9/50 | 0→6/25 |
| dv8 modular | 410→430/480 | 20→20/20 | 0→0/100 | 0→3/50 | 0→8/25 |
| qwen3-17b | 439→443/480 | 0→0/20 | 0→0/100 | 0→2/50 | 0→4/25 |

Three consequences. First, the exact scorer understated every model, most of all on decompose-to-solve, where the container arm actually computes 66 of 100 problems correctly rather than zero. Second, the container arm (dv7) remains the best under semantic scoring (77.2% overall) and is the only arm that moved decompose-to-solve while keeping world 20/20. Third, the simplified-statements arm (dv12, 70.9%) did not beat containers — a null that closes the "statement complexity" lever.

## The bloat indicator

The static data-quality checker reports the structure debt on the shipped suite: on dv7, **2.19 wires per plan** against **15.4 `jsEval` lines per plan** (7.0 lines per wire), with **1,468 plans** (13.8%) carrying at most three wires but more than 25 `jsEval` lines. These are the monolithic book-family bodies the structure experiment refactored; dv8 moved the indicator to 2.81 wires per plan and 5.5 lines per wire, and the holdout moved the wrong way (chapter 3, H-structure).

## Pending numbers

- `{{TODO: exp-026 0.5B}}` — the 0.5B student trained on the repaired data (fractional-chain tranche restored, integer-probe contamination relaxed), to be compared against the 1.7B container arm on the reasoning books.
