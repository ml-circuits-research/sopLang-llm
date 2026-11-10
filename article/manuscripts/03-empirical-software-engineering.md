# Where errors entered, and what found them: incidents in an agent-operated machine-learning research pipeline

## Abstract

Coding agents can now build and operate much of the software of a machine-learning study, from data generators to the reports that interpret results. Software engineering has catalogued faults in machine-learning code, but little is known about where errors enter when agents also run the pipeline and draw its conclusions, or about which checks find them. We report a retrospective case study of a ten-day research programme in which coding agents built and operated most of a pipeline for fine-tuning small language models under a human research lead. From version history, run records, agent reviews and a post-programme audit, we registered the incidents that changed, or would have changed, a conclusion, decision, launch or artifact. Two agent sessions coded them with a fixed codebook; an independent human coding is pending. The saved evaluation records reproduced exactly; the errors lay in what was computed, how outputs were read, and how the pipeline was run. Detection followed what each checking process examined. Code defects and environment failures were all detected during the programme, by breakage, by reading records or by review. Errors of inference and reporting broke nothing; after an early review, no process checked claims until a final audit, which found almost all of them. The active test suite first detected none of the incidents. Advisory warnings to a person were logged beside the actions they should have stopped; blocking gates held. Agent-run pipelines need claims checked before they enter a plan, and guards that block rather than advise.

Keywords: LLM-based coding agents; incident analysis; software engineering for machine learning; test oracle; research software; case study

## 1. Introduction

Coding agents can now write and operate most of the software of a machine-learning study: the data generators, the training launchers, the evaluation harness, and the notes and drafts that say what the numbers mean. Some systems aim to automate the whole research loop [@aiscientist]. When such a pipeline produces a wrong conclusion, whoever relies on it needs to know where the error entered and what could have found it.

Software engineering has studied the faults of machine-learning code [@dlbugs; @dlfaulttaxonomy], the teams that build machine-learning systems [@amershi; @mlcollaboration] and how such systems are tested [@mltestscore; @mltestingsurvey], and it has argued that much of their risk lies outside the model code [@techdebt]. These studies concern code written, and outputs interpreted, by people. Studies of coding agents judge the code the agents write [@swebench; @agenticprs]. Neither asks where errors enter when agents also run the experiments and write the conclusions, so that an error can lie not in code but in what an output is taken to mean.

We examine one such pipeline through its records: a ten-day programme in which coding agents did most of the work of fine-tuning small language models under one human research lead. We registered its consequential incidents and asked which process first detected each, and found that detection followed what each process examined. Code defects and environment failures were found while the programme ran, by breakage, by reading records or by review; errors of inference and reporting broke nothing, no process examined claims after an early review, and they survived until a final audit did.

We ask three questions:
- RQ1: What kinds of defect produced the consequential incidents?
- RQ2: Which processes detected each kind, and what did each process examine?
- RQ3: What checks does the case suggest for each kind, and what does it show about the checks that existed?

Our contributions are:
- a register of the 32 consequential incidents of one agent-operated programme, with dates, detection routes and evidence pointers (Appendix A, Table 6);
- a four-category codebook applied by two agent coders, with a pre-specified protocol for the human coding in progress;
- a coverage analysis of which processes found which kinds of error;
- checks for each kind, with what the case shows about the checks that existed, and a follow-up that applied two of them to later work.

Two companion manuscripts use the same programme, one for its learning results and one for the identity error of Section 5.4 as a question of research accountability. Neither contains the register or its analysis.

## 2. Background and related work

**Machine-learning engineering.** Sculley and colleagues argued that machine-learning systems accumulate hidden technical debt outside the model code [@techdebt]. Amershi and colleagues found that data management and entangled components set machine-learning work apart from conventional software engineering [@amershi], and Nahar and colleagues traced the collaboration problems of such teams to communication, documentation, engineering and process [@mlcollaboration]. Zhang and colleagues surveyed machine-learning testing and its oracle problem [@mltestingsurvey].

**Faults in machine-learning software.** Empirical studies classify the faults of deep-learning programs from repositories, forum posts and interviews [@dlbugs; @dlfaulttaxonomy]; their units are faults that a change to the program, the model or its data removes. Our register adds a unit that leaves no trace in code: an output taken to mean something it does not. We use the fault, error and failure vocabulary of dependable computing loosely [@dependability]; in our category names, "error" means a mistake by a person or an agent.

