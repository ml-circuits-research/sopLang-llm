# Declarative Circuits over Hand-Written Code: Evidence from an Abstraction-Learning Loop, and a Case for Symbolic Solving

**One-line thesis.** An abstraction-learning loop compiles word problems into declarative wires, and its measured evidence — hand-written JavaScript per problem concentrates the failures (execution errors jumped 57 → 184 when the probe idiom shifted), while an abstract container shape transferred to an entire book (world-as-a-system 0 → 20/20) — argues for pushing the actual solving into a symbolic solver (Prolog, Z3, or similar), stated here as an unproven hypothesis.

## Abstract

Program synthesis from natural language usually means generating code, and the more general the code, the more the model can express — and the more it can break. We present a measured contrast. In a 705-problem holdout (480 procedural-arithmetic + 225 across 7 reasoning books), a 1.7B model that compiles word problems into declarative wires and lets a verified runtime own correctness reached 460/705 (65.2%) exact and 544/705 (77.2%) semantic with only 57 execution errors. When the probe idiom shifted under a data repair, execution errors jumped from 57 to 184 and the same model fell to 421/705 (59.7%) exact. The abstraction that won — the container family — is declarative and LLM-recognizable, and it transferred to an entire book (world-as-a-system 0 → 20/20). We conclude that the failure surface lives in the custom code, not in the problem, and argue the next step is to stop emitting per-problem code: compile into a higher-level specification and hand the solving to a symbolic solver (Prolog, Z3, or similar). That step is a hypothesis, not a result.

## 1. Introduction

The dominant framing in program synthesis is "generate the program that computes the answer." This paper presents evidence against that framing for the class of word problems a small model can plausibly compile. The alternative: the model's output is a **declarative circuit** — named wires with declared dependencies, composed from a small, fixed command vocabulary — and a separate runtime parses, schedules, and executes it. Correctness of scheduling, dependency soundness, acyclicity, and isolation lives in the runtime; the model only chooses *which* plan to write for *which* statement.

The interesting question is where the remaining failures sit. The answer, measured, is that they sit in the one command that is still free-form code: `jsEval`.

## 2. The abstraction-learning loop

The method is a standing cycle — **measure, flag, propose, validate, measure again** — over the wire vocabulary. A recurring multi-line `jsEval` transcription is ranked by frequency × mean-lines × error-share; a wire is proposed with its contract, its measured line reduction, and the error class it makes impossible; it is validated against family round-trip tests and a verifier that proves every circuit reproduces its printed answer and reacts to its inputs; and the next arm measures the change. Only a measured win keeps the command.

This discipline produced `graphPath` (adjacency-map traversal), `aggregate` (filter-then-reduce), `fraction` (GCD reduction and proportional arithmetic), and the container family (`container`, `containerAdd`/`containerUpsert`/`containerRemove`, `containerFilter`). Each exists because a recurring transcription was moved out of the model's body into a command whose contract the runtime enforces — converting a class of transcription errors into an impossibility. The measured effect of the declarative wires: holdout oracle match rose 379/705 → 440/705, and procedural-arithmetic execution errors fell 63 → 13.

## 3. The measured fragility of `jsEval`

The decisive measurement is the probe-relaxation arm (`exp-027-1.7b-qwen3-dv13`). It applied a data-level repair — the fractional chain restored, the strict integer probes relaxed — and the shift in the probe idiom took execution errors from **57 (dv7) to 184 (dv13)**, with runtime completion falling from 91.9% to 73.9%. The same arm regressed the container book: world-as-a-system dropped from 20/20 to 5/20 exact, and procedural-arithmetic fell from 438 to 414/480. (The world drop was itself a scorer artifact — comma-vs-semicolon punctuation, semantically still 20/20 — which is a separate finding, not a mitigation of the execution-error jump.)

The direction is the point. When the model's bodies are dominated by hand-written JavaScript, a small change in the *idiom* of that JavaScript concentrates into a large change in failures. Execution errors did not drift; they tripled.

## 4. The abstraction that won is declarative

The container family is the loop's clearest product, and its measured effect is a whole book: **world-as-a-system 0 → 20/20** — the first book solved completely — with the same arm recording only 57 execution errors and 91.9% runtime completion. The container abstraction is a schema-and-identity-policy store with staged patches and a provenance-keeping view; the model names a store instead of transcribing list surgery. Its boundary is equally measured: it did not transfer to the units-and-rates and dependency-chain shapes (dv9 left both books at zero and cost 28 procedural and 4 world answers), so it is shape-specific, not a general compiler faculty.

The controlled pair confirms that abstraction quality, not abstraction quantity, is what matters: dv8 over-split the same content into modular multi-wire targets and doubled execution errors (57 → 135), dropping the aggregate to 448/705 (63.5%). Gratuitous structure widens the same execution-failure surface.

## 5. The argument for a symbolic solver

The evidence points one way: every win came from moving computation out of the model's free-form code and into a named abstraction with an enforced contract. The end point of that trajectory is to move the computation out of the emitted artifact entirely — to have the model emit a *specification* (facts, constraints, the shape of the answer) and let a **symbolic solver** (Prolog, Z3, or similar) find the answer. The model would no longer emit per-problem JavaScript, and the entire class of execution-error failures would become impossible rather than merely rarer.

This is a hypothesis, not a result. It has not been tested in this series. It is falsifiable and cheap to test — the runtime already has a solver-shaped boundary (declared facts, a typed answer, an isolated execution realm) — but no number in this paper supports it yet. What the paper does support is the premise: hand-written JavaScript per problem concentrates the failures, and abstract, LLM-recognizable circuits beat custom code.

## 6. Conclusion

For word problems a small model can plausibly compile, the measured best practice is: grow the declarative vocabulary one measured win at a time, keep plans compact, and push as much computation as possible out of the model's body. The next abstraction is a solver. Until that experiment runs, the claim is bounded and honest: `jsEval` is the fragile part, and the container abstraction is the evidence that abstract wires transfer where custom code does not.
