# Claim ledger and correction record

Audit date: 28 September 2026. The primary scientific manuscripts report supported findings. Historical mistakes appear as bounded examples only in the research-practice and epistemic-accountability papers. No inference is made that a human-only team would avoid those mistakes.

## Evidence hierarchy

Item records are authoritative for saved outcomes, nested manifests for base identity, and source code for the comparator and implemented command contracts. Design specifications distinguish implemented behavior from planned extensions. Narrative experiment reports and earlier article variants are candidate interpretations. They do not override the records.

The extraction reads ten `evaluation/registry/<arm>/items/holdout.jsonl` files and their metrics, run manifests, selections, and available `training/checkpoints/<arm>/run-manifest.json` files. [source-hashes.json](../evidence/source-hashes.json) identifies the exact inputs. [results.json](../evidence/results.json) holds counts, identities, command use, comparisons, and restricted diagnostics. The tracked source before this work is revision `922debb5242e10e3e9c4c7d8b7f85b927d09d54e`; experimental files additionally require content hashes because some are not tracked.

| Claim | Status and evidence | Permitted interpretation |
| --- | --- | --- |
| Ten arms contain 7,050 item records | Reproduced: 705 unique identifiers in each arm; class totals equal metrics | Census of these selected archived files, not 7,050 independent tasks |
| Original normalized exact outcomes reproduce | Reproduced with `teacher/naming.mjs`, zero label disagreements on completed outputs | Comparator reproducibility; no claim of general semantic accuracy |
| Syntax and graph stages pass | Reproduced: 705/705 in every arm | Structural validity under the evaluator; execution and interpretation remain separate |
| Specialized-wire comparison improves performance | Reproduced: exp-014 379/705, exp-016 440/705; 377 joint matches, 63 only exp-016, two only exp-014 | Strong descriptive vocabulary signal, with one run per condition and missing exp-014 training manifest |
| Procedural execution errors decline | Reproduced: 63/480 to 13/480; matches 377/480 to 440/480 | A 50-item failure reduction and 63-item match gain in this subset |
| Direct use explains the entire gain | Not established: 40 exp-016 procedural outputs declare graphPath, aggregate, or fraction | Direct-use count is smaller than the gain; indirect curriculum effects and confounding remain possible |
| More target wires improve results | Contradicted as an unconditional statement: exp-021 460/705 versus exp-022 448/705; execution errors 57 versus 135 | A negative representation result, not a rejection of modular programming generally |
| A small model beats a 17B model | Unsupported: exp-017's nested metadata says Qwen/Qwen3-1.7B, revision `70d244cc86ccca08cf5af4e1e306ecf908b1ad5e` | Excluded from model, systems, and open-research results; identity error discussed only as an audit example |
| A 77.2% semantic total is reconstructable | Historical-only: 833 unique judge inputs survive, with keys/oracle/answer but no item verdicts | Excluded from results; absent judgments are not silently replaced |
| Four judge files establish inter-rater validation | Unsupported: disjoint input shards, without decisions | No inter-rater reliability claim |
| Containers caused coalition success | Not established: exp-021 has 20/20 coalition matches but zero container-family declarations in those completions | Curriculum-associated improvement on one coalition plan |
| A whole reasoning book was solved | Unsupported: 20 evaluated world-as-a-system cases share one plan | Report the coalition family and sample size |
| Dv7 and dv13 are the same test | False: 655 shared IDs, 50 removed, 50 added; 100 changed oracles and 147 changed plans among shared IDs | Restrict cross-version inference and retain population changes |
| The 0.5B result establishes a universal size floor | Unsupported: Qwen2.5-Coder-0.5B and Qwen3-1.7B differ in family and pretraining | Compare the two archived systems, 361/705 versus 421/705 |
| The runtime is formally verified | Unsupported: implemented contracts and executable tests, no formal semantic proof | A tested executor with explicit boundaries |
| The nominal holdout is pristine confirmation | Unsupported after repeated inspection and redesign | Development benchmark; new frozen transfer evaluation is future work |
| Dependency-join semantic success is 66/100 | Not reconstructed from retained decisions | Report the new restricted diagnostic: 64 matches, two disagreements, 26 unclassified, eight execution failures |
| Dv8 has 410/480 procedural exact matches | Incorrect earlier table | Correct original-comparator count is 428/480 |
| Solver integration is measured | Proposed only | Graph critical-path, units/rates, and solver commands are future candidates |