**Research software.** In one large comparison, independently written seismic-processing packages given the same data disagreed, increasingly with code size [@scisoftaccuracy], and the gap between software engineering and scientific programming threatens reliable results [@scisoftchasm]. Published AI studies rarely document what reproduction needs [@gundersen], and leakage makes evaluations overoptimistic [@kapoor].

**Test oracles.** A comparator that decides whether an answer matches a reference is a test oracle, and deciding the correct output is the oracle problem [@testoracle]. Metamorphic testing checks relations that must hold between the outputs of related inputs [@metamorphictesting].

**Agents and agent judgement.** Coding agents are evaluated on resolving real repository issues [@swebench; @sweagent], and in one study of open-source projects most pull requests made with a coding agent were merged, many after human revision [@agenticprs]. Failures of multi-agent systems include failures of task verification [@masfailures]. Language models can replace some human annotation of software artifacts [@llmannotators], and model judges carry measurable biases [@llmjudge], which bears on our agent coders and judges.

**Method.** Incident registers descend from the critical incident technique, which collects observed incidents meeting defined criteria [@criticalincident]. We follow case-study guidance for software engineering [@runeson; @empiricalstandards] and, for guards addressed to people, studies of automation [@ironiesautomation; @automationbias].

## 3. The pipeline studied

### 3.1 Research goal

The programme fine-tuned small open code models, from 0.5 to 1.7 billion parameters, to translate word problems into programs in SOP Lang, a small dataflow language, rather than to answer them directly. A SOP Lang program declares named computations called wires. A wire's body can refer to another wire's value with `$name`, and those references define the execution order. A runtime executes the program and returns the requested value:

```sop
@slots literal
{"packs": 3, "perPack": 4}

@answer jsEval
return $slots.packs * $slots.perPack;
```

Here the model must extract the quantities into `slots` and choose the operation in `answer`; the runtime performs the arithmetic and returns 12.

### 3.2 Components and terms

Coding agents wrote and maintained six components: data generators, which turned seven books of reasoning exercises and procedural generators into verified problem families; export and training, which recorded a manifest per run; orchestration, which launched, watched and chained runs detached from interactive sessions and pruned checkpoints; evaluation, which executed a generated program for each held-out problem and classified the outcome as a parse failure, graph failure, execution error, answer mismatch or match; diagnostics such as capability probes; and reporting, from run reports to drafts. About 25 training runs and 240 commits fall between 18 and 27 September 2026 (day 1 is 18 September).

The comparator decides whether a program's executed answer matches the reference answer. An evaluation chain converts a run's checkpoints, selects one and evaluates it; a watcher waits for a chain to finish and starts the next step. A probe is a short capability test, and the export is the trainer's view of the dataset. A book is a source of exercises, and a family one problem type within it. The working thread is the set of agent sessions doing the main work, as distinct from review sessions.

### 3.3 Who did what

One human research lead, an author, chose the questions, approved training designs and set the aims, following the work mainly through a status file written partly in Romanian. Coding agents wrote the software, ran and watched the runs, and wrote the notes, analysis log and drafts, often several in parallel (the plan of day 9 split data repair and an article rewrite between two agents). [AUTHORS: name the tool and model of the working-thread sessions; the records we hold do not identify them.] All commits carry the lead's git identity, so we attribute an act to an agent or to the lead only where a record says so.

The first review was a Codex CLI session using the model gpt-6-astra, which the handoff file calls "the external review"; the second survives only in a commit message that does not name its agent. The final audit ran in two rounds on 28 September, first in a Codex CLI session (gpt-6-astra), then in Claude Opus 5.5 sessions. Claude Opus 5.5 sessions directed by the authors also compiled the register, wrote its codebook, coded and adjudicated, and judged answers in the follow-up of Section 5.7.

## 4. Method

### 4.1 Design and data

This is an exploratory single-case study [@runeson]: one pipeline in its real context, studied after the fact. The case is the programme and the unit of analysis the incident. We chose it because its records are nearly complete and it can be studied from its own history; it was also available to us, since the authors directed it. The sources are the version history, run manifests, per-item evaluation records, the analysis log, status notes and operational logs, the two reviews (days 5 and 8), and the final audit (28 September), which recomputed reported numbers from item records and resolved model identities from manifests. Pruning deleted one run's training manifest (I27), the second review's report was not kept, and the working thread left no transcripts among the records we hold.

### 4.2 Screening and inclusion

