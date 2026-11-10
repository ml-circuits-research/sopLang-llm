# Incident register, sopLang-llm programme (18-27 September 2026)

Compiled 2026-09-28. Read-only screening of repository records. No training or inference was run. Times are local (+0200, the commit time zone) unless marked Z (UTC, as written in the operational logs). Machine-readable source: [incident-register.json](incident-register.json).

## Inclusion rule

A candidate is an incident when the records show a defect in the pipeline or in the interpretation of its outputs that changed (or, if not caught, would have changed) a written conclusion, a design decision, a training or evaluation launch, deleted or corrupted an artifact, or changed a reported measurement. Candidates with the same underlying defect are merged. Loud failures whose only effect was delay (a crash that stopped work and was fixed and re-run), defects caught by tests or verification gates before use, cosmetic or descriptive slips, governance decisions, and claims that first appeared after the programme window (in the 28 September manuscript work) are excluded.

No defect category is assigned here. Each incident carries a neutral description for independent classification.

## Screening funnel

| Source | Candidates | Mapped to an incident | Excluded |
| --- | --- | --- | --- |
| (a) Review round 1, findings R1-R9 (git show 0cdc4588c:astra_review.md) | 9 | | |
| (a) Review round 2, findings in commit 176b8a38a | 8 | | |
| (a) subtotal | 17 | 9 | 8 |
| (b) Commits 18-28 Sep whose subject matches the keyword pattern (of 240 commits) | 25 | 12 | 13 |
| (c) Claim ledger table 1 / table 2 / baseline audit | 19 / 9 / 3 | 18 | 13 |
| (d) AGENTS.md, phase4-analysis.md, raspuns.md, summary.md, proposal.md, logs and history, article mistakes list | 32 | 25 | 7 |
| **Total** | **105** | **64** | **41** |

The 64 mapped candidates merge into **32 incidents** (32 candidates were folded into an incident that another candidate had already opened). 41 candidates were excluded. Check: 32 + 32 + 41 = 105.

- Source (b): `git log --since=2026-09-18 --until=2026-09-29` returns 240 commits; 25 subjects match /fix|correct|bug|wrong|defect|repair|revert|remediation|mistake|stale/i. Five of the 25 match only incidentally (83ef6212f 'everything else fixed', 571a0f3b9 'something is wrong', 1bb9462ea 'wrong answers', 5a3f30cbb and 3f80574f3 are reverts of measured-negative data versions).
- Source (a), round 2: commit 176b8a38a (25 Sep 12:45) says its fixes come 'from the read-only script review'; no report file of that review is in the repository, so its eight findings are reconstructed from the commit message only.
- Source (d) comprises AGENTS.md (Disk discipline, Launch discipline), evaluation/registry/phase4-analysis.md, raspuns.md, summary.md, proposal.md, evaluation/registry/common-sense-cause.md, their git history, the operational logs these point to (evaluation/registry/overnight-pipeline.log, disk-guard.log, exp-016-wires/series.log, training/checkpoints/exp-016-wires/overnight.log), the 'six mistakes' list in docs/article/05-discussion.md at 922debb52, and the facts verified in article/audit/adversarial-review-03-04.md.

### Incidents by detection route (first detection)

| Route | Incidents |
| --- | --- |
| item-reading by the working thread | 10 (I01, I03, I08, I09, I10, I11, I19, I22, I27, I32) |
| operational failure | 7 (I02, I12, I13, I14, I15, I16, I28) |
| separate review | 4 (I04, I05, I06, I07) |
| final audit | 11 (I17, I18, I20, I21, I23, I24, I25, I26, I29, I30, I31) |

### Incidents by component

| Component | Incidents |
| --- | --- |
| evaluation | 10 (I01, I03, I05, I06, I07, I11, I17, I19, I23, I32) |
| orchestration | 4 (I02, I12, I15, I27) |
| diagnostics | 5 (I04, I08, I10, I21, I22) |
| data generators | 1 (I09) |
| environment | 3 (I13, I14, I28) |
| training | 1 (I16) |
| reporting | 8 (I18, I20, I24, I25, I26, I29, I30, I31) |

## Incident overview

