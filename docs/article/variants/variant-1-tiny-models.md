# A 1.7B Model Beats a 17B Model on Reasoning Books by Compiling Word Problems into Declarative Circuits

**One-line thesis.** A 1.7B model trained through an abstraction-learning loop beats the project's own 17B on the reasoning books (world-as-a-system 20/20 vs 0/20, decompose-to-solve 66/100 vs 0/100 under a semantic scorer) by learning a container abstraction, with a measured size floor at 0.5B (361/705, 51.2%) below which the loop cannot compensate.

## Abstract

The standard story in small-model research is that scale buys reasoning: a larger model solves harder problems. We report a measured counterexample. A 1.7-billion-parameter model, fine-tuned through a "measure, flag, propose, validate, measure again" abstraction-learning loop to compile word problems into declarative circuits (SOP Lang) executed by a verified runtime, beats the project's own 17B model on the two hardest reasoning books. On the 705-problem holdout (480 procedural-arithmetic + 225 across 7 reasoning books, never seen in training), the 1.7B container arm scores 460/705 (65.2%) exact and 544/705 (77.2%) semantic; the 17B scores 442/705 (62.7%) exact and 457/705 (64.8%) semantic. The per-book gap is decisive: world-as-a-system 20/20 vs 0/20, and decompose-to-solve 66/100 vs 0/100. The same loop has a measured boundary in both directions: a gratuitous modular split (dv8) doubled execution errors (57 → 135) and dropped the aggregate to 448/705 (63.5%), and a 0.5B student trained on identical repaired data reaches only 361/705 (51.2%) exact / 370/705 (52.5%) semantic — the loop multiplies capacity, it does not create it.

## 1. Introduction

Efficient ML asks how far a small model can be pushed before scale becomes necessary. We answer with a comparative experiment that fixes the training pipeline and varies the model size: the student is a Qwen3-1.7B, and the control is the project's own Qwen3-17B, fine-tuned on the same synthetic data through the same pipeline. The result is not "small models are as good as large ones" in general; it is that on a specific, well-defined task — compiling word problems into executable plans — one more turn of an abstraction-learning loop moved a book that scale alone could not.

The task is deliberately structured. A word problem is compiled into a **SOP Lang** circuit: named wires with declared dependencies, composed from a small command vocabulary (`jsEval`, `literal`, `graphPath`, `aggregate`, `fraction`, and the container family). A verified runtime parses, schedules, and executes the circuit, so arithmetic and scheduling correctness live in the runtime, not in the model. The model's only remaining burden is choosing which plan to write for which statement. Training data is fully synthetic: a generator declares operators and families, verifies every circuit executes and reproduces its printed answer and reacts to its inputs, and holds out whole compositions before any instance is rendered.

## 2. Method: the abstraction-learning loop

The series runs a standing cycle of five steps. **Measure** every arm's holdout into a seven-class outcome ladder. **Flag** recurring `jsEval` shapes (ranked by frequency × mean-lines × error-share) and monolithic bodies that have outgrown a single wire. **Propose** a wire with its contract, line reduction, and the error class it makes impossible. **Validate** it through family round-trip tests and `node training-data/verify.mjs`. **Measure again** with one variable changed. A measured win keeps the command; a measured null or loss rejects it.

The container family is the loop's clearest product: `container` (schema + identity policy), `containerAdd`/`containerUpsert`/`containerRemove` (staged patches), and `containerFilter` (a provenance-keeping view). It replaces the hand-rolled list and membership logic of the book families' longest `jsEval` bodies, so the model names a store instead of transcribing list surgery. The control that proves the loop works in both directions is dv8: a gratuitous over-split of the same content into modular multi-wire targets.

## 3. Results

### 3.1 The measured arms

| arm | change under test | items | exec errors | runtime completion | exact | semantic |
| --- | --- | --- | --- | --- | --- | --- |
| `exp-017-qwen3-17b` | 17B base | 705 | 152 | 78.4% | 442/705 (62.7%) | 457/705 (64.8%) |
| `exp-021-1.7b-qwen3-dv7` | **container abstraction** | 705 | 57 | 91.9% | 460/705 (65.2%) | **544/705 (77.2%)** |
| `exp-022-1.7b-qwen3-dv8` | **modular multi-wire targets** | 705 | 135 | 80.9% | 448/705 (63.5%) | 468/705 (66.4%) |
| `exp-023-1.7b-qwen3-dv9` | containers on the stuck books | 705 | 92 | 87.0% | 428/705 (60.7%) | 490/705 (69.5%) |
| `exp-024-1.7b-qwen3-dv11` | compact answers | 705 | 112 | 84.1% | 439/705 (62.3%) | 473/705 (67.1%) |
| `exp-025-1.7b-qwen3-dv12` | simplified statements | 705 | 136 | 80.7% | 432/705 (61.3%) | 500/705 (70.9%) |
| `exp-027-1.7b-qwen3-dv13` | probe relaxation | 705 | 184 | 73.9% | 421/705 (59.7%) | 445/705 (63.1%) |
| `exp-026-0.5b-qwen2.5coder-dv13` | 0.5B base, repaired data | 705 | 214 | 69.6% | 361/705 (51.2%) | 370/705 (52.5%) |

