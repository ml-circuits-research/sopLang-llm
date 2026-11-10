# Evaluation-only comparison (28–29 September 2026)

No model was trained for these results. Plan and pre-registered readings: [no-training-plan.md](../../experiments/no-training-plan.md). Every model and condition answered the same items: 115 held-out problems (5 per family, seeded) for the main comparison, 75 items per rung for E2 and E8 (5 per composition, held-out and trained controls), 30 per wording for E3 (15 scheduling, 15 coalition), and all 40 problems of the withheld stock-and-lead-time type for E9. Items, per-item records (with every generated program), and run manifests are under `evaluation/registry/<experiment>/`.

## Scoring

Each record is scored at three levels:
- **Exact:** the project's comparator.
- **Strict value:** see `valueMatches` in `evaluation/run-items.mjs`.
- **Semantic:** exact, or accepted by both of two blind judges.

The judges were two independent agent sessions of Claude Opus 5.5 per pass (`judge-sessions.json`). They saw only the statement, the reference, and the candidate, over 2,048 deduplicated answer pairs plus 25 injected pairs (24 known-wrong answers and one correct control), in four passes. Verdicts are in `judge-A-*.jsonl` and `judge-B-*.jsonl`, with a reason for each.

Judge performance:
- **Agreement:** 98.3% (κ = 0.97); 36 pairs disputed.
- **Known-wrong pairs:** none of the 24 was accepted by either judge (19 in the first two passes, 5 in the fourth; the third pass had none). The calibration key lists one of the first 19 twice; `merge-judges.mjs` counts each pair once.
- **Pairs a deterministic parser proves equivalent:** all 50 were accepted by both.

The strict level over-accepts when a verdict is phrased freely. On the withheld type it accepted 33 answers that the judges reduced to 24, because several stated the right number of days with the wrong ordering decision.

Scripts:
- `article/experiments/analyze-comparison.mjs` (main table and judge inputs);
- `article/experiments/summarize-experiments.mjs` (strict level per experiment);
- `article/experiments/merge-judges.mjs` (agreement, calibration, and expansion of pair verdicts to records).

Machine-readable results: `comparison.json`, `experiments.json`, `judge-agreement.json`.


## Paired tables

The rewording (E2), abstraction-level (E8), and wording (E3) comparisons were re-scored on identical instances at every wording, with existing records reused and only missing items generated. See [paired-tables.md](paired-tables.md), produced by `article/experiments/paired-tables.mjs`. The first, unpaired samples drew different instances per wording; their tables in `comparison.json` are kept for provenance but are not used in the manuscripts' wording comparisons.

The main comparison of 115 held-out problems, and the withheld-type test, did not involve rewording. Their results are in `comparison.json` (`table`, and `experiments` under `e9-*`).

## Larger models (agent sessions)

Claude Haiku 4.5 and Claude Sonnet 5 answered the same items through agent sessions. No session saw two wordings of the same problem. Four accepted batches per model combine two answer forms of the same problems (c1, c2: operator plan and JavaScript; c5, c6: JavaScript and SOP Lang), so those forms are not independent answers; in c5 and c6 the two forms gave identical answers in 30 of 30 problems. Sessions were not allowed to run scripts or code. Their tool use was audited. Batches that broke either rule were discarded; they are kept under `evaluation/registry/agent-models/superseded/`. Two defects were found this way:
- a first design put two wordings in one batch, allowing carry-over (identical answers across wordings are not proof of it: the re-run in separate sessions also gave identical JavaScript answers in 42 to 45 of 45);
- one session produced its replies with a script (`superseded/answers-sonnet-b4.scripted.jsonl.bak`); session transcripts were not retained.

The larger models' answers were judged in the third pass (judge batches 5 and 6), which contained no calibration items; the judges agreed on 616 of 619 of these answers (κ = 0.958).

The generated JavaScript and SOP Lang were executed by the project's runtime, as for the small models. Scoring: `article/experiments/score-agent-models.mjs`. Table: `model-comparison.md` (`model-comparison-table.mjs`).

## Additions after the manuscript reviews (29 September)

Three measurements were added, without training, to answer points raised by the reviews of the Machine Learning manuscript:
- **E9 with SOP Lang in the prompt** (`evaluation/registry/e9-sopicl3-qwen3-17/`): the untuned Qwen3-1.7B model writing SOP Lang, taught in the prompt by the syntax guide and three examples, on all 40 problems of the withheld stock type. It separates the target language from fine-tuning as explanations of the fine-tuned models' failure on that type.
- **E3 with the statement's trailing newline restored** (`evaluation/registry/e3nl-<wording>-<run>/`, items in `evaluation/registry/items-e3/paired-nl/`): the first E3 items had the final newline of each statement removed, while the held-out evaluation sends it. For the simplified-statement run that one byte changed 8 of the 15 coalition programs; with the newline restored, 15 of 15 programs were identical to those of the run's original evaluation. The manuscript reports the restored version (`ml-review-checks.md`, section 4).
- **Judging round 4** (`judge-pairs-7.jsonl`, `judge-A-7.jsonl`, `judge-B-7.jsonl`): the non-exact answers of these runs, judged with the same instructions as the earlier rounds, with injected known-wrong pairs (`build-judge-round.mjs`). Pairs already judged in an earlier round reuse their verdicts.

`ml-review-checks.md` (`article/experiments/ml-review-checks.mjs`) recomputes the other figures added in response to the reviews: the rewording test of the 1.7B run on the items shared with the inventory-era runs, the book types split into taught shapes and the rest, the SOP Lang programs rejected before execution, program identity against the original evaluations, and the scheduling answers outside the restricted parser's grammar. `judge-sessions.json` and `agent-sessions/` record which model every judge and larger-model session was.
