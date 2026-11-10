# Revision fact-check (2026-09-28)

Scope: the revised manuscripts 01-machine-learning.md, 02-informatica.md, 03-empirical-software-engineering.md, 04-ai-and-ethics.md. Only mismatches and unsupported statements are listed. Sources are paths relative to the repository root. Findings are appended as they are confirmed.

## Scheduling series (restricted parser, article/evidence/*-decompose-to-solve-restricted.jsonl)

Recomputed restricted_match counts on the 100 held-out scheduling problems: exp-021 (1.7B, dv7) 64; exp-022 (1.7B, dv8) 0; exp-023 (1.7B, dv9) 0; exp-024 (1.7B, dv11) 2; exp-025 (1.7B, dv12) 54; exp-026 (0.5B, dv13) 3; exp-027 (1.7B, dv13) 0. The series 64, 0, 0, 2, 54, 3, 0 is correct but its sixth value is the 0.5B run.

Execution failures on the same 100: exp-017 87, exp-018 88, exp-019 58, exp-021 8, exp-022 59, exp-023 36, exp-024 62, exp-025 44, exp-026 55, exp-027 94.

Training form of the decompose-to-solve book (non-eval solution.sop, wires per plan): dv3, dv4, dv5, dv6, dv7 = 2.00 (compact; dv5, dv6 and dv7 byte-identical, md5 prefix 9c6b9e); dv8 = 3.44 (split); dv9 = 4.00 (container idiom); dv10 = 3.44, byte-identical to dv8 (65c03e); dv11, dv12, dv13 = 3.44 (split, rewritten answers/statements). The claim that dv10 to dv13 kept the split form is confirmed. It holds for the whole decompose-to-solve book, not for a trained "scheduling type" (the scheduling type itself is eval-only; the procedural chain-and-join families are byte-identical from dv7 to dv13).

## 02-informatica.md

### HIGH 02-1. "Only one run in the programme had compact scheduling programs" is false

Quoted (Section 4.3): "Every run after the recorded revert therefore trained on split scheduling programs. ... Only one run in the programme had compact scheduling programs, and it had 8. The split form is thus associated with high execution failure in every observed run."

Records: the decompose-to-solve training programs were compact (2.00 wires per plan) in dv3, dv4, dv5, dv6 and dv7, and the dv5 programs are byte-identical to dv7 (`git archive 6f950605c` vs `9aba95b08`, training-data/decompose-to-solve, non-eval solution.sop, same md5). Execution failures on the 100 held-out scheduling problems: exp-017 (1.7B, dv3) 87, exp-018 (1.7B, dv4) 88, exp-019 (1.7B, dv5, the same compact programs as dv7) 58, exp-014 and exp-016 (1.5B) 98 each (evaluation/registry/<exp>/items/holdout.jsonl, items whose folder is dependency-chain-and-join). So five runs had compact scheduling programs, and four of them failed on 58 to 98. What distinguishes exp-021 (8 failures) is the combination of compact book programs with the procedural chain-and-join shape (first trained in dv7, exp-021). The sentence "The split form is thus associated with high execution failure in every observed run" is true, but the implied converse (compact form associated with low failure) is contradicted by exp-019.

Fix: "Only one run combined compact scheduling programs with the taught procedural chain-and-join shape, and it had 8. Earlier 1.7B runs with the same compact programs but without the procedural shape had 58 to 88 (exp-019 trained on byte-identical compact programs and had 58)." Also soften the Introduction's framing accordingly.

### MEDIUM 02-2. The splice failure did not "disappear" when scaffolding moved into the runtime; it occurred in one scaffolded run only

Quoted (Section 4.1): "The spliced-assertion failure disappeared. Total compile failures did not fall." and Check 1 "doing so removes the failure mode tied to that construct".

