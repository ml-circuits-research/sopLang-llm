# Revision log: Informatica manuscript (article/manuscripts/02-informatica.md)

29 September 2026. Response to <home>/.claude/jobs/69b234c8/tmp/review-informatica.md (25 items), plus two provenance updates from the coordinator received during the work.

## What changed

- **Manuscript.** `article/manuscripts/02-informatica.md` was rewritten. It grew from 5,921 to 7,189 words (+21%). About 560 of the added words are the new Related work section; tables and observed code listings account for most of the rest.
- **Structure.**
  1. Introduction
  2. SOP Lang
  3. Related work (new)
  4. The study: 4.1 the fine-tuning project; 4.2 the prompt-only comparison (new method section)
  5. Five design decisions: 5.1 to 5.5
  6. How far should the abstraction level rise? (former 4.6, now its own section): 6.1 must a small model be trained; 6.2 larger models; 6.3 design consequences
  7. Discussion: 7.1 principle; 7.2 seven checks; 7.3 limitations
  8. Conclusion
- **Tables.**
  - Table 1 (compact against split targets) was rebuilt.
  - Table 2 (abstraction comparison) was relabelled; the larger-model rows moved to prose.
  - Table 3 (how operator plans failed) is new.
- **`article/submission/02-informatica.json`.**
  - `shortTitle` is now "A target language for small models".
  - `tableWeights` has one key per table header, each equal to that table's header cells joined by "|":
    - "Measure|Compact targets|Split targets"
    - "Model|Form|Generator wording|Narrative wording"
    - "Model|Wording|Solved|Malformed JSON|Unknown operation|Well-formed, wrong or failed"
- **Bibliography.**
  - 15 new verified entries are in `bib-informatica.json`, with audit records in `bib-informatica-audit.json`: faithfulcot, codeact, visprog, vipergpt, satlm, logiclm, picard, synchromesh, shin2021, geng2023, dataflowsurvey, stitch, lilo, multiple, mindemos.
  - Three works I intended to add are already in `article/evidence/bibliography.json`, merged there by the ML bibliography job during this session, so I cite them under their existing keys: `tinygsm`, `tora`, and `panickssery2024` (instead of my planned `selfpreference`).
  - The manuscript cites 37 keys, against 8 before.
  - I spot-checked 9 of the new entries against Crossref and PMLR myself. All matched.
- **Scripts.** Eight new read-only scripts are in `article/scripts/`, listed below. All run with Node built-ins, and each reads the records directly.
  - `static-check-populations.mjs` runs the project's static checker on `git archive` copies of the dataset in a temporary directory. An earlier run of it had overwritten `skills/data-quality/last-report.md`. I restored that file with `git checkout`; it was clean before the run, as it did not appear in `git status`. The script now passes `--report` into the temporary directory.

## New scripts and what they reproduce

| Script | Computes |
| --- | --- |
| `split-target-failures.mjs` | For each held-out run, execution failures by group (scheduling, other book-derived, procedural) and exact matches. For the scheduling programs: computation wires, keyed durations, feasibility assertions, `.values()` crashes, maximum over all durations, and failures by wire count. Fisher p-values. Covers the compact run (exp-021), the split run (exp-022), and the history runs (exp-017 to exp-027). |
| `split-target-training-programs.mjs` | `jsEval` wires in the training programs at the commits whose SHA-256 equals each run's recorded `dataset_sha256`, both book-derived and in the scheduling book. Keyed maps, within-limit assertions, and `.values()` calls in training. Byte identity of the scheduling book's programs across versions (the dv10 "revert"). |
| `static-check-populations.mjs` | The static checker's bloat indicator and its population (all 10,640 `solution.sop` files) for dv7 and dv8. |
| `graphpath-program-size.mjs` | Computation wires and body lines of the 40 path-question programs before and after `graphPath`. |
| `whole-number-guards.mjs` | Book-derived training programs with a whole-number `probe`, at dv5, dv12 and dv13. |
| `scheduling-output-forms.mjs` | What the scheduling programs printed before and after the reference rewrite, the restricted-parser decisions, which training programs print the new form, and the return sentence of the procedural scheduling type in every version. |
| `abstraction-failure-classes.mjs` | For the operator plans, the check that correct plans reproduce all 520 generator-wording references, and the forms of the held-out references. Also: failure classes per form, model and wording; the invented operation names; CPU re-execution of plans with the brace appended or `multiply` renamed to `double`; SOP Lang programs with no `answer` wire, re-executed with their last wire as the output; and unit words in correct but inexact answers, for small and larger models. |
| `informatica-semantic-scores.mjs` | Semantic and exact scores for Table 2, the fine-tuned reference row, the trained controls, the 115-problem sample, and the withheld type. Judge agreement, κ and calibration per judging chunk, and agreement on the larger-model answers. |

