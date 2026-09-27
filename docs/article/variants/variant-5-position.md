# Stop Emitting Code per Problem: Abstract Declarative Circuits Plus Symbolic Solvers Should Replace Per-Problem Hand-Written JavaScript

**One-line thesis.** Abstract declarative circuits plus symbolic solvers should replace per-problem hand-written JavaScript, grounded in the measured fragility of custom code (execution errors jumped 57 → 184 when the probe idiom shifted) and the measured transfer of the container abstraction (world-as-a-system 0 → 20/20).

## The argument, in one paragraph

Every word-problem solver that emits hand-written code per problem is betting its failures on the one part it controls least. Our measured series makes the bet explicit. A 1.7B model compiling problems into declarative wires reached 460/705 (65.2%) exact and 544/705 (77.2%) semantic on a 705-problem holdout, with only 57 execution errors, and its container abstraction transferred to an entire book — world-as-a-system 0 → 20/20. The same model, when the probe idiom shifted, jumped to 184 execution errors and fell to 421/705 (59.7%). The fragility is in the custom JavaScript, not in the problem. So the field's next move should not be better code generation; it should be to *stop generating the code*: emit a declarative specification and hand the solving to a symbolic solver.

## The evidence

**Custom code concentrates failures.** The probe-relaxation arm is the clean measurement. Relaxing the integer probes shifted the probe idiom and took execution errors from 57 (dv7) to 184 (dv13), dropping runtime completion from 91.9% to 73.9%. A small change in the *idiom* of the emitted JavaScript became a threefold change in failures. Execution errors did not drift; they tripled.

**Abstract wires transfer.** The container family — a typed store with staged patches and a provenance-keeping view — replaced the hand-rolled list surgery of the book families' longest `jsEval` bodies. Its effect is a whole book: world-as-a-system 0 → 20/20, the first book solved completely, while the project's own 17B control stayed at 0/20. The abstraction is recognizably LLM-composable in a way that 40-to-67 lines of custom JavaScript is not.

**More structure is not the answer.** The controlled pair makes the point from the other side: dv8 over-split the same content into modular multi-wire targets and doubled execution errors (57 → 135), dropping the aggregate to 448/705 (63.5%). Abstracting toward more code is not abstracting; it widens the same failure surface.

**The scorer was a second custom-artifact trap.** The benchmark's exact-phrase comparison understated every model: a competent writer computed ~18/20 holdout items but scored 2/20 because the recorded answers carry wording no solver can derive from the statement. The world drop 20→5 in dv13 was entirely comma-vs-semicolon punctuation — semantically still 20/20. Both the per-problem code and the per-problem phrase-matcher are artifacts of the same mistake: putting the answer in a form the model must reproduce rather than a form a solver can judge.

## The position

The trajectory of the measured wins points one way. Every improvement came from moving computation *out* of the model's free-form output and *into* a named abstraction with an enforced contract. The end point is to move it out of the emitted artifact altogether: the model emits facts and constraints, and a **symbolic solver** (Prolog, Z3, or similar) finds the answer. Then the model never emits per-problem JavaScript, and the execution-error class becomes impossible rather than merely rarer.

We state this as a hypothesis, not a result. It has not been tested in this series, and nothing here is a claim that it works. What the measurements support is the premise — that custom JavaScript is the fragile part, and abstract, LLM-recognizable circuits are the robust part. If you accept the premise, the prescription follows: search for still-more-general abstractions, avoid `jsEval` wherever possible, and push the actual solving into a solver. The alternative — generating better and better per-problem code — is optimizing the part of the system we measured to be the failure point.