Candidates came from the four sources of Table 1; the commit screen searched subject lines for the terms fix, correct, bug, wrong, defect, repair, revert, remediation, mistake and stale. An incident is a defect in the pipeline or in the interpretation of its outputs that changed, or if not caught would have changed, a written conclusion, a design decision, a launch, a deleted or corrupted artifact, or a reported measurement. We merged candidates describing the same defect and excluded, with a recorded reason, delay-only failures, defects caught by a test or verification gate before use, cosmetic slips, governance decisions, and claims first made after the programme. One governance decision, the lapse of a stop rule, appears in Section 5.5 because it links two incidents to the runs that followed.

Table 1 shows what each source contributed.

Table 1. Screening of candidate incidents.

| Source | Candidates | Mapped to an incident | Excluded |
| --- | --- | --- | --- |
| Findings of the two separate reviews | 17 | 9 | 8 |
| Commits whose subject line matches a correction term (of 240) | 25 | 12 | 13 |
| Rows of the final audit's correction ledger and baseline audit | 31 | 18 | 13 |
| Operational rules, analysis log, status notes, logs | 32 | 25 | 7 |
| Total | 105 | 64 | 41 |

The 64 mapped candidates merge into 32 incidents: 15 rest on one source (six of them only on the audit's own ledger), 13 on two and 4 on three. Twenty-six had a realised consequence; four are latent or showed no demonstrated effect (I05, I06, I09, I32), and two changed only a reported number on which nothing depended (I29, I30). Because the commit screen matched subject lines only, 45 commits that match a term only in the message body were not screened (Section 6.4). We report counts: the register is a census of one programme, and percentages would suggest a rate that a single case cannot estimate.

### 4.3 Dating

Entry is the first record that shows the defect affecting a record, decision or artifact; detection is the first record that shows awareness of it. Times are local (UTC+2). We compute the time from entry to detection only for detections during the programme where both are recorded; the audit's detections are dated to the audit, so their distance from entry measures when an error entered. A script in the replication package implements these rules; lags stored with the coding predate them and differ for eight incidents.

### 4.4 Coding

The codebook has four categories. In a code defect (C), the code does not do what its own specification or evident intent says. In a representation error (R), the code works as specified, but one artifact is taken as evidence of something it does not represent; a seam names the relation that fails: name → identity, score → construct, intervention → distribution, record → state, or population → population. In an inference or reporting error (I), the evidence was represented correctly, but the stated conclusion goes beyond it or miscounts it. An environment failure (E) is a resource or platform failure outside the project's code. When an incident fits two categories, the codebook assigns the one whose correction would have prevented it. The categories were derived inductively. The session that compiled the register assigned each incident its route and dates, which no one else checked, and wrote a neutral description of each; the analysing session wrote the codebook within two minutes of the register's completion, with examples drawn from these incidents.

Two Claude Opus 5.5 sessions coded all 32 incidents separately, instructed to read only the codebook and a file giving each incident's component, description and consequence. Their retained transcripts show that each read only those two files and returned within a minute. Neither saw the register's route, date or evidence fields, or the other coding, but the inputs carried information about the category: all three environment incidents were coded E, seven of the eight reporting incidents I, and for 6 of the 11 incidents the audit found, the consequence says so. The coders agreed on the category of 31 of 32 incidents (Cohen's κ = 0.96) and on category and seam for 30 (κ = 0.92). The analysing session resolved the two disagreements (I03, I07) by the codebook's rule within a minute, both in favour of the second coder, and recorded its reasons. The codings show that two sessions of one model apply the codebook consistently to the incidents it was written from; they are not independent human judgement.

### 4.5 Human coding protocol

The human coding follows a protocol fixed before it starts:
- A person who took no part in the programme or the analysis [AUTHORS: name or role] codes category, seam and route for all 32 incidents, blind to the agent codings and to this manuscript, from a sheet without component labels or sentences naming the detecting process.
- We report κ for category, for category and seam, and for route, against the final coding and each agent coder, with confusion matrices. If κ for category is below 0.6, we report both codings and treat the category-level findings as tentative.
- A second person [AUTHORS: name or role], not an agent session, adjudicates disagreements with recorded reasons.
- The same coder checks the 41 exclusion reasons, screens the 45 unscreened commits, and codes the follow-up defects of Section 5.7, which the codebook was not written from; new incidents enter the register and the tables are regenerated.

[PENDING: human coding. κ for category, for category and seam, and for route, against the final coding and against each agent coder, to be inserted here; confusion matrices in the replication package.]

## 5. Results

### 5.1 The item records were reproducible

We re-executed every saved program from the held-out evaluations of the 24 fine-tuned checkpoints and two quantised variants, 13,330 records in 26 evaluation runs, through the current evaluation code. Every outcome class and executed answer matched the recorded one. Generation was not re-run, and the diagnostic, adaptation and base-model runs were not re-executed. The code still had defects: a report misnamed its dataset snapshot (I03), and pruning deleted run manifests (I27). But each recorded outcome is what the pipeline computed from the saved program, so the errors below lie in what was computed, in how outputs were read, or in how the pipeline was run.

### 5.2 RQ1: kinds of defect

Table 2 answers RQ1: it gives the kinds of defect behind the 32 incidents.

Table 2. Incidents by category and seam, with examples (identifiers as in Table 6).

| Category | Seam | Incidents | Examples |
| --- | --- | --- | --- |
| Code defect | | 9 | Retry attempts after the first never executed (I10); demonstration selection read the hidden reference solution (I06) |
| Representation error | name → identity | 2 | A run labelled "17b" read as a 17B model (I18) |
| | score → construct | 4 | Exact-phrase mismatches read as wrong answers (I19) |
| | intervention → distribution | 1 | Assisted prompts outside the training distribution read as isolating a stage (I08) |
| | record → state | 2 | A "series done" line, also written by failed runs, read as completion (I15) |
| | population → population | 2 | A changed held-out set compared across versions (I23) |
| Inference or reporting error | | 9 | A comparison across model families reported as a "size floor" (I24) |
| Environment failure | | 3 | The disk filled during a checkpoint save (I14) |

Twenty of the 32 incidents were errors in what an output was taken to mean (11) or in the conclusion drawn from it (9). Incidents occurred in all six components, most in evaluation (10) and reporting (8); three more were environment failures, one of which (I28) has no recorded cause and was coded E by default, though a stray operation by one of several agents sharing the working tree is as plausible. Agent conduct, such as an agent reading stored reference answers (I32), has no category of its own and was coded as a code defect.

### 5.3 RQ2: which processes detected which kinds

Table 3 shows which process first detected each kind of incident, and what each process examined.

Table 3. First detection by process and category (32 incidents).

| First detected by | What it examined | Code defect | Representation error | Inference or reporting | Environment |
| --- | --- | --- | --- | --- | --- |
| Reading records (working thread) | Logs and item records | 5 | 4 | 1 | 0 |
| Operational failure | Whatever broke | 2 | 2 | 0 | 3 |
| Separate reviews, days 5 and 8 | Code, plumbing and experiment evidence (day 5); scripts (day 8) | 2 | 2 | 0 | 0 |
| Final audit, after the programme | Claims headed for the manuscripts, against item records | 0 | 3 | 8 | 0 |
| Test suite | Specified behaviour | 0 | 0 | 0 | 0 |
| Detected during the programme | | 9 of 9 | 8 of 11 | 1 of 9 | 3 of 3 |

The table is a coverage map, because the processes examined different things. All code defects and environment failures, and most representation errors, were detected during the programme; one of the nine inference and reporting errors was. No process was charged with checking claims between the first review, on the morning of day 5, and the audit, and all nine inference and reporting errors entered in that interval. The first review, which read experiment evidence as well as code, first detected four incidents; the second, which read scripts, none. One detection by reading records (I11) was the lead's; the records do not attribute the others.

Every dated detection during the programme came within 40 hours of entry, after a median of about 6 hours for code defects (7 dated) and 14 hours for representation errors (5 dated). The one inference error found during the programme, a drop on one book diagnosed as a regression and then as a distribution shift, fell when the working thread read the fifteen failing answers: they differed from the reference only in punctuation (I22). The summary file was never corrected. Restricted to the 26 incidents with a realised consequence, the audit still found six of the seven remaining inference and reporting errors, and no code defect or environment failure.

No incident was first detected by the test suite, although it ran throughout (289 tests on day 5, 382 by day 9) and twice stopped the pipeline after a dataset rebuild (Table 4). The zero is partly definitional, since the inclusion rule excludes defects caught by a test before use. It does not show that tests could not have caught the code defects: at least four of the nine (I05, I06, I10, I27) break an intent that a unit test can state, and the fix for I06 added exactly such a test. In the representation and inference errors, the code did what it was written to do, so no test of the code as specified could have failed.

### 5.4 Three cases

**The comparator.** Answers to book problems were compared with the book's reference answers as normalised strings. The first run that could compute the scheduling family was evaluated on the evening of day 8; a parser written afterwards finds the right duration and verdict in 64 of its 100 scheduling answers, and exact comparison accepted none. Nine and a half hours later, a reading of a later run's records found that 38 of its 64 mismatched scheduling answers stated the reference number, some as counts rather than durations; the programme changed references and training targets, not the comparator. Fifteen hours after that, an agent wrote programs for twenty problems of the two stuck books without being given the answers (it began to open stored reference files and was stopped, I32); the comparator passed 2, and the audit judged all twenty right in value and verdict. The comparator did what it was written to do; the defect lay in what its output was taken to mean, and reading items found it twice. Not every zero was the comparator's: in the three runs that targeted the stuck books with new data, 47% of the 300 scheduling programs failed to execute, and the parser accepted 19% of the answers (54 of its 56 in one run), with 8% more right in wording it does not accept.

**The model identity.** A pipeline script named a run "17b", the base model's name without its decimal point, before the base had been chosen (I18). The run's manifest, a roster and an article draft recorded it correctly as 1.7B, and that draft's commit records that a drafting pass had written "17B" and been caught. On day 9 a status note read the label as a 17B model, a training run was built on that reading, and an article rewrite replaced the correct label. The audit found the error by printing each identity from manifest contents. Correcting one instance did not stop the next.

**The assisted diagnostic.** The first review proposed asking the same problems four ways (the statement alone, with the correct extracted values, with the correct operation plan, and with both) and warned that if no condition helped, the prompt should be inspected before any conclusion about the model. On 60 problems the four conditions scored 8, 9, 8 and 10. The analysis concluded that the difficulty lay in adapting a remembered plan, which shaped the next training run. Nine hours later a follow-up on another suite and model found the instrument faulty (I08): the assisted conditions scored worse than the statement alone (3 against 23 of 48 with values supplied), and in none of 24 problem pairs did an assisted condition produce the same program as the plain one, since the appended text used wording absent from training. Rewriting it in training notation recovered only part of the gap (8 against 12 of 24). The record kept the weaker conclusion, that supplying values bought little, and withdrew the claim that the conditions isolate a stage. Irrelevant formatting changes can move model performance substantially [@sclar]; adding information to a prompt changes its distribution as well as its content.

### 5.5 Cascades, and messages addressed to a person

**The night of day 6.** A machine reset had wiped operational scripts kept in /tmp (I13), and they were rewritten into the repository. That night the trainer's memory guard, trusting a free-memory figure that excluded reclaimable cache, stopped a run at step 160 (I16), and the forced save met a disk filled by downloads and checkpoints (I14). The rewritten disk guard, with thresholds below the size of one save, warned and tried to stop the trainer but not the downloads. The failed evaluation chain still wrote "series done"; at 23:45 the pipeline read that line as completion and started a base-model comparison (I15), in which 322 of 705 requests to the eventual choice returned no completion (I17). The next morning a watcher read the line again, launched the next run beside the resumed one, and pruned the resumed run's checkpoints.

**Days 9 and 10.** In the hour or so before the programme changed its aim from an accuracy target to a comparative claim, the comparator problem and the identity error were joined by an unrecorded re-scoring of all models (I20) and a mistaken diagnosis of one book's zeros (I21). A stop rule written that evening required a comparator re-test before further training. No record shows it being lifted, yet a training run on a new data version started within half an hour of the change of aim, and the re-test never ran.

Table 4 answers whether the six messages addressed to a person in the pipeline log stopped the automation.

Table 4. Messages addressed to a person in the pipeline log (local time).

| When | Message | Kind | What followed |
| --- | --- | --- | --- |
| Day 7, 00:22 | "NOT training — a human decides" (selection gate) | Blocking | No training; next morning a launch script chose the base anyway, with no recorded review |
| Day 7, 07:40 | "chain closed WITHOUT metrics — a human must look" (watcher) | Advisory | The next run launched in the same second |
| Day 7, 07:45 | The same, from a second watcher | Advisory | The resumed run's checkpoints pruned one second later |
| Day 7, 10:24 | "CHAIN FAILURE ... a human must look" (sentinel) | Advisory | A false alarm; the sentinel exited, stopping the queue until it was re-armed an hour later |
| Day 7, 17:41 | "TEST SUITE FAILED after the ... rebuild; stopping for a human" | Blocking | Stopped; relaunched after the tests' pinned dataset counts were updated |
| Day 8, 13:18 | The same, after the next rebuild | Blocking | Stopped; the run was not launched, by the lead's recorded decision |

In the watcher's code the warning does not change the control flow, and both warnings were logged within five minutes of the morning report's commit: the failure was not that nobody was awake but that nobody could act in time. A stall sentinel added that morning raised six alarms over the next two days, addressed to "a human or an agent"; we did not trace what followed them.

### 5.6 RQ3: checks per kind, and how the existing ones performed

Table 5 answers RQ3: the check the case suggests for each kind of defect, and what it shows about the checks that existed.

Table 5. Checks by kind of defect, with the observed behaviour of the checks that existed.

| Kind | Check | What the case shows |
| --- | --- | --- |
| Code defect | Unit tests of the intended behaviour of scorers, selectors and pruning; a separate review; reading records from each new run | All nine detected during the programme, the dated ones within 40 hours; one fix added the test that would have caught its defect |
| Name → identity | Generate model references from the manifest and block reports that disagree | Recorded correctly three times and one misreading caught before commit; the next survived to the audit. No blocking check existed |
| Score → construct | Test the comparator on a competent solver's answers; score at more than one level; judge with two blind judges, calibration items and retained verdicts | The solver test confirmed the problem fifteen hours after records flagged it; three-level scoring later changed a conclusion (Section 5.7) |
| Intervention → distribution | Show that a content-neutral intervention leaves outputs unchanged before interpreting it (a metamorphic relation) | The assisted conditions changed every program, which was measurable at once |
| Record → state | Result artifacts, not log lines, as completion signals; runs bound to hashed inputs | Adopted after the cascade, in which the log line had already caused a deletion and a second trainer |
| Population → population | Diff item identifiers, references and programs before comparing evaluations; count missing responses separately | Both found only by the audit; in the follow-up, counting shared identifiers found unpaired samples |
| Inference or reporting | A separate pass told to find reasons each headline is false, from item records, before the claim enters a plan | The audit found eight of nine, after the programme; an earlier pass is untested here |
| Environment | Preflight gates on disk and concurrent jobs, with thresholds above the largest write, that also stop downloads | The disk guard fired too late and did not stop downloads; it was strengthened afterwards |
| Any guard | Block the automated action; hand a person the evidence for a recorded decision | Three blocking gates held; two advisory messages were followed within a second by the actions they warned about |

### 5.7 A follow-up: two checks applied to later work

After the programme we applied two checks from Table 5 to evaluation-only comparisons on the same pipeline, reported in the companion manuscript on learning results: every answer was scored at three levels, and item identifiers were compared before any comparison across wordings. The levels were exact; strict value, a deterministic check of the last number stated and of any verdict; and semantic, exact or accepted by both of two blind judges, Claude Opus 5.5 sessions shown only the statement, the reference answer and the candidate answer, with every verdict retained. The judges disagreed on 36 of 2,073 pairs (κ = 0.97) and accepted none of 24 injected answers known to be wrong. But these calibration items were clear-cut rather than the borderline wordings the judges mostly decided, one of four judging passes had none, and the judges share a model family with two of the systems they judged.

The scoring level changed one conclusion. On all 40 problems of a withheld stock-and-lead-time type, exact matching scored an untuned 1.7B model writing JavaScript and a fine-tuned 1.7B model equal, at zero; the strict check accepted 83% and 13% of their answers, the judges 60% and 5%. The strict check over-accepted answers that stated the right number of days with the wrong ordering decision. On 55 held-out compositions, exact matching put operator plans ahead of plain JavaScript by 80% to 16%; at the semantic level the figures were 89% and 73%, a gap that 55 problems cannot resolve.

The follow-up produced defects of its own. The first sample drew different items for each wording, because the seed hashed identifiers that carried a wording suffix; a fact-check that counted shared identifiers found it. The first batch design for two larger models, answering through agent sessions, put two wordings of a problem in one session; reading the design found it, since the answers stayed largely identical across wordings even in separate sessions. One session assembled its replies with a script, and its batch was discarded; full transcripts were not retained, but the orchestration records were, with each session's model, number of tool calls, last tool and instructions, so that audit can be re-checked in part. Later, comparing re-generated programs with those of the original evaluation showed that one test's items had lost each statement's final newline, a single byte that changed 8 of 15 programs of one fine-tuned run. In our reading these are two code defects, a population → population error, and agent conduct, which the codebook lacks. None was caught by a test; each was found by examining what an artifact represented.

## 6. Discussion

### 6.1 What the case shows

Detection followed what each process examined. Code defects and environment failures were detected during the programme by breakage, by reading records or by a review of the code, including latent ones. Errors of inference and reporting broke nothing: a size floor inferred across model families, or a gain credited to commands its items did not use, looked like a finished result and was carried into notes and drafts until a process examined claims against item records. After the first review, no process had that job while the programme ran. Fault taxonomies of machine-learning software classify what a code change can remove [@dlbugs; @dlfaulttaxonomy]; most of our incidents lay in what outputs were taken to mean or concluded. This extends the concern about entanglement and undeclared consumers [@techdebt] from code to claims: in an agent-run pipeline, a conclusion is consumed by the next plan, data change and draft, usually without being re-derived. The comparator is the oracle problem [@testoracle] in a research setting: an oracle that implements its specification exactly can still answer the wrong question.

### 6.2 Commission the doubt, early

The reviews and the audit first detected 15 of the 32 incidents, including eight of the nine inference and reporting errors. They differed from the working thread in their instruction, to doubt rather than to make progress, but also in timing, scope, hindsight and possibly model, and the case cannot separate these factors. The instruction is the factor a practitioner can set cheaply: the first review took about a quarter of an hour and first detected four incidents. Since each restatement of a claim adds confidence without adding a check, we recommend, untested here, that a questioning pass run before a claim enters a plan.

### 6.3 Guards must block

In Table 4 the blocking gates held, and the watcher's advisory warnings did not stop the actions they concerned. Automation leaves people the monitoring it cannot do itself [@ironiesautomation], and people under-attend to automated output [@automationbias]; a warning logged in the same second as the action leaves nothing to monitor. A blocking gate hands a decision to a person, and the decision is only as good as the evidence handed with it: after the selection gate declined to train, a launch script chose the base model anyway, on a comparison in which 322 of 705 requests had no completion, and no record shows who reviewed that choice. A guard should prevent the action it warns about, and a hand-off should carry the evidence for the decision and end in a dated record of it. Governance rules need the same property: the stop rule of Section 5.5 named no one who could lift it, and it lapsed when the aim changed.

### 6.4 Threats to validity

**Instrument and researcher bias.** The authors directed the programme and the analysis, and agent sessions compiled the register, wrote the codebook, coded and adjudicated, and performed the audit that supplied 31 of the 105 candidates. The coders and the analysing session were the same model, which also ran the audit's second round. The coders saw information that bears on the category, and one session alone assigned routes and dates. Until the human coding (Section 4.5) is reported, the category-level findings rest on agent judgement.

**Screening gap.** The 45 commits that match a correction term only in the message body were not screened. A preliminary reading by an agent session during this revision, not yet checked by a person, found that most concern registered incidents or would be excluded, but two bear on RQ2: one corrects from item records a success count reported the evening before the first review, and one records that a drafting pass on day 8 wrote the "17b" run as a 17B model and was caught before commit. Both would add in-programme detections of kinds the register shows as found late, so the gap biases the register towards our headline.

**Route scope and timing.** Table 3 describes coverage, not how detectable each kind is. Five of the nine inference and reporting errors entered on the programme's last two days, three within about an hour before the change of aim, and had little time to be found by anything but the audit. Only a claim check running during a programme can separate kind from coverage.

**Construct validity.** The inclusion rule depends on documented consequences, so the count is a lower bound; "would have changed" is judged after the fact for four incidents, and two more changed only numbers nothing depended on. Fifteen incidents rest on a single source.

**External validity and reliability.** This is one pipeline, one lead and a few agent models over ten days; we make no claim about frequency elsewhere or about human-built pipelines. Another team might screen, date or classify differently, although the dating rules are scripted. The checks in Table 5 were derived from the incidents they would catch, so their value elsewhere is a hypothesis, which Section 5.7 tests once.

## 7. Conclusion

In a research pipeline built and operated largely by coding agents, the item records were exactly reproducible, and 20 of the 32 consequential incidents were errors in what those records were taken to mean or in the conclusions drawn from them. Code defects and environment failures were detected within the programme; errors of inference and reporting broke nothing, and almost all survived until an audit whose job was to doubt. Advisory messages were logged beside the actions they should have stopped, while blocking gates held. Such a pipeline needs checks where one artifact stands for another, scoring that does not let one comparator decide a conclusion, guards that block, and an early, separate, questioning pass over every claim a plan or a paper will rely on.

## Data availability and declarations

The replication package contains the version history, run manifests, item records, operational logs, the analysis log, the day-5 review and the audit ledger. For this study it adds: incident-register.json and incident-register.md, with the screening funnel and exclusion reasons; incident-codebook.md; incident-coding-input.json; incident-coding-A.json, incident-coding-B.json and incident-coding-final.json; incident-agreement.json with the script that computes it; incident-coding-sheet.md; reexecution-summary.json with the script that re-executes every saved program; incident-tables.mjs, which regenerates Tables 1 to 3, the coverage figures, the dates and lags, and the message census of Table 4; scheduling-zeros.mjs for Section 5.4; and the judge verdicts and agent-session orchestration records of Section 5.7. [AUTHORS: anonymised archive link for review.]

Coding agents did most of the work of the programme studied (Section 3.3). In this study, agent sessions compiled the incident register and its neutral descriptions, wrote the codebook, performed both codings and resolved their disagreements, performed the final audit and the judging of Section 5.7, and assisted in drafting and revising this manuscript. [AUTHORS: name] checked every number in the manuscript against the evidence files; the record of that check is [AUTHORS: file]. The human coding is pending (Section 4.5). Two companion manuscripts use the same programme (Section 1) and are declared to the editor. Author details, funding and competing interests are to be completed before submission.

## Appendix A. The incident register

Table 6 lists every incident with its category, the process that first detected it, and, for detections during the programme, the hours from entry to detection where both are dated. Dates, evidence pointers and consequences are in incident-register.json.

Table 6. The 32 incidents.

| ID | Incident | Component | Category | First detected by | Lag (h) |
| --- | --- | --- | --- | --- | --- |
| I01 | Evaluation servers not bound to the checkpoint under test | Evaluation | R: name → identity | Reading records | |
| I02 | Evaluation chains could run twice for one experiment | Orchestration | C | Operational failure | 5.6 |
| I03 | Evaluation read the current export, not the run's own | Evaluation | C | Reading records | 0.1 |
| I04 | Strict-format probe failures read as lost capability | Diagnostics | R: score → construct | First review | 16.2 |
| I05 | Probe scorer accepted an answer whose first number matched | Evaluation | C | First review | 16.3 |
| I06 | Demonstration selection read the hidden reference solution | Evaluation | C | First review | 7.2 |
| I07 | Selection score dominated by trained plans; held-out set reused | Evaluation | R: score → construct | First review | |
| I08 | Assisted conditions changed the prompt's distribution | Diagnostics | R: intervention → distribution | Reading records | 9.4 |
| I09 | Split ignored compositions reserved for evaluation | Data generators | C | Reading records | |
| I10 | Retry attempts after the first never executed | Diagnostics | C | Reading records | ≤ 0.4 |
| I11 | Untrained base models scored on a format never taught | Evaluation | R: score → construct | Reading records (the lead) | 30.1 |
| I12 | Argument-parser bug; dead runs reported as done | Orchestration | C | Operational failure | 1.6 |
| I13 | Operational scripts in /tmp wiped by a machine reset | Environment | E | Operational failure | |
| I14 | Disk filled during a checkpoint save | Environment | E | Operational failure | 0.7 |
| I15 | "series done", also written on failure, read as completion | Orchestration | R: record → state | Operational failure | 14.4 |
| I16 | Memory guard trusted the GPU driver's free-memory figure | Training | R: record → state | Operational failure | |
| I17 | Base model chosen on incomplete, unequal evidence | Evaluation | R: population → population | Final audit | |
| I18 | A run labelled "17b" read as a 17B model | Reporting | R: name → identity | Final audit | |
| I19 | Exact-phrase comparison rejected correct answers | Evaluation | R: score → construct | Reading records | 9.5 |
| I20 | Unrecorded agent re-scoring reported as a measurement | Reporting | I | Final audit | |
| I21 | Zeros attributed to training data no run had contained | Diagnostics | I | Final audit | |
| I22 | A punctuation difference diagnosed as a regression | Diagnostics | I | Reading records | 1.4 |
| I23 | A changed held-out set compared across data versions | Evaluation | R: population → population | Final audit | |
| I24 | A comparison across model families reported as a size floor | Reporting | I | Final audit | |
| I25 | A result credited to commands the programs did not use | Reporting | I | Final audit | |
| I26 | A gain credited to commands few gained items used | Reporting | I | Final audit | |
| I27 | Checkpoint pruning deleted run manifests | Orchestration | C | Reading records | 39.9 |
| I28 | Status files removed from the working tree, cause unrecorded | Environment | E | Operational failure | |
| I29 | A wrong exact count copied from a neighbouring row | Reporting | I | Final audit | |
| I30 | A plan count that included the held-out plans | Reporting | I | Final audit | |
| I31 | A validation range generalised from winners to all checkpoints | Reporting | I | Final audit | |
| I32 | A solver agent began reading stored reference solutions | Evaluation | C | Reading records | |

<!-- REFERENCES -->
