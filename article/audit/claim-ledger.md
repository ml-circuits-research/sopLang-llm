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
