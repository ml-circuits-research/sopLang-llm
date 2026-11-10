# Review: 01-machine-learning.md (target: Springer *Machine Learning*)

Reviewed version: `article/manuscripts/01-machine-learning.md` as of 2026-09-29 06:48 (362 lines, percentages already partly converted). Line numbers refer to that version and will drift; section names are the stable reference. Every number quoted below was recomputed from `evaluation/registry/<run>/items.jsonl`, the judge files, or git history unless marked "verify".

## Overall verdict

1. Almost ready for co-authors and colleagues. The evidence is unusually well audited and nearly every number reproduces, but three problems would dominate any expert reading and should be fixed first.
2. First, withdraw the claim that the larger models "locate these limits in the small models' capacity" (Abstract, 9.3, 9.4). The paper's own data contradict it: the untuned 1.7B model writing JavaScript kept 79% in both wordings, while its fine-tuned version fell from 100% to 73% (item 1).
3. Second, fix the internal contradictions a referee will find first. The paper says every program was "syntactically valid", yet 36% did not compile. It says "at least 80%" of coalition problems were solved, yet Table 5 shows 47% for the same run; the likely cause is a one-byte prompt difference. The held-out items were edited between runs and this is not disclosed (items 2–4).
4. Third, reorganise the front and the middle. Open with the problem, the research questions, and the lesson that transfers to other work. Add a run table that defines every label ("compact targets", "final data", "declarative-command data", ...). Move the larger-model results (Table 7) out of the Discussion into Results (items 5–8).
5. Before external review, also add the literature on wording and distractor robustness (SVAMP, GSM-IC, GSM-Symbolic, Shaw et al. 2021) and on small models fine-tuned to write programs (TinyGSM, ToRA, MAmmoTH). Name the model that served as judge (items 13–14).

## Prioritised items

### 1. The "capacity" attribution is contradicted by the paper's own data (Abstract l.5; 9.3 l.304; 9.4 l.332)

**Problem.** The Abstract says the larger models' results "locat[e] these limits in the small models' capacity". Section 9.4 says the limits are "limits of the small models' capacity", and 9.3 that "most of the wording dependence is a matter of capacity". The larger models differ from the small ones in parameters, pretraining data, post-training, possible exposure to the books, and the evaluation protocol (batched agent sessions). They were also never fine-tuned. So the comparison shows that the task and the program-writing formulation are not the obstacle. It cannot show that parameter count is. Worse, the same small model is robust to wording in one condition. Untuned Qwen3-1.7B writing JavaScript solved 79% of the 33 held-out-composition problems in both generator and narrative wording (Table 7, row 1). Fine-tuned, it fell from 100% to 73%. Prompted to write SOP Lang, it fell from 70% to 18% (23 to 6 of 33; `paired-tables.md`, E8). At 1.7B, then, the wording binding depends on the target form and on fine-tuning, not on size alone.

**Fix.**
- Abstract, replace the sentence with: "Two larger models, prompted with the same language and examples, solved nearly every problem in every wording, so these limits belong to the small models as we trained them, not to the task or to the program-writing formulation."
- 9.4, replace "The wording binding and the coverage boundary we measured are therefore limits of the small models' capacity, not of the task or of the program-writing formulation." with: "The wording binding and the coverage boundary are therefore not properties of the task or of the program-writing formulation. They are properties of the small models as we trained them, and this comparison cannot say which difference between the model pairs removes them: the larger models differ in size, pretraining, and post-training, and they were not fine-tuned. The untuned 1.7B model was itself unaffected by narrative wording when it wrote JavaScript (79% in both wordings), but not when it wrote SOP Lang from the prompt (70% to 18%) or after fine-tuning (100% to 73%)."
- 9.3, delete "The comparison with larger models in Section 9.4 shows that most of the wording dependence is a matter of capacity." Replace it with: "Section 9.4 shows that larger prompted models do not have this dependence; it does not show which of their differences removes it."

### 2. Section 5.3 contradicts Table 5, and the likely cause is a one-byte prompt difference (5.3 l.196–211; Table 5)

**Problem (a).** The text says "Every later 1.7B run solved at least 80%" of the coalition problems. Table 5 gives 47% (7 of 15) in book wording for the "Simplified statements" run. That is the same checkpoint (`exp-025…/gguf/checkpoint-450.gguf`) on 15 of the same problems, and its original held-out evaluation matched all 15 exactly. In the Table 5 re-generation, 6 of those 15 returned a wrong answer and 2 crashed.

The likely cause (verify): `items-e3/original.jsonl` stores each statement with its trailing newline removed (`items-e3/README.md`: "trailing newline removed"). The held-out evaluation sends `statementBodyOf(problem.md)`, which keeps it. The system prompts are the same text (the two manifests hash it differently: text hash `c2967d…` against message-array hash `2e9f7c…`), decoding is greedy, and the checkpoint is identical.
- The coalition statements have not changed since before any run (git), so on those problems the newline is the only input difference. Re-generated programs were identical to the original ones in 14 of 15 problems (dv7 run), 7 of 15 (dv12) and 15 of 15 (dv13).
- On the scheduling problems, whose text did not change after dv12, the dv13 run's programs were identical in only 4 of 15, although every one failed both times.
- By contrast, the withheld-type items keep the newline and reproduced 40 of 40 and 39 of 40 programs. The 115-item re-evaluation of the dv7 run, which also kept it, reproduced 104 of 110; the harness alone therefore accounts for about 5% of changed programs.
- The "Compact targets" book-wording cells use the simplified statements, which that run never saw in its own evaluation (item 3). Its 100% therefore cannot be compared with its original 64%.