## Restricted diagnostic contract

[restricted-comparators.mjs](../scripts/restricted-comparators.mjs) accepts whole supported answers. Coalition results must consist entirely of coalition/count tuples; member ordering and tuple ordering are canonicalized, duplicates and repeated members are rejected, and counts must be safe integers. Join results must state both a safe-integer duration and a feasibility verdict in the declared sentence grammar. The known oracle suffix is optional. Extra contradictory text is rejected rather than ignored. Execution failures remain failures. Outside-grammar answers remain unclassified.

Exp-027 coalitions: 5/20 original matches and 20/20 restricted matches. Exp-021 dependency joins: 0/100 original matches; restricted counts 64/100 match, 2/100 disagreement, 26/100 outside grammar, and 8/100 execution failure. Individual decisions are preserved in the corresponding `*-restricted.jsonl` files. These parsers are retrospective diagnostics, not a validated general semantic evaluator or a reconstruction of absent judge votes.

The dependency-join example in manuscript 01 is record `decompose-to-solve/eval/no-knowledge/dependency-chain-and-join/1.1.4-dependency-chain-and-join` in exp-021. Its saved literal values and computation yield 46 minutes against a 43-minute limit. The oracle and output agree on duration and infeasibility while differing in phrasing. The manuscript describes the saved circuit, because the historical item record does not retain the complete original prompt text.

## Boundaries that remain

There is one archived training run per condition; the known later seed is 3407, while exp-014's training manifest is absent. Repeated generated instances and repeated arms are not independent replications. Identical identifiers and oracles do not by themselves prove identical prompt bytes, because complete historical statements are not stored in the item files. Current source and verification code support the documented teaching process, but do not retrospectively prove every historical data row semantically correct. No fresh external benchmark, equal-budget execution ablation, training rerun, energy measurement, or productivity comparison was performed for this portfolio. The reader-focused revision found and reconstructed existing direct-answer base evaluations; their matched-population and scoring limits are documented in the baseline audit.

The positive abstraction finding remains useful within these boundaries. It is neither discarded because stronger controls are absent nor promoted into a general causal law. The manuscript-specific research questions determine which parts of this evidence belong in each article.

## Additional evidence in the reader-focused revision

The manuscript-facing results now use percentages with denominators in captions or population definitions. Raw counts remain in the evidence files. Internal run names and data-version codes are moved to the [experiment map](../evidence/experiment-map.md). Each paper introduces SOP Lang notation through a complete executed example.

The [baseline audit](baseline-audit.md) replaces the earlier blanket absence claim. Paired early base/adapted evaluations share all 585 identifiers and expected answers. Under the common historical content check, the 0.5B comparison is 10.8% to 44.4%, and the 1.5B comparison is 5.1% to 61.4%. These are weak reference-content diagnostics, not semantic-accuracy claims. Qwen3's separate base evaluation has 45.7% missing completions and is not used as a clean capacity ranking.

The Open Research Europe revision examines a different contrast: the paired later systems improve from 51.2% to 59.7% overall exact match, while dependency-join execution failures increase from 55% to 94%. Both observations are retained. The family result describes those two systems; it does not isolate parameter count.

## Additions in the portfolio revision (28 September 2026, second round)

The second round rebuilt the portfolio around the whole experimental history. Every early-series number used by the manuscripts was recomputed by `article/scripts/verify-early-series.mjs` ([early-series-verification.md](../evidence/early-series-verification.md)). The following claims from earlier narrative records were corrected or excluded.

