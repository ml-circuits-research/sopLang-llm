# Human coding sheet for the incident register

Please code each incident on your own, before looking at any other coding. Use only the codebook below and the description and consequence given for each incident. Do not consult the repository, the manuscripts, or the agent codings. Write your answers in [incident-coding-human.csv](incident-coding-human.csv), one row per incident, with columns: id, category (C, R, I or E), seam (for R only; otherwise leave empty), confidence (high, medium or low), and reason (one sentence). Coding takes about one to two hours.

## Codebook

Each incident receives exactly one primary category and, for category R only, one seam.

**C — Code defect.** The code does not do what its own specification, documentation, or evident intent says (a loop that never runs, a scorer that reads the wrong number, a race between processes, a parser bug, a leak of hidden data into an input the code was meant to exclude).

**R — Representation error.** The code or procedure works as specified, but one artifact is taken as evidence of something it does not represent. Seams:
- `name-identity`: a name, label, or path is taken as the identity of a model, dataset, or checkpoint.
- `score-construct`: a score or comparator output is taken as the capability or correctness it is meant to indicate.
- `intervention-distribution`: an intervention on an input (a prompt, a condition, a data view) is taken as isolating one factor, but also changes the input's distribution.
- `record-state`: a log line, report, file, or signal is taken as evidence of a system state (completion, which inputs were used) it does not reliably indicate.
- `population-population`: one evaluation population or item set is treated as another (changed items, missing responses counted as failures, unequal sets compared).

**I — Inference or reporting error.** The evidence was represented correctly, but the stated conclusion goes beyond it: an unsupported causal attribution, an over-generalization, a miscount or wrong number in a report, or an unrecorded procedure presented as a measurement.

**E — Environment failure.** A resource or platform failure outside the project's code (disk, memory, host reset, files removed by the environment).

Rules: code what the incident primarily is, not what caused it upstream. If an incident fits two categories, choose the one whose correction would have prevented it. Record a confidence (high, medium, low) and a one-sentence reason.

## Incidents

### I01 (evaluation)

Evaluation and chat servers were started under one shared alias on fixed ports. The readiness check accepted any server that answered on the port. When an older server was still running, a newly launched checkpoint failed to bind, and requests were answered by the older model while the records named the new one. The exp-009 checkpoint selection produced eight identical rows as a result.

*Consequence.* All eight exp-009-mix10 selection checkpoints were scored by checkpoint-90's model because a leftover llama-server held port 8090. That selection evidence was discarded and the chain was re-run (c1884d6e4). In the chat, a new --gguf answered from an old checkpoint without saying so (865b9dd73).

### I02 (orchestration)

The unattended watchdog and queue scripts could each start an experiment's evaluation chain. The start decision checked for running chains incompletely, and the holdout worker took no lock. On the night of 21-22 Sep, two chains for one experiment ran at once, a restarted chain re-scored checkpoints that had already been scored, and a lock left by a dead process then blocked legitimate restarts.

*Consequence.* A second evaluation chain started beside a live one at 20:38Z and again at 21:31Z on 21 Sep. A restarted chain re-scored all eight checkpoints after selection had finished (22:33Z), and duplicate workers wrote into the same registry folder. On 22 Sep from 04:24Z, a stale lock descriptor refused every restart of exp-009's chain. Compute was wasted and registry outputs were at risk of being overwritten; no corrupted record is documented.

### I03 (evaluation)

The evaluation code imported the current system prompt and export manifest from the working tree at scoring time rather than from the experiment's recorded training inputs. The trainer, when resuming, rebuilt its manifest from the current inputs. When the dataset was regenerated during a run, reports recorded the new snapshot and data version, not the one the checkpoint was trained on.

*Consequence.* evaluation/registry/exp-007-sft-wires/report.md records dataset snapshot 5ffd341e (7,575 rows), but the checkpoint was trained on snapshot 390211ea (7,335 rows). Models trained under prompt compiled-plan-chat-1 would be evaluated with compiled-plan-chat-2; the review reports different hashes 67655b81... and dfe015ee.... The trainer overwrote a run's manifest on resume without comparing inputs. The phase-4 analysis judged the 265 scored items themselves unaffected.

### I04 (diagnostics)

The capability probe suite scored answers with a strict direct-answer protocol, so a correct value in a forbidden format counted as a failure. The programme read falling probe scores after fine-tuning as a loss of general JavaScript and instruction ability. It then designed and trained a preservation-mixture arm to counter that loss.