**Problem (b).** l.198 reads "in the second of these runs, 18% of the outputs state the correct duration and verdict in wordings it does not accept". The 18 answers belong to the third run (dv9, `exp-023`). The dv8 run's 41 out-of-grammar answers contain none with the correct duration. The dv9 run's 64 out-of-grammar answers contain 18 with the correct duration and verdict, plus 20 that give the correct number with the unit "work packages".

**Problem (c).** l.198 gives "64%" for the first shape-taught run (parser, 100 problems, original statements). Table 5 gives 100% for the same run (judges, 15 problems, simplified statements; see item 3). A reader cannot reconcile the two.

**Fix.**
- Re-run the four book-wording cells of Table 5 with the exact held-out prompt bytes (120 generations), or report both versions.
- Add to 5.3: "Single greedy decodes were sensitive to byte-level differences in the prompt. Re-generating the 15 coalition problems with only the statement's trailing newline removed changed the program in 0 to 8 of 15 problems for the three shape-taught runs, and lowered the simplified-statement run's result from 15 of 15 to 7 of 15." Add the same point to 9.5 as a threat. It supports the wording-binding thesis (cite Sclar et al. 2024, already in `evidence/bibliography.json`). Hiding it is the real risk.
- l.198: "in the third of these runs, 18% of the outputs state the correct duration and verdict in a wording it does not accept ('does not meet the completion limit'), and 20% more state the correct number with the wrong unit".
- After Table 5, add one sentence explaining that the parser figures (100 problems, original statements) and Table 5 (15 problems, final statements, judges) measure different things.

### 3. The held-out items were edited during the programme, and the paper does not say so (2.3 l.53; 3 l.89; 5.3; 9.5 "Adaptive reuse")

**Problem.** Git history shows the held-out statements and references of two books were rewritten after runs had failed on them:
- dv11 (`e230b2146`) shortened the reference answers of 14 families of decompose-to-solve and common-sense. For example, "The earliest safe completion time is 46 minutes, so the plan is not feasible. The critical insight is …" became "46 minutes: not feasible." The commit's stated motivation was the models' own failures.
- dv12 (`e494ddbf5`) rewrote the statements. It removed the scenario sentence, the distractor sentence and the hint "Best decomposition (5 subproblems).", and replaced "Main question." with "Question.".
- The claim ledger also records that the dv7 and dv13 held-out sets differ: 50 problems replaced, and 100 references and 147 reference programs changed among the shared identifiers.
- The run manifests confirm it: the held-out `itemsSha256` differs for every run of the 1.7B series (dv7, dv8, dv9, dv11, dv12, dv13).

Consequences:
- The scheduling series "64%, 0%, 0%, 2%, 54% and 0%" spans three combinations of statement and reference. The dv7–dv9 runs had the long reference and the distractor statement, the dv11 run the short reference and the distractor statement, and the dv12 and dv13 runs the short reference and the simplified statement.
- Table 5's "book wording" is the simplified dv12 statement, not the one quoted in Section 3.
- The Section 3 quote is presented "as the model saw it" but is abridged: it omits "Main question." and "Best decomposition (5 subproblems)."

**Fix.** Add to 2.3: "The held-out items were not frozen. For two books whose problems no run had solved, one data version shortened the reference answers to their values (for example, '46 minutes: not feasible.') and the next simplified the statements, removing the scenario, the distractor sentence, and a decomposition hint. Each run was scored on the items current at its evaluation; the evaluation-only comparisons use the final items for every condition." Quote the Section 3 statement verbatim, including "Main question." and "Best decomposition (5 subproblems)." In 5.3, say which statement version each scheduling figure used. Strengthen the 9.5 threat: "…and the statements and references of two of its books were edited after runs had failed on them, so it is a development benchmark rather than a clean test [@dwork]."

### 4. "Syntactically valid" and "learned the language completely" conflict with 36% that did not compile (Intro l.11; 3 l.81, l.94; 9.1 l.262; Conclusion l.350; Fig. 2 note)

**Problem.** The paper's first sentence says the model "wrote a syntactically valid program … for every one of 225 held-out problems". It then says "The model had learned the language completely", and 9.1 and the Conclusion repeat "learned the language … at once". Section 3 reports that 80 of those 225 programs (36%) did not compile, 58 of them because of a spliced validation line. "Parse validity" in the records refers to the SOP Lang structure; the JavaScript inside a wire is compiled only when the wire runs. The Fig. 2 note ("Every held-out program parsed and formed a valid dependency graph") has the same problem. Separately, l.81 says the untuned model "could not produce the language at all". Yet in Table 6 the untuned models, given a syntax guide and three examples, solved 7% to 62% of the compositions in SOP Lang. The l.81 claim refers to a prompt without guide or examples.

**Fix.**
- l.11: "…wrote a well-formed program, one that parsed as SOP Lang and formed a valid dependency graph, for every one of 225 held-out problems. … The model had learned the form of the language completely and had learned no way to use it on something new."
- l.81: "…every held-out program parsed and formed a valid graph; the JavaScript inside a wire is compiled only when the wire runs, and 36% of these programs failed at that step (below). … Prompted without a syntax guide or examples, the untuned model produced no parseable program for any of 50 sampled problems."
- 9.1: "It learned the form of the language at once."
- Conclusion: "It learned the form of the language at once, …".
- Fig. 2 note: "Every held-out program parsed as SOP Lang and formed a valid dependency graph; 36% failed when their JavaScript was compiled."

