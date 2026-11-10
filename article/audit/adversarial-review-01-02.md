# Adversarial review of manuscripts 01 (Machine Learning) and 02 (Informatica)

Reviewer stance: adversarial. Date: 2026-09-28. Manuscripts were not edited. Findings are appended section by section; severity is R (reject-level), M (major), m (minor). Throwaway scripts are under `article/audit/review-scripts/`.

Sources used: `article/manuscripts/01-machine-learning.md`, `article/manuscripts/02-informatica.md`, `article/evidence/early-series-verification.{md,json}`, `article/evidence/results.json`, `article/audit/claim-ledger.md`, `article/audit/baseline-audit.md`, `evaluation/registry/<exp>/items/*.jsonl`, run manifests, git history.

## Part A. Manuscript 01 (Machine Learning): evidence check

### A1. Held-out set composition (M)

Recomputed from `evaluation/registry/exp-003-sft-lr1e-4/items/holdout.jsonl`: the 225 "held-out families" are 16 plan fingerprints in 19 folders, and one plan dominates: 100 of 225 items are `decompose-to-solve/dependency-chain-and-join`, 50 are `common-sense/units-and-rates`, 25 `scientific-reasoning/minimum-information-needed`, 20 the coalition family (grades 1-4), 10 opening-hours, 10 two-written-rules, and 10 single items from mathematical-thinking. "0 of 225" is therefore closer to "0 of about 16 plans", with 44% of the denominator one plan. The manuscript states "sixteen book-derived plans" in 2.3 but then reports every held-out result as x of 225 / x of 265 and treats them as family-level evidence ("almost none from problem families absent from training"). Fix: report held-out results also per plan/family (e.g. "0 of 16 held-out plans"), and state in Table 1-3 captions that 100 of the 225 items are instances of one plan.

### A2. Section 3 example is not the input the model saw (M)

01 quotes "Five work packages A-E must be completed. A takes 7 minutes. ... the completion limit is 43 minutes." as "this held-out scheduling problem" for the first-series 0.5B model (exp-003). That wording is the dv12 simplified statement (`git show e494ddbf5:training-data/decompose-to-solve/eval/no-knowledge/dependency-chain-and-join/1.1.4-dependency-chain-and-join/problem.md`, commit message "statement simplification ... without distractors"). The statement exp-003 was evaluated on (`git show d06dbc846:...1.1.4.../problem.md`) begins "Scenario. In household faults and maintenance observations, ..." and contains a distractor: "The description mentions the total number of observations, but the task durations already incorporate that workload, so recounting them would double-count input." The exp-003 program's return string ends with "because the total number of observations is 5", i.e. the model reacted to the very distractor the manuscript deleted. Fix: quote the statement as evaluated (with the distractor) or explicitly say it is abridged, and mention the distractor, since it is a competing explanation for the failure.

Verified: the exp-003 program for item 1.1.4 declares `"parallel": ["A","C"]`, has the spliced line `probe(Number.isInteger(slots.durations.every((value) => value > 0), ...)`, and fails with "missing ) after argument list".

### A3. "80 programs did not compile, 74 of them with the same unbalanced-parenthesis error this splice produces" (m)

Recomputed (`article/audit/review-scripts/exp003-syntax.mjs`): 80 JavaScript compile failures (62 dependency-chain-and-join, 15 minimum-information-needed, 2 two-written-rules, 1 cut-and-choose); 74 carry the message "missing ) after argument list"; only 58 contain the `Number.isInteger(... .every(` splice. The sentence implies 74 splices. 02 correctly says 58. Fix: "80 programs did not compile; 74 failed with the same missing-parenthesis error, 58 of them on the same spliced assertion".

### A4. "77 compiled but extracted inputs under the wrong names or values; and 62 ran and answered a different question. In one family every program computed a throughput rate, ... when the problem asked for a count" (M, factually wrong)

- The 77 are programs stopped by an assertion the model itself wrote (`probe failed: ...`, e.g. 15 x "at least one group must reach the winning threshold", 9 x "every work package must have a single duration"). Whether each reflects wrong extraction was not established; many are invented constraints. Fix: "77 ran into an assertion the model had written".
- Of the 62 mismatches, 50 are `common-sense/units-and-rates`. Those programs answered the right question (useful output) with a wrong unit conversion (multiplying minutes by 60 instead of dividing): oracle "20.9 useful cases." vs answer "The useful output is 125400 undefined in undefined minutes."; oracle "21 useful cases." vs "The useful output is 126000 35s. Convert the minutes to hours with 35 x 60 = 126000 hours." None is a throughput rate. So "answered a different question" is wrong for at least 50 of 62 and the "throughput rate ... when the problem asked for a count" description is wrong. Fix: "50 of the 62 mismatches came from one rate family, where every program multiplied the running time by 60 instead of converting minutes to hours". The "undefined" template example is correct (6 answers contain "undefined").
- "The remaining six were other runtime errors" is correct (80+77+62+6=225).

This matters because Section 3's interpretation ("retrieves the stored program closest to the new statement") leans on the "neighbouring training family" example that the records do not show.

### A5. Table 1 denominators (m)