Existing scripts re-run for context:
- `article/audit/review-scripts/exp003-syntax.mjs`: 58 of 80 compile failures contain the splice; 2,968 of 11,289 generated lines, 26%.
- `article/audit/review-scripts/guard-rescue.mjs`: 36 guard failures, 12 print the reference numbers, 0 exact.

## Item by item

### 1. Section 4.3 mechanism: applied, in modified form

**Checked.** All of the reviewer's counts reproduce (`split-target-failures.mjs`, `split-target-training-programs.mjs`).
- 78 added failures (57 to 135). Scheduling 8 to 59, procedural 12 to 31, other book-derived 37 to 45.
- 12 lost exact matches, 10 of them procedural.
- 95 of 100 scheduling programs were one computation wire, and 55 of the 59 failures were one-wire programs.
- dv8 scheduling-book training programs: 600 of 900 had two or more `jsEval` wires (mean 2.44).
- Keyed durations: 69 against 14.
- Feasibility assertion: 46 against 0. My first pattern also counted "limit > 0" checks; I tightened it to require a comparison of a computed value with the limit, and the count stayed at 46.
- Two-wire programs on other book types failed 10 of 31, one-wire programs 35 of 94.
- Wording test: the final-data 1.7B run (exp027) executed 1 of 15 in book wording and solved 0, and solved 15 of 15 in procedural wording. The simplified-statement run (exp025) went from 8 to 15, and the compact run (exp021) solved 15 and 15.

**Modified, because the review overstates the role of the assertion.** Of the 59 scheduling failures in the split run:
- 41 are the `.values()` crash, which happens before the assertion line runs;
- only 1 is a feasibility-type probe failure;
- 44 programs took the maximum over all durations, where the compact run did this 0 times.

The manuscript therefore says the failures came from the changed representation and the `.values()` call. It says the feasibility guard "would stop" every correct "not feasible" answer, not that it caused the failures.

**Added, a new finding.** Keyed numeric maps (426 programs), within-limit assertions (240) and `.values()` calls (41) occur in equal numbers in the dv7 and dv8 training programs. The habits were not new; only what the retrained model drew on changed.

**Also applied:**
- Section 5.3 retitled "Refactoring the targets changes more than their structure".
- The introduction anecdote reframed: the program was not split.
- Check 3 revised.
- The lesson paragraph now names the confound with retraining variation. The same retraining moved procedural failures from 12 to 31 on unchanged programs, Fisher p = 0.004.

### 2. Section 4.6: failure classes: applied

All counts reproduce (`abstraction-failure-classes.mjs`).

At 1.7B in narrative wording:
- 8 plans are JSON missing the final brace. All stopped naturally (`finish_reason` "stop", about 55 to 65 tokens), so none was truncated.
- 2 name `multiply`.
- 8 are wrong.
- 15 of the 23 well-formed plans are correct (Fisher p = 0.36 against JavaScript 26 of 33).
- Appending the brace makes 4 of 8 exact; renaming `multiply` makes 1 of 2 exact.

At 0.5B:
- 15 of 33 plans in generator wording use an unknown operation name: `multiply`, `multiplyByLabels`, `remainderDivideBy`, `take30Percent`, `thirdLargest`, `divideRate`, `convertRate`, `split`.
- 14 of 33 in narrative wording: `multiply` 6, `divideRate` 4, `takeRate` 3, `sum` 1.

At 1.5B in narrative wording, 5 plans are invalid (1 malformed, 4 unknown), and 9 of the 28 well-formed plans are correct (p = 0.07).