### 5. The Introduction starts with a system-specific number and never states the research questions or the lesson that transfers (Intro l.11–21)

**Problem.** The Introduction opens with a vignette (0.5B, 225 problems, 99%) before it states the problem. It poses no explicit research questions, so a reader cannot tell which result tests what. It does not say which results come from training runs and which from evaluation-only experiments, which matters because only the latter are controlled. The lesson most useful to other ML researchers appears only in 9.2 and the Conclusion, and there only as practice advice. That lesson: held-out compositions rendered by the training generator overstate compositional transfer, and an untuned model writing code is a strong baseline. The contributions list also omits the larger-model comparison, although the Abstract features it.

**Fix.** Reorder the Introduction. Proposed opening (then compress the vignette into one paragraph, or move it to Section 4):

> "Program-aided reasoning lets a language model write code that an interpreter executes, which moves arithmetic out of the model's job [@pal; @pot]. Small models are attractive for this role because they are cheap to run and can be specialized by fine-tuning on synthetic problems with verified programs [@magister; @specializing; TinyGSM]. Whoever builds such a system must decide what training data to generate: more instances of the same problems, more kinds of problems, more varied presentation, or a larger model instead. That decision depends on what a small model transfers from program-writing data to problems it was not trained on. Studies of compositional generalization predict failure on new combinations in purpose-built benchmarks [@scan; @cfq; @cogs; @bogin], and studies of math word problems show that models are sensitive to how a problem is worded [SVAMP; GSM-IC; GSM-Symbolic]. Neither settles the question for a small model fine-tuned on synthetic programs.
>
> We fine-tuned open models of 0.5B to 1.7B parameters to write programs in a small dataflow language and asked three questions. RQ1: What transfers from program-writing fine-tuning: the language, the trained programs, new combinations of trained operations, or new problem types? RQ2: Is transfer to new combinations a property of the taught operations or of the training generator's wording? RQ3: What does fine-tuning add over prompting the same models to write ordinary code, and do the limits belong to the task or to the small models? A sequence of training runs answers RQ1. Evaluation-only experiments, in which every condition answered the same items, answer RQ2 and RQ3.
>
> The answers carry a lesson beyond our system. Held-out combinations rendered by the training generator overstated transfer: compositions a fine-tuned model solved without error in the generator's wording were solved far less often when reworded, and even trained compositions degraded. A taught solution procedure that failed on book problems succeeded when a few phrases of the statement were replaced by the teaching template's phrases. And an untuned model prompted to write plain JavaScript came close to the fine-tuned models within the curriculum and, on one problem type outside it, beat them. Evaluations of fine-tuned program writers should reword held-out items and report the untuned model writing code as the baseline to beat."

Then give five contributions mapped to the RQs. Add: "5. We compare the fine-tuned models with two larger prompted models on the same items, which shows that the limits we found are not properties of the task or of the program-writing formulation (RQ3)." Replace "students" with "fine-tuned models" (l.21 and l.217).

### 6. The Abstract needs a rewrite: undefined "valid", unqualified "complete transfer", untested "retries", the capacity claim, no general lesson (Abstract l.5)

**Problem.**
- "wrote valid programs almost always" (see item 4).
- "complete transfer to unseen combinations" holds only for combinations of taught operations; with a newly added operation the 0.5B model reached 60%.
- "retries did not change that": retries were never tried on untrained types (item 15).
- "almost as well" holds at 1.5B and 1.7B (89% and 82% against 100%) but not at 0.5B (60% against 82%).
- The capacity claim (item 1).
- The transferable lesson is missing.

**Fix.** Proposed replacement (about 250 words):

> "Small language models can be fine-tuned to translate word problems into programs that a runtime executes, and what they transfer to unseen problems decides what training data they need. We fine-tuned open models of 0.5B to 1.7B parameters to write programs in a small dataflow language and tested the results with evaluation-only experiments in which every condition answered the same items. The fine-tuned models wrote well-formed programs and solved problems whose solution program they had been trained on, but almost none from untrained problem types; changes to the learning rate, the adapter, the data mixture, the target structure, and the prompt did not change that. A curriculum of declared operation combinations, with whole combinations held out, gave complete transfer to unseen combinations of taught operations in the training generator's wording; rewording the same problems removed much of that transfer and degraded trained combinations as well. A taught solution procedure that failed on book problems in their own wording succeeded once the problems were restated in the teaching template. Prompted to write plain JavaScript, the untuned 1.5B and 1.7B models solved most unseen combinations, and the untuned 1.7B model solved most problems of a type its fine-tuned versions almost never solved. Two larger prompted models solved nearly every problem in every wording, so these limits belong to the small models as trained, not to the task. Held-out combinations rendered by the training generator overstate transfer: evaluations should reword them and report the untuned model writing code as a baseline. Fine-tuned small program writers suit bounded problem classes."

### 7. Run labels are undefined, and Table 6 compares fine-tuned runs from three data versions (5.2 Table 4; 5.3 Table 5; 6 Table 6; 7; 8)