Caption says "Held-out: 225 problems", but the LoRA row (exp-004) was scored on 265 (0/265, 33/265 = 12.5% executed). Fix: give 265 for that row or add a footnote.

### A6. Table 2 "best over all scored checkpoints" column (m)

Recomputed from `article/evidence/early-series-verification.json` (detail.ladderResults/widenedResults): best untrained-plan score per arm: exp-002 (lower LR) **2**/16 (checkpoint-360), not "1 of 16" as the table says under a best-over-checkpoints caption; exp-004 3; exp-005 3; exp-007 3; exp-008 4; exp-009 4; exp-010 3. The 1/16 is the exp-002 winner. The text in 4 ("3 of 16, against 2 of 16") compares LoRA's best/winner (3) with the full-FT winner (2); exp-003's best over checkpoints is 3/16, so on the column's own definition the comparison is 3 vs 3. Fix: row 1 -> "up to 2 of 16"; state "3 of 16 against 3 of 16 (best) or 2 of 16 (selected)".

### A7. Retries row of Table 2 is not a held-out measurement (M, presentation)

`retry-sweep-{0,1,2}` used the exp-012 checkpoint-720 (the composition-inventory arm, i.e. after the curriculum change of Section 5) on 30 procedural diagnostic problems whose records carry `"split":"development"`. The table places "17 of 30" under the column "Held-out correct" in a table titled "Interventions tried against the out-of-family result" whose caption says each row changes one factor relative to the previous 0.5B run. None of that holds for this row. Also "turned every crashing program into one that ran" refers to 2 programs (28/30 -> 30/30 executed; both retried items end as answer_mismatch). Fix: move retries out of Table 2 or mark the model (census-inventory 0.5B), the population (30 in-vocabulary development problems), and write "the two crashing programs".

### A8. Contrastive pairs: "giving the same answer to both" is false (M)

`evaluation/registry/diag-pairs-010/items/diagnostic.jsonl`, normal condition: in 0 of 8 direction (largest/smallest) pairs did the model give the same answer to both members; in 4 of 8 pairs one member crashed (execution_error), and the others gave different wrong values (e.g. "The largest kept record is 1131312 tickets."). The 7/8, 0/8, 1/8 counts reproduce. The mechanism sentence ("giving the same answer to both") is unsupported, and it is the evidence for "the distinction ... it did not learn required a different operand". Fix: "in 4 of the 8 direction pairs one program crashed; the rest returned different wrong values". The frequency argument ("extreme-value and percentage operations were more common than threshold comparisons") rests on a regex count of `Math.max/Math.min` and percentages over all 8,015 rows (`evaluation/registry/phase4-analysis.md` lines 259-269), which counts any use of max/min (e.g. scheduling joins), not training contrasts between largest and smallest. Soften to "a raw count of operator occurrences does not favour threshold comparisons".

### A9. Composition-inventory results (Table 3, 5.2): values reproduce; one sentence contradicts the table (m)

Reproduced: 160/160 (exp-011, exp-012, exp-013), 96/160 with 40, 7, 9, 40 per composition, 320/320 for 1.5B, 0/40 withheld family, books 1, 2, 2 of 225; all 64 failures (33 discount + 31 third-largest) stop at `probe failed: the answer must be a whole number that is not negative`; the failing programs index with `slots.pct - 1` and have no rank slot, and compute `current - slots.discount * 100`. Contradiction: "had solved essentially none of the withheld procedural family and none of the book families before, and continued to solve none of them now" while Table 3 reports 1, 2, 2 book problems and Table 2 reports 1/265 in several earlier runs. Fix: "almost none (0-2 of 225)". Also "The difference between the rows is not the depth or the length of the programs, which were comparable" is asserted without any measurement; the book reference programs (e.g. the scheduling program) are longer and structurally different (list parsing, prose output). Either measure length/wire count per slice or delete.

### A10. Section 5.3 "the boundary moves when the vocabulary grows" is contradicted by the arms after exp-021 (R for the claim as worded)

- Coalitions: exp-021..exp-025 and exp-027 (1.7B) 20, 20, 16, 20, 20, 20 of 20 under the restricted parser; exp-027 5/20 exact - the manuscript discloses this. But exp-026 (Qwen2.5-Coder-0.5B on dv13, which contains the 40 procedural coalition rows) solved 0/20, all execution failures (`evaluation/registry/exp-026-0.5b-qwen2.5coder-dv13/items/holdout.jsonl`). So "solved when, and only when, their plan shape had become one the model had been taught" is false as a biconditional: teaching the shape was not sufficient for the 0.5B model.
- Dependency join: 01 says it "followed the same pattern ... 64 of 100 held-out outputs stated the correct duration and verdict". That is exp-021 only. The procedural dependency-chain-join shape stayed in the data from dv6 on, and the other taught arms scored, with a comparator that accepts both oracle forms (`article/audit/review-scripts/join-recheck.mjs`): exp-022 0, exp-023 0, exp-024 2, exp-025 54, exp-026 3, exp-027 0 of 100 (execution failures 59, 36, 62, 44, 55, 94). Exact match was 0/100 in every arm. The shape being taught therefore produced correct content in 2 of 7 taught arms. "Followed the same pattern" is a selective report.
- The evidence pipeline itself undercounts: `article/evidence/exp-025-1.7b-qwen3-dv12-decompose-to-solve-restricted.jsonl` marks 55 answers "outside_grammar" because `joinValue` in `article/scripts/restricted-comparators.mjs` cannot parse the dv11+ oracle form "45 minutes: not feasible." (expected = null), although the model answer parses and matches ("The earliest safe completion time is 45 minutes, so the plan does not meet the limit."). The restricted diagnostics for exp-024..027 in the evidence folder are therefore wrong for this family.
Fix: report the dependency-join series in full (64, 0, 0, 2, 54, 3, 0 of 100), drop "when, and only when", and state that teaching the shape was necessary in these data but not sufficient. Fix the comparator.