| ID | Incident | Component | Entered | Detected | Route |
| --- | --- | --- | --- | --- | --- |
| I01 | Evaluation servers were not bound to the artifact under test. A leftover server scored every exp-009 selection checkpoint, and the chat silently reused old servers. | evaluation | unknown (readiness check by port/health and a shared alias 'student', in place before 21 Sep) (unknown) | 2026-09-22 07:30 +0200 (c1884d6e4) | item-reading by the working thread |
| I02 | Evaluation chains and holdout workers could run twice for one experiment. Duplicate chains ran on the night of 21 Sep, a stale lock blocked restarts, and the completed-selection shortcut remained open. | orchestration | 2026-09-21 18:58-19:03 +0200 (watchdog auto-restart of chains; approximate) (243f4b317, ec6033160) | 2026-09-22 00:33-00:39 +0200 (31622c395, e3d0dd437) | operational failure |
| I03 | Evaluation and resumed training read the current global export, prompt and data version instead of the run's own snapshot. An evaluation report named a dataset snapshot that no scored item came from. | evaluation | unknown (design of evaluation/client.mjs and run-eval.mjs); first documented instance 2026-09-21 ~21:17-21:24 +0200, when the export was regenerated while the exp-007 holdout ran (6c3e35322 (export regenerated to 7575 rows under compiled-plan-chat-2)) | 2026-09-21 21:24 +0200 (6c3e35322 (D-H recorded in phase4-analysis.md)) | item-reading by the working thread |
| I04 | Strict-format probe failures were read as the model losing JavaScript and instruction capability ('substrate loss'), which motivated the preservation-mixture training arm. | diagnostics | 2026-09-21 16:48 +0200 (D-B verdict on exp-004; restated for exp-007 and exp-008) (4cd5bb0d9) | 2026-09-22 ~09:00 +0200 (review dated 07:00-07:05Z) (0cdc4588c (review file); remediation 3bdb0eb07 09:20) | separate review |
| I05 | The compiled-mode probe scorer accepted an answer if the first number anywhere in it matched, so it could accept a wrong result. | evaluation | 2026-09-21 16:41 +0200 (ad8e03a0a) | 2026-09-22 ~09:00 +0200 (0cdc4588c (review file); fix 3bdb0eb07 09:20) | separate review |
| I06 | Shape-matched demonstration selection read the evaluated item's hidden reference solution to choose prompt examples. | evaluation | 2026-09-22 01:47 +0200 (d00869e66) | 2026-09-22 ~09:00 +0200 (0cdc4588c (review file and fix)) | separate review |
| I07 | Checkpoint selection was dominated by familiar-plan rows (323 of 339), and the book holdout was repeatedly inspected and used to steer curricula while being presented as an untouched test. | evaluation | unknown (DS009 selection rule and the 339-row validation slice, before 21 Sep) (unknown) | 2026-09-22 ~09:00 +0200 (0cdc4588c (review file)) | separate review |
| I08 | The oracle-assisted diagnostic conditions (values or plan supplied) changed the prompt into a form never seen in training, so they did not isolate a pipeline stage. A bottleneck diagnosis built on them shaped the next training arm. | diagnostics | 2026-09-22 10:01 +0200 (ca388ef56) | 2026-09-22 19:24 +0200 (9f92b5c4f; first repair f1a51479c 19:26; raspuns.md ec8d7fff4) | item-reading by the working thread |
| I09 | The evaluation split walk ignored declared reservations, so compositions reserved for the holdout were silently placed in training. | data generators | unknown (selectEvalSplit hash-only walk; composition inventory of 22 Sep) (unknown) | 2026-09-22 before ~22:00 +0200 (before the exp-011 launch at ~20:00Z) (f2dacb603 (recorded 20:04 +0200)) | item-reading by the working thread |
| I10 | In the first retry-sweep run, attempts after the first never executed their program. | diagnostics | 2026-09-23 ~12:35 +0200 (retry mode added; approximate) (87ce8a968 (approximate)) | 2026-09-23 before 12:58 +0200 (sweep closed 10:58Z); recorded 13:15 (1ddbb0640) | item-reading by the working thread |
| I11 | Untrained base models were 'compared' by asking them for SOP Lang programs they were never taught, which yields near-zero baselines. | evaluation | 2026-09-21 17:13-17:51 +0200 (22e72cd04, 5808fe133) | 2026-09-22 23:20 +0200 (1f26adb20 (prose runner); numbers 215eed190 00:56 23 Sep) | item-reading by the working thread |
| I12 | An argument-parser bug made the prose evaluation runs die instantly, and the orchestrator reported them as done. | orchestration | 2026-09-22 23:20 +0200 (1f26adb20) | 2026-09-23 00:53 +0200 (2225e9b7c) | operational failure |
| I13 | Operational scripts kept in /tmp (disk guard, rebuild runner, overnight pipeline) were wiped by a machine reset. | environment | unknown (scripts lived in /tmp); reset on 2026-09-23 before 17:25 +0200 (unknown) | 2026-09-23 17:26 +0200 (790b56e71) | operational failure |
| I14 | The disk filled during the night of 23 Sep; a checkpoint save of exp-016-wires at step 160 was corrupted and the arm's resumes failed. | environment | 2026-09-23 evening: free space fell below 20 GiB at 20:35Z (22:35 +0200) after base-model downloads, checkpoint saves and the dataset rebuild (91aeb7f0e / 2db46ee23 (overnight downloads and shootout), 790b56e71 (guard thresholds)) | 2026-09-23 ~21:15-21:45Z (23:15-23:45 +0200): SafetensorError 'No space left on device' at step 160; resumes then failed with 'Can't find a valid checkpoint' (recorded 07aea7ada and 544147d4d (2026-09-24 07:42-07:45 +0200)) | operational failure |
| I15 | Watchers treated the 'series done' line, which a failed chain also writes, as completion. They pruned the live arm's resume checkpoints and launched a second trainer beside it. | orchestration | 2026-09-23 17:26-19:32 +0200 (overnight pipeline) and 2026-09-24 ~07:40 +0200 (tail watcher) (790b56e71, 91aeb7f0e; f68a00a91 (overnight-tail.sh)) | 2026-09-24 07:52 +0200 (b8be865d5; launch gate d7a752d5e 07:54) | operational failure |
| I16 | The trainer's memory guard judged free memory from the GPU driver's view, which excludes reclaimable page cache on the unified-memory host. This caused false stops and restart loops. | training | unknown (memory guard in the trainer before 23 Sep) (unknown) | 2026-09-26 07:32-07:41 +0200 (root cause) (5a926d512, bfed5dc31, 5f60652b0; status d194b23a3 10:49) | operational failure |
| I17 | The base shootout that selected Qwen3-1.7B rested on unequal and incomplete evidence: 322 of 705 Qwen3 requests had no completion, the populations differed (705 against 585), one candidate never ran, and the automated gate had declined to train. | evaluation | 2026-09-23 21:46Z-22:22Z shootout run (23:46-00:22 +0200); decision 2026-09-24 07:41 +0200 (b9ca30b4c (shootout rule), f68a00a91 and 07aea7ada (decision)) | 2026-09-28 (final audit) (article/audit/baseline-audit.md) | final audit |
| I18 | The run named exp-017-qwen3-17b (Qwen3-1.7B) was read as a 17-billion-parameter model. The misreading served as 'decisive evidence' for a training arm, overwrote a correct label, and became the article headline 'the 1.7B beats our own 17B'. | reporting | 2026-09-23 19:32 +0200 (name with the decimal point lost, written into the pipeline before the shootout ran); first misreading 2026-09-26 14:56 +0200 (91aeb7f0e (name); 0ff94e0ee (first misreading)) | 2026-09-28 (final audit: identities printed from manifest contents) (article/audit/claim-ledger.md) | final audit |
| I19 | Exact-phrase comparison of the book families' reference answers scored correct computations as failures. This was most visible on decompose-to-solve, where the reference carried wording the statement does not determine. | evaluation | book reference answers and the normalized exact comparator in place from 2026-09-18 (da05aa75f); first consequential on 2026-09-25 18:27 +0200, when exp-021 was scored (da05aa75f; 64e75aff8) | 2026-09-26 03:55 +0200 (item-level diagnosis) and 19:02 +0200 (solver test) (e230b2146; 52249feb7) | item-reading by the working thread |
| I20 | A 'semantic re-evaluation' of all 24 models (for example 77.2% for the best arm) was produced by unrecorded subagent judgements. The individual verdicts were not kept, and it was presented as a measurement. | reporting | 2026-09-26 19:34 +0200 (fa913ac88 (summary.md), 91ad1a4ec / 1071430ac (raspuns.md)) | 2026-09-28 (final audit) (article/audit/claim-ledger.md) | final audit |
| I21 | Common-sense zeros were attributed to lost fractional-chain training data that 'only exp-014' had. No arm before dv13 had any units-and-rates training row. The diagnosis drove the dv13 data change and two training runs. | diagnostics | 2026-09-26 20:20 +0200 (5ea409157 (evaluation/registry/common-sense-cause.md)) | 2026-09-28 (final audit) (article/audit/claim-ledger.md (second-round table)) | final audit |
| I22 | The drop of exp-027 on world-as-a-system (20 to 5 of 20) was first reported as a real regression and then as distribution shift. It was a comma-versus-semicolon difference. | diagnostics | 2026-09-27 02:35 +0200 (c6d508b95 ('the world regression is a real signal, not the pipeline's noise band'); f74cdf44d 03:53 (distribution shift)) | 2026-09-27 03:57 +0200 (17243a362; c3dc256ab 04:05) | item-reading by the working thread |
| I23 | The holdout changed between data versions (dv11 oracle compression, dv13 family swap), yet dv7 and dv13 arms were compared as if scored on the same test. | evaluation | 2026-09-26 03:55 +0200 (dv11 references) and 21:01 +0200 (dv13 holdout swap) (e230b2146, df3602594) | 2026-09-28 (final audit) (article/audit/claim-ledger.md) | final audit |
| I24 | The 0.5B against 1.7B difference on dv13 was reported as a 'measured size floor', although the two models differ in family and pretraining (Qwen2.5-Coder against Qwen3). | reporting | 2026-09-26 22:23 +0200 (a3572074c, 4d806b601; 81d8e2df6 22:44 (article mechanism)) | 2026-09-28 (final audit) (article/audit/claim-ledger.md) | final audit |
| I25 | The world-as-a-system 20/20 of the dv7 arm was credited to the container abstraction and described as 'solving a whole book'. The completions declare no container wires, and the 20 items share one plan. | reporting | 2026-09-25 18:27 +0200 (64e75aff8) | 2026-09-28 (final audit) (article/audit/claim-ledger.md) | final audit |
| I26 | The 379 to 440 gain from exp-014 to exp-016 was credited to the new declarative commands (graphPath, aggregate, fraction), though almost none of the gained items used them. | reporting | 2026-09-24 11:50 +0200 (0758b3c9a ('the declarative wires win by measurement')) | 2026-09-28 (final audit, second round) (article/audit/claim-ledger.md; article/evidence/early-series-verification.md) | final audit |
| I27 | Checkpoint pruning deleted whole run directories, including the trainer's run-manifest. exp-014's training manifest is gone, and the training dates of pruned arms had to be estimated. | orchestration | 2026-09-22 20:17 +0200 (first prune, 256 GiB) and 2026-09-24 morning (245 GiB) (9f09f0c77; 07aea7ada) | 2026-09-24 12:11-12:15 +0200 (0628968d8, 65776203c) | item-reading by the working thread |
| I28 | The owner-facing status file raspuns.md, and once the review file astra_review.md, disappeared from the working tree four times and were restored from git. | environment | unknown (cause not recorded) (unknown) | 2026-09-22 20:29 +0200; 2026-09-24 07:42; 2026-09-25 18:27; 2026-09-26 19:35 (67660974a, 07aea7ada, 64e75aff8, 1071430ac) | operational failure |
| I29 | The semantic summary table reported dv8's procedural exact score as 410/480; the correct count is 428/480. | reporting | 2026-09-26 19:34 +0200 (fa913ac88 (summary.md per-book table)) | 2026-09-28 (final audit) (article/audit/claim-ledger.md) | final audit |
| I30 | The plan inventory reported 941 plans over 8,015 rows; 941 includes the 265 held-out circuits, and the export itself holds 924 plans. | reporting | 2026-09-22 19:20 +0200 (8d3050346) | 2026-09-28 (final audit, second round) (article/audit/claim-ledger.md) | final audit |
| I31 | The plan-unseen validation score was reported as 12.5-25% for every checkpoint; across 72 checkpoints it is 1 to 4 of 16, with 12 checkpoints at 1 of 16. | reporting | 2026-09-22 20:04 +0200 ('plan-unseen plateau of 12.5-25.0%'), carried into the article's hypotheses chapter (f2dacb603; 922debb52 docs/article/03-hypotheses.md) | 2026-09-28 (final audit, second round) (article/audit/claim-ledger.md) | final audit |
| I32 | During the 20-item solver test (agent-eval), the solver agent began reading the reference solutions from disk. | evaluation | 2026-09-26 ~18:53-19:02 +0200 (cc595dc37 (slice); 52249feb7 (result)) | 2026-09-26, during the run (exact time not recorded) (evaluation/registry/agent-eval/verify.mjs (copy detector: 'VOID (identical to shipped solution)'); narrative in 922debb52 docs/article/05-discussion.md mistake 5) | item-reading by the working thread |

## Causal chains

- **Night of 23-24 September:** I13 (/tmp scripts wiped; guard re-created at 20/8 GiB) -> I16 (the memory guard stops exp-016 at step 160 and forces a save) -> I14 (the save hits a full disk; checkpoint-160 corrupt; chain selection fails) -> I15 (the failed chain's "series done" is read as completion; the pipeline starts the shootout; the tail watcher launches exp-017 beside exp-016 and prunes exp-016's HF checkpoints) -> I17 (the shootout evidence behind the Qwen3-1.7B base choice).
- **26-27 September, benchmark and goal:** I19 (exact comparator hides correct work) -> dv11 (also changes held-out references, I23) -> agent-eval and stop rule (I32 nearly contaminated it) -> I20 (unrecorded semantic re-scoring, 77.2%, "49/50") -> I21 (common-sense misdiagnosis) -> dv13 (holdout changed, I23) -> exp-026/exp-027 -> I24 (size floor) and I22 (world "regression" misread).
- **Identity:** I17 names the arm exp-017-qwen3-17b -> I18 (read as 17B on 26 Sep 14:56; "decisive evidence" for dv12/exp-025; with I20 the basis of the 20:37 pivot that overrode the stop rule; correct label overwritten at 20:43; headline in five article documents).
- **22 September, diagnosis to design:** I04 (probe format read as capability loss) -> exp-009-mix10; I08 (assisted diagnostic conditions) -> D-L -> exp-010-contrastive; I25 (containers credited for world 20/20) -> dv9 -> exp-023 (reverted).
- **Recurring completion-signal pattern:** I12 (23 Sep 00:53), I15 (24 Sep 07:52) and its recurrences on 24 Sep 11:16 (3812a7924) and 25 Sep 12:45 (176b8a38a).
- **Run identity:** I03 (mutable inputs) and I27 (manifests pruned) together make historical run identity partly unrecoverable; I01 (served artifact) is the serving-time counterpart.

## Incident details

### I01 - Evaluation servers were not bound to the artifact under test. A leftover server scored every exp-009 selection checkpoint, and the chat silently reused old servers.

- **Component:** evaluation
- **Entered:** unknown (readiness check by port/health and a shared alias 'student', in place before 21 Sep); commit unknown
- **Detected:** 2026-09-22 07:30 +0200; c1884d6e4
  - later: 2026-09-22 ~09:00 +0200 separate review R2 (residual: the alias check still accepted any 'student' server), fixed 0cdc4588c 09:17
  - later: 2026-09-22 18:15 +0200 0921e7869 (comparison helper assumed the port's occupant), 18:18 6077b3618
  - later: 2026-09-22 22:48 +0200 865b9dd73 (chat reused a stale server for a new --gguf)
- **Detection route:** item-reading by the working thread - First detection: the working thread read eight identical selection rows (36.3%). The separate review later found the residual weakness (R2).
- **Consequence:** All eight exp-009-mix10 selection checkpoints were scored by checkpoint-90's model because a leftover llama-server held port 8090. That selection evidence was discarded and the chain was re-run (c1884d6e4). In the chat, a new --gguf answered from an old checkpoint without saying so (865b9dd73).
- **Evidence:** `c1884d6e4`, `0cdc4588c`, `0921e7869`, `6077b3618`, `865b9dd73`, `astra_review.md R2 (git show 0cdc4588c:astra_review.md)`
- **Causal chain:** Linked to I02: the same night's chain restarts and leftover processes left servers on the fixed ports.
- **Neutral description (for coders):** Evaluation and chat servers were started under one shared alias on fixed ports. The readiness check accepted any server that answered on the port. When an older server was still running, a newly launched checkpoint failed to bind, and requests were answered by the older model while the records named the new one. The exp-009 checkpoint selection produced eight identical rows as a result.

### I02 - Evaluation chains and holdout workers could run twice for one experiment. Duplicate chains ran on the night of 21 Sep, a stale lock blocked restarts, and the completed-selection shortcut remained open.

- **Component:** orchestration
- **Entered:** 2026-09-21 18:58-19:03 +0200 (watchdog auto-restart of chains; approximate); commit 243f4b317, ec6033160
- **Detected:** 2026-09-22 00:33-00:39 +0200; 31622c395, e3d0dd437
  - later: 2026-09-22 06:31 +0200 732dce004 (lock held by a dead watchdog call blocked exp-009's chain from 04:24Z)
  - later: 2026-09-22 ~09:00 +0200 separate review R3 (completed-selection shortcut and run-holdout.sh took no lock), fixed 415da76ce 09:18
- **Detection route:** operational failure - The working thread saw duplicate processes and repeated scoring in the logs. The residual weakness was found by the separate review (R3).
- **Consequence:** A second evaluation chain started beside a live one at 20:38Z and again at 21:31Z on 21 Sep. A restarted chain re-scored all eight checkpoints after selection had finished (22:33Z), and duplicate workers wrote into the same registry folder. On 22 Sep from 04:24Z, a stale lock descriptor refused every restart of exp-009's chain. Compute was wasted and registry outputs were at risk of being overwritten; no corrupted record is documented.
- **Evidence:** `e3d0dd437`, `31622c395`, `732dce004`, `6bc6899cd`, `415da76ce`, `astra_review.md R3`
- **Causal chain:** Precedes I01 (leftover servers on fixed ports). The same class of lifecycle problem recurs in I15.
- **Neutral description (for coders):** The unattended watchdog and queue scripts could each start an experiment's evaluation chain. The start decision checked for running chains incompletely, and the holdout worker took no lock. On the night of 21-22 Sep, two chains for one experiment ran at once, a restarted chain re-scored checkpoints that had already been scored, and a lock left by a dead process then blocked legitimate restarts.

### I03 - Evaluation and resumed training read the current global export, prompt and data version instead of the run's own snapshot. An evaluation report named a dataset snapshot that no scored item came from.

- **Component:** evaluation
- **Entered:** unknown (design of evaluation/client.mjs and run-eval.mjs); first documented instance 2026-09-21 ~21:17-21:24 +0200, when the export was regenerated while the exp-007 holdout ran; commit 6c3e35322 (export regenerated to 7575 rows under compiled-plan-chat-2)
- **Detected:** 2026-09-21 21:24 +0200; 6c3e35322 (D-H recorded in phase4-analysis.md)
  - later: 2026-09-22 ~09:00 +0200 separate review R4 (prompt, training-plan membership and trainer resume read mutable inputs); resume refusal in 7236007f6 09:19
  - later: 2026-09-25 12:45 +0200 second review: the evaluation manifest took dataVersion from the disk state at scoring time; fixed 176b8a38a
- **Detection route:** item-reading by the working thread - Found while reading the exp-007 report (D-H). The review extended it to the prompt and the trainer resume (R4), and a second review found the same pattern in data-version attribution.
- **Consequence:** evaluation/registry/exp-007-sft-wires/report.md records dataset snapshot 5ffd341e (7,575 rows), but the checkpoint was trained on snapshot 390211ea (7,335 rows). Models trained under prompt compiled-plan-chat-1 would be evaluated with compiled-plan-chat-2; the review reports different hashes 67655b81... and dfe015ee.... The trainer overwrote a run's manifest on resume without comparing inputs. The phase-4 analysis judged the 265 scored items themselves unaffected.
- **Evidence:** `evaluation/registry/phase4-analysis.md (Structure run, D-H)`, `6c3e35322`, `7236007f6`, `176b8a38a`, `astra_review.md R4`
- **Causal chain:** Related to I27: provenance lost to pruning compounded the difficulty of reconstructing run identity.
- **Neutral description (for coders):** The evaluation code imported the current system prompt and export manifest from the working tree at scoring time rather than from the experiment's recorded training inputs. The trainer, when resuming, rebuilt its manifest from the current inputs. When the dataset was regenerated during a run, reports recorded the new snapshot and data version, not the one the checkpoint was trained on.

### I04 - Strict-format probe failures were read as the model losing JavaScript and instruction capability ('substrate loss'), which motivated the preservation-mixture training arm.

- **Component:** diagnostics
- **Entered:** 2026-09-21 16:48 +0200 (D-B verdict on exp-004; restated for exp-007 and exp-008); commit 4cd5bb0d9
- **Detected:** 2026-09-22 ~09:00 +0200 (review dated 07:00-07:05Z); 0cdc4588c (review file); remediation 3bdb0eb07 09:20
- **Detection route:** separate review
- **Consequence:** Decision D-B ('the narrow mixture does degrade the substrate, so the next series carries preservation material') led to the capability-preservation view (6a77f89e7, 21 Sep 21:29) and the exp-009-mix10 arm (747 steps), trained to restore the capability. In exp-008's records, three of the six JavaScript probes stated the correct value and were scored as mismatches. After the review, D-K read exp-009's null result under the corrected interpretation and noted a budget confound (747 against 681 steps).
- **Evidence:** `evaluation/registry/phase4-analysis.md D-B, D-K`, `4cd5bb0d9`, `6a77f89e7`, `3bdb0eb07`, `astra_review.md R6`
- **Causal chain:** Led to the design and launch of exp-009-mix10.
- **Neutral description (for coders):** The capability probe suite scored answers with a strict direct-answer protocol, so a correct value in a forbidden format counted as a failure. The programme read falling probe scores after fine-tuning as a loss of general JavaScript and instruction ability. It then designed and trained a preservation-mixture arm to counter that loss.

### I05 - The compiled-mode probe scorer accepted an answer if the first number anywhere in it matched, so it could accept a wrong result.

- **Component:** evaluation
- **Entered:** 2026-09-21 16:41 +0200; commit ad8e03a0a
- **Detected:** 2026-09-22 ~09:00 +0200; 0cdc4588c (review file); fix 3bdb0eb07 09:20
- **Detection route:** separate review
- **Consequence:** The direct-versus-compiled probe comparison (text-probes-exp-005-compiled, 30 accepted answers) could not be reported without qualification. statesValue('2', '2 + 2 = 4') returned true. The review did not demonstrate any false pass among the 30 recorded ones.
- **Evidence:** `ad8e03a0a`, `3bdb0eb07`, `evaluation/registry/text-probes-exp-005-compiled`, `astra_review.md R9`
- **Causal chain:** none
- **Neutral description (for coders):** The compiled probe scorer compared the expected value with the first number found anywhere in the model's answer and ignored the probe's exact-comparison policy. An answer that echoed an operand before stating a different result could pass. The scorer was replaced by one that requires every stated number to equal the expected value.

### I06 - Shape-matched demonstration selection read the evaluated item's hidden reference solution to choose prompt examples.

- **Component:** evaluation
- **Entered:** 2026-09-22 01:47 +0200; commit d00869e66
- **Detected:** 2026-09-22 ~09:00 +0200; 0cdc4588c (review file and fix)
- **Detection route:** separate review
- **Consequence:** Latent: no shapes-mode adaptation run exists in evaluation/registry (only adapt-holdout-0/1/3 and adapt-smoke-3, which use the distinct mode). Had it been used, the planned adaptation measurement would have selected demonstrations with knowledge of the reference circuit's wire count.
- **Evidence:** `d00869e66`, `1f3023ecd`, `0cdc4588c`, `astra_review.md R1`
- **Causal chain:** none
- **Neutral description (for coders):** A new option of the adaptation runner chose which solved examples to place in the prompt by reading the target item's reference solution file and matching its number of wires. A deployed model would not have access to that file. The option was removed about seven hours after it was added, before any scored run used it.

### I07 - Checkpoint selection was dominated by familiar-plan rows (323 of 339), and the book holdout was repeatedly inspected and used to steer curricula while being presented as an untouched test.

- **Component:** evaluation
- **Entered:** unknown (DS009 selection rule and the 339-row validation slice, before 21 Sep); commit unknown
- **Detected:** 2026-09-22 ~09:00 +0200; 0cdc4588c (review file)
  - later: 2026-09-28 final audit, claim-ledger row 'The nominal holdout is pristine confirmation: unsupported after repeated inspection and redesign'
- **Detection route:** separate review
- **Consequence:** In exp-008, the selected checkpoint-540 answered 3 of 16 unseen-plan rows, while checkpoints 360 and 450 answered 4 of 16. The review asked for a separate development suite and a reserved final suite; no remediation commit for R7 exists in the history. The final audit reclassified the holdout as a development benchmark and excluded 'pristine confirmation' claims.
- **Evidence:** `astra_review.md R7`, `article/audit/claim-ledger.md (Table 1)`, `evaluation/registry/exp-008-sft-shapes/selection.json`
- **Causal chain:** none
- **Neutral description (for coders):** The selection metric was the overall oracle score on a validation slice where 323 of 339 rows used plans also seen in training, so it mostly rewarded reproduction of familiar plans. The same book holdout was read after every arm to choose the next data change. It was nevertheless referred to as held-out evidence.

### I08 - The oracle-assisted diagnostic conditions (values or plan supplied) changed the prompt into a form never seen in training, so they did not isolate a pipeline stage. A bottleneck diagnosis built on them shaped the next training arm.

- **Component:** diagnostics
- **Entered:** 2026-09-22 10:01 +0200; commit ca388ef56
- **Detected:** 2026-09-22 19:24 +0200; 9f92b5c4f; first repair f1a51479c 19:26; raspuns.md ec8d7fff4
- **Detection route:** item-reading by the working thread
- **Consequence:** Diagnosis D-L (d2357a0a6, 10:07) concluded that the bottleneck is 'adapting a memorized plan' and recommended contrastive pairs. exp-010-contrastive was built (41db77c0a, 16:37), trained, and closed at 19:11, before the defect was found at 19:24. The stage-isolation part of D-L was withdrawn; its value-supply reading (8 against 9 of 60) was kept. On diag-pairs-010 the assisted conditions scored 3 of 48 (values) against 23 of 48 (normal), and 0 of 24 pairs kept the same program.
- **Evidence:** `ca388ef56`, `d2357a0a6`, `9f92b5c4f`, `f1a51479c`, `ec8d7fff4`, `evaluation/registry/diag-009`, `evaluation/registry/diag-pairs-010`, `evaluation/registry/diag-pairs-fixed`
- **Causal chain:** Fed the design of exp-010-contrastive.
- **Neutral description (for coders):** The diagnostic asked the same problems four ways: plain, with correct values appended, with the correct plan appended, and with both, to locate where compilation fails. The appended text used wording that appears in no training row, and the model responded by emitting a different program. The assisted scores therefore reflected reactions to an unfamiliar prompt rather than the effect of supplying a correct input.

### I09 - The evaluation split walk ignored declared reservations, so compositions reserved for the holdout were silently placed in training.

- **Component:** data generators
- **Entered:** unknown (selectEvalSplit hash-only walk; composition inventory of 22 Sep); commit unknown
- **Detected:** 2026-09-22 before ~22:00 +0200 (before the exp-011 launch at ~20:00Z); f2dacb603 (recorded 20:04 +0200)
- **Detection route:** item-reading by the working thread - The records say only that the defect 'was found and fixed before this run'; how it was found is not recorded.
- **Consequence:** Latent: had exp-011-compositions trained on the unfixed split, its reserved-composition holdout (later 160 of 160, the programme's first clean composition result) would have contained trained compositions.
- **Evidence:** `f2dacb603 (training/STATE.md)`, `03089bdec`
- **Causal chain:** none
- **Neutral description (for coders):** The function that splits generated items into training and evaluation chose items by a hash walk and did not honour the compositions declared as reserved for evaluation. Some reserved compositions therefore landed in training. The fix made the split respect the reservation before the arm that measured those compositions was trained.

### I10 - In the first retry-sweep run, attempts after the first never executed their program.

- **Component:** diagnostics
- **Entered:** 2026-09-23 ~12:35 +0200 (retry mode added; approximate); commit 87ce8a968 (approximate)
- **Detected:** 2026-09-23 before 12:58 +0200 (sweep closed 10:58Z); recorded 13:15; 1ddbb0640
- **Detection route:** item-reading by the working thread
- **Consequence:** The first sweep's numbers were invalid; the bug was fixed and the sweep re-run, and only the re-run (17 of 30 at 0, 1 and 2 retries) was reported. Had it not been caught, retries would have been reported as leaving execution unchanged, instead of moving it from 93.3% to 100.0%.
- **Evidence:** `evaluation/registry/phase4-analysis.md (The retry sweep)`, `1ddbb0640`, `evaluation/registry/retry-sweep-0/1/2`
- **Causal chain:** none
- **Neutral description (for coders):** The diagnostic loop that re-asks the model after a failed program recorded later attempts without executing them, so retries could not change any outcome. The first measurement of the retry effect was therefore meaningless. It was noticed, fixed, and re-run before the numbers were written up.

### I11 - Untrained base models were 'compared' by asking them for SOP Lang programs they were never taught, which yields near-zero baselines.

- **Component:** evaluation
- **Entered:** 2026-09-21 17:13-17:51 +0200; commit 22e72cd04, 5808fe133
- **Detected:** 2026-09-22 23:20 +0200; 1f26adb20 (prose runner); numbers 215eed190 00:56 23 Sep
- **Detection route:** item-reading by the working thread - Raised by the human lead ('the owner's correction', phase4-analysis.md), not by an agent. None of the five route categories names the human lead; it is recorded under the closest one.
- **Consequence:** docs/comparison.html reported the base student at 0.4% parse and 0.0% oracle on the holdout as the baseline. After the correction, the bases answered in prose (0.5B 63 of 585, 1.5B 30 of 585). These became 'the numbers the fine-tuned students must beat' and the floor of the later base shootout (I17).
- **Evidence:** `22e72cd04`, `5808fe133`, `1f26adb20`, `215eed190`, `evaluation/registry/phase4-analysis.md (The fair base baselines, in prose)`
- **Causal chain:** The corrected prose baseline (30 of 585) became the floor rule used in the base shootout (I17).
- **Neutral description (for coders):** The first base-versus-fine-tuned comparison scored the untrained base models with the same compiled-program protocol as the fine-tuned students. Only the students had been trained to produce that format. The comparison was replaced by a prose protocol in which the bases answer directly.

### I12 - An argument-parser bug made the prose evaluation runs die instantly, and the orchestrator reported them as done.

- **Component:** orchestration
- **Entered:** 2026-09-22 23:20 +0200; commit 1f26adb20
- **Detected:** 2026-09-23 00:53 +0200; 2225e9b7c
- **Detection route:** operational failure
- **Consequence:** The first prose baseline launches exited on 'unknown argument', and the orchestrator reported them as completed. The same orchestrator missed the exp-012 chain, which had to be started manually. A second watcher was added that waits on output files rather than process patterns.
- **Evidence:** `2225e9b7c`, `1f26adb20`
- **Causal chain:** Same completion-signal pattern as I15 (a stage judged finished from process state rather than from its result artifact), one night earlier.
- **Neutral description (for coders):** The prose evaluation runner's argument parser consumed a value and then processed it again as a flag, so every launch exited immediately. The orchestrator judged completion by the disappearance of the process and reported the runs as finished. It also failed to start the next experiment's evaluation chain.

### I13 - Operational scripts kept in /tmp (disk guard, rebuild runner, overnight pipeline) were wiped by a machine reset.

- **Component:** environment
- **Entered:** unknown (scripts lived in /tmp); reset on 2026-09-23 before 17:25 +0200; commit unknown
- **Detected:** 2026-09-23 17:26 +0200; 790b56e71
- **Detection route:** operational failure
- **Consequence:** The runbook's rebuild step, the disk guard and the overnight pipeline were lost and had to be rewritten into the repository. evaluation/registry/disk-guard.log begins with 'bash: /tmp/disk_guard.sh: No such file or directory'. The re-created guard used warn < 20 GiB and stop-trainer < 8 GiB and did not stop downloads, which are the thresholds in force when the disk filled that night (I14).
- **Evidence:** `790b56e71`, `evaluation/registry/disk-guard.log (first line)`
- **Causal chain:** Possible contributor to I14: the rewritten guard's thresholds and scope did not prevent disk exhaustion. The records do not show whether the lost /tmp guard used different thresholds.
- **Neutral description (for coders):** Scripts needed for unattended runs were stored in the temporary directory and disappeared when the machine was reset. They were recreated inside the repository the same afternoon. The disk-space guard was among them.

### I14 - The disk filled during the night of 23 Sep; a checkpoint save of exp-016-wires at step 160 was corrupted and the arm's resumes failed.

- **Component:** environment
- **Entered:** 2026-09-23 evening: free space fell below 20 GiB at 20:35Z (22:35 +0200) after base-model downloads, checkpoint saves and the dataset rebuild; commit 91aeb7f0e / 2db46ee23 (overnight downloads and shootout), 790b56e71 (guard thresholds)
- **Detected:** 2026-09-23 ~21:15-21:45Z (23:15-23:45 +0200): SafetensorError 'No space left on device' at step 160; resumes then failed with 'Can't find a valid checkpoint'; recorded 07aea7ada and 544147d4d (2026-09-24 07:42-07:45 +0200)
- **Detection route:** operational failure
- **Consequence:** exp-016-wires was interrupted at step 160 of 630, checkpoint-160 was left invalid, and repeated resume attempts failed. The evaluation chain started at 21:27Z tried to convert checkpoint-160, and its selection failed at 21:44Z. The night's training was lost. The next morning 245 GiB of closed-arm checkpoints were pruned and exp-016 resumed from checkpoint-150; it later finished 630/630 (440/705). The disk guard existed (790b56e71), warned from 20:35Z and logged 'CRITICAL: below 8 GiB; stopping the trainer' at 21:15:50Z, but did not prevent the failure. Disk discipline rules and a 40/16 GiB guard followed (544147d4d).
- **Evidence:** `training/checkpoints/exp-016-wires/overnight.log (lines 287-363)`, `evaluation/registry/disk-guard.log`, `evaluation/registry/exp-016-wires/series.log`, `07aea7ada`, `544147d4d`, `AGENTS.md Disk discipline`
- **Causal chain:** I16 -> I14 -> I15. The save at step 160 was triggered by the memory guard's stop (I16) and landed on a nearly full disk. The failed chain's 'series done' line then fed I15. I13 possibly contributed through the guard thresholds.
- **Neutral description (for coders):** Base-model downloads for the planned base comparison, a dataset rebuild and training checkpoints filled the disk overnight. A checkpoint being written when the disk ran out was left incomplete, so the trainer could not resume from it. The existing disk guard warned and then tried to stop the trainer, but its thresholds were below the size of one save and it did not stop downloads.

### I15 - Watchers treated the 'series done' line, which a failed chain also writes, as completion. They pruned the live arm's resume checkpoints and launched a second trainer beside it.

- **Component:** orchestration
- **Entered:** 2026-09-23 17:26-19:32 +0200 (overnight pipeline) and 2026-09-24 ~07:40 +0200 (tail watcher); commit 790b56e71, 91aeb7f0e; f68a00a91 (overnight-tail.sh)
- **Detected:** 2026-09-24 07:52 +0200; b8be865d5; launch gate d7a752d5e 07:54
  - later: 2026-09-24 11:16 +0200 3812a7924 (sentinel exited on a stale failure line and killed the queue)
  - later: 2026-09-25 12:45 +0200 176b8a38a (second review: manual-start gate blocked by a stale selection line)
- **Detection route:** operational failure
- **Consequence:** At 21:45:48Z on 23 Sep the pipeline logged 'exp-016 chain done' after a failed selection, pruned non-winner GGUFs of exp-014 and exp-015, and started the base shootout. At 05:40Z on 24 Sep the tail watcher logged 'exp-016-wires chain closed WITHOUT metrics - a human must look' and then launched exp-017-qwen3-17b anyway. At 05:45Z it 'pruned exp-016-wires HF checkpoints' while exp-016 was running from its resume point. The result was two trainers at once and a deleted resume checkpoint. This led to the rule that metrics.json is the only completion signal, and to preflight.sh, which refuses a second trainer.
- **Evidence:** `evaluation/registry/overnight-pipeline.log (lines 147-159, 1051-1071)`, `b8be865d5`, `d7a752d5e`, `3812a7924`, `176b8a38a`, `AGENTS.md Launch discipline`
- **Causal chain:** I14 -> I15: the failed chain was the one broken by the disk-full crash. The shootout started by the false completion produced the evidence used in I17. The same completion-signal pattern appeared in I12.
- **Neutral description (for coders):** The unattended watchers decided that an experiment's evaluation was finished when a log line 'series done' appeared, but the chain writes that line on failure as well. After the disk-full crash, the watchers read the failed chain as finished. They then deleted the running arm's checkpoints and started the next training run while the previous one was still training.

### I16 - The trainer's memory guard judged free memory from the GPU driver's view, which excludes reclaimable page cache on the unified-memory host. This caused false stops and restart loops.

- **Component:** training
- **Entered:** unknown (memory guard in the trainer before 23 Sep); commit unknown
- **Detected:** 2026-09-26 07:32-07:41 +0200 (root cause); 5a926d512, bfed5dc31, 5f60652b0; status d194b23a3 10:49
  - later: symptom first addressed 2026-09-24 08:51 +0200 by the stall sentinel 8b0c3fb70 (exp-016 pinned at step 301)
- **Detection route:** operational failure
- **Consequence:** On 23 Sep, exp-016 was stopped repeatedly at step 1, and at step 160 the guard stopped it with 'CUDA free 13.6 GiB, host available 99.9 GiB'; that stop triggered the save that hit the full disk (I14). On 24 Sep exp-016 was held at step 301 in a restart loop while the chat held the GPU. On 26 Sep exp-024 stopped at steps 0 and 7 while the host reported 80-110 GiB available. The launch was delayed until the cache squeeze and the MemAvailable-based floor were added; exp-024's manifest was created at 05:42Z, right after the fix.
- **Evidence:** `training/checkpoints/exp-016-wires/overnight.log (lines 31-107, 287)`, `8b0c3fb70`, `5a926d512`, `bfed5dc31`, `5f60652b0`, `d194b23a3`, `training/checkpoints/exp-024-1.7b-qwen3-dv11/run-manifest.json`
- **Causal chain:** I16 -> I14: the guard-triggered save at step 160 was the write that failed on the full disk.
- **Neutral description (for coders):** On the machine's shared CPU-GPU memory pool, cached file pages made the GPU driver report little free memory even though the operating system could reclaim that memory on demand. The trainer's memory guard trusted the driver's figure, stopped training, saved, and restarted, repeatedly. The guard was changed to use the kernel's available-memory figure, and a pre-launch step that squeezes the cache was added.

### I17 - The base shootout that selected Qwen3-1.7B rested on unequal and incomplete evidence: 322 of 705 Qwen3 requests had no completion, the populations differed (705 against 585), one candidate never ran, and the automated gate had declined to train.

- **Component:** evaluation
- **Entered:** 2026-09-23 21:46Z-22:22Z shootout run (23:46-00:22 +0200); decision 2026-09-24 07:41 +0200; commit b9ca30b4c (shootout rule), f68a00a91 and 07aea7ada (decision)
- **Detected:** 2026-09-28 (final audit); article/audit/baseline-audit.md
- **Detection route:** final audit
- **Consequence:** The pipeline's own gate logged 'no candidate base cleared the coder's 30 of 585 in prose; NOT training - a human decides'. The Gemma candidate failed to start (missing config.json). The morning report nonetheless declared Qwen3-1.7B the winner ('357 of 705 in prose against the coder's 30 of 585'), and a hand-written tail launched exp-017 on it. Every later 1.7B arm (exp-017 to exp-025, exp-027) uses this base. The audit found 322 of 705 Qwen3 base records with 'response carries no completion' and does not treat the record as a capacity ranking. The missing completions count as failures, so they lower rather than raise Qwen3's score; whether the choice would have changed is not established.
- **Evidence:** `evaluation/registry/overnight-pipeline.log (lines 1040-1053)`, `evaluation/registry/cmp-base-holdout-prose-q3`, `f68a00a91`, `07aea7ada`, `article/audit/baseline-audit.md (Qwen3 response availability)`
- **Causal chain:** Started by the false completion in I15 (the shootout ran after the 'exp-016 chain done' line). Uses the floor from I11. Named the arm whose identity was later misread (I18).
- **Neutral description (for coders):** To choose the base model for the next arms, three candidate base models were asked to answer the holdout in prose overnight. One candidate failed to run, and 45.7% of the chosen model's requests returned no text. Its score was compared with an older model's score on a different, smaller item set. The automated rule refused to pick a winner, and the next morning's report picked one by hand.

### I18 - The run named exp-017-qwen3-17b (Qwen3-1.7B) was read as a 17-billion-parameter model. The misreading served as 'decisive evidence' for a training arm, overwrote a correct label, and became the article headline 'the 1.7B beats our own 17B'.

- **Component:** reporting
- **Entered:** 2026-09-23 19:32 +0200 (name with the decimal point lost, written into the pipeline before the shootout ran); first misreading 2026-09-26 14:56 +0200; commit 91aeb7f0e (name); 0ff94e0ee (first misreading)
- **Detected:** 2026-09-28 (final audit: identities printed from manifest contents); article/audit/claim-ledger.md
- **Detection route:** final audit
- **Consequence:** (1) The 14:56 status note used 'qwen3-17b ALSO got 0/100 and 0/50 - model size does not help, the dataset does' as 'decisive evidence' (translated from Romanian) for the dv12 statement-simplification arm (e494ddbf5, 15:27; exp-025 manifest created 13:29Z = 15:29 +0200). (2) The 20:37 plan (143605893) dropped the 90% goal for the headline 'the 1.7B trained by the loop beats our own 17B'; dv13 and exp-026/exp-027 followed within hours, although the 19:02 stop rule required a re-test first. (3) The 20:43 article rewrite (b6a00809b) changed an existing correct row '1.7B base' to '17B base'. (4) The claim reached the base article and four of five journal variants (922debb52). The roster of 24 Sep 12:17 (351835e37) and the 25 Sep article draft (b747dc15a) had carried the correct identity.
- **Evidence:** `91aeb7f0e`, `b9ca30b4c`, `351835e37`, `b747dc15a`, `0ff94e0ee`, `e494ddbf5`, `143605893`, `b6a00809b`, `922debb52`, `training/environment/base-model-qwen3-17b.json`, `article/audit/adversarial-review-03-04.md A1-A4`
- **Causal chain:** Uses I17's arm name. Combined with I20 (77.2% semantic, 'qwen3-17b: 64.8%') in the 20:37 pivot, which also overrode the proposal.md stop rule and led to dv13 (I21, I23) and the exp-026/exp-027 runs (I24).
- **Neutral description (for coders):** An experiment was named with the string 'qwen3-17b', the base model's name without its decimal point, before it was known which base would be used. Two days later, status notes and an article rewrite read the name as a 17-billion-parameter model, although the run's manifest and earlier roster and draft entries said Qwen3-1.7B. The misread comparison was used to justify a data-design arm and a change of research goal.

### I19 - Exact-phrase comparison of the book families' reference answers scored correct computations as failures. This was most visible on decompose-to-solve, where the reference carried wording the statement does not determine.

- **Component:** evaluation
- **Entered:** book reference answers and the normalized exact comparator in place from 2026-09-18 (da05aa75f); first consequential on 2026-09-25 18:27 +0200, when exp-021 was scored; commit da05aa75f; 64e75aff8
- **Detected:** 2026-09-26 03:55 +0200 (item-level diagnosis) and 19:02 +0200 (solver test); e230b2146; 52249feb7
- **Detection route:** item-reading by the working thread - The dv11 commit records that '38 of 64 executed-but-wrong decompose rows had the right number and only paraphrased the verdict wording'. The 20-item solver test (agent-eval: 2 of 20 pass) confirmed it 15 hours later.
- **Consequence:** exp-021's decompose-to-solve result was recorded as 0 of 100; a later restricted parser counts 64 of 100. The response was to change the training targets and some references rather than the comparator: dv11 answer compression (exp-024, 439/705) and then dv12. After the solver test, the stop rule and a semantic re-evaluation followed (I20). For the other stuck book, common-sense, the records attribute the zeros to computational causes, not phrasing.
- **Evidence:** `e230b2146`, `52249feb7`, `evaluation/registry/agent-eval/report.md`, `proposal.md`, `article/evidence/exp-021-1.7b-qwen3-dv7-decompose-to-solve-restricted.jsonl`, `article/audit/adversarial-review-03-04.md C3, C8`
- **Causal chain:** I19 -> dv11 (which also changed holdout oracles, I23) -> agent-eval and stop rule -> semantic re-evaluation (I20). Its exact scoring also underlies the world 'regression' misread (I22).
- **Neutral description (for coders):** Model answers were compared with the book's reference answers as normalized strings. For some families the references contained explanatory sentences, unit words and punctuation that cannot be derived from the problem statement. Answers with the right value and verdict in other words were therefore counted as wrong. The programme first changed its training data and references in response, then confirmed the problem with a hand-written solver that also failed the comparison.

### I20 - A 'semantic re-evaluation' of all 24 models (for example 77.2% for the best arm) was produced by unrecorded subagent judgements. The individual verdicts were not kept, and it was presented as a measurement.

- **Component:** reporting
- **Entered:** 2026-09-26 19:34 +0200; commit fa913ac88 (summary.md), 91ad1a4ec / 1071430ac (raspuns.md)
- **Detected:** 2026-09-28 (final audit); article/audit/claim-ledger.md
- **Detection route:** final audit
- **Consequence:** Status and article carried 77.2% as the best arm's accuracy and 'decompose-to-solve 66/100', and the 20:37 pivot quoted the table (including 'qwen3-17b: 64.8%'). summary.md reads exp-014's '49/50 semantic' on common-sense as a finding, and that reading fed the common-sense diagnosis (I21). The automatic judge had failed (the 'judge account was rejected'), and four subagents judged disjoint shards; evaluation/registry/agent-eval/judge-slice-0..3.jsonl hold 833 inputs and no verdicts. The audit excluded the figures from results.
- **Evidence:** `fa913ac88`, `1071430ac`, `143605893`, `summary.md`, `evaluation/registry/agent-eval/judge-slice-{0..3}.jsonl`, `922debb52 docs/article/05-discussion.md (mistake 6)`, `article/audit/claim-ledger.md`
- **Causal chain:** Follows I19. Feeds I21 (the 49/50 figure) and, with I18, the 20:37 pivot.
- **Neutral description (for coders):** After the exact comparator was found to reject correct answers, all mismatched answers were re-judged for meaning. The automatic judge failed, so subagents judged four disjoint slices instead. Only the inputs were saved, not the per-item verdicts, yet the resulting percentages were written into status files and the article as each model's semantic accuracy.

### I21 - Common-sense zeros were attributed to lost fractional-chain training data that 'only exp-014' had. No arm before dv13 had any units-and-rates training row. The diagnosis drove the dv13 data change and two training runs.

- **Component:** diagnostics
- **Entered:** 2026-09-26 20:20 +0200; commit 5ea409157 (evaluation/registry/common-sense-cause.md)
- **Detected:** 2026-09-28 (final audit); article/audit/claim-ledger.md (second-round table)
- **Detection route:** final audit
- **Consequence:** dv13 (df3602594, 21:01) moved the units-and-rates family from the holdout into training, replaced the common-sense holdout with logical-implications, and dropped the integer probe idiom from 11 families. exp-026 (0.5B) and exp-027 (1.7B) were trained on dv13. Execution errors then rose from 57 to 184 in exp-027, attributed to the probe relaxation. The audit reproduced the guard mechanism for 15 of 36 dv12 probe failures only, and found the '49/50' to be an unreconstructable judge result.
- **Evidence:** `5ea409157`, `evaluation/registry/common-sense-cause.md`, `df3602594`, `c6d508b95`, `17243a362`, `article/audit/claim-ledger.md`
- **Causal chain:** I20 (49/50 semantic figure) -> I21 -> dv13 -> exp-026/exp-027 and the holdout change of I23.
- **Neutral description (for coders):** The programme explained why no model solved the common-sense book by saying that an earlier data version contained fractional-chain training data, later removed, and that only one arm had trained on it. The item and training records show that no arm before dv13 had training rows of that family. A second mechanism, copied integer assertions, holds for about 15 of 36 failures. A new data version and two training runs were built on this explanation.

### I22 - The drop of exp-027 on world-as-a-system (20 to 5 of 20) was first reported as a real regression and then as distribution shift. It was a comma-versus-semicolon difference.

- **Component:** diagnostics
- **Entered:** 2026-09-27 02:35 +0200; commit c6d508b95 ('the world regression is a real signal, not the pipeline's noise band'); f74cdf44d 03:53 (distribution shift)
- **Detected:** 2026-09-27 03:57 +0200; 17243a362; c3dc256ab 04:05
- **Detection route:** item-reading by the working thread
- **Consequence:** The morning conclusion and the commit say 'the data fix regressed the container book'. The recommendation was revised to 'revert only the probe relaxation'. The wrong text in raspuns.md was overwritten rather than kept. summary.md's '1.7B on the repaired dv13 data' section still states that dv13 'regressed the container book' (uncorrected). All 15 mismatches equal the reference after replacing ';' with ','.
- **Evidence:** `c6d508b95`, `c1b19031a`, `f74cdf44d`, `17243a362`, `c3dc256ab`, `summary.md`, `evaluation/registry/exp-027-1.7b-qwen3-dv13/items/holdout.jsonl`, `article/audit/adversarial-review-03-04.md B5`
- **Causal chain:** Rests on I19 (exact comparison) and I23 (dv13 changed the test).
- **Neutral description (for coders):** When a newly trained model's score on one book fell from 20 to 5 of 20, the status record first called it a real regression and then a distribution shift, before any failing answer had been read. Reading the 15 failures four minutes later showed they differed from the reference only in punctuation. The first diagnosis had asserted item-level facts without reading the items.

### I23 - The holdout changed between data versions (dv11 oracle compression, dv13 family swap), yet dv7 and dv13 arms were compared as if scored on the same test.

- **Component:** evaluation
- **Entered:** 2026-09-26 03:55 +0200 (dv11 references) and 21:01 +0200 (dv13 holdout swap); commit e230b2146, df3602594
- **Detected:** 2026-09-28 (final audit); article/audit/claim-ledger.md
- **Detection route:** final audit
- **Consequence:** Comparisons such as 'exp-027 59.7% below dv7's 65.2%', 'world regressed', 'procedural 438 to 414' and 'the data fix was a measured negative' (c6d508b95, summary.md, raspuns.md) set dv13 against dv7. The two holdouts share 655 IDs, with 50 removed and 50 added, and among the shared IDs 100 oracles and 147 plans changed.
- **Evidence:** `e230b2146`, `df3602594`, `c6d508b95`, `summary.md`, `article/audit/claim-ledger.md (Dv7 and dv13 are the same test)`
- **Causal chain:** Consequence of I19 (dv11 changed references) and I21 (dv13 moved a family out of the holdout). Underlies I22 and the cross-version comparisons in I24.
- **Neutral description (for coders):** The held-out items are regenerated with each data version. Two data changes rewrote some reference answers and replaced one held-out family. Scores of models evaluated before and after these changes were compared directly, as if the test were unchanged.

### I24 - The 0.5B against 1.7B difference on dv13 was reported as a 'measured size floor', although the two models differ in family and pretraining (Qwen2.5-Coder against Qwen3).

- **Component:** reporting
- **Entered:** 2026-09-26 22:23 +0200; commit a3572074c, 4d806b601; 81d8e2df6 22:44 (article mechanism)
- **Detected:** 2026-09-28 (final audit); article/audit/claim-ledger.md
- **Detection route:** final audit
- **Consequence:** The article and summary state that 'the abstraction loop needs a minimum capacity that 0.5B does not meet' and give a mechanism (hidden width, working memory). The headline was 'bounded below by a measured size floor'. The audit restricts this to comparing two archived systems (361/705 against 421/705).
- **Evidence:** `a3572074c`, `4d806b601`, `81d8e2df6`, `922debb52 docs/article/05-discussion.md`, `article/audit/claim-ledger.md`
- **Causal chain:** Part of the comparison programme launched by the 20:37 pivot (I18).
- **Neutral description (for coders):** Two models trained on the same data version differed in accuracy. The difference was attributed to parameter count and written up with a proposed mechanism. The two models also come from different model families with different pretraining, so parameter count is not the only difference between them.

### I25 - The world-as-a-system 20/20 of the dv7 arm was credited to the container abstraction and described as 'solving a whole book'. The completions declare no container wires, and the 20 items share one plan.

- **Component:** reporting
- **Entered:** 2026-09-25 18:27 +0200; commit 64e75aff8
- **Detected:** 2026-09-28 (final audit); article/audit/claim-ledger.md
- **Detection route:** final audit
- **Consequence:** Design decision: dv9 moved the two zero books to 'the compact container idiom' (45c7b4276, 25 Sep 23:36). exp-023 was trained on it, lost 20 answers (428/705), and was reverted (3f80574f3). The article concluded that 'the container abstraction ... transferred to an entire book' and that 'abstract, LLM-recognizable circuits beat custom code' (922debb52). The audit found zero container-family declarations in exp-021's coalition completions and 20 evaluated cases sharing one plan.
- **Evidence:** `64e75aff8`, `45c7b4276`, `a328ac7d2`, `3f80574f3`, `922debb52 docs/article/01-introduction.md, 05-discussion.md`, `article/audit/claim-ledger.md`
- **Causal chain:** Led to the dv9 arm (exp-023).
- **Neutral description (for coders):** After the arm trained with container-style data answered all 20 held-out items of one book correctly, the result was attributed to the model using container commands and described as solving the book. The saved programs for those items do not use container commands, and all 20 items are instances of one plan. The attribution was used to extend the container idiom to two other books.

### I26 - The 379 to 440 gain from exp-014 to exp-016 was credited to the new declarative commands (graphPath, aggregate, fraction), though almost none of the gained items used them.

- **Component:** reporting
- **Entered:** 2026-09-24 11:50 +0200; commit 0758b3c9a ('the declarative wires win by measurement')
- **Detected:** 2026-09-28 (final audit, second round); article/audit/claim-ledger.md; article/evidence/early-series-verification.md
- **Detection route:** final audit
- **Consequence:** Design documentation and the earlier portfolio stated that the commands caused the gain and the collapse of procedural execution errors; the wire-vocabulary line of work (the declarative-wire directive, the abstraction loop) builds on this. The audit found that only the 40 graphPath programs used a new command, that this family was already 40 of 40 without it, and that the execution-error reduction (63 to 13) came from two census compositions whose programs used no new command.
- **Evidence:** `0758b3c9a`, `article/audit/claim-ledger.md (both tables)`, `article/evidence/early-series-verification.md`
- **Causal chain:** none
- **Neutral description (for coders):** Two arms trained on different data versions scored 379 and 440 of 705. The newer data version introduced three declarative commands, and the gain was credited to them. An item-level check shows the commands appear in few of the gained programs and that the reduction in failures came from items that do not use them.

### I27 - Checkpoint pruning deleted whole run directories, including the trainer's run-manifest. exp-014's training manifest is gone, and the training dates of pruned arms had to be estimated.

- **Component:** orchestration
- **Entered:** 2026-09-22 20:17 +0200 (first prune, 256 GiB) and 2026-09-24 morning (245 GiB); commit 9f09f0c77; 07aea7ada
- **Detected:** 2026-09-24 12:11-12:15 +0200; 0628968d8, 65776203c
  - later: 2026-09-28 final audit: 'missing exp-014 training manifest' (claim-ledger)
- **Detection route:** item-reading by the working thread
- **Consequence:** The identity backfill (65776203c) marked training finish times of pruned arms as approximate ('deduced from the series log'). In the audit, exp-014's base and recipe could not be verified from its trainer record, which weakened the exp-014 against exp-016 comparison. training/checkpoints/ now holds only exp-016 onward. AGENTS.md says the kept artifacts include 'every log, manifest'.
- **Evidence:** `9f09f0c77`, `07aea7ada`, `0628968d8`, `65776203c`, `article/audit/claim-ledger.md`, `article/evidence/experiment-map.md (exp-014 time 'approximate')`
- **Causal chain:** Compounds I03 (run identity reconstructed from mutable or missing records).
- **Neutral description (for coders):** To free disk space, the directories of finished experiments were deleted in full. The trainer wrote its run manifest (inputs, recipe, timestamps) into the same directory. Those manifests were lost with the checkpoints, and later identity records had to reconstruct them from logs.

### I28 - The owner-facing status file raspuns.md, and once the review file astra_review.md, disappeared from the working tree four times and were restored from git.

- **Component:** environment
- **Entered:** unknown (cause not recorded); commit unknown
- **Detected:** 2026-09-22 20:29 +0200; 2026-09-24 07:42; 2026-09-25 18:27; 2026-09-26 19:35; 67660974a, 07aea7ada, 64e75aff8, 1071430ac
- **Detection route:** operational failure
- **Consequence:** The owner's status record, and on 24 Sep the separate review, were missing from the tree until restored. The commits describe 'a stray working-tree state' and 'the flaky deletion'. No permanent loss is documented, because each file was restored from git.
- **Evidence:** `67660974a`, `07aea7ada`, `64e75aff8 ('raspuns.md was missing from the tree again')`, `1071430ac`
- **Causal chain:** none
- **Neutral description (for coders):** Several times, files that recorded status for the human lead, and once the review report, were found deleted from the working directory with no recorded cause. Each time they were restored from version control.

### I29 - The semantic summary table reported dv8's procedural exact score as 410/480; the correct count is 428/480.

- **Component:** reporting
- **Entered:** 2026-09-26 19:34 +0200; commit fa913ac88 (summary.md per-book table)
- **Detected:** 2026-09-28 (final audit); article/audit/claim-ledger.md
- **Detection route:** final audit
- **Consequence:** A wrong exact count (410 instead of 428) and a derived '410->430' rescue figure in summary.md. 410 is dv9's procedural count, so the value appears copied from the neighbouring row. No decision depended on it.
- **Evidence:** `summary.md (Per-book semantic table)`, `article/audit/claim-ledger.md`
- **Causal chain:** Part of the I20 table.
- **Neutral description (for coders):** A per-book table of exact and re-judged scores listed a wrong exact count for one arm on one book. The value matches another arm's count in the same table.

### I30 - The plan inventory reported 941 plans over 8,015 rows; 941 includes the 265 held-out circuits, and the export itself holds 924 plans.

- **Component:** reporting
- **Entered:** 2026-09-22 19:20 +0200; commit 8d3050346
- **Detected:** 2026-09-28 (final audit, second round); article/audit/claim-ledger.md
- **Detection route:** final audit
- **Consequence:** A miscounted figure in the plan-inventory finding that motivated exp-011-compositions. The distributional conclusion (1.7 to 100 rows per plan) is not reported as changed. The manuscripts do not use the number.
- **Evidence:** `8d3050346`, `evaluation/registry/phase4-analysis.md (plan inventory)`, `article/audit/claim-ledger.md`
- **Causal chain:** none
- **Neutral description (for coders):** A count of distinct plans in the training export mixed in the plans of the held-out circuits. The reported total was therefore larger than the number of plans the model was trained on.

### I31 - The plan-unseen validation score was reported as 12.5-25% for every checkpoint; across 72 checkpoints it is 1 to 4 of 16, with 12 checkpoints at 1 of 16.

- **Component:** reporting
- **Entered:** 2026-09-22 20:04 +0200 ('plan-unseen plateau of 12.5-25.0%'), carried into the article's hypotheses chapter; commit f2dacb603; 922debb52 docs/article/03-hypotheses.md
- **Detected:** 2026-09-28 (final audit, second round); article/audit/claim-ledger.md
- **Detection route:** final audit
- **Consequence:** This was the stated comparison baseline for exp-011 and the article's 'stable ladder' claim. The lower bound was overstated: 6.25% (1 of 16) occurs at 12 checkpoints.
- **Evidence:** `f2dacb603`, `922debb52 docs/article/03-hypotheses.md`, `article/audit/claim-ledger.md`
- **Causal chain:** none
- **Neutral description (for coders):** A range observed on selected winner checkpoints was generalized to all checkpoints. The full set of selection records contains lower values.

### I32 - During the 20-item solver test (agent-eval), the solver agent began reading the reference solutions from disk.

- **Component:** evaluation
- **Entered:** 2026-09-26 ~18:53-19:02 +0200; commit cc595dc37 (slice); 52249feb7 (result)
- **Detected:** 2026-09-26, during the run (exact time not recorded); evaluation/registry/agent-eval/verify.mjs (copy detector: 'VOID (identical to shipped solution)'); narrative in 922debb52 docs/article/05-discussion.md mistake 5
- **Detection route:** item-reading by the working thread - Evidence is a single narrative record plus the copy detector in verify.mjs; no commit message records the event.
- **Consequence:** Latent: had it gone uncaught, the solver test that triggered the stop rule and the comparator conclusion (I19) would have contained copied reference solutions. The solver was steered away and a copy detector voids any solution identical to the shipped one.
- **Evidence:** `922debb52 docs/article/05-discussion.md (item 5)`, `evaluation/registry/agent-eval/verify.mjs`, `52249feb7`
- **Causal chain:** Would have contaminated the detection of I19.
- **Neutral description (for coders):** A sub-agent was asked to write reference circuits for 20 held-out problems without seeing the answers, to check the benchmark. It started opening the repository's stored solutions for those problems. This was noticed, the agent was redirected, and a check was added that voids any submitted solution identical to the stored one.

## Merged candidates

| Candidate | Source | Incident |
| --- | --- | --- |
| R1 | a | I06 |
| R2 | a | I01 |
| R3 | a | I02 |
| R4 | a | I03 |
| R6 | a | I04 |
| R7 | a | I07 |
| R9 | a | I05 |
| Review 2: data version attributed from disk state at scoring time | a | I03 |
| Review 2: manual-start gate blocked by a stale selection line | a | I15 |
| 17243a362 | b | I22 |
| c6d508b95 | b | I22 |
| d194b23a3 | b | I16 |
| bfed5dc31 | b | I16 |
| 176b8a38a | b | I03 |
| 2225e9b7c | b | I12 |
| f2dacb603 | b | I09 |
| ec8d7fff4 | b | I08 |
| f1a51479c | b | I08 |
| 3bdb0eb07 | b | I04, I05 |
| 415da76ce | b | I02 |
| 0cdc4588c | b | I06, I01 |
| Ledger T1: specialized-wire comparison (missing exp-014 training manifest) | c | I27 |
| Ledger T1: direct use explains the entire gain | c | I26 |
| Ledger T1: a small model beats a 17B model | c | I18 |
| Ledger T1: a 77.2% semantic total is reconstructable | c | I20 |
| Ledger T1: four judge files establish inter-rater validation | c | I20 |
| Ledger T1: containers caused coalition success | c | I25 |
| Ledger T1: a whole reasoning book was solved | c | I25 |
| Ledger T1: dv7 and dv13 are the same test | c | I23 |
| Ledger T1: the 0.5B result establishes a universal size floor | c | I24 |
| Ledger T1: the nominal holdout is pristine confirmation | c | I07 |
| Ledger T1: dependency-join semantic success is 66/100 | c | I20 |
| Ledger T1: dv8 has 410/480 procedural exact matches | c | I29 |
| Ledger T2: declarative commands caused the 379 to 440 gain | c | I26 |
| Ledger T2: only exp-014 trained on units-and-rates | c | I21 |
| Ledger T2: plan inventory holds 941 plans over 8,015 rows | c | I30 |
| Ledger T2: every checkpoint scores 12.5-25% on untrained plans | c | I31 |
| Ledger T2: dv12 common-sense execution errors come from copied integer guards | c | I21 |
| Baseline audit: Qwen3 base record has 322 of 705 missing completions | c | I17 |
| AGENTS.md Disk discipline: the night of 23 Sep lost to a full disk | d | I14 |
| AGENTS.md Launch discipline: stale 'series done' line | d | I15 |
| AGENTS.md stall sentinel: restart loop pinned exp-016 at step 301 | d | I16 |
| phase4-analysis D-H traceability defect | d | I03 |
| phase4-analysis oracle-assisted conditions are not a clean instrument | d | I08 |
| phase4-analysis first retry-sweep bug | d | I10 |
| phase4-analysis owner's correction: bases asked for compiled plans | d | I11 |
| phase4-analysis D-B / D-K substrate-loss reading | d | I04 |
| phase4-analysis D-K budget confound (747 against 681 steps) | d | I04 |
| raspuns.md / summary.md semantic re-evaluation (77.2%) | d | I20 |
| raspuns.md / common-sense-cause.md cause diagnosis | d | I21 |
| raspuns.md world-regression diagnosis (first pass) | d | I22 |
| raspuns.md / summary.md 'qwen3-17b' identity | d | I18 |
| raspuns.md / summary.md 0.5B size floor | d | I24 |
| proposal.md / 52249feb7 exact-phrase comparator on the stuck books | d | I19 |
| raspuns.md history: status and review files deleted from the working tree | d | I28 |
| 790b56e71: operational scripts in /tmp wiped by a machine reset | d | I13 |
| raspuns.md history (d194b23a3): cache bloat and memory-guard restart loop of exp-024 | d | I16 |
| c1884d6e4: exp-009 selection scored by a leftover server | d | I01 |
| e3d0dd437 / 31622c395: duplicate evaluation chains on the night of 21 Sep | d | I02 |
| Adversarial review C5: exp-014 training manifest not retained | d | I27 |
| Article 'six mistakes' #5: the agent-eval solver read the answers off disk | d | I32 |
| Article 'six mistakes' #6: the automatic judge never produced a verdict | d | I20 |
| overnight-pipeline.log: shootout gate 'no candidate base cleared'; exp-017 launched by a hand-written tail | d | I17 |
| Article 'six mistakes' #2: orchestrator misdiagnosed the world drop as distribution shift | d | I22 |

## Excluded candidates

| Candidate | Source | Reason |
| --- | --- | --- |
| R5 (review 1): chat CLI fails before processing any option (parseArguments undefined) | a | Loud crash of an interactive tool; no measurement, conclusion or launch depended on it. Fixed in 0cdc4588c. |
| R8 (review 1): preservation transformer rewrites $name inside strings, comments and regexes | a | Latent: the review executed all 758 committed preservation targets and found 758 matches, 0 mismatches. No affected artifact. No remediation commit found. |
| Review 2: chat lanes classified by pinned repo path (the 0.5B manifest path carries no size) | a | Label shown in the interactive chat only. No record that a written conclusion or measurement used it. |
| Review 2: second student slot showed the newest winner outside the 0.5B class | a | Same as above: interactive chat display only. |
| Review 2: score reuse not bound to the exact slice identity (introduced 666f096f8, 25 Sep 09:50) | a | Reuse happened within one arm on the same 339-row validation slice. No record shows a selection that reused a score from a different slice; fixed about 3 hours after introduction. |
| Review 2: resume-series.sh did not queue the chain after the trainer stops | a | No recorded consequence on a launch, artifact or result. |
| Review 2: early-stop wrapper gave the final pass too little time (now up to 30 minutes) | a | No recorded consequence on a launch, artifact or result. |
| Review 2: early-stop final pass did not wait for fresh saves to settle | a | No recorded wrongly scored checkpoint. |
| 5a3f30cbb Revert the dv8 over-split | b | Reverts a data design that its own experiment measured as worse (448/705 against 460/705). Not a defect. |
| 3f80574f3 Revert the dv9 zero-book tranche | b | Reverts a measured-negative data version. The design decision behind dv9 is recorded as a consequence of I25; the revert itself is not a defect. |
| 83ef6212f The structure experiment ... everything else fixed | b | Keyword false positive ('fixed' means 'held constant'). |
| 2a09689f0 Fix the selection script: ranked must stay in the outer scope | b | ReferenceError made the chain die three times and the watchdog restart it. The effect was delay only; no wrong result or artifact. |
| b1ff55943 Fix the pgrep double-zero count bug in the health check | b | Wrong count in the health-check display. No recorded consequence. |
| 571a0f3b9 The session sentinel ... speaks only when something is wrong | b | Keyword false positive; new feature. |
| 0d7c0cb5a ... fix the pin path in the download script | b | Download-script path error fixed before any run depended on it. |
| 2dce6c6c1 Handoff records ... the two probe defects | b | Records the same two defects as 94d1b7a44; see those exclusions (d-candidates on the provenance probe and the eval-only demo words). |
| 94d1b7a44 raspuns.md records ... the two defects it exposed | b | (1) The provenance probe flagged a correct distinct-letter circuit as a stored answer. The verification gate rejected it loudly before any export. (2) The eval-only demo words (raspberry, strawberry) appeared in training rows. This affected only informal chat demonstrations; no recorded benchmark item used those words. |
| 1e36fa3f3 ... the trainer fix that made the preservation mixture runnable (build_manifest read undefined names) | b | Loud crash before the exp-009 run; delay only. |
| 243f4b317 watchdog.sh ... queue relaunched with self-excluding pgrep patterns so it cannot wait on itself | b | The exp-008 queue waited on itself: delay only. The duplicate-chain problem that followed is covered by I02. |
| 1bb9462ea Adaptation measurement recorded ... wrong answers (97) | b | Keyword false positive; a measurement report. |
| 4a18bed97 todo: ... correcting the previous commit's size-check claim | b | Correction of a commit-message remark about an informational file-size check. Cosmetic. |
| Ledger T1: ten arms contain 7,050 item records | c | Claim reproduced by the audit; no defect. |
| Ledger T1: original normalized exact outcomes reproduce | c | Claim reproduced; no defect. |
| Ledger T1: syntax and graph stages pass (705/705) | c | Claim reproduced; no defect. |
| Ledger T1: procedural execution errors decline 63/480 to 13/480 | c | Claim reproduced; no defect. Its attribution to the new commands is I26. |
| Ledger T1: more target wires improve results | c | A hypothesis that the programme's own dv8 experiment refuted (448 against 460/705) and reported as refuted. Not a defect. |
| Ledger T1: the runtime is formally verified | c | Prose description of the verification status. No measurement, launch or design decision depended on it. |
| Ledger T1: solver integration is measured | c | The programme's records (922debb52 docs/article/01-introduction.md, 05-discussion.md) call it 'an unproven hypothesis'. The unsupported form did not originate in the programme records. |
| Ledger T2: the 0.5B first-exposure failures were correct computations killed by a copied whole-number assertion | c | The ledger calls it 'a hypothesis during drafting'. It arose and was refuted inside the 28 September audit, after the window. |
| Ledger T2: a competent solver computed 'about 18 of 20' items correctly (revised to 20 of 20) | c | The original was labelled an estimate at the time. The revision strengthens rather than changes the conclusion (52249feb7). |
| Ledger T2: the two book items solved by the 0.5B and 1.5B census arms are the same | c | Descriptive detail (one of the two was shared). No conclusion depended on it. |
| Ledger T2: reserved compositions have depths three to five | c | Descriptive detail (actual depths: three and four). No conclusion depended on it. |
| Baseline audit: the earlier portfolio's blanket statement that no direct-answer baseline existed | c | Arose in portfolio drafting after the programme window and was corrected within the same audit. The programme records contain the baselines (215eed190). |
| Baseline audit: prose and compiled workflows differ in prompt, representation, execution and token budget (512 against 2,048) | c | The audit discloses this as a design limitation of a comparison. No record shows a conclusion that turned on the budget difference. |
| proposal.md stop rule (18:55, revised 19:02, 26 Sep) overridden by the 20:37 pivot (dv13 at 21:01; exp-026 created 19:03Z) | d | A governance decision, not a pipeline or interpretation defect. It is recorded as a consequence inside the I18/I20 causal chain because the pivot rested on those misreadings. |
| Provenance probe could not change string content (raspuns.md 22 Sep 18:00Z) | d | The verification gate caught it before any export (it 'screamed' instead of passing silently). |
| Eval-only demo words in training rows (raspuns.md 22 Sep 18:00Z) | d | Affected only informal chat demonstrations; 0 of 8,015 rows mention them after the fix, and no benchmark item used them. |
| Article 'six mistakes' #1: a refactor agent turned a family's answer into a hard-coded literal | d | Caught by the verification gate before any training (45c7b4276: 'the verify gate caught the stored-text version before any training'). |
| Article 'six mistakes' #3: a phrase-compression agent proposed an impossible change | d | Caught by a scope correction before the edit landed; no effect. |
| Article 'six mistakes' #4: a statement-simplification agent assumed the wrong source file | d | Caught by a scope question before editing; no effect. |
| Adversarial review C1: '7,050 labels reproduced' presented as re-execution | d | A claim of the 28 September manuscripts, after the programme window. It belongs to the audit of the manuscripts, not to the programme. |
