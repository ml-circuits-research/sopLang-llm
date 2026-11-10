# Fact-check: evaluation-only results in the manuscripts (2026-09-29)

Scope: the new evaluation-only numbers (Sections 2.3, 5.2-5.3, 6, 8, 9 and abstract of 01; abstract, 4.6, Table 2, Check 6, conclusion of 02; abstract, 4.6, Tables 4-5 of 03; Section 6 sentence of 04). Sources: article/evidence/comparison/*, evaluation/registry/{s-*,e2-*,e3-*,e8-*,e9-*}, analysis scripts. Manuscripts were not edited.

Findings are appended as they are verified.

## Log

### Recomputation
- `node article/experiments/analyze-comparison.mjs` reproduces `comparison.json` byte-for-byte (identical after JSON normalisation). Every main-table cell in the README matches.
- Judge statistics recomputed from `judge-A-*.jsonl`/`judge-B-*.jsonl`: over all 1,401 unique pids (1,381 real + 20 known-wrong; 1,402 lines, one duplicated pid) agreement 97.64%, kappa 0.942, 33 disputed; over the 1,381 real pairs only, agreement 97.61%, kappa 0.942, 33 disputed. Both round to the manuscript's 97.6% / 0.94. The calibration key holds 21 rows (20 `different` + 1 trivial `same`); none of the 20 was accepted by either judge; 41 parser-equivalent pairs, all accepted by both. VERIFIED. Wording nit: 01 says "agreed on 97.6% of 1,381 distinct answers", but the script's statistic is computed over 1,401 pairs including the calibration items (same rounded value).

### F1 (HIGH) - The "same numbers at every wording" pairing does not hold for the evaluated samples
`stratifiedSample(items, 5, 20260928)` ranks items by `sha256(seed:id)`, and the id carries the rung suffix (`...-L0`, `...-L2`) or the `-procedural` suffix. Each wording therefore drew its own 5 instances per composition. Overlap of the evaluated instances (e2-*-exp012; identical for all runs of a rung):
- Held-out compositions: L0 and L2 share 5 of 55 instances; L0 and L1 share 6 of 55; only 1 instance is in all three rungs.
- Trained controls: L0 and L2 share 7 of 20; L0 and L1 share 5 of 20.
- E3 scheduling: book wording and procedural wording share 2 of 15 problems; coalitions share 12 of 15.
Affected statements:
- 01 Table 4 caption: "Same numbers and references at every wording." False for the evaluated items (true only for the full 520-item files).
- 01 Sec. 5.3: "We rewrote 15 held-out scheduling problems and 15 coalition problems ... The numbers and reference answers were kept" and "including the final-data run, which solved none of the same scheduling problems in their book wording". Only 2 of the 15 scheduling problems are the same in both columns of Table 5.
- 02 Sec. 4.6: "Every problem was posed in the generator's own wording and in a narrative wording like the book problems, with the same numbers and references." The two columns of Table 2 are different samples (5 of 55 shared), so the "fell furthest" per-model drops compare different problems.
The directional conclusions survive because the contrasts are large (for example exp-027 scheduling 0 of 15 vs 15 of 15), but the pairing language must go, or the runs must be re-scored on the paired subset / re-run with a rung-independent sampling key.

### F2 (HIGH) - For the 0.5B and 1.5B extended-inventory runs (exp-012, exp-013), 3 of the 11 "held-out compositions" and 1 of the 4 "trained controls" contain operations absent from their training data
exp-012-census and exp-013-1.5b trained on data version 1 ("composition inventory (2026-09-22) - 37 compositions"; finished 2026-09-22T22:50Z and 2026-09-23T07:59Z). The elapsed, pathExists and rectangleArea operations and the compositions `above-total-elapsed`, `below-total-elapsed`, `below-largest-path-exists`, `below-largest-rectangle-area` were added to `teacher/procedural/compositions.mjs` in commits f350e40b5 / e748be001 on 2026-09-23 13:04-13:25 +0200, after both runs were trained (their holdout slice had 585 items = 225 + 40 + 8x40, not 705). Consequences:
- 01 Table 4 caption "Control: 5 fresh problems for each of 4 trained compositions" is false for the 0.5B and 1.5B rows: `above-total-elapsed` (5 of the 20 controls) was never trained for them.
- The 0.5B and 1.5B held-out columns include 15 items (path-exists, elapsed, rectangle-area) whose operations those models were never taught; Table 3 of the same paper describes their held-out set as 8 compositions. The "held-out vs trained fell together" reading for those rows mixes in untaught operations. Per-composition results (semantic): exp-012 L0 path-exists 1/5, elapsed 5/5, rectangle 5/5, control above-total-elapsed 5/5; exp-013 L0 path-exists 0/5.
- 01 Sec. 5.2 prose ("rewording broke compositions the models had been trained on") should either restrict the control to the 3 compositions trained by all three runs or say that one control is untrained for the two smaller models.

### F3 (HIGH) - 01 abstract and Sec. 9.1 attribute the withheld-type success to "an untuned code model"
Abstract: "An untuned code model writing plain JavaScript composed the elementary operations almost as well, and solved a problem type that fine-tuning had made unsolvable." Sec. 9.1 repeats it. The withheld stock problems were solved (24 of 40, e9-js1-qwen3-17) by Qwen3-1.7B, which Sec. 2 of the same paper calls "a general-purpose model rather than a code model". The untuned code model (Qwen2.5-Coder-1.5B, e9-js1-coder15) solved 2 of 40, the same as the fine-tuned 1.7B compact run (e9-ft-exp021, 2 of 40). "Made unsolvable" also overstates: exp-021 solved 2 of 40 at the semantic level, and the base-vs-fine-tuned contrast changes the target language and prompt as well as the weights (see F6).

### F4 (HIGH) - 02 abstract and Sec. 4.6: operator plans did not "fall furthest" when reworded, and did not "match plain code" at 0.5B
From Table 2 (semantic): generator -> narrative drops are 0.5B ops 19->11 (-8), JS 36->20 (-16), SOP 7->18 (+11); 1.5B ops 50->13 (-37), JS 50->33 (-17), SOP 21->1 (-20); 1.7B ops 49->25 (-24, -49%), JS 40->47 (+7), SOP 39->8 (-31, -79%). Operator plans fell furthest only at 1.5B. At 1.7B, SOP Lang with jsEval fell further in both absolute and relative terms. Sec. 4.6 bullet "In the narrative wording the operator plans fell furthest (to 13 and 25)" is false for the 1.7B model; the abstract "they fell furthest when the problems were reworded" is false as a general statement. What does hold: ops fell below plain JavaScript at 1.5B and 1.7B in narrative wording. Also, abstract "untuned models matched plain code in familiar wording" and Check 6 "equal accuracy ... in familiar wording" hold at 1.5B (50 vs 50) and 1.7B (49 vs 40) but not at 0.5B (19 vs 36). Note F1: the two columns are different item samples (5 of 55 shared).

### F5 (MEDIUM) - 03 abstract, Sec. 4.6 and Table 5: "exact matching reversed two conclusions" - neither is a reversal
(a) Operator plan vs JavaScript, 1.7B, held-out compositions: exact 44 vs 9, semantic 49 vs 40. The direction is unchanged; the gap narrows (35 -> 9), as 4.6's own bullet says. (b) Withheld stock problems: exact 0 vs 0 (a tie), semantic 24 vs 2. A tie becoming a difference is a changed conclusion, not a reversal. All six Table 4 rows are otherwise VERIFIED at all three levels (45/0/45/45; 55/9/39/40; 55/44/49/49; 55/7/22/27; 40/0/33/24; 40/0/5/2), and the two composition rows do use the same 55 items (identical item set, e8-js1-l0-qwen3-17 and e8-ops3-l0-qwen3-17). Suggest "changed" or "overstated one gap fourfold and hid another".

### F6 (MEDIUM) - Causal wording beyond the design in 01 Sec. 8, 9.1 and abstract
- Sec. 8: "Fine-tuning on templated synthetic programs made the model more accurate within its templates and less able to handle problems outside them ... Specialization did not only fail to add reach. It removed some." The comparison is Qwen3-1.7B untuned writing JavaScript (1 example) vs Qwen3-1.7B fine-tuned writing SOP Lang. Weights, target language and prompt all differ; 9.3 itself says a matched JavaScript fine-tuning was not run. The same base writing SOP Lang from the prompt solved 8 of 55 narrative held-out compositions (e8-sopicl3-l2-qwen3-17) and 0 of 5 withheld problems in the 115-sample (s-sopicl3-qwen3-17), so the loss cannot be attributed to fine-tuning alone.
- "the binding weakens as the model grows" (5.2), "less so as models grew" (abstract), "The binding to wording weakened with size" (9.1): the 1.7B row is a different model family (Qwen3 vs Qwen2.5-Coder) and a later data version (dv7 vs dv1, with 3 more operations and 11 held-out compositions). Sec. 7 of the same paper treats exactly this pair difference as "a system difference rather than a size effect".
- 9.1: "at every size we tested it was the binding, more than the operations, that separated success from failure on the book types." Only two book shapes (scheduling, coalitions; 15 problems each) were reworded (E3); no experiment isolates wording for the other book types.
- 6: "Most of the gain on the held-out compositions comes from executing code, not from fine-tuning." Acceptable as a decomposition of condition differences on the same 115 items, but "comes from" is causal.

### F7 (MEDIUM) - 01 Sec. 8: "In their original evaluations the fine-tuned models solved none of its problems"
exp-015-deep-chains-05 (a fine-tuned 0.5B run) matched 1 of 40 withheld problems exactly in its original evaluation (instance-023, "The stock covers 5 whole days, so the order must be placed today."). Every other fine-tuned run scored 0 of 40. Say "all but one ... solved none; one solved 1 of 40".

### F8 (MEDIUM) - The 115-problem sample is not "five per problem family" on the book side, and it over-weights coalitions
`stratifiedSample` groups book items by the second-to-last folder segment. That gives 5 per group, but mathematical-thinking contributes 10 problems from 10 different families (1 each, grouped as knowledge / no-knowledge), and the coalition type contributes 20 of the 55 book problems (4 grade folders x 5). In the 225-problem book set coalitions are 20 of 225. The fine-tuned 1.7B compact run's 32 book-type answers are 20 coalition + 5 scheduling + 5 logical-implications + 2 mathematical-thinking; the final-data run's 27 are 20 coalition + 7. So "most of them the coalition problems" (01 Sec. 6) is VERIFIED (20 of 32), but Sec. 2.3's "five per problem family" and the headline book-type contrast (32 vs at most 13) rest heavily on one type sampled at 4x its weight. Also 5 of the 1.5B direct-answer base's 13 book answers are logical-implications and 5 are two-written-rules problems (short verdict answers).

### F9 (LOW-MEDIUM) - 01 Table 6 picks the best 1.7B fine-tuned run, the final-data 0.5B run
The 1.7B row uses the compact-target run (exp-021: 55 held-out compositions, 32 book types); the final-data 1.7B run (exp-027) scored 51 and 27 on the same items. The caption discloses the choice. "Fine-tuning raised this to 55 at both sizes" would read 55 and 51 with the final data. Requested checks: exp-026 (0.5B) and exp-027 (1.7B final) rows are computed from their original holdout records filtered to the 115 sampled ids (115 of 115 found). Their holdout slice hash (568762bd...) equals the current slice hash, which covers book, folder, plan, oracle and statement. So the statements the bases saw equal those the fine-tuned runs saw. VERIFIED. s-ft-exp016 and s-ft-exp021 were re-run on the same 115 ids (identical set).

### F10 (LOW) - Prompt conditions
- run-items.mjs: `js` mode with `--shots 1` gives one example (a trained keepAbove-total-addRate composition). `sop-icl` with `--shots 3` gives the syntax guide plus SOP_EXAMPLES[0..2]: one trained composition, one crate-packing type and one letter-counting type. `ops` with `--shots 3` gives three trained compositions: above-total-add-rate, below-largest-double, above-largest-path-exists. The manifests confirm shots 1 (js1), 3 (sopicl3, ops3), 0 (prose, compiled). 01 wording ("one solved example", "a syntax guide and three solved examples of trained types") is VERIFIED.
- 02 Sec. 4.6 "Each form was shown three solved examples of trained compositions" is inaccurate for the SOP Lang form (only one of its three examples is a composition). The example sets also differ between forms. The operator-plan prompt includes a path-exists example that differs from held-out `below-largest-path-exists` only in filter direction. At 1.7B, path-exists was 5/5 with ops vs 0/5 with JavaScript, so 5 of the 9-answer ops-over-JS gap in generator wording sits in that one composition. This is a confound to "with no code to get wrong".
- Qwen3 base runs used `noThink: true`; fine-tuned Qwen3 runs did not (not claimed either way).

### F11 (LOW) - 02 conclusion: "the same move removes code and format errors"
Operator plans replace code errors with plan errors. For example, e8-ops3-l0-coder05 had 25 of 55 `graph_invalid` (unknown operation) and 1 `parse_invalid`. e8-ops3-l2-qwen3-17 had 13 `parse_invalid`, and e8-ops3-l2-coder15 had 12 `execution_error`. Format errors are not fully removed either: 5 of 49 ops successes at 1.7B are not exact, all judge-accepted with "units" in place of "minutes"/"hours".

### F12 (LOW) - Judge leniency on elapsed-time units
Both judges accepted 24 pairs (47 records) where the reference is "N hours." / "N minutes." and the candidate states N with "units" or no unit (elapsed compositions, whose operation is a unit conversion). Also 1 of the 21 calibration rows is a known-correct pair, not reported. The "two independent judges" (03 Sec. 4.6) are two sessions of an agent model, not independent raters in the human sense; 04 Sec. 5.4 argues that internal agreement is weak evidence. Consider "two separate, blind agent judges".

### Verified without change
- 23 operations: `Object.keys(OPERATORS).length === 23` (teacher/procedural/compositions.mjs), and all are in the operator-plan catalogue.
- 520 references: executing the correct plan (the item's `chain` with its `slots`) through `executePlan` reproduces the oracle for 520 of 520 items at every one of L0, L1, L2 and L3.
- 01 Table 4, Table 5 and Table 6, and 02 Table 2: every cell equals the semantic (exact) counts in comparison.json, recomputed.
- 01 Sec. 8: 2 and 0 of 40 (e9-ft-exp021, e9-ft-exp027); 24 of 40 (e9-js1-qwen3-17); 47 vs 39 narrative on the identical L2 item set (e8-js1-l2-qwen3-17 vs e2-l2-exp021). The quote "The stock covers 13 whole days. The order must be placed today: No." is in e9-js1-qwen3-17 instance-006, and both judges said "same". The Sec. 5.2 quote "18.642857142857142" is in exp-012-census holdout.
- 03: strict accepted 33, judges 24. All 9 strict-only answers state the right day count with the wrong ordering decision; the "must be placed today: true" wording is present (instance-008). Eight judge files (4 slices x 2 judges). Pairs were written 02:12:50 and the last verdict file is dated 02:15:34, 2 min 44 s. "Under three minutes" is consistent, but it is evidenced only by file mtimes.
- 02: "second sample" of 115 shares 11 of its 55 composition problems with Table 2's generator-wording sample (partly overlapping, which the wording allows). SOP-in-prompt 4/19/34 and 2/9/1, fine-tuned 45/55/55: VERIFIED. Prompt hashes are identical between s-sopicl3-* and e8-sopicl3-*.
- 04 Sec. 6 sentence (minutes, kappa 0.94, retained verdicts, injected wrong answers): VERIFIED.
- 01 Sec. 6 "at the two smaller sizes fine-tuning did not help on book types": holds at the semantic level. 0.5B fine-tuned 4 vs base direct 5 / JS 1 / SOP 2; 1.5B fine-tuned 6 vs 13 / 10 / 9. At 0.5B fine-tuning beats two of the three prompted conditions. At the exact level, 1.5B fine-tuned (5) beats every base (at most 2).
- 01 Sec. 6 "SOP Lang taught only in the prompt was worse than plain JavaScript at every size": true for held-out compositions (4 < 33, 19 < 49, 34 < 45). Not true for book types at 0.5B (2 vs 1).

## Ranked summary
1. F1 (01, 02): the wordings were not evaluated on the same problems. Separate hash samples per rung give 5 of 55 shared held-out items between L0 and L2, and 2 of 15 shared scheduling problems between book and procedural wording.
2. F2 (01): for the 0.5B and 1.5B inventory runs, `above-total-elapsed` is not a trained control, and 3 of the 11 held-out compositions use operations those runs were never taught.
3. F3 (01): the abstract and 9.1 credit the withheld-type success to "a code model". It was Qwen3-1.7B (24/40); the coder base scored 2/40.
4. F4 (02): "operator plans fell furthest" is false at 1.7B, and "matched plain code" is false at 0.5B.
5. F5 (03): "exact matching reversed two conclusions": neither case is a reversal.
6. F6 (01): causal wording. "Fine-tuning removed ability" is confounded with target language and prompt; "binding weakens with size" is confounded with family and data version; 9.1 generalises from 2 shapes.
7. F7 (01): exp-015 solved 1 of 40 withheld problems in its original evaluation.
8. F8 (01): the book side of the 115-sample is not 5 per family, and coalitions are 20 of 55.
9. F9 (01): Table 6 uses the best 1.7B run (the final-data run gives 51/27). The requested same-items/same-statements check passes.
10. F10-F12: example sets differ across forms (02), plan errors remain (02), judges lenient on time units, and "independent" judges (03).
Per manuscript: 01 - F1, F2, F3, F6, F7, F8, F9 (+ minor F10/F12 wording); 02 - F1, F4, F10, F11; 03 - F5, F12 (all Table 4 numbers verified); 04 - no mismatch found.