### A11. Scale section (6): values reproduce; overreach in the conclusion (m/M)

Reproduced: 256/360 = 71.1% -> 320/360 = 88.9%; execution errors 195 -> 154 of 225; 2 vs 2 book items, one shared (plant-growth-rate). But "Scale multiplied what the curriculum taught; it did not replace what the curriculum omitted" and the Conclusion's "model size in the tested range failed" generalize from one pair of runs (one seed each) and 2/225 vs 2/225, where 2/225 is noise-level. The coalition comparison (exp-026 0.5B 0/20 vs exp-027 1.7B 20/20 on identical dv13 data) actually shows a size/family effect on a taught book shape, which 6 describes only as "the larger system was more accurate overall, largely on procedural problems". Fix: mention the coalition contrast; soften "multiplied".

### A12. Section 7 capability probes: cherry-picked 1.5B number (M)

Records (`evaluation/registry/*/items/capability-probes.jsonl`): base 0.5B 4/10; 0.5B fine-tunes 0-2/10 (LoRA 0/10, confirmed); exp-013 (1.5B) 5/10, but exp-014 (same 1.5B base, later data) 1/10 and exp-016 3/10; the untuned 1.5B base was never probed. "The 1.5B model passed 5 of 10 without any preservation data" therefore picks the best of three 1.5B fine-tunes and has no base comparison; with 10 probes the differences are within noise. Fix: report 5, 1, 3 of 10 for the three 1.5B arms and say no 1.5B base was probed, or drop the sentence. Text probes reproduce (0/49 direct, 5/49 base, 30/49 compiled, 16/16, 9/9).

### A13. Setting details (m)

- "another contributed ten plans with a hundred examples each": first dataset (`git show d06dbc846:training/data/all-books.jsonl`) has decompose-to-solve 9 plans / 900 rows; mathematical-thinking 579 plans / 990 rows. Fix: "nine plans".
- 6,775 rows over 893 plans reproduces (877 training plans + 16).
- "Unless stated otherwise, training was ... three epochs": every later arm (exp-016..exp-027 manifests) trained 2 epochs; the later Qwen3 runs of 5.3 and 6 fall under "unless stated otherwise" without being stated. Fix: say "three epochs (two in the later Qwen3 runs)".

### A14. Scale claim not replicated by another 1.5B run (M)

01 section 6 and Table 3: "the 1.5B model ... solved all the first-exposure compositions that the smaller model had failed". A second Qwen2.5-Coder-1.5B-Instruct arm, exp-014-deep-chains (dv2), evaluated on the same census compositions, solved `above-third-largest-percent` 0/40 and `above-total-percent-discount` 17/40, failing with the same `probe failed: the answer must be a whole number ...` pattern as the 0.5B model (`evaluation/registry/exp-014-deep-chains/items/holdout.jsonl`). The 0.5B arm exp-015 (dv2) was 0/40 and 0/40. So the "scale fixes first exposure" contrast is one run (exp-013) against one run (exp-012); with other data the 1.5B model shows the same failure. Fix: report exp-014's 0/40 and 17/40 beside exp-013's 40/40, and phrase scale as "in one pair of runs".

### A15. Validation column after the inventory change (m, omission)

The composition-inventory arms did not move the 16 untrained validation plans either: exp-011 3/16 (18.8%), exp-012 3/16, exp-013 up to 4/16 (`evaluation/registry/exp-01{1,2,3}*/selection.md`). This is consistent with the paper's thesis and would strengthen Section 5 if reported; its absence makes Table 3 look like the curriculum change moved "generalization" in general.

## Part B. Manuscript 02 (Informatica): evidence check

### B1. Section 4.3 / Introduction: the compact-vs-split contrast is one run per condition, and the programme's own later data are misdescribed (M, bordering R)

Reproduced: exp-021 (dv7) 460/705, 57 execution errors, 91.9% executed; exp-022 (dv8) 448/705, 135, 80.9%; scheduling execution failures 8 -> 59; `slots.durations.values is not a function` in exactly 41 exp-022 scheduling programs; procedural execution failures 12 -> 31; jsEval wires 11,760 -> 18,401 (+56.5%) and wires 2.19 -> 2.81 per plan over the 10,640 `solution.sop` files; bloated 13.8% -> 2.7%. Decompose-to-solve eval reference programs are byte-identical between dv7 and dv8 (`git diff 9aba95b08 9a561fccd`).