| Claim | Status and evidence | Use in the manuscripts |
| --- | --- | --- |
| The declarative commands (graphPath, aggregate, fraction) caused the 379 → 440 gain and the collapse of procedural execution errors (design documentation, earlier portfolio) | Contradicted at item level: only the 40 graphPath programs used a new command, and that family was already 40/40 without it; the execution-error reduction (63 → 13) came from two census compositions whose programs used no new command | Informatica reports the command as a code-size reduction without an accuracy gain and names the misattribution |
| The 0.5B first-exposure failures were correct computations killed by a copied whole-number assertion (a hypothesis during drafting) | Contradicted: the 64 failing programs confused the new operator with its neighbour (rank read as a percentage; discount scaled by 100); the whole-number assertion was true of the reference and caught the wrong value | ML and Informatica report operand confusion caught by a valid assertion |
| A competent solver computed "about 18 of 20" stuck-book items correctly | Revised: all 20 state the reference value and verdict (one to more decimal places) | ESE and AI and Ethics say every one of the twenty |
| Only exp-014 trained on units-and-rates, explaining its 49/50 semantic score | Contradicted: no arm before dv13 had any units-and-rates training row; the 49/50 is an unreconstructable judge result | Not used |
| The two book items solved by the 0.5B and 1.5B census arms are the same | Partly: one shared item | ML says one of them the same problem |
| Reserved compositions have depths three to five | Depths three and four | ML says three and four |
| The plan inventory holds 941 plans over 8,015 rows | 924 plans over 8,015 export rows; 941 includes the 265 held-out circuits | Not used |
| Every checkpoint scores 12.5–25% on untrained plans | 1–4 of 16 across 72 checkpoints (12 checkpoints at 1 of 16) | ML reports the range as 1 to 4 of 16 |
| The dv12 common-sense execution errors come from copied integer guards | Reproduced for 15 of 36 probe failures: removing the guards yields the reference value; the remaining 21 are not rescued | Informatica reports 36 guard failures, 15 with correct computations |

## Adversarial review round (28 September 2026, third round)

Two separate reviewers, instructed only to find reasons the claims were false, examined the four manuscripts against the records ([adversarial-review-01-02.md](adversarial-review-01-02.md), [adversarial-review-03-04.md](adversarial-review-03-04.md)). Every finding was checked against the records before a revision. The principal corrections:

| Claim in the second-round drafts | Finding | Revision |
| --- | --- | --- |
| "What changed it was the unit of the curriculum" (ML) | No before-measurement on the held-out compositions; confounded with rendering by the training generator and with scaffold removal in the same data version | Stated as transfer within the training generator; partial "before" from the diagnostic suite added; confounds named; template test named as future work |
| Book types solved "when, and only when" their shape was taught (ML) | 0.5B solved 0/20 coalitions with the shape taught; scheduling 64, 0, 0, 2, 54, 3, 0 of 100 across taught runs | Necessary but not sufficient; full series reported |
| Scale fixes first-exposure compositions (ML) | Another 1.5B run on the next data version failed the same two compositions (0 and 17 of 40) | Reported as unstable across data versions |
| First-series mismatches "answered a different question" (ML) | 50 of 62 were a rate type that multiplied minutes by 60 | Corrected description |
| Quoted scheduling statement (ML) | Later simplified wording; the evaluated statement had a distractor the program reacted to | Evaluated statement quoted |
| Plan fingerprint = computation (ML) | Hash of program source text | Redefined from the implementation |
| Compact against split targets (Informatica) | One run each; compact run resumed; procedural failures rose without target change; the recorded revert did not revert scheduling programs | All disclosed; later split-form runs reported (62, 44, 94 at 1.7B; 55 at 0.5B) |
| Scaffold removal reduced compile failures (Informatica) | 80 before, 42 and 83 after | Removed a failure mode, not failures |
| Borrowed guards "killed correct answers" (Informatica) | Without guards 0 of 36 would have matched exactly | "Stopped correct computations" |
| Rewriting references fixes output (Informatica) | Exact match stayed 0/100; model printed the related type's sentence; evidence comparator could not read the new reference form | Reported as a finding; comparator fixed and evidence regenerated |
| "7,050 labels reproduced" shows reliable computation (ESE) | Only the comparator had been re-applied | Every saved program re-executed: 13,330 records in 26 runs, all classes and answers reproduced ([reexecution-summary.json](../evidence/reexecution-summary.json)) |
| Manifest never consulted until audit (ESE, Ethics) | Roster (24 Sep) and draft (25 Sep) had the correct label; the 20:43 rewrite overwrote it | Revised in both papers |
| Stop rule "halted training until the benchmark was shown sound" (Ethics) | Overridden about two hours later by the change of aim; the re-test was never run | Rewritten as a rule that worked and then dissolved |
| "Each artifact was locally accurate" (Ethics) | Drafts invented a "Qwen3-17B" and "the same synthetic data" | Removed; invented details reported |
| Solver test "every one of the twenty" as fact (ESE, Ethics) | Contemporaneous record said about 18; 20 is the audit's later reading; some failures were solver verbosity | Both readings reported |
| Double-anonymous readiness (Ethics) | File names, run names, system name, and commit times identify the repository | Replaced by neutral descriptions and relative times |