Records: the 58 spliced `probe(Number.isInteger(<expr>.every(...)` compile failures occur only in exp-003. The other scaffolded 0.5B runs, whose every held-out program still carried the scaffolding (225 of 225 programs contain `const probe =`), have 0 such splices: exp-002 0 of 71 compile failures, exp-004 0 of 54, exp-005 0 of 68, exp-007 0 of 75, exp-008 0 of 23, exp-009 0 of 68, exp-010 0 of 29 (evaluation/registry/<exp>/items/holdout.jsonl, book slice; detector: a compile-failed program containing a probe(Number.isInteger|typeof|Array.isArray(...<method>( line). The failure mode had already vanished six runs before the scaffolding was removed, so its absence in exp-011 and exp-012 is not evidence that removal eliminated it. The comparison "42 and 83 compile failures, against 80 before" also picks exp-003 as the baseline; the scaffolded runs immediately before the change had 23 (exp-008), 68 (exp-009) and 29 (exp-010).

Fix: state that the splice appeared in one of eight scaffolded runs (exp-003) and in none after removal, so the records show that removal made it impossible, not that removal made it go away; compare 42 and 83 against the scaffolded range 23 to 80.

### LOW 02-3. "Validation accuracy on trained programs ... (94.7%, against 94.4% to 95.3% before)" labels overall accuracy as trained-program accuracy

Records: 94.7% is exp-011's overall validation match (321/339 equivalent; evaluation/registry/exp-011-compositions/selection.md, winner rows 94.7% overall, 98.5% plan-seen). 94.4% to 95.3% are the overall figures of exp-005 to exp-010. The trained-program (plan-seen) figures are 98.5% for exp-011 against 98.1% to 98.8% for exp-003 to exp-010. Fix: "overall validation accuracy stayed where it was (94.7%, against 94.4% to 95.3%)" or use 98.5% against 98.1% to 98.8%.

### LOW 02-4. Introduction example: "wrote five scalar inputs and one line of arithmetic"

Records (exp-021, item 1.1.4-dependency-chain-and-join): the slots literal has seven scalars (five durations, bufferMinutes, limitMinutes), and the computation is two lines (a Math.max join and a sum). Fix: "seven scalar inputs and two lines of arithmetic", or "five durations as separate scalars".

### LOW 02-5. "For the scheduling type the revert did not take effect"

Records: no scheduling type is trained; the held-out scheduling type is eval-only, and the procedural chain-and-join families are byte-identical in dv7 to dv13. What failed to revert is the whole decompose-to-solve book's training programs (dv10 byte-identical to dv8, md5 65c03e; dv11 to dv13 keep 3.44 wires per plan). The other books did revert. Fix: "For the decompose-to-solve book, which contains the scheduling type, the revert did not take effect".

### LOW 02-6. "We re-executed every saved program of every evaluation run"

Records: article/evidence/reexecution-summary.json covers 26 runs and 13,330 records (the held-out evaluations of trained checkpoints exp-002 to exp-027 plus two quantized exp-003 runs). Not re-executed: adapt-holdout-0/1/3 (795 records), cmp-base-holdout, diag-009, diag-pairs-010, diag-pairs-fixed, retry-sweep-0/1/2, exp-000-baseline, exp-001 overfit runs. Fix: "every saved program of the 26 held-out evaluations of trained checkpoints". The same wording appears in 01 (Section 2.3) and 03 (Section 4.1 and abstract).

Checked and reproduced in 02 (no action): 41 `.values()` crashes in exp-022; 64 restricted matches in exp-021; 58 of 80; about a quarter of generated lines (27.9% of non-blank lines in exp-003); 42 and 83 with 50 of the 83 from the units-and-rates type (space in an identifier); graphPath type 40/40 in exp-014 and exp-016, the only 40 programs using a new command; 53.8% to 62.4%, and the +61 comes from the discount (+23) and third-largest (+40) types; Table 1 all rows; +56.5% jsEval wires; 13.8% to 2.7% bloated; procedural execution failures 12 to 31; 62, 44, 94 and 55; dv10 to dv13 split form; 36 of 50 guard failures in exp-025, 12 of 36 printing the reference numbers, 0 exact (article/audit/review-scripts/guard-rescue.mjs); 54 of 100 in exp-025 printing the procedural sentence; 64 wrong values stopped by the non-negative-whole-number assertion in exp-012; reference programs for the evaluated scheduling problems identical in dv7 and dv8; keyed duration maps in 50 training programs of both dv7 and dv8; thirteen data versions.

## 01-machine-learning.md

### MEDIUM 01-1. "The single correct answers in some runs were different problems in each run" is false

Records: exp-005, exp-008 and exp-010 each solved the same held-out item, mathematical-thinking/.../37.22-compare-two-groups-by-percentage-not-absolute-count; only exp-007 solved a different one (35.11-plant-growth-rate-as-change-per-day) (evaluation/registry/<exp>/items/holdout.jsonl; article/evidence/early-series-verification.md section 3). Fix: "Three of the four single correct answers were the same problem, a percentage comparison; the fourth was a different one."

### MEDIUM 01-2. The scheduling series mixes model sizes without saying so

Quoted (Section 5.3): "It found 64 of 100 correct in the first 1.7B run that included the shape. Across the seven runs trained with the shape, the correct counts were 64, 0, 0, 2, 54, 3 and 0 of 100".

Records: the seven values are exp-021 (1.7B) 64, exp-022 (1.7B) 0, exp-023 (1.7B) 0, exp-024 (1.7B) 2, exp-025 (1.7B) 54, exp-026 (0.5B) 3, exp-027 (1.7B) 0 (article/evidence/*-decompose-to-solve-restricted.jsonl). The sixth value is the 0.5B run; six of the seven are 1.7B. The next paragraph's "the other in two of seven runs, and neither transferred at 0.5B" is consistent only if the reader knows that the 3 is the 0.5B run. Fix: "Across the six 1.7B runs trained with the shape the counts were 64, 0, 0, 2, 54 and 0, and the 0.5B run on the final data had 3." Also "most of the rest failed to execute" holds in aggregate (358 of 577 non-matches) but not for exp-021 (8 of 36) or exp-023 (36 of 100 failed; 64 printed answers outside the parser's grammar); say "in five of the seven runs, most of the rest failed to execute".

### LOW 01-3. "It declared eleven elementary operations"

Records: `git show 834f1ab51:teacher/procedural/compositions.mjs` declares ten operators in OPERATORS: keepAbove, keepBelow, total, count, largest, smallest, double, addRate, subtractRate, perUnit. Fix: "ten".

### LOW 01-4. Order of the exp-014 counts is reversed

Quoted (Section 5.2): "solved 0 and 17 of 40 on the same two compositions", after the previous sentence ordered them as percentage discount then third-largest (7 and 9).

Records: exp-014 solved the percentage-discount composition 17/40 and the third-largest composition 0/40 (evaluation/registry/exp-014-deep-chains/items/holdout.jsonl). Fix: "17 and 0 of 40". (exp-015 0 and 0, exp-016 40 and 40 are correct.)

### LOW 01-5. "That model scored 0 of 10 on each of three chain structures"

Records: diag-009 (exp-009-mix10 checkpoint-728) normal condition scored 0/10 on four structures: filter-largest-double, filter-total-add-rate, filter-count-per-unit, filter-largest-add-rate (evaluation/registry/diag-009/items/diagnostic.jsonl; early-series-verification.md section 6). Fix: "four".

### LOW 01-6. Rate-type failure mechanism

Quoted (Section 3): "Those programs computed the right kind of quantity, useful output over a period, but multiplied the running time in minutes by 60 instead of dividing."

Records (exp-003, 50 units-and-rates mismatches): 45 compute nominal x (100 - overheadPercent) x minutes with no division by 100 or by 60, 4 also divide by 60, 1 divides by 100. The typical value is 125400 = 12 x 95 x 110 for a reference of 20.9 (off by a factor of 6000). No program multiplies the minutes by 60; 27 answers print a text "Convert the minutes to hours with 110 x 60 = ...". Fix: "but multiplied the rate by the running time in minutes instead of hours and did not convert the percentage, producing values thousands of times too large".

### LOW 01-7. "We re-executed every saved program of every evaluation run (13,330 records in 26 runs)"

See 02-6: the adaptation runs reported in Table 2 (adapt-holdout-0/1/3), the diagnostics and the retry sweeps are evaluation runs that were not re-executed. Fix: "every saved program of the 26 held-out evaluations of trained checkpoints".

Checked and reproduced in 01 (no action): 6,775 examples over 893 fingerprints, 579 over 990 and 9 x 100 (git d06dbc846 export); 339 = 323 + 16; Table 1 all cells; 0 of 50 parse; 46-minute example and the model program (A and C parallel, spliced line, "total number of observations is" + 5); 80/58/77/62/50/6; "125400 undefined in undefined minutes"; Table 2 all cells including the per-run maxima 2, 3, 3, 3, 4, 4, 3 of 16 and exp-003's 3 of 16; 72 checkpoints between 1 and 4; LoRA 54% vs 99%, probes 0, 1, 4 of 10; pairs 7/8, 0/8 (four pairs with a crash, four with two wrong values), 1/8; 168 to 239; retries 17 of 30; 22/18/4 and 37/8; Table 3 all cells; depths 3 and 4; 8 of 60; 7 and 9 of 40; all 64 stopped by the final assertion; exp-015 neither, exp-016 both; the 18.642857142857142 answer (exp-012); 3 or 4 of 16 in the inventory runs; coalition 0/20 before dv7, 20/20 in exp-021, at least 16/20 in every later 1.7B run under the set comparison (exp-027 5/20 exact, 20/20 restricted), exp-026 20 compile failures; 71% to 89%; 2 of 225 with one shared item; 195 to 154; probes 0 to 2 (0.5B), 5, 1, 3 (1.5B); text probes 0/49, 5/49, 30/49, 16/16, 9/9; no more than 6 early mismatches containing every reference number (exp-002 to exp-013); recipe (lr 1e-4, effective batch 32, max_seq_len 4096, seed 3407, adamw, 2 epochs in later manifests).

### MEDIUM 01-8. The exp-023 zero in the scheduling series is a parser-grammar artifact for at least 18 answers

Quoted (Section 5.3): "A retrospective parser checked the stated duration and verdict ... the correct counts were 64, 0, 0, 2, 54, 3 and 0 of 100" and the conclusion "the other in two of seven runs".

Records: in exp-023 (1.7B, dv9) all 64 executed mismatches are outside_grammar (article/evidence/exp-023-1.7b-qwen3-dv9-decompose-to-solve-restricted.jsonl). Of them, 18 state the reference duration in minutes with the correct verdict, only in phrasings the grammar lacks ("so the plan does not meet the completion limit", "so the plan meets the deadline"); another 20 give the right number with the unit "work packages". The same check finds 5 such answers in exp-024 and 1 in exp-021. The grammar (article/scripts/restricted-comparators.mjs line 20) accepts four verdict phrasings only. With "completion limit" and "deadline" accepted, exp-023 has at least 18 correct, and the "two of seven runs" count becomes three with a low third value. This is the same run whose 64 mismatches the 03 manuscript's "38 of 64" reading refers to (see 03 M3 below). Fix: report exp-023 as "0 under the parser (18 more state the right duration and verdict in wording the parser does not accept)", or widen the grammar and recompute; soften "two of seven".


## 03 and 04 (checked 2026-09-28; times local +0200 unless marked UTC)

### Verified (no action)

Table 1 funnel (17/9/8, 25/12/13, 31/18/13, 32/25/7; 105/64/41; 32 incidents); Table 2 category counts (C 9, R 11, I 9, E 3) and seam counts (2/4/1/2/2); component counts (evaluation 10, reporting 8, diagnostics 5, orchestration 4, environment 3, training 1, data generators 1); Table 3 cross-tab; kappa 0.96 (31/32) and 0.92 (30/32); 13,330 records in 26 runs, all reproduced; 240 commits; no commits on 19 and 20 Sep; ~25 training runs; reviews on day 5 (22 Sep) and day 8 (25 Sep); "Five of the nine" I-incidents entered on 26-27 Sep; I-median about 40 h (40.4); 38 of 64 figure exists in commit e230b2146; 15 h (03:55 to 19:02) and ~10 h (18:27 to 03:55); diagnostic 8/9/8/10 of 60, 9.4 h lag, 3/48 vs 23/48, 0 of 24 pairs with same program, 8/24 vs 12/24 (diag-pairs-fixed); disk guard WARN 20:35:50Z and CRITICAL 21:15:50Z; memory-guard stop at step 160; 322 of 705 Qwen3 requests without completion; "NOT training — a human decides" (22:22:21Z); first "a human must look" and "launching" both at 05:40:43Z; pruning at 05:45:10Z. 04: T = 20:37:47 (143605893); note 14:56 = T-5.7 h; dv12 commit 15:27 / exp-025 manifest 15:29 = T-5.1 h; stop rule 18:55 / 19:02 = T-1.7 / T-1.6 h; rewrite 20:43 = T+6 min; dv13 21:01 and exp-026 created 21:03 = T+24/26 min; 26 Sep 2026 is a Saturday; name written 23 Sep 19:32 (three days earlier); roster 24 Sep, draft 25 Sep, paper package 27 Sep 04:21; weights 4.07 GB; 65.2% to 77.2%; "four independent subagents" (922debb52 docs/article/04-results.md); four of five variants (1, 3, 4, 5; variant 2 has none); "Qwen3-17B ... fine-tuned on the same synthetic data", "is not 'small models are as good as large ones' in general", "varies the model size" (variant-1); "17B ≈ 1.7B" node (docs/article/README.md); "a 17B model was fine-tuned on the same pipeline" (b6a00809b); "1.7B base" -> "17B base"; "Regression diagnosis, CORRECTED", "was WRONG", 15 failures with commas, 4 minutes (03:53 -> 03:57); stop-rule quote "until then, no training, no further arms" (52249feb7 proposal.md); "the owner's stop rule" (52249feb7 message).

### Findings

### M1 (medium) 03 section 4.3: median lags do not match the coding file
- Quote: "The median time from entry to detection, where both could be dated, was about nine hours for code defects and five for environment failures. Representation errors were spread across all routes, with a median of about thirty hours."
- Records (incident-coding-final.json lagHours): code defects 7.5 h (8 dated: 0, 0, 1.6, 5.6, 9.4, 10.2, 19.3, 39.9); environment 2.7 h (only 2 dated: 0 and 5.4); representation 24.7 h (8 dated: 9.4 ... 112.5). Inference 40.4 h is correct.
- Fix: "about eight hours for code defects (eight dated), and under six hours for the two dated environment failures ... representation errors ... a median of about twenty-five hours".

### M2 (medium) 03 section 4.1 (and the same wording in 01/02): "every held-out evaluation" is broader than what was re-executed
- Quote: "We re-executed every saved generated program from every held-out evaluation in the programme ... That is 13,330 records from 26 evaluation runs."
- Records: reexecution-summary.json covers the 26 checkpoint runs exp-002 ... exp-027. Saved held-out completions not re-executed: adapt-holdout-0/1/3 (3 x 265 = 795 records), cmp-base-holdout (265), exp-000-baseline compiled-50 (50).
- Fix: "every saved program from the held-out evaluations of the 26 fine-tuned checkpoints (13,330 records)"; or re-execute the remaining runs.

### M3 (medium) 03 section 1: the "38 of 64" reading is from a different run and overstates "only paraphrased"
- Quote: "Fifteen hours earlier, a reading of individual records had found that 38 of 64 wrongly scored scheduling answers had the right number and only paraphrased the verdict."
- Records: the 64 are the answer_mismatch rows of exp-023-1.7b-qwen3-dv9 (decompose-to-solve: 64 mismatches, 36 execution errors), not the day-8 run exp-021 (92 mismatches, 8 errors). 38 of the 64 contain the reference number, but about 16 of those give the unit as "work packages" and several verdicts are garbled ("meets the does not meet work packages"). The restricted parser classifies all 64 as outside_grammar (article/evidence/exp-023-1.7b-qwen3-dv9-decompose-to-solve-restricted.jsonl), so "wrongly scored" is the commit's reading and the parser does not confirm it. Source: commit e230b2146; evaluation/registry/exp-023-1.7b-qwen3-dv9/items/holdout.jsonl.
- Fix: "a reading of individual records from a later run found that 38 of its 64 executed but mismatched scheduling answers stated the reference number, in varied wording". Section 4.4's "flagged the phrasing problem about ten hours later" then refers to that later run's records. Note for 01: the dv9 count of 0 of 100 in the scheduling series depends on the parser grammar; 38 of the dv9 mismatches carry the right number.

### M4 (medium) 04 section 3.2: the number of 1.7B runs listed above the "17b" run
- Quote: "The same file listed the '17b' run below four 1.7B runs of the same model family."
- Records: raspuns.md at 143605893 lists six entries above "qwen3-17b: 64.8%" (dv7, dv12, dv9, dv11, dv8, dv5), all Qwen3-1.7B runs, but labelled by data version, not by size. summary.md at the same commit lists six rows named exp-0xx-1.7b-qwen3-* above exp-017-qwen3-17b (and one, dv4, below it).
- Fix: "The same file listed the '17b' run among six runs of the same base model, and the full table it pointed to named each of them '1.7b'."

### M5 (medium-low) 04 section 5.2: harm understated
- Quote: "The harm was bounded to one training run's design rationale and a set of internal drafts."
- Records: I18 consequence (incident-register.json): the misreading was decisive evidence for the dv12 run (exp-025), and together with I20 it fed the 20:37 change of aim that led to dv13 and runs exp-026 and exp-027 (143605893). The manuscript's own sections 1 and 4.1 say this.
- Fix: "bounded to the rationale of one training run, the framing of the change of aim and the two runs that followed it, and a set of internal drafts".

### L1 (low) 03 abstract and Table 4: "in the same second"
- Quote (abstract): "several operational warnings addressed to 'a human' were logged in the same second as the automated action they should have stopped." Quote (Table 4): "Two human-addressed warnings were logged in the same second as an automatic launch and minutes before a pruning".
- Records (overnight-pipeline.log lines 1052-1060): warning 1 at 05:40:43Z, "launching" at 05:40:43Z (same second); warning 2 at 05:45:09Z, pruning and "launching" at 05:45:10Z (one second later). Only warning 1 was minutes before the pruning.
- Fix: "within one second of".

### L2 (low) 03 abstract and section 5.1: "within hours" for code defects
- Quote: "Code defects and environment failures announced themselves within hours".
- Records: code-defect lags reach 39.9 h (I27) and 19.3 h (I05); Table 4 itself says "within hours to two days".
- Fix: "within two days, most within hours".

### L3 (low) 03 Table 4: "nothing else did"
- Quote: "Found eight of nine; nothing else did".
- Records: the ninth inference error (I22) was found by reading records in the working thread (section 4.3 says so).
- Fix: "Found eight of nine; the ninth was found by reading records".

### L4 (low) 03 section 4.4 and Table 4: "printed correctly once"
- Quote: "The identity had been printed correctly once, and that did not prevent the error."
- Records: the correct identity appeared in the manifest, the 24 Sep roster (351835e37) and the 25 Sep draft (b747dc15a), as the same section says.
- Fix: "had been recorded correctly twice".

### L5 (low) 03 section 1 and 04 section 4.1: the solver did see reference files for a while
- Quote (03): "It saw the problem statements but not the reference answers." (04: "seeing the statements but not the reference answers").
- Records: I32 says the solver agent began reading reference solutions from disk during the test; it was steered away and a copy detector voids identical solutions (0 copies per early-series-verification.md section 9).
- Fix: add "it was stopped when it began to read reference files, and no submitted program copies a reference".

### L6 (low) 04 abstract and section 4.1: "two hours"
- Quotes: "Two hours before the change of aim, a stop rule written by the research lead"; "For about two hours the rule did what it was designed to do."
- Records: 18:55 (4dd28815b) or 19:02 (52249feb7) to 20:37 = 1 h 42 min or 1 h 35 min; Table 1 correctly says T-1.6 h. The record calls it "the owner's stop rule" (52249feb7), which supports "attributed to", not "written by".
- Fix: "About an hour and a half before..."; "a stop rule that the record attributes to the research lead".

### L7 (low) 04 Table 1 row "Day 6, evening"
- Quote: "Names the next run with a '17b' label and a matching model-configuration file, before a selection step has chosen among three base models".
- Records: on 23 Sep the downloader (2db46ee23, 19:18) and pipeline (91aeb7f0e, 19:32) name the run and the file paths base-model-qwen3-17b.json and base-qwen3-17b-f16.gguf; the configuration file was first committed on day 7 (07aea7ada, 07:42). The 91aeb7f0e pipeline planned exp-017 on Qwen3 unless its baseline fell below a floor; its message names two candidate bases (general 1.5B and Qwen3-1.7B), and the Gemma candidate appears only in the log.
- Fix: "Names the next run, and the path of its model-configuration file, with a '17b' label, before the base-model comparison has run".

### L8 (low) 04 section 4.2: the first written diagnosis
- Quote: "the first written diagnosis attributed the drop to a shift in the training distribution".
- Records: the first written statement was commit c6d508b95 (02:35), which called the drop "a real signal, not the pipeline's noise band" and said the fix "regressed the container book". The distribution-shift diagnosis came at 03:53 (f74cdf44d) and was corrected at 03:57. summary.md still carries the uncorrected "regressed" text (I22).
- Fix: "the first written verdict called the drop a real regression, and the diagnosis that followed attributed it to a shift ... A pass four minutes after that diagnosis ...". (03 section 4.3's "corrected four minutes after it was written" needs the same qualification; the register lag for I22 is 1.4 h.)

### L9 (low) 04: quotation altered without ellipsis, and residual identifying strings
- Quote: "prove that a small coding model, fine-tuned through the abstraction-learning loop, beats a larger model on the reasoning books". The source (143605893 raspuns.md) reads "prove that a SMALL coding model, fine-tuned on SOP Lang through the abstraction-learning loop, beats ...". The words "on SOP Lang" are removed without an ellipsis.
- Identifying strings left in 04: no file names, run identifiers, "SOP Lang" or clock times. Verbatim, searchable project phrases remain: "abstraction-learning loop", "Regression diagnosis, CORRECTED", "was WRONG", "the article agent", "the 1.7B trained by the loop beats our own 17B on the books", and "Qwen3-17B". If the repository becomes public, a text search for any of these finds it. The weekday "Saturday" plus the day numbering fixes the calendar date.
- Fix: mark the removal with "[...]", and paraphrase or blind the distinctive phrases for review.

### Cross-manuscript consistency (03 against 04)
No contradictions found. Both give 4 minutes, half an hour, day numbering (18 Sep = day 1), "about 25" against "about two dozen" training runs, 2 of 20, about 18 of 20 then 20 of 20, and the four-of-five variants. L8 affects both manuscripts.

### Manuscripts with no findings
None. Both 03 and 04 have findings above; none is high severity.

## Ranked summary

High: 02-1 (compact scheduling programs were trained in five runs, not one; exp-019 had byte-identical compact programs and 58 failures).

Medium: 02-2 (splice failure present in only one of eight scaffolded runs, so its disappearance is not caused by moving scaffolding into the runtime); 01-1 (three of four single correct answers were the same problem); 01-2 (scheduling series mixes the 0.5B run in as the sixth value); 01-8 (exp-023's 0 hides at least 18 right duration-and-verdict answers outside the parser grammar); 03 M1 (median lags 7.5 h, 2.7 h from two incidents, 24.7 h, not 9, 5, 30); 03 M2 and 01-7 and 02-6 (re-execution covers 26 checkpoint evaluations, not every evaluation); 03 M3 ("38 of 64" is from exp-023, not the day-8 run, and is not confirmed by the parser); 04 M4 (six, not four, 1.7B runs listed above the "17b" run); 04 M5 (harm understated in Section 5.2).

Low: 01-3 (ten operations, not eleven); 01-4 (17 and 0, not 0 and 17); 01-5 (four structures at 0/10, not three); 01-6 (rate programs multiplied by the minutes and skipped /100; nothing multiplied by 60); 02-3 (94.7% is overall, not trained-program accuracy); 02-4 (seven scalars, two lines); 02-5 (the decompose-to-solve book, not the scheduling type, failed to revert); 03 L1 to L4; 04 L6 to L9 (and L5, L8 affect both 03 and 04).

No manuscript is free of findings. No contradiction was found between 03 and 04. Cross-manuscript: 01's parser-based zero for exp-023 and 03's "38 of 64" reading describe the same exp-023 answers from opposite directions.