Problems:
1. "fine-tuned identically except for how the training programs were structured": exp-021 was resumed (`training/checkpoints/exp-021-1.7b-qwen3-dv7/run-manifest.json`: tokens_seen_seeded 11,878,813, wall clock 771 s) while exp-022 ran from zero (11,994 s); dv8 targets are 3.8% longer per epoch. Fix: "trained with the same recipe on the same statements; the compact-target run was resumed from an interrupted run".
2. Procedural targets were not changed by dv8 (`git diff --name-only 9aba95b08 9a561fccd -- training-data` touches only book folders), yet procedural execution failures rose 12 -> 31. The manuscript cites this as part of the effect. It is equally evidence of run-to-run variance or cross-family spillover, and it bounds how much of the book-side change can be attributed to the book targets. Fix: say the procedural targets were unchanged and that this rise shows the size of non-target-specific variation.
3. The good condition (compact targets with the dependency-join shape taught) exists in exactly one run (exp-021). Every other 1.7B arm trained with the split decompose-to-solve targets. Important: the dv10 label "revert to the measured-best dv7 monolithic book bodies" did not take effect for decompose-to-solve: all 900 decompose-to-solve rows of the dv10 export (`git show 3eebc5984:training/data/all-books.jsonl`) are byte-identical to dv8 and only 300 to dv7; wires per exported row remain 3.44 in dv10-dv13 (dv7: 2.00). Those arms show scheduling execution failures of 62 (exp-024), 44 (exp-025), 94 (exp-027). This is actually replication in favour of the paper's direction, but the paper does not use it and states "new families were written that way afterwards", which hides that the split targets stayed in the training data of every later arm. Fix: disclose the incomplete revert; report the later split arms (59, 62, 44, 94 execution failures) against the single compact arm (8), and say the compact result is not replicated.
4. "Compact plans of two or three wires with short bodies were the best-performing target form in the programme": rests on 460 vs 448 (12 answers, single seed). Fix: "the compact-target run had the highest total of any run (460 of 705); the difference from the split run is 12 answers".
5. Table 1 row label "Wires per training plan": the 2.2/2.8 values count all 10,640 shipped `solution.sop` files including evaluation items. Fix the label to "per shipped plan".
6. Wording "The model trained on split targets failed at run time more than twice as often" is fine (135/57 = 2.4), but correct answers changed by only 12, largely because the 100 scheduling problems scored 0/100 by exact match in both runs; the execution-failure increase fell mostly on problems that were scored wrong anyway. State this.

### B2. Section 4.1: scaffold removal did not reduce compile failures (M)

58 of 80 exp-003 compile failures contain the spliced assertion (reproduced; `article/audit/review-scripts/exp003-syntax.mjs`). 11,289 total generated lines reproduces; 2,743 scaffolding lines is not reproducible without the definition (a rule counting every probe line, the wrapper, and `const slots = $slots` gives 2,968). Validation 94.7% for exp-011 and the 94.4-95.3% range of earlier winners reproduce.

But the paper implies the fix removed a failure source. Counting JavaScript compile failures on the 225 book-derived held-out items: with scaffolding exp-003 80, exp-005 68, exp-007 75, exp-008 23, exp-009 68, exp-010 29; after scaffolding moved into the runtime exp-011 42, exp-012 **83**, exp-013 45. The spliced-assertion failure disappeared (0 unbalanced probe lines in exp-012), but exp-012's 83 compile failures (50 of them `missing ) after argument list` in units-and-rates) exceed exp-003's 80. The abstract's "a leading source of compile failures" is true of exp-003 only; the rule's benefit on compile failures is not visible in the records. Fix: add "The specific spliced-assertion failure disappeared, but total compile failures on the held-out book items did not fall (80 before, 42 and 83 in the next two runs), so the evidence supports removing a failure mode, not reducing failures." Also note that 94.7% validation is on 323 trained-plan rows near ceiling and cannot detect loss on untrained plans (3/16 before and after).

### B3. Section 4.2 graphPath (m)

Reproduced: 40 exp-016 programs use a new command (all `graphPath`, family `below-largest-path-exists`), 40/40 in both exp-014 and exp-016; the 379 -> 440 gain comes from `above-third-largest-percent` 0 -> 40 and `above-total-percent-discount` 17 -> 40. The BFS stage in the exp-014 program spans 14 lines (from `const adjacency2` to `const answer2`), not "about twenty". Fix: "about fifteen lines". The paper should also name what the two gaining families are: they are the first-exposure census compositions that 01 discusses. That makes the dv3 gain an interesting unexplained result (no new command, but the percentage/rank operators suddenly composable), which is worth one sentence and links the two papers.

### B4. Section 4.4 rate family: "false guards killed correct answers" is overstated (M)

Reproduced: exp-025 (dv12) units-and-rates: 36 of 50 fail on a `probe`, 21 of them "the useful rate must be a whole positive rate". The quoted program is abridged but faithful. Running all 36 programs with `probe` made a no-op (`article/audit/review-scripts/guard-rescue.mjs`) and scoring with the evaluator's `answerMatches` (`teacher/naming.mjs`) gives **0 of 36 exact matches**; 12 print the same numbers as the reference (the claim ledger's 15 uses a looser rule). The reason: the program returns "20.9 cases." while the reference is "20.9 useful cases.". So the guards did not cost any scored answer; they stopped programs whose computation was right but whose output would still have been scored wrong. The abstract's "false guards killed correct answers" and "made correct programs look wrong" should read "stopped correct computations". Also, the neighbouring arm exp-024 (dv11) had only 6 probe failures on the same family, and dv13 moved units-and-rates into training, so the guard-removal policy was never measured on this family. Say so.