## Fact-check of the revision (fourth round)

A separate fact-check ([revision-factcheck.md](revision-factcheck.md)) re-verified the revised manuscripts. Corrections applied: only one run combined compact scheduling programs with the taught shape (earlier compact runs failed on 58 to 98 of 100); the spliced-assertion failure occurred in the first full run only, and compile failures varied from 23 to 80 per run before the scaffolding change; the rate-type failures multiplied by the percentage and by minutes without converting either (48 of 50), not by 60; the single correct held-out answer in three early runs was the same problem; the first inventory declared ten operations; the scheduling series names model sizes and notes 18 correct answers the retrospective parser does not accept in one run; re-execution covers the held-out evaluations of trained checkpoints only; ESE median lags corrected (about 7.5 hours for code defects, a day for representation errors); the ethics paper's relative times, the number of neighbouring runs in the status file, the diagnosis sequence, and the scope of internal consequences corrected; remaining searchable phrases in the double-anonymous manuscript paraphrased.

## Evaluation-only experiments (29 September)

New measurements, run without training on existing checkpoints (plan: [no-training-plan.md](../experiments/no-training-plan.md); results: [comparison/README.md](../evidence/comparison/README.md)), changed or qualified earlier claims:

| Earlier claim or open question | New evidence | Revision |
| --- | --- | --- |
| Composition transfer might reflect the vocabulary or the training template (ML, open) | Rewording breaks trained and held-out compositions together; strongest at 0.5B, weakest at 1.7B | Transfer described as bound to the generator's wording |
| Book scheduling failures after the shape was taught (ML) | Reworded into the teaching template, all 45 problems solved by three runs, including one that solved none in book wording | Failure attributed to recognition under the book's wording, not to the plan |
| Fine-tuning is what makes composition possible (implicit in earlier drafts) | Untuned 1.5B and 1.7B writing plain JavaScript solved 49 and 45 of 55 held-out compositions | Most of the composition gain attributed to code execution; fine-tuning's contribution stated as taught shapes and exactness |
| The narrow curriculum's cost measured by probes only (ML) | Untuned 1.7B with JavaScript solved 24 of 40 withheld stock problems; fine-tuned 1.7B runs 2 and 0 | Specialization reported to remove an ability, on one type |
| Higher abstraction suits small models (authors' position) | Operator plans matched code and gave exact answers in generator wording, fell furthest in narrative wording | Position stated with its measured condition: recognition across wordings must be taught |
| Strict value checks as a scoring level | Over-accepted free-form verdicts (33 against 24 on the withheld type) | Semantic level by two blind calibrated judges used as the reported level |

## Larger models on the same prompts (29 September)

Claude Haiku 4.5 and Claude Sonnet 5 answered the same items as the small models, through agent sessions with no two wordings of a problem in one session, no code execution, and an audit of tool use. Results: [comparison/model-comparison.md](../evidence/comparison/model-comparison.md). Independent fact-check and its corrections: [larger-models-factcheck.md](larger-models-factcheck.md).

| Earlier claim or open question | New evidence | Revision |
| --- | --- | --- |
| Are the wording binding and the coverage boundary properties of the task or of the small models? (ML, open) | Both larger models solved 31 to 33 of 33 held-out compositions in generator and narrative wording, all 15 book scheduling problems in book wording, and all 40 withheld-type problems | Stated as capacity limits of the small models (ML Section 9.4), with pretraining exposure and agent-session evaluation as caveats |
| Must SOP Lang be learned by fine-tuning? (Informatica) | Taught only in the prompt, SOP Lang matched plain JavaScript on compositions for both larger models (55 of 55 each); Haiku lost some on book problems (47 against 52) and in generator wording (31 against 33) | "Must be learned" restricted to small models; a capable model learns it from a description |
| Operator plans give exact answers (Informatica, small models) | Larger models: operator plans exact in 33 of 33 in both wordings; their JavaScript matched the reference wording in 3 to 6 of 33 | The format advantage persists at scale |
| Haiku and Sonnet differ? | Only in direct answering: Haiku 48 of 55 compositions and 41 of 55 book problems, Sonnet 55 and 53; with code both at or near ceiling | Reported in ML Section 9.4 as: code helped Haiku, the lower-cost of the two larger models |
| Agent-session evaluation is equivalent to independent calls | First batches mixed two wordings and gave identical answers across them; one batch was produced by a script | Batches redesigned (no two wordings per session) and re-run; four accepted batches still pair two answer forms (stated); the third judge pass had no calibration items (stated); defects reported in ESE Section 4.6; rule added to the audit protocol (item 15) |
| Judge statistics | Re-judged after all additions: 2,019 distinct pairs plus 20 injected wrong answers, agreement 98.2%, κ = 0.96, 0 of 20 accepted, 50 of 50 parser-equivalent accepted | Updated in all manuscripts and letters |

## Review round of the Machine Learning manuscript (29 September)

A reviewer session read the manuscript against the records ([review-ml.md](reviews/review-ml.md)). Every finding below was checked against the records before it changed the text; new figures are recomputed by `article/experiments/ml-review-checks.mjs` ([ml-review-checks.md](../evidence/comparison/ml-review-checks.md)).

| Earlier claim | Evidence checked | Revision |
| --- | --- | --- |
| The larger models locate the limits in the small models' capacity | The untuned 1.7B model writing JavaScript kept 79% of 33 held-out-composition problems in both wordings; fine-tuned, 100% to 73%; the larger models also differ in pretraining and post-training | Withdrawn. The limits are stated as not properties of the task; which difference between the models removes them is not identified |
| Every later 1.7B run solved at least 80% of the coalition problems, while Table 5 showed 47% for one of them | The E3 items had the statement's final newline removed; with it restored, 58 of 60 coalition programs matched the original evaluations (38 of 60 without) and the run solved 15 of 15 | Table 6 re-run with the restored bytes (240 generations); the sensitivity reported as a finding |
| The fine-tuned models lost a capability the untuned model had (cost of fine-tuning) | The untuned 1.7B model writing SOP Lang from the prompt solved 0 of 40 of the withheld type (JavaScript: 24 of 40) | Loss not attributed to fine-tuning alone |
| (undisclosed) held-out items were edited during the programme | dv11 shortened the references (e230b2146); dv12 simplified the statements (e494ddbf5); item hashes differ per run | Disclosed in Sections 3.4 and 6.1, with the version behind each scheduling figure; the Section 4.2 quotation given in full |
| "A syntactically valid program for every one of 225", beside 80 compile failures | Parse validity concerns the SOP Lang structure; JavaScript inside a wire compiles only when the wire runs | "Well-formed"; compile failures described as JavaScript compile failures |
| Book types separate fine-tuned and untuned models | 25 of the fine-tuned 1.7B model's 32 correct book answers are the two taught shapes; on the other 30 problems it solved 7 (23%), its untuned model 8 writing JavaScript and 9 directly | Stated in Section 7.1 |
| Rewording hurt held-out compositions more than trained ones, and least in the largest run | Resolvable only at 0.5B; on the 24 + 9 shared problems the 1.7B run scored 100/63/71% and 100/67/89%, the 1.5B run 100/67/33% and 100/78/22% | Rewritten; the abstract drops the comparison; Fig. 2 added |
| "In the second of these runs, 18 outputs state the correct duration" | The 18 belong to the third run; 20 more give the right number with the unit "work packages" | Corrected |
| Retries did not change transfer to untrained types | Retries were tried on 30 in-inventory problems, of which 2 crashed | Removed from the lists of levers; scope stated |
| The results match the compositional-generalization account of Keysers and colleagues | That account predicts failure on unseen compounds of familiar atoms | Section 8.2 rewritten |
| Judges unnamed | All sixteen judge sessions were Claude Opus 5.5 (`judge-sessions.json`); the larger models were Claude Haiku 4.5 and Claude Sonnet 5 | Named, with the self-preference risk |
| Low-rank run executed 13% | 33 of 265 = 12.45% (double rounding from 12.5%) | 12% |
| Judge statistics | Fourth pass added for the new records: 2,048 distinct answers; 24 distinct injected wrong answers (the key had listed one of the earlier ones twice, so the earlier count of 20 was 19); agreement 98.3%, κ = 0.97, none of the 24 accepted | Updated in every manuscript and letter |