**Also applied:**
- New Table 3 with the failure classes.
- The "Code writing" and "Form as well as recognition" paragraphs.
- Operation names are treated as part of the design: `double` with `multiplier` invited `multiply`.
- Grammar-constrained decoding is named as the fix, citing geng2023 and picard/synchromesh.

**Not applied: the grammar-constrained rerun (c).** No GPU and no new generations were allowed. It is stated as untested.

### 3. Unstated design features: applied, with one part not applied

**Checked:**
- Worked examples. Plans: above-total-add-rate, below-largest-double, above-largest-path-exists. JavaScript: above-total-add-rate. SOP Lang: 3 programs, 1 a composition. Source: `evaluation/operator-plans.mjs` and `evaluation/run-items.mjs`.
- `operator-plans.mjs` imports `OPERATORS` from `teacher/procedural/compositions.mjs`.
- Correct plans reproduce 520 of 520 generator-wording (L0) references. The 520 is the whole L0 item pool; the manuscript now says so.
- 27 of the 33 held-out references are "N units.", and all 27 statements ask for a named unit. The other 6 are "yes." (3) and "N minutes." (3).
- The JavaScript worked example returns " units." for a crates statement.

**Larger models' JavaScript.** On all 27 problems with a "units." reference, Haiku and Sonnet printed the unit the statement asked for. Their remaining answers:
- Haiku: 3 "yes" (exact) and 3 "N minutes." (exact).
- Sonnet: 3 "Yes, a path exists." (inexact) and 3 "N minutes." (exact).

The small models' inexact but correct JavaScript answers were also nearly all the statement's unit, for example 19 of 20 at 1.7B in generator wording.

**Applied:**
- The setup paragraph (4.2) states the unequal examples and the direction of the bias: it favours the plans, whose examples showed `keepBelow`, `largest`, `double` and `pathExists`.
- It states that plans match by construction.
- The "Output conventions" paragraph was rewritten.
- The pre-registration deviation is stated.

**Not applied: calling "units." a defect to be fixed.** `teacher/procedural/composition-families.mjs` documents it as deliberate: "N units" can never coincide with a recorded value. The manuscript describes it as a generator convention that the statement does not determine.

**Not applied: rerunning JavaScript with three examples.** No generations were allowed. It is a limitation.

**Added.** The judges' rubric says unit words do not matter (`agent-sessions/judging-pass-3.json`), so semantic scores are unaffected and only exact matching is.

### 4. The recommendation outruns the measurement: applied

**Checked:**
- The pre-registered E8 reading (`no-training-plan.md`).
- Plans outperform code in no small-model cell. The only numerically higher cell, 1.7B in generator wording at 94% against 79% (p = 0.15), is within resolution; the manuscript now says "did not detectably outperform".
- The 1.5B extended-inventory run fell from 24 of 24 to 8 of 24 (companion rewording table).
- On the withheld type, 24 of 40 against 2 and 0 of 40 (`informatica-semantic-scores.mjs`).

**Applied:**
- The abstract's last clause.
- Section 6.3, which states the conditional position, the hypothesis, the fact that no plan training was done, the narrowing effect of a catalogue with its numbers, and that the pairing with a larger model is unbuilt.
- The conclusion.
- Check 6.

### 5. Limitations: applied

Section 7.3 was rewritten and reconciled with Section 6. It covers:
- single runs;
- the procedural rise on unchanged programs;
- confounded data versions;
- the held-out set as a development benchmark;
- the comparison with JavaScript made only without fine-tuning, and that no model was fine-tuned on JavaScript or on plans;
- the unequal worked examples;
- the catalogue taken from the generator;
- exactness judged by the plans' own formatter;
- judges from the larger models' own model family;
- the later judging pass without calibration items;
- batched sessions that paired plans with JavaScript;
- transcripts not retained;
- that whether fine-tuned larger models copy guards was not tested.

### 6. Related work: applied

New Section 3 has five paragraphs. Each ends with how this paper differs.