### B5. Section 4.4 the "useful" assertion (m)

Reproduced: 64 exp-012 failures, all stopped by `the answer must be a whole number that is not negative`; failing programs index with `slots.pct - 1` and compute `current - slots.discount * 100`. However the "useful side" produced no scored benefit (each caught wrong value is still a failure), and the same guard is a `Number.isInteger` whole-number guard of the kind 4.4 condemns in the rate family; which guard is "an invariant of the answer" was determined from the reference answers after the fact. Fix: state that the benefit is diagnostic (the failure is visible and attributable), not accuracy, and that the policy requires knowing the answer's type per family in advance.

### B6. Section 4.5 outputs: the remedy was applied and did not change the score; the parser is misdescribed (M)

1. "A parser that accepted any complete sentence stating a duration and a verdict" is false: `joinValue` in `article/scripts/restricted-comparators.mjs` accepts one fixed template ("The earliest safe completion time is N minutes, so the plan (is feasible|is not feasible|meets the limit|does not meet the limit).") plus the optional oracle suffix. 01 says the same ("any complete sentence of that form" is closer but still loose). Fix: "a parser that accepted the reference sentence template with four verdict phrasings".
2. After dv11 changed the references to "46 minutes: not feasible.", exact match on the 100 scheduling problems stayed 0/100 in exp-024, exp-025, exp-026, exp-027. In exp-025, 54 answers state the right duration and verdict in the old sentence ("The earliest safe completion time is 45 minutes, so the plan does not meet the limit.") against the new reference "45 minutes: not feasible." - the model kept printing the sentence of the procedural dependency-chain-join family. So "change the reference, not the model" did not, by itself, make correct programs score as correct: the model's output convention came from a different (procedural) family than the one whose references were changed. This is a strong, on-topic observation for 4.5 (output conventions are learned across families) and its omission makes the section read as a solved problem. Fix: report it.
3. The retained restricted diagnostics mislabel these 54 exp-025 answers as "outside_grammar" because the comparator cannot parse the new oracle form (expected = null). Fix the comparator before any number from `*-restricted.jsonl` for exp-024..027 is used.

### B7. Section 3 programme description (m)

"The dataset went through thirteen versions, each changing one aspect of the data; each version change was followed by a training run." dv6 was built and deliberately not trained (VERSION.label at c945ce3ec), dv10 (a revert) was not trained, dv8 changed 3,437 solution files across six books, and 4.2 itself says dv3 "changed other targets as well". Fix: "thirteen versions, most followed by a training run; several changed more than one aspect".

"Each comparison below changes one aspect of the targets between two training runs with the same base model and recipe" is contradicted by 4.1 (the inventory change coincided) and 4.2 (other targets changed), and 4.4 is not a two-run comparison. Fix: "Where a section compares two runs, ...".

## Part C. Citation check (both manuscripts)

Checked against `article/evidence/bibliography.json`, `bibliography-additions.json`, and the `supports` / `doesNotEstablish` fields of `bibliography-additions-audit.json`.

- [@pal; @pot] (01 1, 02 1): supported for "delegates computation to an interpreter". 01's "removes arithmetic errors from the model's job" is slightly stronger than the sources (they show reduced arithmetic error); fine as "moves arithmetic out of the model's job".
- [@magister], [@specializing], [@scan], [@cfq], [@cogs], [@bogin], [@kirkpatrick], [@lora], [@loraforgets], [@selfrepair], [@dslsurvey], [@dbc], [@toolformer], [@synthesis]: used within what the audit says they support.
- [@cogs] "semantic parsers": COGS evaluates seq2seq Transformers/LSTMs trained from scratch; "sequence-to-sequence models on a semantic-parsing benchmark" is more accurate (m).
- [@hupkes] (01 8.1) - misuse (m/M): "What our model showed is systematicity within a closed vocabulary, together with no productivity beyond it." In Hupkes et al., productivity means generalizing to longer sequences than seen in training, not to unseen primitives or operations (audit entry: "productivity (extending beyond training length)"). Unseen operators are not productivity in that taxonomy; by that definition the paper did not test productivity at all. Fix: "systematicity within a closed operator vocabulary; the tests do not address productivity in Hupkes et al.'s sense, and failure on unseen operations is outside their taxonomy".
- [@faithfate] (01 3): Dziri et al. describe matching of linearized computation subgraphs; 01 extends this to "retrieves the stored program closest to the new statement ... observed here at the level of whole programs". This is an analogy, and the evidence offered for retrieval (the "throughput rate of a neighbouring family" example) is wrong (A4). Fix: "resembles" rather than "is the behaviour ... observed here"; cite the diag-009 finding (copied return statement of a different training family, `evaluation/registry/phase4-analysis.md`) which is better evidence of retrieval.
- [@loraforgets] (01 4): Biderman et al. compare LoRA with full fine-tuning on forgetting. 01's contrast is LoRA 0/10 against the untuned model 4/10; the relevant comparison is LoRA 0/10 against full fine-tuning 1/10 (10 probes), which is uninformative. Fix: "its probe score (0 of 10, against 1 of 10 for full fine-tuning and 4 of 10 untuned) is too small a sample to test that claim".
- [@dwork] (01 8.3): supported for adaptive reuse of a holdout. The positive Table 3 result used a fresh reserved slice, so the sentence is fair.
- [@herzig] (02 1, 5.1): supports the IR finding for pretrained seq2seq on CFQ/text-to-SQL (non-peer-reviewed preprint). 02 5.1 says "Our observations are consistent with that finding at a finer grain: the same model ... wrote more reliable programs when the target omitted scaffolding, avoided unnecessary interfaces, and used outputs the input determined." Two of those three are not shown by 02's own records (B2: compile failures did not fall after scaffold removal; B6: the output change did not change the score). Fix: restrict to "avoided unnecessary interfaces".
- Missing literature (m): 01 does not cite work on compositional generalization in neural program synthesis specifically (e.g. Shi et al. on compositional generalization and decomposition in program synthesis, and ExeDec), which is the closest prior work to "unseen compositions of taught operators"; 02 does not cite grammar-constrained or grammar-prompted DSL generation with LLMs (e.g. Wang et al., grammar prompting for DSL generation), the closest prior work on designing/constraining a target DSL for an LLM. Verify and add.

