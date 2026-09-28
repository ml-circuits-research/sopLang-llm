# Informatica author-assistance review

This is a preparation self-review applying the journal's [published review questions](https://www.informatica.si/public/site/LLM_prompt_informatica.txt). It is neither independent peer review nor an editorial recommendation.

**Title:** SOP Lang: Moving Algorithms into Explicit Commands for Small-Model Compilation. **Category:** technical paper, Normal track. **Authors:** not supplied.

## Formal and layout checks

The English abstract contains 197 words. The source resolves nine cited references in first-appearance order. All three native tables and both figures have numbered captions and text callouts. The document imports the official 2026 template's paragraph styles and page geometry and renders as five pages in two columns. It omits invented publication dates, issue numbers, and author identities.

The short Slovenian abstract remains an author-preparation requirement because repository instructions allow only English prose on disk. Author details, declarations, and a public evidence-access record also remain incomplete. The editable DOCX and inspected PDF are both provided.

## Research question and technical contribution

The paper asks how much implementation work a small model should generate when its output is an executable program. It answers through an implemented language boundary and two retrospective design comparisons. The positive result supports specialized commands that own recurring algorithms; the negative result shows that splitting a target into more components can make generation less reliable.

The contribution is a concrete language/runtime design with evidence about its learning implications. The paper does not claim to invent program-aided reasoning, solve general program synthesis, or implement automatic library learning. PAL, Program of Thoughts, LLMCompiler, DreamCoder, and the program-synthesis literature provide the relevant context and explicit distinctions.

## Reader onboarding and examples

Section 2 defines a circuit, a wire, the declaration syntax, body boundaries, command-specific interpretation, value references, dependency order, and the requested-output naming convention. The arithmetic example is complete and executable. The first diagram annotates that program and its dependency graph.

The graph example then replaces an algorithm with an undirected-reachability command. Runtime checks cover connected, disconnected, and absent-target cases. The second diagram contrasts undirected reachability with a constructed directed graph for which the answer changes. It demonstrates a semantic boundary rather than claiming an observed rate of model errors.

## Evidence and interpretation

Experiment A compares general-code and specialized-command targets. Overall exact matching improves from 53.8% to 62.4%, and procedural execution failures fall from 13.1% to 2.7%. Experiment B compares compact and split targets; matching falls from 65.2% to 63.5%, and execution failures rise from 8.1% to 19.1%. Captions give the applicable populations: 705 problems overall and 480 in the procedural subset.

The paper directly interprets this contrast as removal of implementation work versus addition of coordination work. It also states the mechanism limit: direct specialized-command use occurs in 8.3% of procedural outputs, below the 13.1-percentage-point match improvement. A missing early training manifest, one run per condition, repeated benchmark inspection, and target-length differences prevent a clean causal estimate.

Repository run identifiers and data-version labels are kept in the companion experiment map. The main paper uses Experiment A and Experiment B with descriptive conditions. It contains no general semantic-accuracy claim, unsupported container mechanism, or invented model-size threshold.

## Future command admission

The proposed admission procedure starts from a recurring failure, defines the command's inputs and exclusions, tests its implementation and counterexamples, and compares equivalent general-code and specialized targets. Several seeds and untouched transfer families are future requirements, not completed results. The procedure follows from the observed positive and negative design outcomes.

## Review outcome

The rewritten paper is internally consistent, its examples execute, its tabulated rates reconstruct from archived counts, and its five-page rendering has been visually inspected. The strongest remaining scientific limitation is experimental control, not an unexplained syntax or inaccessible comparison label. The technical-paper scope makes that boundary explicit.

Before submission, complete the actual author fields and declarations, arrange the short Slovenian abstract, provide the permitted public evidence access, and use the journal's required PDF. No acceptance prediction or numerical editorial score is inferred from this self-review.