*Consequence.* Decision D-B ('the narrow mixture does degrade the substrate, so the next series carries preservation material') led to the capability-preservation view (6a77f89e7, 21 Sep 21:29) and the exp-009-mix10 arm (747 steps), trained to restore the capability. In exp-008's records, three of the six JavaScript probes stated the correct value and were scored as mismatches. After the review, D-K read exp-009's null result under the corrected interpretation and noted a budget confound (747 against 681 steps).

### I05 (evaluation)

The compiled probe scorer compared the expected value with the first number found anywhere in the model's answer and ignored the probe's exact-comparison policy. An answer that echoed an operand before stating a different result could pass. The scorer was replaced by one that requires every stated number to equal the expected value.

*Consequence.* The direct-versus-compiled probe comparison (text-probes-exp-005-compiled, 30 accepted answers) could not be reported without qualification. statesValue('2', '2 + 2 = 4') returned true. The review did not demonstrate any false pass among the 30 recorded ones.

### I06 (evaluation)

A new option of the adaptation runner chose which solved examples to place in the prompt by reading the target item's reference solution file and matching its number of wires. A deployed model would not have access to that file. The option was removed about seven hours after it was added, before any scored run used it.

*Consequence.* Latent: no shapes-mode adaptation run exists in evaluation/registry (only adapt-holdout-0/1/3 and adapt-smoke-3, which use the distinct mode). Had it been used, the planned adaptation measurement would have selected demonstrations with knowledge of the reference circuit's wire count.

### I07 (evaluation)

The selection metric was the overall oracle score on a validation slice where 323 of 339 rows used plans also seen in training, so it mostly rewarded reproduction of familiar plans. The same book holdout was read after every arm to choose the next data change. It was nevertheless referred to as held-out evidence.

*Consequence.* In exp-008, the selected checkpoint-540 answered 3 of 16 unseen-plan rows, while checkpoints 360 and 450 answered 4 of 16. The review asked for a separate development suite and a reserved final suite; no remediation commit for R7 exists in the history. The final audit reclassified the holdout as a development benchmark and excluded 'pristine confirmation' claims.

### I08 (diagnostics)

The diagnostic asked the same problems four ways: plain, with correct values appended, with the correct plan appended, and with both, to locate where compilation fails. The appended text used wording that appears in no training row, and the model responded by emitting a different program. The assisted scores therefore reflected reactions to an unfamiliar prompt rather than the effect of supplying a correct input.

*Consequence.* Diagnosis D-L (d2357a0a6, 10:07) concluded that the bottleneck is 'adapting a memorized plan' and recommended contrastive pairs. exp-010-contrastive was built (41db77c0a, 16:37), trained, and closed at 19:11, before the defect was found at 19:24. The stage-isolation part of D-L was withdrawn; its value-supply reading (8 against 9 of 60) was kept. On diag-pairs-010 the assisted conditions scored 3 of 48 (values) against 23 of 48 (normal), and 0 of 24 pairs kept the same program.

### I09 (data generators)

The function that splits generated items into training and evaluation chose items by a hash walk and did not honour the compositions declared as reserved for evaluation. Some reserved compositions therefore landed in training. The fix made the split respect the reservation before the arm that measured those compositions was trained.