## Part D. Argument check

### D1. 01's headline causal claim has no before-measurement on the same slice and is confounded (R unless addressed)

Abstract: "What changed it was the unit of the curriculum." Table 3's 160/160 is measured on four reserved compositions that no earlier run was evaluated on. The only slices measured before and after are the withheld procedural family (0/40 -> 0/40) and the book set (0-1 -> 1-2 of 225), and those did not change. So the records show that the inventory run solved a new slice, not that the change of curriculum unit moved a result. Confounds in the same run: (a) scaffolding moved into the runtime (01 5.1 says so but draws no consequence); (b) the reserved compositions are rendered by the same procedural generator, statement template, slot names, stage comments, and return format (`return current + " units."`) as the trained compositions, while the withheld family and the book families differ in all of those. The strongest alternative explanation is therefore "in-generator template filling vs out-of-generator transfer", not "inside vs outside the operator vocabulary". 01 dismisses this with an unmeasured sentence ("The difference between the rows is not the depth or the length of the programs, which were comparable").

The programme has a partial before-measurement that 01 does not use: `diag-009` (exp-009 winner, before the inventory) scored 8 of 60 on filter/aggregate chains, 0/10 on the held-out `filter-total-add-rate` and 0/10 on `filter-largest-double` and `filter-largest-add-rate` (`evaluation/registry/phase4-analysis.md`, "Four-condition diagnostic"). That is the natural "before" row for Table 3 (different items, same kind of chains). Fix: add a before row from diag-009; state the scaffold-removal and same-generator confounds; test the vocabulary claim against the template claim (e.g. a reserved composition rendered with a book-style statement/output format, or a book family rewritten into the procedural template) or narrow the claim to "compositions rendered by the training generator".

### D2. Plan fingerprint is text identity, not computation identity (M)

01 2.2: "a hash of its computation with the specific values removed. Two problems share a plan when their solutions perform the same computation on different numbers." `planFingerprint` in `teacher/families/index.mjs` hashes the literal source text of the facts body, every intermediate wire (name, command, body), and the compute body, excluding only instance values. Identifier names, probe messages, and return-string wording are part of the plan. Consequences: (a) "untrained plan" can mean a trained computation with different wording, so the middle rung of the ladder is not "a new plan" in the computational sense; (b) the split-integrity check (`teacher/dataset.mjs` lines 75-84) guarantees no held-out item shares source text with training, not that no held-out computation appears in training. For mathematical-thinking (579 plans over 990 rows) plan and template nearly coincide. Fix: define the fingerprint as it is implemented and say what it does not guarantee.

### D3. "Ten interventions" is not ten comparisons against one baseline (M)

- Demonstrations and retries used other models and other populations: adaptation used exp-003 checkpoint-540 (fine), retries used the exp-012 census model on 30 development problems (A7).
- "Larger model" is listed as an intervention that "did not move the boundary" but Table 2 gives "see Section 6" and no numbers; Section 6 is after the curriculum change.
- Wider/deeper curricula, mixture, contrastive rows are cumulative (each on top of the previous data), so rows are not independent.
- The abstract lists eight items and calls them ten. Fix: "a sequence of interventions (Table 2)" and show the counts.

### D4. 1.7B coalition result coincides with other data changes (m, disclosed partly)

dv7 (first arm with the procedural coalition family) also introduced containers (VERSION.label "container plans") and came one version after dv6's four book shapes; the claim ledger notes zero container declarations in exp-021's coalition programs, which answers one confound. 01 says "while the data changed in other ways" for later runs. The 0.5B failure on dv13 (A10) must be added. Adequate otherwise.

### D5. Held-out reuse and the positive results (m)