**Problem.** A newcomer meets "0.5B, extended inventory", "1.7B, compact targets", "simplified statements", "final data", "the 1.5B run on the declarative-command data", "the two inventory-phase runs" and "the extended-inventory 0.5B model", and none is defined. The only crosswalk is promised in the supplement.
- Table 6's fine-tuned rows come from three data versions: 0.5B on dv13, 1.5B on dv3, 1.7B on dv7. The dv3 run predates the shape-teaching types (the dv3 1.7B run is Table 5's "never taught" row). "At the two smaller sizes, fine-tuning did not help on book types" therefore compares a 1.5B run never taught the book shapes with a 1.7B run that was.
- The rule for choosing which fine-tuned run represents each size is not stated. For 1.7B, the run shown (compact targets, 58% on book types) is the better of the two evaluated (final data, 49%).
- Section 5.1 describes two tranches (4 and then 8 held-out compositions), yet Tables 4, 6 and 7 use 11. The third tranche (time, graph-path and area operations) is never introduced, only mentioned in passing at l.168.
- Epochs, compute, and hardware are not reported per run.

**Fix.** Add a table in Section 2 and use its labels everywhere. Template (fill the "?" cells from the manifests):

| Label in text | Base | Data version: what it added | Epochs | Used in |
| --- | --- | --- | --- | --- |
| First series (LR 2×10⁻⁵, 10⁻⁴; LoRA r16, α32, LR 10⁻⁴) | Qwen2.5-Coder-0.5B-Instruct | book types only | 3 | Tables 1–2 |
| Wider curriculum; multi-stage targets; twenty shapes; preservation mixture; contrastive pairs | 0.5B | cumulative additions | 3 | Table 2 |
| First inventory | 0.5B | 22 declared compositions, 4 held out; validation scaffolding moved into the runtime | ? | Table 3 |
| Extended inventory | 0.5B and 1.5B | 37 compositions, 8 held out | ? | Tables 3–4, Sec. 7 |
| Declarative-command data | 1.5B | dv3: commands for … | ? | Table 6 |
| Before the shapes | Qwen3-1.7B | dv3 | 2? | Table 5 |
| Compact targets | 1.7B | dv7: shape-teaching types; time, path, area operations; 11 held-out compositions | 2? | Tables 4–7 |
| (dv8, dv9, dv11 runs) | 1.7B | split targets; … | 2? | Sec. 5.3 series |
| Simplified statements | 1.7B | dv12: simplified statements of two held-out books | 2 | Table 5 |
| Final data | 0.5B, 1.7B | dv13 | 2? | Tables 5–6, Sec. 8 |

State the selection rule under Table 6 and add the final-data 1.7B row. Replace the book-type sentence with the one proposed in item 10. Add one sentence to 5.1 on the third tranche and the data version that introduced it.

### 8. The structure puts new results in the Discussion and repeats results across Sections 6, 8 and 9.4 (9.4; 2.3 l.57; 7)

**Problem.**
- Section 9.4 introduces new data (Table 7, the whole larger-model protocol) inside the Discussion.
- The withheld-type contrast appears three times (5.2, 8, Table 7), and the narrative-wording comparison twice (8, Table 7). Table 7 repeats two rows of Table 6.
- Section 7 ("What scale changed") rests on one within-family comparison that did not replicate across data versions, plus one cross-family pair. It reads as a heading without a finding.
- l.57 says "Sections 5 to 9 add evaluation-only comparisons", but Table 3 and all of Section 7 are training results.
- There is no Related Work section; the literature sits in one Introduction paragraph and in 9.3.

**Fix.** Proposed outline:
1. Introduction (item 5).
2. Related work: move Intro paragraph 3 and add item 13.
3. Setting: language, problems and fingerprints, models and training (run table), evaluation protocol (judges, samples).
4. What transfers (coverage ladder, failure mechanisms, interventions table condensed).
5. Operations or wording? (inventory, rewording, first exposure, outside the inventory; the 0.5B/1.5B size comparison of current Section 7 goes here).
6. Taught shapes and book wording (current 5.3 plus the minimal pair of item 11).
7. Baselines and ceilings: Table 6 and Table 7 merged into one table with the larger models as extra rows, plus the withheld type and the cost.
8. Discussion (answers to RQ1–3; relation to compositional generalization; what to generate; a condensed "more data or different data"; threats).
9. Conclusion.

Fix l.57 to "Tables 4 to 7 and Section 8 report evaluation-only comparisons".

### 9. Section 8 states a causal "cost of fine-tuning" that its own caveat withdraws, and it ignores a measured alternative (8 l.251–255; 9.3 l.299)

**Problem.**
- l.253: "Fine-tuning on templated synthetic programs made the model more accurate within its templates and less able to handle problems outside them". This is causal. The next sentence concedes that the comparison "does not isolate fine-tuning from the change of target language".
- The paper holds evidence for the language explanation and does not use it. Prompted to write SOP Lang instead of JavaScript, the untuned 1.7B model solved 0 of the 5 sampled withheld problems; with JavaScript it solved 4 of 5 (`model-comparison.md`, main table).
- The first paragraph opens "Specialization had a cost that matters for deployment" and closes "with ten probes these differences are within noise". 9.3 then cites the probes as a loss ("short instruction and code probes fell").

