# Machine Learning contribution information sheet

Manuscript: Learning to select executable abstractions: evidence and limits from small language models compiling word problems

## 1. Main claim and significance

The operations exposed by an executable target language are a consequential experimental variable for small-model program compilation. In the archived development series, specialized graph, aggregation, and fraction commands accompany a substantial improvement, while splitting targets into additional wires can reduce reliability. The scientific contribution is the empirical distinction between abstraction that removes recurrent implementation work and decomposition that adds coordination burden. Syntax and graph validity alone fail to distinguish these outcomes.

The claim is deliberately bounded. This is a retrospective, single-run-per-condition study of a structurally concentrated synthetic benchmark, not a new synthesis algorithm or a general model-scaling result. It supplies a positive development signal, a counterexample to unconditional modularity, and a prospective design for studying vocabulary discovery under stronger controls.

## 2. Evidence

Ten archived arms contribute 7,050 item records. Reconstructed class totals and the original normalized exact comparator agree with the stored outcomes. In the early Qwen2.5-Coder-1.5B comparison, matches increase from 379/705 to 440/705 on unchanged identifiers and oracle strings. The paired records contain 63 matches exclusive to the revised arm and two exclusive to the earlier arm. Procedural execution errors fall from 63/480 to 13/480. Missing early training metadata and one run per condition limit causal attribution.

In the later Qwen3-1.7B dv7/dv8 comparison, exact matches decline from 460/705 to 448/705 while execution errors increase from 57/705 to 135/705, again with unchanged evaluation identifiers and oracles. All ten arms pass syntax and graph checks on all 705 items. Two restricted retrospective diagnostics reveal specific answer-format penalties, with explicit abstention on unsupported prose; no general semantic score is inferred.

## 3. Closest contributions and relation

Gao and colleagues' *PAL: Program-aided Language Models* establishes the utility of generating programs and delegating computation to an interpreter (PMLR 202, 2023, 10764–10799). Chen and colleagues' *Program of Thoughts Prompting* likewise separates computation from generated reasoning (TMLR, 2023). Our study changes the executable vocabulary learned by a small fine-tuned student and analyzes its success and failure modes; it does not claim matched performance superiority over either method.

Ellis and colleagues' *DreamCoder: bootstrapping inductive program synthesis with wake-sleep library learning* learns reusable libraries and synthesis policies (PLDI, 2021, https://doi.org/10.1145/3453483.3454080). Our commands were engineered with agent assistance, so automatic library discovery remains future work. Lake and Baroni's *Generalization without Systematicity* motivates distinguishing familiar instances from structural transfer (PMLR 80, 2018, 2873–2882); we apply that distinction without importing its RNN results as a law for these models.

## 4. Prior publication and related manuscripts

Prior publication or preprint status requires author confirmation. Five journal-specific manuscripts have been prepared locally from the same experimental programme. This version emphasizes representation learning; the others emphasize runtime contracts, artifact auditing, evidence reuse, or epistemic responsibility. Their common empirical basis is substantial, so they are currently alternative submission routes. No assertion of exclusive submission or prior-publication absence is made before the authors establish those facts.
