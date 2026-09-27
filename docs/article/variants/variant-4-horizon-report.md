# D4.x — Project Results Deliverable: Compiling Word Problems into Executable Plans (SOP Lang)

**One-line thesis.** This deliverable reports the completed results of the project: a 1.7B model trained through an abstraction-learning loop beats the project's own 17B on the reasoning books (world-as-a-system 20/20 vs 0/20, decompose-to-solve 66/100 vs 0/100 semantic), the benchmark's exact-phrase scorer was found to hide computation, and the measured fragility of per-problem JavaScript motivates a symbolic-solver next step.

| Field | Value |
| --- | --- |
| Deliverable | D4.x — Final project results |
| Work package | WP4 — Evaluation and lessons |
| Status | Final |
| Date | 2026-09-27 |
| Dissemination level | Public |

## 1. Executive summary

The project's objective was to teach a small code-capable model to compile word problems into declarative circuits executed by a verified runtime, and to grow that language's vocabulary through a measured abstraction-learning loop. The objective was met and exceeded on the reasoning books, with a qualification: the benchmark's own answer comparison was hiding computation, and the measured failure surface sits in the hand-written JavaScript the model emits. This deliverable reports the results, the two honest lessons, the deviations from plan, and the recommended next step.

## 2. Objectives

- **O1.** Build a wire-based DSL (SOP Lang) and a verified runtime that owns correctness (scheduling, dependency soundness, acyclicity, isolation).
- **O2.** Teach a small model (Qwen3-1.7B) to compile word problems into circuits via fully synthetic training data.
- **O3.** Run an abstraction-learning loop — measure, flag, propose, validate, measure again — and keep only measured wins.
- **O4.** Compare the small model against the project's own 17B control on a sealed holdout.
- **O5.** Establish whether the win extends to a still-smaller (0.5B) student.

## 3. Methodology

Data is declared, verified, exported, taught, and measured. A generator declares operators and families; every circuit must execute, reproduce its printed answer, and react to its inputs before admission. Whole compositions are held out structurally before rendering. Each arm changes one variable. Evaluation is a fixed chain (validation selection → sealed holdout → capability probes) over a **705-problem holdout: 480 procedural-arithmetic + 225 across 7 reasoning books, never seen in training**. Scoring is dual: the benchmark's original exact-phrase scorer and a meaning-based (semantic) re-score that never rescues an execution error.

## 4. Results

### 4.1 The measured arms (headline subset)

| arm | change under test | exec errors | runtime completion | exact | semantic |
| --- | --- | --- | --- | --- | --- |
| `exp-017-qwen3-17b` | 17B base | 152 | 78.4% | 442/705 (62.7%) | 457/705 (64.8%) |
| `exp-021-1.7b-qwen3-dv7` | **container abstraction** | 57 | 91.9% | 460/705 (65.2%) | **544/705 (77.2%)** |
| `exp-022-1.7b-qwen3-dv8` | **modular multi-wire targets** | 135 | 80.9% | 448/705 (63.5%) | 468/705 (66.4%) |
| `exp-023-1.7b-qwen3-dv9` | containers on the stuck books | 92 | 87.0% | 428/705 (60.7%) | 490/705 (69.5%) |
| `exp-024-1.7b-qwen3-dv11` | compact answers | 112 | 84.1% | 439/705 (62.3%) | 473/705 (67.1%) |
| `exp-025-1.7b-qwen3-dv12` | simplified statements | 136 | 80.7% | 432/705 (61.3%) | 500/705 (70.9%) |
| `exp-027-1.7b-qwen3-dv13` | probe relaxation | 184 | 73.9% | 421/705 (59.7%) | 445/705 (63.1%) |
| `exp-026-0.5b-qwen2.5coder-dv13` | 0.5B base, repaired data | 214 | 69.6% | 361/705 (51.2%) | 370/705 (52.5%) |

### 4.2 The comparison objective (O4) — met

| book | 17B exact | 17B semantic | 1.7B+containers exact | 1.7B+containers semantic |
| --- | --- | --- | --- | --- |
| world-as-a-system | 0/20 | 0/20 | 20/20 | 20/20 |
| decompose-to-solve | 0/100 | 0/100 | 0/100 | 66/100 |

The container abstraction lifted world-as-a-system from 0 to 20/20 — the first book solved completely — and moved decompose-to-solve from 0 to 66/100 semantic, while the 17B stayed at zero on both books under both scorers.

### 4.3 The size-floor objective (O5) — met

On identical repaired dv13 data, the 0.5B (Qwen2.5-Coder-0.5B) reaches 361/705 (51.2%) exact and 370/705 (52.5%) semantic, against the 1.7B's 421/705 (59.7%) and the container arm's 460/705 (65.2%). The 0.5B solves world-as-a-system 0/20 — all 20 rows fail as compile errors ("Missing initializer in const declaration") — and decompose-to-solve 0/100, mostly real. There is a measured size floor: the loop multiplies capacity, it does not create it.

## 5. Deviations from plan

- **D1 — The 90% goal was dropped.** The original standing goal (a small model approaching 90% on the compiled benchmark) was replaced by the comparative claim reported here, because the ceiling (62.4–62.7% exact) was a data boundary, not a recipe boundary.
- **D2 — The data-repair arm was a measured negative.** The probe-relaxation repair (fractional chain restored, integer probes relaxed) regressed the 1.7B: execution errors 57 → 184, runtime completion 91.9% → 73.9%, world 20/20 → 5/20 exact, procedural 438 → 414/480.
- **D3 — The 0.5B run underperformed the hypothesis.** "Small beats big" does not hold at 0.5B; the comparative headline is now bounded below by the measured floor.

## 6. Two honest lessons

**Lesson 1 — the comparator was the bottleneck.** The exact-phrase scorer understated every model: a competent writer computed ~18/20 holdout items but scored 2/20, because recorded answers carry wording (unit words, semicolon-vs-comma, prose wrappers) a solver cannot derive from the statement. A semantic re-score (same values, same verdict, wording ignored) recovers the real computation — e.g. the 1.7B world drop 20→5 in dv13 was entirely comma-vs-semicolon punctuation, semantically still 20/20. Recommendation: adopt a value-based scorer with rounding tolerance as the benchmark default.

**Lesson 2 — `jsEval` is fragile.** Hand-written JavaScript per problem concentrates the failures (execution errors jumped 57 → 184 when the probe idiom shifted), while higher-level abstract wires (the container abstraction) transferred to an entire book (world 20/20). Abstract, LLM-recognizable circuits beat custom JavaScript.

## 7. Impact

The result demonstrates a small model crossing a task boundary that a 10× larger model cannot, when the language it emits is grown one measured abstraction at a time. The re-scorer and the bloat indicator are portable tools for any generated-data benchmark. The honest failure catalog (deliverable companion, and the research-automation variant) demonstrates the conditions under which an autonomous research assistant is trustworthy.

## 8. Next steps

1. **Prove or falsify the symbolic-solver hypothesis.** Move the actual solving into a symbolic solver (Prolog, Z3, or similar) so the model emits a specification rather than per-problem code. *This is a hypothesis, not a result.*
2. **Revert only the probe relaxation** (the world "regression" needs no fix; it was punctuation).
3. **Grow the vocabulary** toward the remaining zero books (graph traversal, probability, time arithmetic, geometry, decimal-chain arithmetic).
4. **Adopt the value-based scorer** as the benchmark default.