**Fix.**
- Run the untuned 1.7B model with SOP Lang in the prompt on all 40 withheld problems (40 generations, no training). If it also fails, the cost belongs to the target language; if it succeeds, to fine-tuning.
- Replace l.253's causal sentence with: "The fine-tuned 1.7B system was more accurate than its starting model within the curriculum and less able outside it: on the withheld type it solved 5% and 0% of 40 problems where the starting model writing JavaScript solved 60%. Two differences separate the systems, fine-tuning and the target language. The same untuned model prompted to write SOP Lang solved none of the five sampled withheld problems [all 40: X%]."
- Replace the first paragraph with one sentence in 9.5: "Ten short capability probes were too few to measure forgetting (untuned 0.5B: 4 of 10; fine-tuned 0.5B versions: 0 to 2)."
- 9.3 l.299: "Our fine-tuned 1.7B models could not solve a problem type that their starting model solved by writing JavaScript (Section 8); our capability probes were too few to show a broader loss."

### 10. On book types, the fine-tuned model's advantage lies entirely in the two taught shapes; say so (6 l.239)

**Problem.** "The book types separate the conditions" is true only because of the taught shapes. Recomputed per family from the judge files: 25 of the fine-tuned 1.7B model's 32 correct book answers are the two taught shapes (all 20 coalition problems and all 5 scheduling problems). On the other 30 sampled book problems it solved 7 (23%). The untuned 1.7B model solved 8 (27%) writing JavaScript and 9 (30%) answering directly, and the untuned 1.5B model 12 (40%) answering directly. Stating this sharpens the paper's thesis and supports Section 7's "None of them transferred to what it did not cover".

**Fix.** Replace the third bullet with: "**The book types separate the conditions only where the curriculum taught the shape.** No untuned model solved more than 24% of the 55 sampled book problems in any condition. The fine-tuned 1.7B compact-target model solved 58%, but 25 of its 32 correct answers were the two taught shapes: all 20 coalition problems and all 5 scheduling problems. On the other 30 book problems it solved 23%, against 27% for its starting model writing JavaScript, 30% answering directly, and 40% for the untuned 1.5B model answering directly. Coalition problems are 20 of the 55 in the sample because they form four families. The 1.5B fine-tuned run predates the shape-teaching types, and the 0.5B final-data run was taught both shapes but solved no coalition problem."

### 11. Section 5.3 hides its most striking result, a minimal pair, behind an unmeasured causal sentence (5.3 l.200, l.213; Table 5)

**Problem.** "Rewrote … into the sentence template of the procedural types" suggests a large rewrite. For the scheduling problems, the two wordings (`items-e3/README.md`) differ in three places:
- "Five work packages A–E must be completed." becomes "A project runs five work packages in a chain."
- "safety or review buffer" becomes "safety buffer".
- "Question. … does the plan meet the limit?" becomes "… is the plan feasible?"

The durations, clause order, and reference are identical. These three phrases decided whether the final-data run's programs executed at all: 1 of 15 ran in book wording, 15 of 15 in template wording. l.213 instead offers an unmeasured cause: "Whether a run then solved the book problems depended on how closely the book's wording resembled what the run had been trained on."

**Fix.** Show the pair as a boxed example (or Fig. 3, see item 23). Replace l.213's sentence with: "For the scheduling problems the two wordings differ in three phrases (Box 1); numbers, clause order and reference are identical. Those phrases decided whether the final-data run's programs ran at all: 1 of 15 in the book wording, 15 of 15 in the template wording. The coalition rewording is larger: it removes the 'Knowledge context', 'Given facts' and 'Rules' headings." Also say explicitly that "book wording" in Table 5 is the simplified statement (item 3).

### 12. Section 9.1 misstates the compositional-generalization literature and misses an analysis that would connect to it (9.1 l.268)

**Problem.** "This matches the account of compositional generalization in which unseen compounds of familiar atoms are handled and unfamiliar atoms are not [@cfq; @bogin]" inverts CFQ. Keysers et al. show that models fail on unseen compounds of familiar atoms when compound divergence is high. That is the point of their splits, and the Introduction (l.15) cites them correctly. Bogin et al. locate the difficulty in local structures unseen in training. The paper's positive result therefore needs explaining, not matching.

