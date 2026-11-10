# Cover-letter drafts

These are prepared editorial texts, not sent messages. Add actual author details, confirmed declarations, public artifact information, and the related-manuscript disclosure before submission. No letter certifies originality or exclusive submission on an author's behalf. The four manuscripts draw on one research programme; each letter names the others as related work under consideration or in preparation, as the receiving journal's policy requires.

## Machine Learning

Dear Editors,

Please consider "Taught operations, taught wording: what small models transfer when fine-tuned to write programs" as a research article.

Teams that fine-tune small language models to write executable programs must decide what training data to generate, and whether fine-tuning is needed at all. The paper follows one such programme from its first run to its last and adds evaluation-only experiments on the existing checkpoints that test what its results mean.
- The models transferred to unseen compositions of taught operations, but this transfer was bound to the training generator's wording: trained and held-out compositions degraded together when reworded.
- Book problems whose shape had been taught were solved once reworded into the teaching template, even by a run that solved none in their own wording.
- Untuned 1.5B and 1.7B models writing plain JavaScript composed the elementary operations nearly as well as the fine-tuned models; the untuned 1.7B model was unaffected by the rewording and solved most problems of a type that its fine-tuned versions, and the same model writing the new language, almost never solved.
- A taught procedure's success depended on the surface of the prompt down to its layout: one byte, a statement's final newline, changed half of one fine-tuned run's programs.
- Two larger models given the same prompts, Claude Haiku 4.5 and Claude Sonnet 5, solved nearly every problem in every wording and condition, so the wording binding and the coverage boundary are not properties of the task; the paper does not claim to know which difference between the models removes them.

The paper relates these results to work on compositional generalization and derives practical rules: cover wording as deliberately as operations, and report the untuned model writing plain code as the baseline to beat.

The study is exploratory, with one run per condition. Its conclusions rest on contrasts large enough to be read without inferential statistics; where later runs replicate or contradict a result, the paper reports them. Every saved generated program was re-executed and every recorded outcome reproduced; the evaluation-only comparisons are scored at three levels, the last by two blind judges with retained verdicts (κ = 0.97). A related manuscript on target-language design, submitted to Informatica, quotes some of the same generated programs for a different question. The per-item records and reconstruction scripts accompany the submission. Coding-agent assistance is disclosed.

## Informatica

Dear Editor,

Please consider "Designing a Programming Language for a Small Model: What the Generated Program Should Not Contain" for the Normal track.

When a small language model is the programmer, the target language becomes its curriculum. The paper introduces SOP Lang, a dataflow language of named computations, and examines five design decisions through the programs that fine-tuned models actually wrote: moving generic contracts into the runtime, replacing recurring algorithms with declarative commands, keeping plans compact, admitting only assertions that are invariants of the answer, and defining output conventions once. For each decision it reports both what changed (usually the kind of failure) and what did not (often the number of correct answers). A prompt-only comparison on untuned models then measures the abstraction level itself. Naming operations from a catalogue matched plain code in familiar wording and produced exact answers, but lost more than plain code under rewording, so recognition becomes the skill a small model's language must teach. Two larger models given the same prompts, Claude Haiku 4.5 and Claude Sonnet 5, were nearly as accurate with SOP Lang taught only in the prompt as with plain JavaScript, in both wordings. Their operator plans still gave exact answers, where their JavaScript matched the reference wording in only 9% to 18% of the problems. The paper also corrects an earlier attribution of an accuracy gain to the declarative commands.

A related manuscript on transfer in the same models, submitted to Machine Learning, draws on the same programme. The Slovenian abstract required by the template, author details, and the public data-access record remain to be completed. AI-assisted implementation and writing are disclosed.

## Empirical Software Engineering

Dear Editors,

Please consider "Correct computations, wrong conclusions: where errors entered an agent-run machine-learning experimentation pipeline" as an exploratory case study.

Coding agents increasingly build and operate the software of machine-learning studies. The paper examines a complete ten-day programme of this kind and classifies every documented incident in which a defect changed, or would have changed, a conclusion or an action. The pipeline's computations reproduced exactly. Every consequential error sat at a seam between artifacts: a name standing for a model's identity, a comparator standing for correctness, an altered prompt standing for a controlled intervention, a log line standing for completed work, or one evaluation population standing for another. The paper derives one inexpensive check per seam. It also reports that these errors were found by reading items and by reviewers instructed to question, not by the test suite. In later comparisons on the same pipeline, exact scoring distorted two conclusions, which a calibrated two-judge protocol with retained verdicts corrected in minutes.

The authors directed the programme studied, which the paper states and addresses through timestamped records. Related manuscripts on the same programme are under consideration elsewhere (Machine Learning; Informatica; AI and Ethics). The version history, manifests, item records, and audit ledger form the replication package.

## AI and Ethics

Dear Editors,

Please consider "The headline the evidence never contained: goal pressure, agent-written evidence, and accountability in automated research" as a research article.

The paper examines a research programme run largely by coding agents under a human lead. On the evening the programme changed its goal to a comparative claim, it produced a headline ("a small model beats a 17B model") that rested on a decimal point lost from a file name. The programme's records had carried the correct identity, and the goal-aligned rewrite overwrote it. A pre-declared stop rule was set aside the same evening. The paper traces how this happened without any intent to deceive and weighs alternative readings. It argues that responsibility for agent-produced claims stays with the human authors, and proposes concrete duties: declared rules with named owners, mechanical identity checks, extra verification for goal-congruent results, and evidence that lets readers disagree.

The manuscript is prepared for double-anonymous review: identifying file names, system names, and commit times are replaced by neutral descriptions, and an anonymised evidence package will be supplied. Related manuscripts on the same programme are under consideration elsewhere.