- **New verified references (15):** Faithful CoT, CodeAct, VisProg, ViperGPT, SatLM, Logic-LM, PICARD, Synchromesh, Shin et al. 2021, Geng et al. 2023, Johnston et al. 2004 (dataflow), Stitch, LILO, MultiPL-E, and Min et al. 2022.
- **Cited from the existing bibliography:** tinygsm, tora, panickssery2024, specializing, magister, llmcompiler, dreamcoder, sclar, faithfate, llmjudge, and dwork.
- **Not used:** Gorilla, which the argument did not need.

Wording was matched to the verified support:
- CodeAct is described as more effective "for most" models: 12 of 17 on M3ToolEval.
- MultiPL-E: accuracy "tends to be" lower for less popular languages. This is from the body of the paper, not the abstract.
- LLMCompiler is described as separating planning from execution. Its abstract does not state a dependency graph.
- DreamCoder is described through its verified support statement.

### 7. Abstract and introduction: applied

- The abstract is problem-first, 248 words, and has two numbers (0.5 and 1.7).
  - "characteristic splice failure" became "the commonest site of compile failures in an early run".
  - "Familiar wording" became "the problem generator's wording".
  - A scope sentence was added: "Single training runs support failure modes, not effect sizes."
  - A reason why the problem matters was added.
- The introduction opens with the problem, gives the reframed anecdote, and ends with a three-item contributions list.

### 8. Structure: applied, one part in modified form

- The old 4.6 is now Section 6. The introduction and the new Section 4.2 describe both parts of the study.
- 4.2 states the items, forms, examples, models with exact releases and access date, greedy decoding with token limits, scoring, judges, and the sample-size justification.
- "Confirms the last point" became Section 6.1, "Must a small model be trained on the language?".
- **Modified:** the larger models were taken out of Table 2 and reported in Section 6.2. This separates the two protocols and saves space.

### 9. SOP Lang output wire: applied

**Checked.** Programs with no wire named `answer`:
- 1.5B: 10 of 33 in generator wording, 18 of 33 in narrative wording.
- 1.7B: 3 and 15.

**Re-executed on the CPU with the last wire as output:**
- 1.7B narrative: 12 of the 15 ran, and 8 state the reference value under the strict value check (`valueMatches`).
- 1.5B generator: 6 of 10 state it.

**Modified.** The re-execution is reported with the strict value check, not the judges, because no new judging was run. The ranking against JavaScript would stand. Added the design consequence (a single sink wire as the default output) and Check 7.

### 10. The 115-problem paragraph: applied, in modified form

**Checked.** All reviewer numbers reproduce:
- JavaScript on compositions: 33, 49 and 45 of 55.
- Book problems, fine-tuned: 4, 6 and 32. JavaScript: 1, 10 and 10. SOP Lang in the prompt: 2, 9 and 1.
- The three fine-tuned data versions.

**Modified.** The reviewer's sentence "surpassed plain JavaScript on compositions at every size" breaks the resolution rule for n = 55 (about ±13). The gains are 22, 11 and 18 points, and only the 22 at 0.5B is readable. The manuscript says so. Book problems: no condition exceeded 18% except the fine-tuned 1.7B model at 58%.

### 11. Section 4.4 assertion rule: applied

**Checked:**
- `training-data/VERSION.history`: probe clean-up in dv5 (25 Sep); rate-type failure in the dv12 run (26 Sep); dv13 relaxed the whole-number guards.
- `whole-number-guards.mjs`: book-derived training programs with a whole-number guard numbered 455 at dv5 and at dv12, and 220 at dv13, across the four books named in the history.
- The generated rate-type program has three probes and uses `slots.` rather than `$slots.`.

**Applied:**
- New rule and opener.
- Chronology corrected.
- Check 4 rewritten.
- Link to the scheduling feasibility guard.
- The listing is now faithful: observed, abridged to the first assertion.

### 12. Judges and larger-model protocol: applied

**Applied:**
- Judge model named: Claude Opus 5.5 (claude-opus-5-5), for all 14 sessions of chunks 0 to 6 (`judge-sessions.json`).
- The judges share a model family with Haiku and Sonnet; self-preference is cited as a risk (panickssery2024).
- The rubric ignored unit words.
- The later pass had no calibration items: 538 of the 619 larger-model answers were judged in chunks 5 and 6, which held 0 known-wrong and 0 parser-equivalent items. Agreement on the larger-model answers was 616 of 619.
- "Tool use audited" became "Full transcripts were not retained; orchestration records with each session's model, tool-call count, and instructions were", per the coordinator. I verified this against `agent-sessions/README.md` and the JSON records, which carry claude-haiku-4-5-20251001, claude-sonnet-5 and claude-opus-5-5.
- Access date: 29 September 2026, from the orchestration timestamps.