"Exact" is the benchmark's original phrase-matcher; "semantic" re-judges a failed answer by meaning (same values and same verdict, wording ignored), and never rescues an execution error. Parse and graph validity are 100.0% on every arm.

### 3.2 The comparison: 1.7B + loop vs the project's own 17B

| book | 17B exact | 17B semantic | 1.7B+containers exact | 1.7B+containers semantic |
| --- | --- | --- | --- | --- |
| world-as-a-system | 0/20 | 0/20 | 20/20 | 20/20 |
| decompose-to-solve | 0/100 | 0/100 | 0/100 | 66/100 |

The 17B reaches 91.5% on procedural-arithmetic and then stops: on the two hardest reasoning books it is zero under both scorers. The 1.7B that ran one more turn of the loop solves all of world-as-a-system and, once scored by meaning, two-thirds of decompose-to-solve. Scale did not buy the reasoning books; the container abstraction did.

### 3.3 The modularity null

Holding the base, the recipe, the statements, the oracles, and the printed answers identical, dv8 changed only the structure of the training targets — splitting the monolithic bodies into modular multi-wire plans. It moved the bloat indicator (2.81 wires per plan, 5.5 `jsEval` lines per wire, against dv7's 2.19 and 7.0) and kept parse/graph validity at 100%, but lost 12 answers (448/705, 63.5%) and doubled execution errors (57 → 135). The measured sweet spot is the compact plan — exactly the container-family style that lifted world-as-a-system to 20/20.

### 3.4 The scorer was hiding computation

A competent circuit-writer computed ~18/20 holdout items of the two stuck books but scored 2/20: the recorded answers carry unit words, punctuation, and prose wrappers that no solver can derive from the statement. Every model was therefore re-scored semantically, which is why the 1.7B container arm reads 77.2%, not 65.2%, and why decompose-to-solve is 66/100 rather than zero. The punctuation artifact is sharply visible in dv13: its world book dropped from 20/20 to 5/20 exact, and that drop was entirely comma-vs-semicolon — semantically still 20/20.

## 4. The container win

World-as-a-system is the clearest single number in the paper: 0 → 20/20. The book's longest bodies are stateful bookkeeping (schedules, coalitions, evidence trees) hand-rolled inside 40-to-67-line `jsEval` bodies. The container abstraction replaces that with a typed store the model names rather than transcribes, and the whole book — the first book solved completely — flipped from zero to perfect. The boundary is equally measured: the idiom did not transfer to the units-and-rates and dependency-chain shapes (dv9 left both books at zero and cost 28 procedural and 4 world answers), so the abstraction is real but shape-specific.

## 5. The size floor: the loop multiplies capacity, it does not create it

The 0.5B result bounds the claim from below, measured on identical data: the 0.5B (Qwen2.5-Coder-0.5B) and the 1.7B were both trained on the repaired dv13 data. The 0.5B reaches 361/705 (51.2%) exact and 370/705 (52.5%) semantic, against the 1.7B's 421/705 (59.7%) on the same data and the container arm's 460/705 (65.2%). The gap is not about knowledge: the 0.5B solves world-as-a-system 0/20 — all 20 rows fail as compile errors ("Missing initializer in const declaration") — and decompose-to-solve 0/100, mostly real. Compiling a statement into a multi-wire circuit demands holding the statement's values, the wire vocabulary, and the family's plan template in working memory at once; a 494M-parameter model with a 896-wide hidden state cannot sustain that, while the 1.7B can. The loop is a multiplier on base capacity, not a substitute for it.

## 6. Discussion

The efficient-ML lesson is comparative and honest on both axes. What worked: growing the language's vocabulary one measured win at a time, until a sub-2B model crossed a book that a 17B could not. What did not work: gratuitous structure (dv8), and any claim that the loop substitutes for capacity (the 0.5B floor). The next lever is not more parameters and not more structure, but more-general abstractions — and, as a hypothesis to be tested separately, moving the actual solving out of the model entirely into a symbolic solver (Prolog, Z3, or similar) so the model stops emitting per-problem code altogether.