01 8.3 properly calls the book set a development benchmark. But the reserved compositions of Table 3 were also reused across exp-011..exp-027 (the 705-item holdout includes them) and later data versions were designed after inspecting them (e.g. the dv3 changes that fixed above-third-largest-percent). For Table 3's first column this is irrelevant (first use); for the 1.5B column and Section 6 it is not.

### D6. Causal verbs on single-seed contrasts (M, both papers)

01: "Scale multiplied what the curriculum taught" (one pair of runs, contradicted by exp-014, A14); "What changed it was the unit of the curriculum" (D1); "The capability had moved from the model's direct answers into its programs" (the untuned model's direct score was 5/49; the fine-tuned compiled score is 30/49 by a different pathway; nothing "moved"). 02: "Splitting ... more than doubled execution failures" (one run each; the compact arm was resumed; procedural targets unchanged but failures rose 12 -> 31); "Validation scaffolding ... was a leading source of compile failures" (true only for exp-003). Fix: use "coincided with", "in the run with", and give n.

### D7. The first-exposure reading (m)

01 8.2: "a newly added operator is first used as a variant of its nearest neighbour". Two compositions, one model, one run; and exp-014 (1.5B) and exp-015 (0.5B) show the identical failure on the same two compositions in a different data version, which supports the observation's robustness across runs but contradicts the scale story (A14). Report both.

## Part E. Reader check

### 01
- Abstract: compelling question and a transferable rule (curriculum as vocabulary coverage); only one number (0.5B-1.7B). Problems: "Ten interventions" followed by a list of eight; "many compositions involving newly added operators" means 2 of 4 fully solved (and 7/40, 9/40 for the others) - write "half of the compositions"; "Book-derived families" and "plan shapes" are internal terms an outside reader cannot parse in the abstract - write "problem types transcribed from exercise books" and "solution structures". "the models wrote valid programs for every problem" is true of the best run only (exp-002 224/225 valid graphs, LoRA 264/265 parsed).
- "SOP Lang" is never expanded or justified by name; "wire", "plan", "family", "book family", "procedural family", "held-out composition", "first exposure", "census" are used before or without definition. Add a short glossary paragraph in 2.2.
- No Related Work section; the compositional-generalization literature is in 1 and 8.1 only; program-synthesis generalization work is absent (Part C).
- No uncertainty statements anywhere; every result is a count. Give Wilson intervals or at least per-plan counts for the 0-of-225 results (effective n = 16 plans, A1).
- "Over the following days the programme tried ..." (4) is lab-notebook voice; a journal reader needs the order and the design, not the calendar.
- Table 2 mixes three different measurement populations under one header (A7) and uses "—" for rows that were not measured; the "Held-out executed" column is not defined.
- 5.1 "so targets contained only the computation" contradicts 5.2, where the targets' final assertion is central. Write "only the computation and its answer assertions".
- 2.3 and the abstract say "code models", but Qwen3-1.7B is a general-purpose model.

### 02
- Abstract: clear, practical, transferable (a checklist for model-facing languages); numbers fine. "replaced twenty generated lines with three" should be about fifteen (B3). "made correct programs look wrong" / "false guards killed correct answers" overstate (B4).
- The paper never compares SOP Lang with the obvious baseline language (plain JavaScript or Python emitted by the same model). As a language-design paper this is the first question a reader will ask; 01 states this limitation, 02 does not. Add to 5.3.
- "The programme's resulting policy was to keep only assertions that are invariants of the answer" - the paper presents the policy but never measures it (the rate family was moved into training in dv13 and the held-out family changed; B4).
- 5.2 claims checks 1, 3, 4, 5 are "supported directly by failures in generated programs". Checks 1 and 5 are supported by failures, but their remedies had no measured benefit (B2, B6); say so beside the checklist.
- Identities are hidden by design ("One trained model wrote", "two versions of the same model"); the reader cannot tell that 4.1, 4.2, 4.3, and 4.4 use four different models (0.5B, 1.5B, 1.7B, 1.7B/0.5B). Name base and size in each subsection.

## Part F. Consistency between 01 and 02

1. Compile failures in the first run: 01 "74 of them with the same unbalanced-parenthesis error this splice produces" vs 02 "58 of 80 contained an assertion line with unbalanced parentheses". The records give 74 missing-parenthesis messages and 58 splices; 01 should adopt 02's 58.
2. The units-and-rates family: 01 says the first-series programs "computed a throughput rate ... when the problem asked for a count"; 02 (correctly) treats the family's answer as the useful output of a rate over time ("20.9 cases"). The records side with 02: the exp-003 programs computed useful output with the minutes multiplied by 60.
3. The dependency-join parser: 01 "a parser that accepted any complete sentence of that form"; 02 "any complete sentence stating a duration and a verdict". Neither matches the implemented fixed template (B6).
4. 01 5.1 "targets contained only the computation" vs 02 4.1 "only the computation and the assertions specific to it"; 02 is right.
5. 01 presents the scale step (0.5B -> 1.5B) as fixing first-exposure failures; 02 4.2 attributes the 379 -> 440 gain to the same two first-exposure compositions (third-largest-percent 0 -> 40, discount 17 -> 40) between two 1.5B runs. Read together, the papers show that a 1.5B model failed those compositions in one data version and solved them in the next without any new operator; neither paper says so, and 01's scale reading does not survive it.
6. Training recipe: 01 "three epochs unless stated otherwise"; the Qwen3 runs used in both papers trained two epochs.

## Ranked summary

Reject-level (must be addressed before submission)
1. 01 D1: the headline "What changed it was the unit of the curriculum" has no before-measurement on the Table 3 slice, and it is confounded with scaffold removal and with the in-generator vs out-of-generator difference. Add the diag-009 baseline, disclose the confounds, and narrow the claim or test it.
2. 01 A10: "solved when, and only when, their plan shape had been taught" and "followed the same pattern" are contradicted by exp-026 (0.5B, shape taught, coalitions 0/20) and by the dependency-join series 64, 0, 0, 2, 54, 3, 0 of 100 across the seven taught arms.

Major
3. 02 B1: compact vs split rests on one run per condition. The compact run was resumed, procedural failures rose 12 -> 31 with unchanged procedural targets, and the recorded dv10 revert did not revert decompose-to-solve: 900 of 900 rows are identical to dv8. Disclose all of this and use the later split arms (59, 62, 44, 94 failures).
4. 01 A4: "62 ran and answered a different question" and "computed a throughput rate ... when the problem asked for a count" are false. 50 of the 62 are units-and-rates programs that multiplied minutes by 60.
5. 01 A14 / F5: the scale claim fails in another 1.5B run. exp-014 scored 0/40 and 17/40 on the same first-exposure compositions.
6. 02 B2: compile failures did not fall after the scaffolding was removed: 80 (exp-003), then 42 (exp-011) and 83 (exp-012).
7. 02 B6: after the value-bearing references were introduced, exact matches stayed 0/100. The parser is misdescribed. The evidence comparator mislabels 54 correct exp-025 answers as outside_grammar.
8. 02 B4: guard removal would have gained 0 of 36 scored answers, so "killed correct answers" overstates. The guard policy was never measured.
9. 01 A2: the quoted scheduling problem is the later simplified statement. The evaluated statement contained a distractor, and the program responded to that distractor.
10. 01 A1: the 225 held-out items are 16 plans, and 100 of them are one plan. Report results per plan.
11. 01 A7: the retries row is measured on another model (exp-012) and on 30 development problems. "Every crashing program" means two programs.
12. 01 A8: "giving the same answer to both" is false. In 0 of 8 direction pairs did both members get the same answer, and in 4 of 8 one member crashed.
13. 01 D2: the plan fingerprint is a hash of the source text, not of the computation.
14. 01 A12: the 1.5B probe score (5/10) is the best of three 1.5B runs (the others scored 5, 1 and 3). No 1.5B base was probed.
15. 01 D3 / D6, 02 D6: the "ten interventions" count is inflated, and causal verbs are used on single-seed contrasts.
16. 01 Part C: [@hupkes] "productivity" is misused.

Minor
17. 01 A3: 74 vs 58 splices, and F1.
18. 01 A6: Table 2 lower-LR best is 2/16, not 1/16. The LoRA comparison should read 3 vs 3 (best).
19. 01 A5: the LoRA row's denominator is 265.
20. 01 A9: "none of the book families before ... none of them now" contradicts 1, 2, 2 of 225. The "comparable length" claim is unmeasured.
21. 01 A13: nine plans, not ten. Later runs used two epochs, not three.
22. 02 B3: the loop is about fifteen lines, not twenty. Name the two gaining families.
23. 02 B7: "each version ... followed by a training run" and "each changing one aspect" are false (dv6 and dv10 were not trained).
24. 02 B1.5: Table 1's "per training plan" counts include evaluation files.
25. Citations: [@cogs] wording, [@faithfate] analogy, [@loraforgets] comparison, [@herzig] overreach in 02 5.1, missing program-synthesis and DSL-constraint literature.
26. Reader: jargon in the abstracts ("book-derived families", "plan shapes"), "many" = 2 of 4, lab-notebook voice, no uncertainty statements, no baseline language comparison in 02, "code models" for Qwen3.

Values that reproduce exactly (no action): Table 1 (01), 98.8%/56.0%/54.2%, 1-2-3 of 16 winners, 0/225, 12.4%/27.6%/12.5%; Table 2 held-out and executed columns; 168 -> 239 and 9.8%; 17/30 unchanged; 7/8, 0/8, 1/8; Table 3 all cells; 7/40, 9/40, all 64 stopped by the non-negative-whole-number assertion; 71.1% -> 88.9%; 195 -> 154; one shared book item; 4/10, 0-2/10, 5/10 (exp-013); 0/49, 5/49, 30/49, 16/16, 9/9; 64/100 (exp-021 only); coalitions >= 16/20 restricted in 1.7B arms. 02: 11,289 lines; 58 of 80; 94.7% vs 94.4-95.3%; graphPath 40/40 both arms; 53.8% -> 62.4%; 40 command users; Table 1 all rows; jsEval +56.5%; bloated 13.8% -> 2.7%; 8 -> 59; 12 -> 31; 41 `.values()` crashes; 36 of 50 guard failures; 64 census failures.