**The "3120 units." acceptances.** Three held-out 1.7B plans (plus three trained controls) used `perUnit` 60 instead of `elapsed`. The judges accepted them because the rubric ignores unit words. The manuscript states the rubric instead of adding a separate sentence.

### 13. Differences too small to interpret: applied

All p-values the review gives reproduce:

| Comparison | p |
| --- | --- |
| Procedural execution failures, 12 against 31 | 0.004 |
| Other book-derived failures, 37 against 45 | 0.35 |
| 1.7B plans against JavaScript, 31 against 26 | 0.15 |
| Haiku SOP Lang against JavaScript, 31 against 33 | 0.49 |
| 0.5B SOP Lang, 5 against 10 | 0.24 |
| 1.7B well-formed plans, 15 of 23 against 26 of 33 | 0.36 |

**Applied:**
- The procedural example is in 4.1, as the reason tests over problems do not settle single-run comparisons.
- "As many" wording for 1.7B.
- "Within 2 of 33 problems" for Haiku.
- The 0.5B SOP Lang rise is named as noise.
- Other book-derived failures are "within sampling noise".
- The trained controls are left to the supplement and not interpreted.

### 14. Table 1 populations: applied

**Checked:**
- The static checker counts all 10,640 `solution.sop` files, training and held-out, all books (`static-check-populations.mjs`).
- `jsEval` bodies went from 11,760 to 18,401 (+56%); bloated programs from 1,468 (13.8%) to 290 (2.7%); wires per program from 2.19 to 2.81.
- In the book-derived training programs, `jsEval` wires went from 6,775 to 13,267 (+96%).

**Applied:**
- The table is split into training-program rows and generated-program rows, with populations shown.
- It gives per-group run-time failures and the multi-wire row: 0 against 5 scheduling programs with more than one computation wire.

**Modified:** per-group correct answers are given in prose (10 of the 12 lost were procedural) instead of as a table row.

### 15. Omitted run, changing population, and the technical error: applied

**Checked:**
- dv9 (exp-023): 428 of 705 exact; 36 of 100 scheduling failures; 87 of 100 one-wire programs; 25 of its 36 failures were one-wire.
- The recorded revert (dv10, commit 3eebc5984): all 900 scheduling-book programs are byte-identical to dv8. dv11 to dv13 keep 600 multi-wire programs.
- `.values()`: `Map` and Python dictionaries have it, plain objects do not. The training programs call `.values()` on Sets and Maps (41 programs).

**Applied:** all three points.

### 16. Principle, evidence, limits: applied

- Every design subsection opens with an italic rule, then the observations, then "The evidence does not show...".
- The misattribution paragraph was cut to one sentence.

### 17. Section 4.2 program: applied, in modified form

**Checked** (`graphpath-program-size.mjs`):
- Before the command: one computation wire of 27 lines, 15 of them the search.
- With the command: three wires of 13 lines, and 40 of 40 programs declare `graphPath`.
- Both runs solved 40 of 40.

**Applied:**
- Whole-program counts.
- `stage0` explained.
- The trade-off with Section 5.3 stated: more wires, but an algorithm removed.

**Modified:** the abridged inline listing was removed to save space, which also removes the undefined `current` problem. The `graphPath` fragment is labelled as observed.

### 18. Replication details: applied, in modified form

**Applied:**
- Recipe: AdamW, learning rate 10⁻⁴, effective batch 32, 4,096 tokens, fixed seed 3407 per the manifests, 3 then 2 epochs, 10% JavaScript mixture in later runs.
- Selection slice of 339 programs.
- Held-out composition: 225 book-derived, grown to 705 with 440 plus 40.
- Greedy decoding, token limits, Qwen3 thinking mode disabled.
- Exact model releases.
- Re-execution scope: 13,330 records in 26 held-out evaluations of trained checkpoints (`reexecution-summary.json`).
- All twelve commands, including `modelCall` and `input`.
- When `probe` arrived.
- The failure stage "a body that does not compile".