A quick check of the declared inventory (`teacher/procedural/compositions.mjs`; verify against each run's data version, and include the older single-scenario procedural types still in the training data, such as "total plus a fixed amount") gives a concrete hypothesis:
- The two new-operation compositions the 0.5B model failed are the two whose adjacent operation pairs include one no trained composition has: percentage then discount; ranked position then percentage (the inventory trained the ranked position only at rank 2).
- The two it solved completely (total then remainder; total then ratio) contain only trained pairs.
- But three of the four original held-out compositions, solved 100%, also contain an untrained pair: largest then add a fixed amount; count then double.
- The failures are exactly the parameter confusions the paper describes: rank taken as a percentage, discount scaled by 100.

**Fix.** Replace l.268's first sentence with: "Benchmarks of compositional generalization find that neural models fail on unseen compounds of familiar atoms [@scan; @cfq; @cogs], and Bogin and colleagues trace the failures to local structures unseen in training [@bogin]. Our small models transferred to unseen compositions, including three whose adjacent operation pairs never occurred in training, and failed only where two adjacent operations take parameters of the same kind (a percentage and a discount, a rank and a percentage). A reading consistent with both is that the models learned operations as typed stages (filter, aggregate, number-to-number step) and confused same-kind parameters; a controlled split could test it." Add a small supplementary table giving, for each held-out composition, whether each adjacent pair and each parameter value occurred in training.

### 13. Related work a *Machine Learning* reviewer will expect (Intro; 9.1; 9.3)

**Problem.** The central finding is that wording decides success. No work on wording or distractor robustness is cited, although the narrative condition adds "one irrelevant number" and Section 3's example turns on a distractor sentence. The closest systems, small models fine-tuned on synthetic problems with program solutions, are also absent. The following all exist; I am confident of each:
- **Wording and distractors in math word problems.** Patel, Bhattamishra & Goyal, "Are NLP Models really able to Solve Simple Math Word Problems?" (SVAMP), NAACL 2021. Shi et al., "Large Language Models Can Be Easily Distracted by Irrelevant Context" (GSM-IC), ICML 2023. Mirzadeh et al., "GSM-Symbolic", ICLR 2025, including GSM-NoOp, which adds irrelevant clauses.
- **Synthetic splits against natural variation.** Shaw, Chang, Pasupat & Toutanova, "Compositional Generalization and Natural Language Variation: Can a Semantic Parsing Approach Handle Both?", ACL 2021. This is exactly the vocabulary-against-template tension of 5.2.
- **Small or medium models fine-tuned to write programs for math.** Liu et al., "TinyGSM" (arXiv 2312.09241, 2023). Gou et al., "ToRA", ICLR 2024. Yue et al., "MAmmoTH", ICLR 2024. Wang et al., "MathCoder", ICLR 2024. Reasoning distillation: Ho, Schmid & Yun, ACL 2023; Hsieh et al., "Distilling Step-by-Step!", Findings of ACL 2023.
- **Fine-tuning and out-of-distribution loss.** Kumar et al., "Fine-Tuning can Distort Pretrained Features and Underperform Out-of-Distribution", ICLR 2022. Wortsman et al., "Robust fine-tuning of zero-shot models" (WiSE-FT), CVPR 2022. WiSE-FT also suggests a cheap test with no training: interpolate the fine-tuned and untuned 1.7B weights and re-measure the withheld type and the compositions.
- **Judges.** Zheng et al., "Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena", NeurIPS 2023 (already in `bibliography.json`). Panickssery, Bowman & Feng, "LLM Evaluators Recognize and Favor Their Own Generations", NeurIPS 2024.
- **Framing.** Hupkes et al., "A taxonomy and review of generalization research in NLP", Nature Machine Intelligence 2023 (the paper cites only the 2020 Hupkes paper). Geirhos et al., "Shortcut learning in deep neural networks", Nature Machine Intelligence 2020.
- **Already in the portfolio bibliography but unused here.** Sclar et al. 2024 (prompt-format sensitivity; items 2 and 16). Razeghi et al. 2022 (pretraining term frequencies; the contamination caveat of 9.4). Wang et al. 2023, "Grammar Prompting" (a DSL taught in the prompt; Section 6). Herzig et al. 2021 (intermediate representations).

**Fix.** Add a Related Work section of four short paragraphs: program-aided reasoning and small program writers; compositional generalization and natural variation; robustness to wording and distractors; fine-tuning, forgetting, and OOD loss. Cut the tangential 9.3 bullets (LIMA; symbolic distillation). Also say why no public benchmark was used. A small SVAMP or GSM8K evaluation of the untuned and fine-tuned 1.7B models would anchor the results externally (optional).

### 14. The judge and larger-model protocol is under-specified in ways that matter for Table 7 (2.3 l.65; 9.4 l.310–334)

**Problem.**
- The judges are "separate agent sessions", but the model is never named. If they are Claude models judging Claude Haiku and Sonnet answers, self-preference is a known risk (Panickssery et al. 2024).
- The larger models' scores are almost entirely judge verdicts (`audit/larger-models-factcheck.md`). Haiku's JavaScript answers matched exactly in 1 of 55 book problems against 52 accepted by the judges, and every withheld-type and Table 5 cell has 0 exact matches.
- Most of these answers were judged in a pass with no calibration items (538 of 619).
- Each larger-model session answered 60 to 115 items in one context (`agent-models/prompts-*.json`). Those models therefore saw other problems of the same family and their own earlier answers. The small models, which answered each item in a separate call, had no such in-context learning.
- The ESE paper reports a known leniency: both judges accepted elapsed-time answers without the reference's unit. One held-out composition (`below-total-elapsed`) is of that kind.
- "Semantic" is described as "counts only if two blind judges … both accept it"; in fact exact matches count without judging.

**Fix.**
- Name the judge model and version, and the prompt (appendix).
- Report exact and strict-value scores beside the semantic ones in Table 7.
- Re-judge a random sample of accepted larger-model answers with a judge from another model family or a human, or insert calibration items into the third pass.
- Re-run one small subset for Haiku as independent calls (for example, the 15 book-wording scheduling problems and the 40 withheld problems) to bound the batching effect.
- Add the elapsed-time leniency to 2.3, and define the semantic level as "an exact match, or an answer both judges accept".

### 15. Retries were never tested on untrained types but are listed as tested (Abstract l.5; 9.1 l.264; Conclusion l.350)

**Problem.** The retry experiment (l.132) used 30 in-inventory development problems, of which 2 crashed. Retries fire only on crashes, so they had two chances to help and no chance to test transfer to untrained types. The Abstract, 9.1 and the Conclusion nonetheless list retries among the levers that failed to change transfer to untrained types.

**Fix.** Remove "retries" from those three lists. Keep the l.132 paragraph, with its scope stated: "Retries could only address crashes, and on 30 in-inventory problems only two programs crashed; we did not test retries on untrained types."

### 16. Table 4's rows use different items, and 9.1's size reading does not survive a matched comparison (5.2 Table 4, l.168–184; 9.1 l.263; 2.3 l.57, l.67)

**Problem.** The 1.7B rows use 33 + 12 problems (11 held-out compositions, 4 controls); the other runs use 24 + 9. On the common 24 + 9 problems (recomputed), the 1.7B run scores:
- held-out compositions: 100%, 63%, 71% (original, paraphrase, narrative);
- trained controls: 100%, 67%, 89%.

Under paraphrase, 1.7B (63%) and 1.5B (67%) do not differ. Only the narrative-wording robustness is specific to 1.7B (71% against 33% and 21%). 9.1's "at 0.5B a paraphrase was enough … while the 1.7B run kept more than half" hides that the 1.5B run kept two thirds. Two further statements are not true across models in Table 4, nor for Tables 5 and 7 (whose conditions are subsets): "Every model and condition answered the same items" (l.57) and "Every condition answered the same problems, so no difference between conditions comes from different samples" (l.67). Finally, "chosen among those already evaluated" (l.168) needs a rule showing that the choice did not depend on outcomes.

**Fix.** Add the matched 1.7B figures to Table 4, as a row or footnote, or restrict all rows to the common items and report the three extra compositions separately. 9.1: "…at 0.5B a paraphrase was enough to lose most new compositions; the 1.5B and 1.7B runs kept about two thirds under paraphrase, and only the 1.7B run kept most under narrative wording." Rephrase l.57 and l.67 to "within each comparison, every condition answered the same items". State the instance-selection rule.

### 17. The inventory confound belongs in the results, and the training volume should be stated (5.1 l.138; 5.2 l.159; 9.3 l.287)

**Problem.** The inventory data version also moved validation scaffolding into the runtime. In the first series, spliced validation lines caused 58 of the 80 compile failures. The only "before" measurement (8 of 60 on a diagnostic suite) differs from the "after" in three respects: the inventory, the scaffolding, and the generator. This is named only in the threats list. Section 5.1's "Each trained composition received enough instances to be learnable" hides the number (40 per composition in the current data), which 9.3 then uses ("Forty instances per composition were enough"). The reader cannot tell whether 40 means training or test instances; Table 3 also says 40.

**Fix.** 5.1: "Each trained composition received 40 training instances." 5.2, after the diagnostic-suite sentence: "The same data version also removed the validation scaffolding whose spliced lines caused most compile failures in Section 3, so this before-and-after contrast confounds the inventory with the scaffolding change. Scaffolding removal alone did not produce transfer outside the inventory: the withheld type and the book types stayed at or near zero after it."

### 18. Sections 3 and 4 overstate what the recipe variations rule out, and some small numbers are wrong (3 l.81; 4 l.104–119; Tables 1–2)

**Problem.**
- "The failure was therefore not an artefact of a recipe that tuning could fix" rests on two learning rates and one LoRA configuration. That LoRA run used rank 16, α 32, and the full-fine-tuning learning rate of 10⁻⁴ (`phase4-first-series.md`), and none of these is stated in the paper. LoRA is usually trained at a higher learning rate than full fine-tuning, and its 54% on trained programs indicates under-training. So the LoRA row says little about "preserving the base preserves general skill".
- l.117, "raised the executing fraction from about one in eight to almost one in three", compares with the preceding row. The reference run of Table 1 already executed 28%, and the fraction fluctuated between 12% and 31% without a trend.
- Table 2's "executed" column mixes denominators (225 in row 1, 265 elsewhere, and the 40 withheld problems behave differently).
- Rounding: the LoRA executed fraction is 33 of 265 = 12.45%, which rounds to 12%, not 13% (Tables 1 and 2). This is probably double rounding from "12.5%"; check other cells converted from one-decimal values.

**Fix.** l.81: "Two learning rates and a low-rank adapter left the same zero, so the failure was not an artefact of these recipe settings." Add the LoRA hyperparameters, with the sentence "LoRA is usually trained at a higher learning rate than full fine-tuning; at the shared rate it reached 54% on trained programs, so this run may understate what an adapter can do." Replace the l.117 sentence with "The executing fraction varied between 12% and 31% across runs without changing correctness." Footnote the mixed denominators. Correct 13% to 12%.

### 19. The text-probe paragraph is under-specified and lacks the relevant baseline (8 l.255)

**Problem.** It does not say which fine-tuned model is meant (the 0.5B wider-curriculum run) or which untuned model. "Answer directly" is a weak condition for a model trained only to emit programs. The informative baseline, the untuned model writing JavaScript on the same 49 probes, is missing. The gains are confined to probe kinds the curriculum taught: letter counting 16/16 and word counting 9/9, against ordering 0/6 and situation traps 1/10. So the paragraph supports the paper's thesis rather than "gained capabilities".

**Fix.** Name the models, give the per-kind counts, and either run the untuned 0.5B model writing JavaScript on the 49 probes (49 generations) or cut the paragraph. Proposed text if kept: "On 49 text-reasoning probes, the fine-tuned 0.5B model compiled correct programs for all 16 letter-counting and all 9 word-counting probes, whose programs the curriculum taught, and for 5 of the 24 others; answering directly, it solved none, and its untuned starting model 5."

### 20. Section 6 speculates about why SOP Lang in the prompt did worse, although the records show the mechanism (6 l.238; Table 6)

**Problem.** "An unfamiliar language costs a small model more than the structure it offers, until the model is trained on it" is a speculation. The records show what happened: the runtime rejected many of these programs before execution. Invalid graph or no parse: 25, 41 and 23 of 115 at 0.5B, 1.5B and 1.7B (`s-sopicl3-*`). The two prompts are also asymmetric: JavaScript had one example, SOP Lang a syntax guide and three examples.

**Fix.** Replace the sentence with: "Many of these programs failed before execution: 25, 41 and 23 of the 115 at 0.5B, 1.5B and 1.7B had an invalid dependency graph or did not parse. Writing a language known only from a guide and three examples cost these models more than the language's structure gained them." Note the prompt asymmetry under Table 6.

### 21. Recommendations the paper did not test are stated as rules (9.2 l.274–276; 9.3 l.288, l.297; Conclusion l.351–353)

**Problem.** Two recommendations are untested:
- "placed beside the operations it could be confused with": the contrastive pairs of Section 4 did not improve transfer. The only support is the first-exposure confusions.
- "Vary the wording … because the wording is what a small model binds to": no run trained with varied wording (9.3 says so).

**Fix.** Mark both as predictions. For example: "Our results predict, but do not test, that varying the wording of each taught shape as deliberately as its numbers would reduce the binding; the direct test is a run whose shape-teaching types are rendered in several wordings, evaluated on the book wording." Compress 9.3 to one paragraph each for "what our data show" and "what the literature adds", dropping LIMA and symbolic distillation.

### 22. Terminology and jargon a newcomer cannot resolve (throughout)

**Problem.**
- "Untuned base models" / "bases": the Qwen2.5-Coder checkpoints are instruction-tuned, and Qwen3-1.7B is a post-trained hybrid-reasoning model. To an ML reader, "base" means pretrained only. The paper also never says that Qwen3's thinking mode was disabled for the prompted conditions (`noThink: true` in the manifests).
- Four near-synonyms are used without definitions: "program", "fingerprint", "shape", "plan" ("the scheduling plan had been learned").
- Internal words: "students", "rows", "plan set" (9.3), "tranche", "inventory-phase", "first exposure", "preservation mixture", "operator plan" (9.4; never introduced in this paper), "third pass", "calibration items".

**Fix.**
- Say "the released checkpoints (instruction-tuned; Qwen3 with thinking disabled), which we call the untuned models". Avoid "base".
- Define once in 2.2: "a solution shape is the computation a problem type requires, independent of wording; a program is one text that implements it; a fingerprint identifies a program text". Then use "shape", never "plan", for the computation.
- Replace "rows" with "training examples". Define "operator plan" where 9.4 uses it, or drop it: it belongs to the companion paper.

### 23. Figures: two duplicate tables, one duplicates the code block, and the central result has no figure (Figs. 1–3)

**Problem.**
- Fig. 1 repeats the code block at l.29–35.
- Fig. 2 repeats one row of Table 1 and carries the wrong note of item 4.
- Fig. 3 repeats Table 3 exactly.
- The paper's central new evidence, the rewording results (Table 4, the untuned 1.7B JavaScript and the larger models in Table 7), exists only as dense tables.

**Fix.** Keep either the code block or Fig. 1. Drop Fig. 2 or fix its note. Replace Fig. 3 with a slope chart: x = wording (generator, paraphrase, narrative), y = percent solved, one line per fine-tuned run for held-out compositions (solid) and trained controls (dashed), on the matched items of item 16, with the untuned 1.7B JavaScript and the two larger models as reference lines. Use Box 1 (item 11) for the scheduling minimal pair.

### 24. Title, keywords, and conclusion (title; l.7; 10)

**Problem.**
- The title names the composition result but not the finding that most distinguishes the paper: that transfer is bound to the training wording.
- The keywords miss the program-aided and robustness angles.
- The Conclusion repeats three claims fixed above ("learned the language at once", "only in the wording it was trained on" against 73% at 1.7B in narrative wording, "retries"), and its four bullets duplicate 9.2.

**Fix.**
- Title options: "Taught operations, taught wording: what small models transfer when fine-tuned to write programs", or "Fine-tuned small program writers transfer taught compositions in taught wording, not untaught problem types".
- Keywords: small language models; program-aided reasoning; compositional generalization; robustness to rewording; synthetic training data; supervised fine-tuning.
- Conclusion, first sentences: "We set out to teach a small model to write programs for problems it had not seen. It learned the form of the language at once, learned the programs it was shown, and recombined their operations reliably only in the wording it was trained on. It could not write programs for problem types whose solution shape it had not been taught, and changes to the recipe, the data, the prompt, and model size in the tested range did not change that." Then keep two recommendations (reword held-out items; report the untuned code-writing baseline and a larger-model ceiling), and refer to 9.2 for the rest.

### 25. Overlap with the companion papers is not disclosed (whole paper; Data availability)

**Problem.** The Informatica manuscript overlaps with this paper in three places:
- its Table 2 reports the same abstraction-level comparison on the same 33 held-out items in both wordings, including the Haiku and Sonnet rows that feed Table 7's rewording column;
- it describes the spliced-scaffolding failure of Section 3;
- it states that "the generalization behaviour of these models is reported in a companion paper".

The ESE paper reports the judge protocol and the larger-model batch defects. This paper mentions neither companion.

**Fix.** Add one sentence to Section 2 or the Data availability statement: "Design lessons from the same programme, including an abstraction-level comparison on the rewording items, and an analysis of the pipeline's errors are reported separately [companion papers]." Avoid printing the same table in both papers (cite instead), and disclose the related submissions in the cover letter.