*Consequence.* Latent: had exp-011-compositions trained on the unfixed split, its reserved-composition holdout (later 160 of 160, the programme's first clean composition result) would have contained trained compositions.

### I10 (diagnostics)

The diagnostic loop that re-asks the model after a failed program recorded later attempts without executing them, so retries could not change any outcome. The first measurement of the retry effect was therefore meaningless. It was noticed, fixed, and re-run before the numbers were written up.

*Consequence.* The first sweep's numbers were invalid; the bug was fixed and the sweep re-run, and only the re-run (17 of 30 at 0, 1 and 2 retries) was reported. Had it not been caught, retries would have been reported as leaving execution unchanged, instead of moving it from 93.3% to 100.0%.

### I11 (evaluation)

The first base-versus-fine-tuned comparison scored the untrained base models with the same compiled-program protocol as the fine-tuned students. Only the students had been trained to produce that format. The comparison was replaced by a prose protocol in which the bases answer directly.

*Consequence.* docs/comparison.html reported the base student at 0.4% parse and 0.0% oracle on the holdout as the baseline. After the correction, the bases answered in prose (0.5B 63 of 585, 1.5B 30 of 585). These became 'the numbers the fine-tuned students must beat' and the floor of the later base shootout (I17).

### I12 (orchestration)

The prose evaluation runner's argument parser consumed a value and then processed it again as a flag, so every launch exited immediately. The orchestrator judged completion by the disappearance of the process and reported the runs as finished. It also failed to start the next experiment's evaluation chain.

*Consequence.* The first prose baseline launches exited on 'unknown argument', and the orchestrator reported them as completed. The same orchestrator missed the exp-012 chain, which had to be started manually. A second watcher was added that waits on output files rather than process patterns.

### I13 (environment)

Scripts needed for unattended runs were stored in the temporary directory and disappeared when the machine was reset. They were recreated inside the repository the same afternoon. The disk-space guard was among them.

*Consequence.* The runbook's rebuild step, the disk guard and the overnight pipeline were lost and had to be rewritten into the repository. evaluation/registry/disk-guard.log begins with 'bash: /tmp/disk_guard.sh: No such file or directory'. The re-created guard used warn < 20 GiB and stop-trainer < 8 GiB and did not stop downloads, which are the thresholds in force when the disk filled that night (I14).

### I14 (environment)

Base-model downloads for the planned base comparison, a dataset rebuild and training checkpoints filled the disk overnight. A checkpoint being written when the disk ran out was left incomplete, so the trainer could not resume from it. The existing disk guard warned and then tried to stop the trainer, but its thresholds were below the size of one save and it did not stop downloads.

*Consequence.* exp-016-wires was interrupted at step 160 of 630, checkpoint-160 was left invalid, and repeated resume attempts failed. The evaluation chain started at 21:27Z tried to convert checkpoint-160, and its selection failed at 21:44Z. The night's training was lost. The next morning 245 GiB of closed-arm checkpoints were pruned and exp-016 resumed from checkpoint-150; it later finished 630/630 (440/705). The disk guard existed (790b56e71), warned from 20:35Z and logged 'CRITICAL: below 8 GiB; stopping the trainer' at 21:15:50Z, but did not prevent the failure. Disk discipline rules and a 40/16 GiB guard followed (544147d4d).

### I15 (orchestration)

The unattended watchers decided that an experiment's evaluation was finished when a log line 'series done' appeared, but the chain writes that line on failure as well. After the disk-full crash, the watchers read the failed chain as finished. They then deleted the running arm's checkpoints and started the next training run while the previous one was still training.

*Consequence.* At 21:45:48Z on 23 Sep the pipeline logged 'exp-016 chain done' after a failed selection, pruned non-winner GGUFs of exp-014 and exp-015, and started the base shootout. At 05:40Z on 24 Sep the tail watcher logged 'exp-016-wires chain closed WITHOUT metrics - a human must look' and then launched exp-017-qwen3-17b anyway. At 05:45Z it 'pruned exp-016-wires HF checkpoints' while exp-016 was running from its resume point. The result was two trainers at once and a deleted resume checkpoint. This led to the rule that metrics.json is the only completion signal, and to preflight.sh, which refuses a second trainer.

### I16 (training)

On the machine's shared CPU-GPU memory pool, cached file pages made the GPU driver report little free memory even though the operating system could reclaim that memory on demand. The trainer's memory guard trusted the driver's figure, stopped training, saved, and restarted, repeatedly. The guard was changed to use the kernel's available-memory figure, and a pre-launch step that squeezes the cache was added.

*Consequence.* On 23 Sep, exp-016 was stopped repeatedly at step 1, and at step 160 the guard stopped it with 'CUDA free 13.6 GiB, host available 99.9 GiB'; that stop triggered the save that hit the full disk (I14). On 24 Sep exp-016 was held at step 301 in a restart loop while the chat held the GPU. On 26 Sep exp-024 stopped at steps 0 and 7 while the host reported 80-110 GiB available. The launch was delayed until the cache squeeze and the MemAvailable-based floor were added; exp-024's manifest was created at 05:42Z, right after the fix.

### I17 (evaluation)

To choose the base model for the next arms, three candidate base models were asked to answer the holdout in prose overnight. One candidate failed to run, and 45.7% of the chosen model's requests returned no text. Its score was compared with an older model's score on a different, smaller item set. The automated rule refused to pick a winner, and the next morning's report picked one by hand.

*Consequence.* The pipeline's own gate logged 'no candidate base cleared the coder's 30 of 585 in prose; NOT training - a human decides'. The Gemma candidate failed to start (missing config.json). The morning report nonetheless declared Qwen3-1.7B the winner ('357 of 705 in prose against the coder's 30 of 585'), and a hand-written tail launched exp-017 on it. Every later 1.7B arm (exp-017 to exp-025, exp-027) uses this base. The audit found 322 of 705 Qwen3 base records with 'response carries no completion' and does not treat the record as a capacity ranking. The missing completions count as failures, so they lower rather than raise Qwen3's score; whether the choice would have changed is not established.

### I18 (reporting)

An experiment was named with the string 'qwen3-17b', the base model's name without its decimal point, before it was known which base would be used. Two days later, status notes and an article rewrite read the name as a 17-billion-parameter model, although the run's manifest and earlier roster and draft entries said Qwen3-1.7B. The misread comparison was used to justify a data-design arm and a change of research goal.

*Consequence.* (1) The 14:56 status note used 'qwen3-17b ALSO got 0/100 and 0/50 - model size does not help, the dataset does' as 'decisive evidence' (translated from Romanian) for the dv12 statement-simplification arm (e494ddbf5, 15:27; exp-025 manifest created 13:29Z = 15:29 +0200). (2) The 20:37 plan (143605893) dropped the 90% goal for the headline 'the 1.7B trained by the loop beats our own 17B'; dv13 and exp-026/exp-027 followed within hours, although the 19:02 stop rule required a re-test first. (3) The 20:43 article rewrite (b6a00809b) changed an existing correct row '1.7B base' to '17B base'. (4) The claim reached the base article and four of five journal variants (922debb52). The roster of 24 Sep 12:17 (351835e37) and the 25 Sep article draft (b747dc15a) had carried the correct identity.

### I19 (evaluation)

Model answers were compared with the book's reference answers as normalized strings. For some families the references contained explanatory sentences, unit words and punctuation that cannot be derived from the problem statement. Answers with the right value and verdict in other words were therefore counted as wrong. The programme first changed its training data and references in response, then confirmed the problem with a hand-written solver that also failed the comparison.

*Consequence.* exp-021's decompose-to-solve result was recorded as 0 of 100; a later restricted parser counts 64 of 100. The response was to change the training targets and some references rather than the comparator: dv11 answer compression (exp-024, 439/705) and then dv12. After the solver test, the stop rule and a semantic re-evaluation followed (I20). For the other stuck book, common-sense, the records attribute the zeros to computational causes, not phrasing.

### I20 (reporting)

After the exact comparator was found to reject correct answers, all mismatched answers were re-judged for meaning. The automatic judge failed, so subagents judged four disjoint slices instead. Only the inputs were saved, not the per-item verdicts, yet the resulting percentages were written into status files and the article as each model's semantic accuracy.

*Consequence.* Status and article carried 77.2% as the best arm's accuracy and 'decompose-to-solve 66/100', and the 20:37 pivot quoted the table (including 'qwen3-17b: 64.8%'). summary.md reads exp-014's '49/50 semantic' on common-sense as a finding, and that reading fed the common-sense diagnosis (I21). The automatic judge had failed (the 'judge account was rejected'), and four subagents judged disjoint shards; evaluation/registry/agent-eval/judge-slice-0..3.jsonl hold 833 inputs and no verdicts. The audit excluded the figures from results.

### I21 (diagnostics)

The programme explained why no model solved the common-sense book by saying that an earlier data version contained fractional-chain training data, later removed, and that only one arm had trained on it. The item and training records show that no arm before dv13 had training rows of that family. A second mechanism, copied integer assertions, holds for about 15 of 36 failures. A new data version and two training runs were built on this explanation.

*Consequence.* dv13 (df3602594, 21:01) moved the units-and-rates family from the holdout into training, replaced the common-sense holdout with logical-implications, and dropped the integer probe idiom from 11 families. exp-026 (0.5B) and exp-027 (1.7B) were trained on dv13. Execution errors then rose from 57 to 184 in exp-027, attributed to the probe relaxation. The audit reproduced the guard mechanism for 15 of 36 dv12 probe failures only, and found the '49/50' to be an unreconstructable judge result.

### I22 (diagnostics)

When a newly trained model's score on one book fell from 20 to 5 of 20, the status record first called it a real regression and then a distribution shift, before any failing answer had been read. Reading the 15 failures four minutes later showed they differed from the reference only in punctuation. The first diagnosis had asserted item-level facts without reading the items.

*Consequence.* The morning conclusion and the commit say 'the data fix regressed the container book'. The recommendation was revised to 'revert only the probe relaxation'. The wrong text in raspuns.md was overwritten rather than kept. summary.md's '1.7B on the repaired dv13 data' section still states that dv13 'regressed the container book' (uncorrected). All 15 mismatches equal the reference after replacing ';' with ','.

### I23 (evaluation)

The held-out items are regenerated with each data version. Two data changes rewrote some reference answers and replaced one held-out family. Scores of models evaluated before and after these changes were compared directly, as if the test were unchanged.

*Consequence.* Comparisons such as 'exp-027 59.7% below dv7's 65.2%', 'world regressed', 'procedural 438 to 414' and 'the data fix was a measured negative' (c6d508b95, summary.md, raspuns.md) set dv13 against dv7. The two holdouts share 655 IDs, with 50 removed and 50 added, and among the shared IDs 100 oracles and 147 plans changed.

### I24 (reporting)

Two models trained on the same data version differed in accuracy. The difference was attributed to parameter count and written up with a proposed mechanism. The two models also come from different model families with different pretraining, so parameter count is not the only difference between them.

*Consequence.* The article and summary state that 'the abstraction loop needs a minimum capacity that 0.5B does not meet' and give a mechanism (hidden width, working memory). The headline was 'bounded below by a measured size floor'. The audit restricts this to comparing two archived systems (361/705 against 421/705).

### I25 (reporting)

After the arm trained with container-style data answered all 20 held-out items of one book correctly, the result was attributed to the model using container commands and described as solving the book. The saved programs for those items do not use container commands, and all 20 items are instances of one plan. The attribution was used to extend the container idiom to two other books.

*Consequence.* Design decision: dv9 moved the two zero books to 'the compact container idiom' (45c7b4276, 25 Sep 23:36). exp-023 was trained on it, lost 20 answers (428/705), and was reverted (3f80574f3). The article concluded that 'the container abstraction ... transferred to an entire book' and that 'abstract, LLM-recognizable circuits beat custom code' (922debb52). The audit found zero container-family declarations in exp-021's coalition completions and 20 evaluated cases sharing one plan.

### I26 (reporting)

Two arms trained on different data versions scored 379 and 440 of 705. The newer data version introduced three declarative commands, and the gain was credited to them. An item-level check shows the commands appear in few of the gained programs and that the reduction in failures came from items that do not use them.

*Consequence.* Design documentation and the earlier portfolio stated that the commands caused the gain and the collapse of procedural execution errors; the wire-vocabulary line of work (the declarative-wire directive, the abstraction loop) builds on this. The audit found that only the 40 graphPath programs used a new command, that this family was already 40 of 40 without it, and that the execution-error reduction (63 to 13) came from two census compositions whose programs used no new command.

### I27 (orchestration)

To free disk space, the directories of finished experiments were deleted in full. The trainer wrote its run manifest (inputs, recipe, timestamps) into the same directory. Those manifests were lost with the checkpoints, and later identity records had to reconstruct them from logs.

*Consequence.* The identity backfill (65776203c) marked training finish times of pruned arms as approximate ('deduced from the series log'). In the audit, exp-014's base and recipe could not be verified from its trainer record, which weakened the exp-014 against exp-016 comparison. training/checkpoints/ now holds only exp-016 onward. AGENTS.md says the kept artifacts include 'every log, manifest'.

### I28 (environment)

Several times, files that recorded status for the human lead, and once the review report, were found deleted from the working directory with no recorded cause. Each time they were restored from version control.

*Consequence.* The owner's status record, and on 24 Sep the separate review, were missing from the tree until restored. The commits describe 'a stray working-tree state' and 'the flaky deletion'. No permanent loss is documented, because each file was restored from git.

### I29 (reporting)

A per-book table of exact and re-judged scores listed a wrong exact count for one arm on one book. The value matches another arm's count in the same table.

*Consequence.* A wrong exact count (410 instead of 428) and a derived '410->430' rescue figure in summary.md. 410 is dv9's procedural count, so the value appears copied from the neighbouring row. No decision depended on it.

### I30 (reporting)

A count of distinct plans in the training export mixed in the plans of the held-out circuits. The reported total was therefore larger than the number of plans the model was trained on.

*Consequence.* A miscounted figure in the plan-inventory finding that motivated exp-011-compositions. The distributional conclusion (1.7 to 100 rows per plan) is not reported as changed. The manuscripts do not use the number.

### I31 (reporting)

A range observed on selected winner checkpoints was generalized to all checkpoints. The full set of selection records contains lower values.

*Consequence.* This was the stated comparison baseline for exp-011 and the article's 'stable ladder' claim. The lower bound was overstated: 6.25% (1 of 16) occurs at 12 checkpoints.

### I32 (evaluation)

A sub-agent was asked to write reference circuits for 20 held-out problems without seeing the answers, to check the benchmark. It started opening the repository's stored solutions for those problems. This was noticed, the agent was redirected, and a check was added that voids any submitted solution identical to the stored one.

*Consequence.* Latent: had it gone uncaught, the solver test that triggered the stop rule and the comparator conclusion (I19) would have contained copied reference solutions. The solver was steered away and a copy detector voids any solution identical to the shipped one.