**Not applied:**
- Training-set size. `dataset_rows_total` is 9,935, but that export includes the 339-row validation slice. The token counts show 10,553 trained rows, which I read as 9,596 SOP Lang rows plus 957 preservation rows, but this is not explicit in the manifests. Left for the authors.
- The epochs and mixture timing are stated separately, because the early runs' manifests do not show them together.

### 19. Terms: applied, in modified form

- "programme" became "project".
- "plan" is reserved for operator plans in the prose, apart from quotations; for example "asserted that the schedule is feasible".
- "untuned" is defined.
- "type", "composition", "book-derived" and "procedural" are defined in 4.1.
- "students", "shipped", "tranche" and "validation accuracy" are gone.
- **Modified:** no data-version table, to stay within length. Each version is named by what it changed where it is used, and the text points to the supplementary list.

### 20. Code examples: applied

Every listing is labelled observed or illustrative, abridged, or with line breaks or whitespace changed.
- `const slots = $slots;` is in the scaffolding list.
- The 2.1 program is labelled illustrative and adapted.
- The introduction says exact matching rejected the compact model's sentence.

**Verified.** Each observed listing equals its record once whitespace is ignored:
- exp-003 1.1.4 (the splice);
- exp-016 path instance 001 (`graphPath`);
- exp-022 1.1.4 (split program);
- exp-025 units-and-rates 1.1.2 (rate guard);
- the three E8 L2 1.7B records for above-count-double-instance-011-L2.

### 21. Section 4.5 on four runs: applied, with corrected numbers

**Checked** (`scheduling-output-forms.mjs`):
- 145 programs ran in the four runs after the rewrite, and none printed the new form.
- The reviewer's "118 ended with the procedural type's clause ('... so the plan meets / does not meet the limit.')" rests on a wrong identification.
  - The procedural scheduling type (`dependency-chain-join`) prints, in every data version from dv6 to dv13, "The earliest safe completion time is N minutes, so the plan is (not) feasible. The critical insight is ...". It never prints "meets the limit".
  - 136 of the 145 (94%) use the procedural type's frame, "The earliest safe completion time is N minutes, so/and the plan ...".
  - 136 complete it with "meets / does not meet the", the words of the book statement's own question ("does the plan meet the limit?"). None prints the procedural "is (not) feasible".
- The same error was in the previous manuscript, which quoted "... so the plan does not meet the limit." as the procedural type's sentence. It is corrected.
- From dv11 on, 100 training programs of a sibling type in the same book ("two-step minimal split") print exactly "N minutes: (not) feasible."
- The rewrite covered the books (VERSION.history names decompose-to-solve and common-sense), not the procedural types.

**Applied:**
- The corrected statement.
- The structured-result proposal made concrete: a record of value, unit and verdict.
- Links to the "units." references in Section 6.

### 22. Table 2: applied, in modified form

**Checked.** The fine-tuned 1.7B compact-target model on the same 33 items: 33 (33 exact) and 24 (20 exact).

**Applied:**
- New caption: solved means exact, or accepted by both judges.
- Full model labels.
- The fine-tuned row.
- The failure classes in Table 3.

**Modified:** the larger models are in 6.2, not in Table 2.

### 23. Discussion, checklist, conclusion: applied

- 7.1 says "carries only risk".
- The Herzig sentence is restricted to execution failures.
- Checks 3 to 6 revised; Check 7 added.
- The conclusion now says "in each case we examined" and reports the form errors.

### 24. Title and keywords: applied, in modified form

- **Title:** "What the Generated Program Should Not Contain: Designing a Target Language for Small Language Models".
- **Keywords:** domain-specific languages; small language models; program-aided reasoning; fine-tuning; abstraction level; runtime contracts.
- The project's document audit (`article/scripts/audit-documents.mjs`) allows 4 to 6 keywords, so "dataflow languages" and "language design" could not be added.

### 25. Formalities, overlap, figure: partly applied

**Not applied (need the human authors):**
- Slovenian abstract (Povzetek). The repository rules allow only English on disk.
- Author names, affiliations, e-mail addresses, funding and competing-interest declarations.
- Persistent identifier for the data.

**Overlap:**
- The Machine Learning manuscript is referred to as "a companion paper", not as a reference entry: it is unpublished, so its metadata cannot be verified under rule 5.
- I rephrased every passage that shared long word sequences with manuscript 01. A check of 8-word overlaps leaves three short phrases.
- Cover-letter disclosure: not my file.
- The ESE manuscript reports an unpaired operator-plan sample: 1.7B 49 of 55 semantic, 44 exact. A sentence noting that the samples differ was not added, for length.

**Figure.** No image was added, because new assets are outside the files I may edit. Instead, Section 6 shows one problem answered in all three forms, three observed listings of the untuned 1.7B model on above-count-double-instance-011-L2 in narrative wording:
- the plan names `multiply`;
- the JavaScript prints "10 litres." against the reference "10 units.";
- the SOP Lang program's last wire is `final`.

## Coordinator updates applied

1. **Judge model.** Claude Opus 5.5 for all 14 sessions; judges and judged share a family. This is in 4.2 and 7.3, with panickssery2024 cited.
2. **Orchestration records.** Wording as instructed, checked against `article/evidence/comparison/agent-sessions/`.
3. **Fourth judging pass** (chunk 7, 34 pairs, added 07:50).
   - My recomputation over all pairs gives 2,073 pairs, agreement 98.3% (2,037 of 2,073), κ = 0.965, which rounds to 0.97.
   - Over the 2,048 distinct answers: 98.2%, κ = 0.965.
   - The Table 2 cells are unchanged.
   - The manuscript now says: "2,048 distinct answers ... plus 25 injected calibration answers ... 98.3% (Cohen's κ = 0.97), rejected all 24 injected wrong answers".
   - **Correction to the coordinator's count.** The 25 injected pairs are 24 distinct known-wrong pairs plus 1 known-equivalent pair ("8." against "8"). `judge-calibration-key.json` lists the known-wrong pair `cbb8c5c11c8c` twice, because it was injected into chunks 0 and 1. So "25 injected wrong answers" (and the earlier "20") counts that duplicate.
   - Neither judge accepted any known-wrong pair.

## Points for the human authors

1. **Merge the bibliography.** Merge `bib-informatica.json` and its audit into `article/evidence/bibliography-additions*.json`, then regenerate. Until then, `audit-documents.mjs` reports unknown citations for the 15 new keys, and `article/docs/02-informatica.docx` is stale.
   - I test-built the DOCX in `/tmp/inf-build` with a merged bibliography: 3 tables, 37 references, 11 pages in LibreOffice. The observed runnable ```sop example still returns "46 minutes: not feasible", as `evidence.test.mjs` requires.
   - Observed programs that do not return that value are fenced `sop-fragment`, `js` or `json`.
2. **Citation-label clash.** CodeAct and the existing `mathcoder` are both "Wang et al., 2024". This matters only under author-date styles; Informatica uses numbered citations.
3. **Judge-count consistency across the portfolio.** The other manuscripts and `comparison/README.md` still say "20 injected known-wrong" and κ = 0.96. Distinct known-wrong pairs are 19 in the first three passes and 24 over all four.
4. **Judges of the fourth pass (chunk 7).** They are not in `judge-sessions.json`. Confirm their model if the pooled statistics are to be attributed to Claude Opus 5.5.
5. **Supplementary data-version list.** The text now points to it. `training-data/VERSION.history` has no line for version 9 (the container idiom); that version appears only inside the version 10 line.
6. **Training-set size** (item 18) is unresolved from the manifests.
7. **Companion paper.** Decide how to cite the Machine Learning manuscript. The text says "a companion paper".
8. **Formal items** (item 25): Slovenian abstract, authors, declarations, archive DOI, and the cover-letter overlap disclosure.
9. **Length.** The manuscript is 21% longer than before, just over the "about 20%" budget. Candidate cuts if needed: the 7.1 Gulwani sentence, the related-work paragraph on contracts, and Check 2.
10. **Optional reruns** the review recommends, both about 270 generations, would settle two open points: operator plans under grammar-constrained decoding with a renamed `double`, and JavaScript with the same three worked examples as the plans.
