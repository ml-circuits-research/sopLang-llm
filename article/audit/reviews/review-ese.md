# ESE review of manuscript 03: "Correct computations, wrong conclusions"

## Overall verdict

1. Not ready as it stands, but one focused revision pass (Items 1-6) makes it ready for co-authors and colleagues. The register itself is sound: Table 1, Table 2, Table 3, the component counts, both κ values, the lag medians, and the 13,330 re-executed records all match article/evidence exactly.
2. Change 1 (Items 1-2): the main RQ2 finding is presented as a property of defect kinds, but the study design produces part of it. The test-suite row is zero by the inclusion rule. The detection processes examined different things: no process was charged with checking claims between the day-5 review and the post-programme audit, and all 9 inference errors entered in that interval. Audit detections are dated by convention. Reframe RQ2 as detection coverage, and delete the false sentence "none of the 32 could have been" [detected by the test suite].
3. Change 2 (Item 3): present the coding honestly. The abstract must say that both coders were agent sessions. The paper must also disclose four things: the coders saw the component label, which predicts the category; the codebook was written from these same incidents; the route and dates behind RQ2 were coded by one party only; and a human coding is still pending. Put a pre-specified human-coding protocol, with a visible placeholder for its κ, into the circulated draft.
4. Change 3 (Items 4-6, 8): fix the story and the frame. The paper needs a problem-first abstract and introduction, a "who did what" section that names the agent tools and the lead's role, and a related-work section (it cites six works). Section 4.6 is the longest section (936 of 5,259 body words) and a different study; cut it to a short follow-up placed after RQ3.
5. The rest is precision work. The commit screen matched subject lines, not messages, so 45 of 240 commits were never screened. The guard evidence omits the blocking gates that held (3 of 6 human-addressed messages). Several counts have no stated population, and some jargon is undefined.

Reviewed file: article/manuscripts/03-empirical-software-engineering.md as saved on 2026-09-29 at 06:47 (251 lines; Table 4 already in percentages). Line numbers refer to that version. As requested, this review does not cover the percentage conversion of Table 4 or the sample-size sentences. Incident IDs (I01-I32) are those of article/evidence/incident-register.json.

## Prioritised findings

### 1. RQ2 is written as a property of defect kinds; part of it comes from the study design

Location: §4.3, lines 120-136; the abstract (the sentences from "The incidents divided sharply by kind" to "a deliberate final audit found them"); §5.1, line 219; §6; §5.4, line 237.

Problem. The paper says "detection depends on the kind of defect" and "The pattern is sharp." A careful ESE reviewer will find four design features that produce part of this pattern:
- The detection routes examined different things.
  - The first review (day 5, about 09:00; astra_review.md) had a scope of code and "experiment evidence". It found 2 code defects (I05, I06) and 2 representation errors (I04, I07).
  - The second review (day 8) was a "read-only script review" (commit 176b8a38a). It was not the first detector of any incident: its findings mapped to I03 and I15, both already detected.
  - The final audit examined only the claims that were headed for the manuscripts.
  - No process was charged with checking claims between the first review and the audit. All 9 inference errors entered in that interval; the earliest is I30, at 19:20 on day 5. "Only the audit found them" therefore partly means "only the audit looked". The single inference error found during the programme (I22) was found when the working thread re-read items.
- The final audit is both the detector and the only source for 6 of its 11 detections. I23, I25, I26, I29, I30 and I31 appear only in the audit's own ledger (source c of the register funnel). So 5 of the 9 inference errors rest solely on the authors' own audit.
- The lags of audit-found incidents are censored at an arbitrary date. All 11 are dated at about 12:00 on 28 September by convention: their lagHours equal that time minus the entry time. The "median of about forty hours" for inference errors therefore measures how late in the programme they entered, not how hard they were to find. The Temporal-confounding threat says half of this.
- The Test suite row is zero by construction (Item 2).

Fix.
- Reframe RQ2 as detection coverage: which processes examined which artifacts, and what each found.
- Lead with a figure that does not depend on the audit date. Detected during the programme:
  - code defects: 9 of 9
  - environment failures: 3 of 3
  - representation errors: 8 of 11
  - inference and reporting errors: 1 of 9
- Report medians only for detections made during the programme, and state the dating convention used for audit detections:
  - code defects: 7.5 h (8 dated)
  - representation errors: 14.4 h (5 dated)
  - environment failures: 2.7 h (2 dated)
- Add the sensitivity check the data already supports. Restricting the analysis to the 26 incidents with a realised consequence drops the latent I05, I06, I09 and I32 and the miscounts I29 and I30, on which nothing depended. The audit still found 6 of the 7 remaining inference errors.
- Add "route scope" as an internal-validity threat.

Replacement for line 134:
> Table 3 is best read as a coverage map, because the processes examined different things. The working thread read logs and item records. The first review, on day 5, read code and experiment evidence; the second, on day 8, read scripts. The final audit, after the programme, re-derived the claims headed for the manuscripts from item records and manifests. Every code defect (9 of 9) and every environment failure (3 of 3) was detected during the programme, as were 8 of the 11 representation errors. Only 1 of the 9 inference and reporting errors was. No process was charged with checking claims between the first review and the audit, all nine entered in that interval, and the audit found eight of them. Where entry and detection can both be dated within the programme, the median time to detection was about 7.5 hours for code defects (8 dated; at most 40 hours), 14 hours for representation errors (5 dated), and 3 hours for environment failures (2 dated). Audit detections are dated to the audit, so their lags measure when an error entered, not how hard it was to find. Restricting the table to the 26 incidents with a realised consequence leaves the pattern unchanged: the audit found 6 of the 7 remaining inference errors.

### 2. "None of the 32 could have been" detected by the test suite is false; "no incident was caught by the test suite" is true only by construction

Location: §4.3, line 136; the abstract; §1, lines 13 and 15; §4.6, line 195; §6; Table 5, row "Code defect".

Problem.
- The inclusion rule (line 71) excludes "defects caught by a test or verification gate before use", so the zero in Table 3 is true by definition. Three excluded candidates were caught by the verification gate.
- The counterfactual "none of the 32 could have been" is contradicted by the register:
  - I05 is a failing unit assertion waiting to be written: statesValue('2', '2 + 2 = 4') returned true.
  - The fix for I06 (commit 0cdc4588c) added exactly the test that catches it. The commit says: "all 265 holdout solutions corrupted, every prompt byte-identical; the test now does exactly that".
  - I10 (retry attempts that never executed) and I27 (pruning that deleted run manifests) violate the intent of a single function, which a unit test can state.
  - The day-5 review reproduced I01's weakness with a mock server of a few lines.
- The suite was active: 289 tests passed on day 5 (astra_review.md), the suite had 382 tests by day 9 (commit e230b2146), and it stopped the pipeline twice after dataset rebuilds (overnight-pipeline.log, 24 Sep 15:41Z and 25 Sep 11:18Z). Line 15's "the agents write the glue quickly and test it thoroughly" is an evaluation the paper does not support.

Fix. Replace line 136 with:
> No incident was first detected by the test suite. The suite ran throughout (289 tests on day 5, 382 by day 9) and twice stopped the pipeline after a dataset rebuild. The zero in Table 3 is partly definitional, however: the inclusion rule excludes defects that a test or verification gate caught before use, and three excluded candidates were of that kind. The zero does not show that tests could not have caught the code defects. At least four of the nine (I05, I06, I10, I27) break an intent that a unit test can state; the fix for one of them (I06) added exactly such a test, and the review that found I05 and I06 wrote small reproductions of them. The representation and inference errors differ: in each, the code did what it was written to do, so no test of the code could have failed.

Also change:
- Conclusion: "Tests caught none of the consequential incidents" → "The test suite first detected none of the consequential incidents; the code defects among them lay in behaviour it did not specify."
- Line 15: "test it thoroughly" → "write tests for it (289 by day 5 in our case)".
- Table 5, code-defect check: add "unit tests that state the intended behaviour of scorers, selectors, and pruning".

### 3. Present the agent coding honestly now, and pre-specify the human coding

Location: the abstract; §3.4, lines 89-97; §5.4, line 235; declarations, line 249.

Problem.
- (a) The abstract says "Two independent coders ... agreed on all but one category". It does not say that both were agent sessions.
- (b) Line 97 says the coders worked "without access to the register's other fields". But incident-coding-input.json gives them the component field, and the component predicts the category: "environment" maps to E for 3 of 3 incidents, and "reporting" maps to I for 7 of 8. The human coding sheet repeats the component in every heading ("### I01 (evaluation)").
- (c) The file times on 28 September (register 21:45, codebook 21:47, codings 21:48) indicate that the codebook was written after the register was compiled, by the same process. Its examples mirror particular incidents:

  | Codebook example | Incident |
  | --- | --- |
  | "a loop that never runs" | I10 |
  | "a scorer that reads the wrong number" | I05 |
  | "a race between processes" | I02 |
  | "a parser bug" | I12 |
  | "a leak of hidden data" | I06, I32 |
  | "an unrecorded procedure presented as a measurement" | I20 |
  | "host reset, files removed by the environment" | I13, I28 |

  Some of the "neutral" descriptions also pre-code the category. For example, I22's description ends: "The first diagnosis had asserted item-level facts without reading the items." The κ of 0.96 therefore measures how determinately two sessions of one model apply a codebook written from these same incidents. It is not inter-rater reliability in the usual sense.
- (d) The route and the entry and detection times, on which RQ2 rests, were assigned by the register's compiler alone. No agreement is reported for them.
- (e) "We resolved the two disagreements" does not say who resolved them. Both resolutions (I03 coded C; I07 coded score → construct) followed coder B.
- (f) The coders' isolation is asserted, not described. The paper's own I32 (an agent opened reference files) and the scripted batch in §4.6 show that an instruction given to an agent session does not isolate it. State where the coder sessions ran, what they could read, and whether their transcripts are kept.

Fix, before the human coding is done:
- Abstract: "two agent sessions coded them with a fixed codebook, and a human coding is in progress" (see Item 4).
- Replace line 97 with:
> Two agent sessions ([tool, model, version]) coded all 32 incidents separately. Each saw the codebook and, for every incident, a description, its consequence, and the component it affected; neither saw the detection route, the dates, the evidence pointers, or the other's output. The register's compiler, also an agent session, wrote the descriptions and the codebook after compiling the register, and the codebook's examples were drawn from these incidents. The two codings therefore show that the codebook can be applied consistently, by two sessions of one model, to the incidents it was written from. They are not independent human judgement. The sessions agreed on the category of 31 of 32 incidents (κ = 0.96) and on category and seam for 30 of 32 (κ = 0.92). [Name or role] resolved the two disagreements (I03, I07) by the codebook's rule, both in favour of coder B, and recorded the reasons. The route and the times were assigned by the compiler alone.
- Put a visible placeholder in the circulated draft:
> [PENDING: human coding. A coder who took no part in the programme codes category, seam, and detection route for all 32 incidents from incident-coding-sheet.md, with the component label removed and blind to the agent codings. We will report κ against the final coding and against each agent coder, with the confusion matrix. If κ for category is below 0.6, we will report both codings and treat the category-level findings as tentative.]
- Protocol points to settle before the human starts:
  - Remove the component from the sheet's headings.
  - Add a one-paragraph route description with evidence pointers, so that the route can be coded too.
  - Have a second human adjudicate disagreements.
  - Ask the same coder to check the 41 one-line exclusion reasons; this covers the single-screener threat.
  - Test the codebook on unseen material by coding the three post-register defects of §4.6 and the 41 excluded candidates.
- Say how the categories were derived (inductively, from these incidents, by the compiler), and relate them to an existing fault taxonomy (Humbatova et al. 2020) and to the fault/error/failure vocabulary (Avizienis et al. 2004).
- §5.4: move the coder discussion into a "researcher bias and instrument" paragraph (Item 7). Say plainly there that the register, the descriptions, the codebook and both codings came from agent sessions of the same family as those that operated the pipeline.

### 4. The abstract and introduction should state the problem, its SE relevance, and the lesson before the case numbers

Location: the abstract, line 5; §1, lines 11-17.

Problem.
- The abstract has 306 words; Springer's instruction for this journal is 150-250 words (please confirm against the current guide). Its middle is spent on method detail, and it ends in jargon ("scoring at more than one level", "two blind, calibrated judges").
- The introduction opens with two paragraphs of case numbers (2 of 20, about 18 of 20, 38 of 64, fifteen hours) before the reader knows the question. The SE relevance arrives only in paragraph 3, and no gap in the literature is stated.
- The contribution sentence (line 17) is not bulleted, and "checks derived from, and tested against, the observed failures" is circular.
- The opening vignette closely duplicates paper 04, §4.1 (Item 18).

Fix. The replacement abstract below has 250 words, gives counts for every number, and includes the fixes from Items 1-3:
> Coding agents now build and operate the software of machine-learning research: data generators, training launchers, evaluation harnesses, and the reports that interpret their outputs. Studies of machine-learning engineering concern code and conclusions produced by people. We ask where errors enter when agents also run the pipeline and draw its conclusions, and which processes find them. In a retrospective case study of a ten-day programme where coding agents built and ran most of a pipeline fine-tuning small language models under one human research lead, we screened 105 candidate defects from the version history, run records, two agent reviews, and a post-programme audit. We registered 32 incidents that changed, or would have changed, a conclusion, decision, launch, artifact, or reported number; two agent sessions coded them with a fixed codebook, and a human coding is in progress. Re-executing the 13,330 saved held-out programs of 26 evaluations reproduced every recorded outcome. All 9 code defects, all 3 environment failures, and 8 of 11 representation errors (one artifact taken to stand for another) were detected during the programme. Only 1 of 9 inference and reporting errors was: no process was charged with checking claims between the first review on day 5 and the audit, which found the other 8. The test suite first detected none of the 32, and two warnings addressed to "a human" were logged within a second of the actions they warned about. Agent-run pipelines need claim checks before a claim enters a plan, and guards that block rather than advise.

Proposed order for the introduction:
1. The problem and its SE relevance.
2. What SE already knows, and the gap.
3. The case and the headline lesson, in two sentences.
4. The vignette, cut to three sentences or moved into §4.4.
5. The RQs, bulleted contributions, and an outline of the paper.

Replacement for the first paragraph:
> Coding agents can now write and operate most of the software of a machine-learning study: the data generators, the training launchers, the evaluation harness, and the reports that say what the numbers mean. Software engineering has studied the faults of machine-learning code [Thung et al. 2012; Islam et al. 2019; Humbatova et al. 2020] and the practices of teams that build machine-learning systems [@amershi; Serban et al. 2020; Nahar et al. 2022], and it has argued that most of such a system's risk lies outside the model code [@techdebt]. Those studies concern systems whose code is written, and whose outputs are interpreted, by people. When agents also run the experiments and write the conclusions, anyone who relies on the result faces a new question: where do the errors that change a conclusion enter, and which processes find them?

Replacement for line 17, from "Our contribution":
> Our contributions are (1) a register of the 32 consequential incidents of one complete agent-run programme, screened from four record sources, with dates, detection routes, and evidence pointers (Appendix A and the replication package); (2) a four-category codebook with five "seams" for representation errors; (3) a detection-coverage analysis showing that each process found what it examined, and that no process checked claims while the programme ran; (4) checks mapped to each kind of defect, with what the case shows about the checks that existed; and (5) a small follow-up in which two of the checks were applied to later work (Section 4.8).

### 5. Section 4.6 dilutes the paper where it stands; shrink it and move it after RQ3

Location: §4.6, lines 163-195; the abstract; Table 5, line 207.

Problem.
- It is the longest section (936 of 5,259 body words) and a different study: post-programme and evaluation-only.
- It brings in its own instrument, agent judges, with validity questions of its own:
  - both judges belong to the same model family;
  - calibration used only clear-cut items: 20 injected answers with a wrong number (for example "77 units." against a reference of "72 units.") and 50 answers a parser proves equivalent. None of them is of the borderline kind the judges actually had to decide, where the number is right but the wording, unit or verdict differs;
  - the third pass had no calibration items at all.
- Table 4's row labels ("operator plan", "held-out compositions", "withheld stock problems", "compact targets", "final data") cannot be understood without paper 01.
- The judge paragraph repeats paper 01 almost word for word (Item 18).
- It sits between the cascades and RQ3 and breaks the sequence of research questions.
- Its moral ("a check whose evidence is not kept is an assertion") differs from the paper's central one.
- Internal slips:
  - "the larger models of Section 4.6" (line 170) is a reference to its own section, made before those models are introduced (line 192);
  - "two independent judges" (line 188) contradicts "their agreement shows consistency, not independence of perspective" (line 170);
  - "corrected" (in the abstract and Table 5) treats the judges as ground truth;
  - "The unrecorded re-scoring of the incident register" (line 188) reads as if the register had been re-scored.
- Its one unique value: it is the only place where checks derived from the incidents were applied to new work, which partly answers the circularity threat (line 241).

Fix. Move it after Table 5 as "4.8 A follow-up: two checks applied to later work", cut to about 400 words:
- (a) Two sentences on the three scoring levels.
- (b) One example that changes a conclusion, in plain words. On all 40 withheld stock-and-lead-time problems, exact matching tied the untuned and the fine-tuned model at zero, while at the semantic level they scored 60% (24 of 40) against 5% (2 of 40). Add one sentence on the operator-plan against JavaScript gap.
- (c) A small table of the three post-register defects, coded with the codebook, each with its detection route:

  | Defect | Code | Detected by |
  | --- | --- | --- |
  | Different items for each wording | code defect | a fact-check that counted shared identifiers |
  | Two wordings in one agent batch | population → population | reading the batch design |
  | A batch assembled by a script | agent conduct | a tool-use review whose transcripts were not kept |

- (d) Move the judge calibration details to an appendix or the replication package, and cite companion paper 01 for the comparisons.
- In the abstract, drop the §4.6 sentence or replace it with "Applied to later comparisons, scoring each answer three ways changed one comparison's conclusion."
- Replace "corrected" with "changed" throughout, and name the judges' model.

Opening for the new 4.8:
> After the programme we applied two checks from Table 5 to evaluation-only comparisons run on the same pipeline, reported in [companion paper 01]: every answer was scored at three levels, and item identifiers were compared before any comparison across wordings. The scoring level changed one conclusion outright. On all 40 problems of a withheld stock-and-lead-time type, exact matching scored an untuned 1.7B model writing JavaScript and a fine-tuned 1.7B model equal, at zero; the strict value check accepted 33 and 5 of their answers, and the two blind judges 24 and 2. The follow-up also produced three incidents of its own (Table 6). None was caught by a test, and each was found by a process that examined what an artifact represented, as in Table 3.

### 6. The paper lacks a "who did what" account, and the agent-specific angle is not coded

Location: §2.2, line 37; Table 3, row 1; §3.2; §5.4, line 239.

Problem.
- The paper never names the agent tools, models, or versions, or says how sessions were run. This applies to the pipeline, the reviews (the day-5 reviewer is recorded only as "Astra"), the coders, and the judges.
- It also omits:
  - that several sessions worked in parallel;
  - the human lead's role and time;
  - that all 240 commits carry the lead's git identity, so authorship is inferred;
  - that some records were written in Romanian (line 142's "decisive evidence" is a translation).
- Line 37 says the agents worked "with review by the research lead". Paper 04, §2.2 says the lead chose the questions, approved designs, and set the aims; no record shows code review.
- The route "Reading individual records (working thread)" mixes agents and the human. The register itself notes that I11 was "raised by the human lead ... not by an agent" and was filed "under the closest" route.
- Without an actor dimension, the paper cannot say what was specific to agents. Examples it has but does not use:
  - I32, where an agent read reference files;
  - the scripted batch;
  - the rewrite at 20:43 that replaced a correct label (I18);
  - a watcher that logged "a human must look" and launched the next run on the following line of its code.

Fix. Add a §2.3, adapted from paper 04, §2.2 rather than copied from it:
> 2.3 Who did what. One human research lead, an author, chose the questions, approved training designs, and set the programme's aims; the lead usually met results as status notes rather than as item records. Coding agents ([tool, model, version]) wrote the generators, runtime, harness, and orchestration scripts; launched, watched, and restarted runs; and wrote the status notes, analysis log, and article drafts. Several sessions often worked in parallel. All commits carry the lead's git identity, so we attribute an act to an agent or to the lead only where a record says so. The two reviews, the final audit, the register with its codebook and codings, and the judges of Section 4.8 were agent sessions directed by the authors. Some status notes were written in Romanian; quotations from them are our translations.

Also add two coded fields to the register: introduced by, and first detected by (agent session, human lead, automated check, or unknown). Split Table 3's first row into "working thread (agent)" and "research lead", and report the counts, using "unknown" where the records are silent. This is the cheapest way to give the paper a result specific to agents.

### 7. Case-study method: chain of evidence, case selection, reflexivity, and the threats structure

Location: §3.1, line 57; §3.2-3.3; §5.4, lines 231-241.

Problem, judged against Runeson and Höst and the ACM SIGSOFT Empirical Standards for case studies:
- (a) There is no table at the level of single incidents, so a reader cannot follow an incident from its record to its category, route, and dates. Line 57 promises that the register can "be checked independently", yet the text never cites an incident ID.
- (b) The case-selection rationale and the unit of analysis are not stated.
- (c) Reflexivity is thin. The register, the neutral descriptions, the codebook, both codings, the final audit and the fact-checks were all produced on 28 September by agent sessions of the kind under study, directed by the authors.
- (d) Triangulation is not reported: 15 of the 32 incidents rest on a single source, 6 of them on the audit's own ledger.
- (e) The "Reliability" paragraph (line 241) discusses the circular derivation of the checks, which is an external-validity point. Runeson and Höst use reliability for dependence on the particular researchers, which here is the agent-compiler and agent-coder problem.
- (f) Gaps in the data sources are not listed together. The exp-014 training manifest was deleted (I27), the day-8 review survives only in a commit message, and the transcripts of the larger-model sessions were not kept.

Fix.
- Add Appendix Table A1 covering all 32 incidents, with columns: ID, one-line description, component, category and seam, route, entered, detected, lag, and evidence pointer (commit or file). All of it is already in incident-register.json. Cite IDs in the text, for example "(I18)".
- In §3.1, add:
> The case is the programme, and the unit of analysis is the incident. We chose the case because its records are complete and it is one of the first agent-operated research programmes that can be studied from its own records, a revelatory case in Yin's sense; it was also available to us.
- Report the number of sources per incident: 15 incidents have one source, 13 have two, and 4 have three.
- Restructure §5.4 into construct validity, internal validity (researcher bias and instrument, route scope, temporal confounding), external validity, and reliability.
- Replacement for line 241:
> Reliability. The register, its descriptions, the codebook, both codings, and the audit that supplied 31 of the 105 candidates were produced by agent sessions directed by the authors, of the same family as the agents that operated the pipeline. Another team, or a human coder, might screen, date, or classify differently; the pending human coding (Section 3.4) tests part of this. The checks in Table 5 were derived from the incidents they would catch, so their value elsewhere is a hypothesis, which the follow-up in Section 4.8 tests only once.

### 8. Related work is missing

Location: the whole paper, which cites six works: techdebt, amershi, mltestscore, runeson, sclar, and kapoor.

Problem. There is no related-work section. An ESE reviewer will expect the paper to be placed within the literature; without that, its novelty claims (an interpretation layer, and operation by agents) have nothing to stand against.

Fix. Add "2. Background and related work", about 700 words in five paragraphs. I am confident the works below exist; entries marked (portfolio) are already verified in article/evidence/bibliography.json.

- SE for ML and ML engineering:
  - Serban et al. 2020 (ESEM), "Adoption and effects of software engineering best practices in machine learning";
  - Nahar et al. 2022 (ICSE), "Collaboration challenges in building ML-enabled systems";
  - Wan et al. (IEEE TSE, 2021), "How does machine learning change software development practices?";
  - Lwakatare et al. 2019 (XP), "A taxonomy of software engineering challenges for machine learning systems";
  - Paleyes et al. 2022 (ACM Computing Surveys), "Challenges in deploying machine learning".
- Faults in ML systems. These studies classify code faults; this paper adds errors of interpretation.
  - Thung et al. 2012 (ISSRE), "An empirical study of bugs in machine learning systems";
  - Zhang et al. 2018 (ISSTA), "An empirical study on TensorFlow program bugs";
  - Islam et al. 2019 (ESEC/FSE), "A comprehensive study on deep learning bug characteristics";
  - Humbatova et al. 2020 (ICSE), "Taxonomy of real faults in deep learning systems";
  - Zhang, Harman, Ma and Liu (IEEE TSE), "Machine learning testing: survey, landscapes and horizons".
- Research software and the validity of research:
  - Hatton and Roberts 1994 (IEEE TSE), "How accurate is scientific software?";
  - Miller 2006 (Science), on five retractions caused by a single software error;
  - Wilson et al. 2014 (PLOS Biology), "Best practices for scientific computing";
  - Storer 2017 (ACM Computing Surveys), "Bridging the chasm";
  - Heaton and Carver 2015 (IST), on claims about software engineering practice in science;
  - Pineau et al. 2021 (JMLR), on reproducibility in machine learning research;
  - @gundersen, @sandve, and @cascades (portfolio);
  - @dwork (portfolio) on holdout reuse, which bears directly on I07.
- LLM coding agents, and LLMs as annotators and judges. These bear directly on the agent coders and the judges.
  - Jimenez et al. 2024 (ICLR), SWE-bench;
  - Yang et al. 2024 (NeurIPS), SWE-agent;
  - @aiscientist and @llmjudge (portfolio);
  - Gilardi et al. 2023 (PNAS), on LLM text annotation.
- Method and theory, for analytical generalisation:
  - Flanagan 1954, "The critical incident technique" (Psychological Bulletin): the lineage of an incident register;
  - Reason 2000 (BMJ): latent conditions, for the cascades;
  - Bainbridge 1983, "Ironies of automation" (Automatica), with @automationbias (portfolio): guards addressed to humans who are not there;
  - Barr et al. 2015, "The oracle problem in software testing" (IEEE TSE): the comparator is a test oracle, and score → construct is an oracle problem;
  - Chen et al. 2018, "Metamorphic testing: a review of challenges and opportunities" (ACM Computing Surveys): the content-neutral-intervention check for intervention → distribution is a metamorphic relation;
  - Avizienis et al. 2004 (IEEE TDSC): the fault/error/failure vocabulary (Item 17);
  - Ralph and Tempero 2018 (EASE): construct validity in SE;
  - Runeson, Höst, Rainer and Regnell 2012 (Wiley book), Yin's "Case Study Research", and Ralph et al. 2020, the ACM SIGSOFT Empirical Standards (arXiv:2010.03525);
  - Gunawi et al. 2016 (SoCC): studies of service outages;
  - Beyer et al. 2016, "Site Reliability Engineering" (O'Reilly): postmortem practice.

Verify these before citing; I believe they exist but have not confirmed them:
- Ahmed, Devanbu, Treude and Pradel, "Can LLMs replace manual annotation of software engineering artifacts?" (MSR 2025);
- Cemri et al., "Why do multi-agent LLM systems fail?" (arXiv 2025);
- Sjøberg and Bergersen, "Construct validity in software engineering" (IEEE TSE);
- Shankar et al., "Operationalizing machine learning: an interview study" (arXiv 2022).

Empirical studies of pull requests written by agents are now appearing; search for them and verify rather than cite from memory. Run every addition through the portfolio's bibliography audit.

### 9. The title, the §4.1 heading, and "not in how records were kept" overreach

Location: line 1; §4.1, lines 101-103; the abstract; §6.

Problem.
- "Correct computations" contradicts the paper's own 9 code defects. For example, retries never executed (I10); a leftover server running another model scored every exp-009 selection checkpoint (I01, coded as a representation error); and a probe scorer accepted wrong answers (I05).
- The re-execution shows two things only: the item records of 26 held-out evaluations are faithful, and the scorer is deterministic. It re-scored stored generations and did not re-run inference.
- It did not cover diagnostics, adaptation runs, or base-model comparisons. That includes the comparison in which 322 of 705 requests had no completion; its records were not re-executed.
- "The evaluation was deterministic and its records were complete" and "not in how records were kept" are contradicted by I03 (a report named a dataset snapshot that no scored item came from) and I27 (pruning deleted run manifests).

Fix.
- Title options:
  - "Reproducible records, unsound conclusions: incidents in an agent-operated machine-learning research pipeline"
  - "Where errors entered, and what found them: an incident census of an agent-operated machine-learning pipeline"
- §4.1 heading: "The item records were reproducible".
- Replace the last two sentences of line 103 with:
> The scoring stage was deterministic, and the item records of these 26 evaluations are complete. Model generation was not re-run, and the diagnostic, adaptation, and base-model runs were not re-executed. The result does not mean the code was free of defects (nine incidents are code defects) or that every record was kept (I27 deleted run manifests, and I03 misnamed a dataset snapshot in a report). It means that every recorded outcome is exactly what the pipeline computed from the saved program, so the errors below lie in what was computed, in how outputs were read, or in how the pipeline was operated, not in the item records.
- Abstract: say "of 26 evaluations", as in Item 4.

### 10. The commit screen is misreported, and 45 of the 240 commits were never screened

Location: §3.3, line 71; Table 1; the abstract ("we screened every candidate defect").

Problem.
- The paper says it screened "every commit whose message mentions a fix, correction, bug, ...". The register screened subject lines only: its screening notes say "25 subjects match".
- Re-running the same pattern over the full commit messages in the 18-27 September window matches 70 of the 240 commits. So 45 commits that mention a screening term in their message body never became candidates. Examples:
  - a9a9905c3, "... or the arm has no evaluation";
  - 9d5042cb8;
  - 6bc6899cd;
  - 865b9dd73;
  - 3812a7924.
  Several of these map to known incidents, but some may be new.
- The paper's list of terms omits "wrong", which the pattern includes.
- The exclusion of claims first made after the programme window is applied in the register but missing from line 71.
- The row "Rows of the final audit's correction ledger" (31) includes 3 rows from the baseline audit.
- "We screened every candidate defect" (abstract) overclaims.

Fix.
- Preferred: screen the 45 commits whose only match is in the message body, with the same rule, and update Table 1. The census claim depends on it, and it is about an hour's work.
- Otherwise, write "every commit whose subject line matches ..." and add the gap as a threat.
- Add "wrong" to the list of terms, and add the post-window exclusion.
- Rename the row to "Rows of the final audit's correction ledger and baseline audit".
- Abstract: "we screened 105 candidate defects from four sources".
- Add one sentence explaining why the override of the stop rule is excluded as a governance decision but discussed in §4.5: it links I18 and I20 to the runs that followed.

### 11. The guard evidence is selective; give the full count

Location: the abstract; §4.5, lines 157 and 161; Table 5, last row; §5.3, line 229; §6.

Problem. The paper reports three human-addressed messages. evaluation/registry/overnight-pipeline.log holds six in the programme window:

| Time (UTC) | Message | Type | What followed |
| --- | --- | --- | --- |
| 23 Sep 22:22:21 | "NOT training — a human decides" | blocking gate | The pipeline stopped. |
| 24 Sep 15:41:55 | "TEST SUITE FAILED ... stopping for a human" | blocking gate | The pipeline stopped. |
| 25 Sep 11:18:14 | "TEST SUITE FAILED ... stopping for a human" | blocking gate | The pipeline stopped; the dv6 run was deliberately not launched (c945ce3ec). |
| 24 Sep 05:40:43 | "a human must look" | advisory | "launching" logged in the same second. |
| 24 Sep 05:45:09 | "a human must look" | advisory | Pruning at 05:45:10. |
| 24 Sep 08:24:18 | "CHAIN FAILURE ... a human must look" | advisory | Answered: someone re-armed the watcher at 09:16Z, and the launch at 09:49Z passed the new preflight gate. |

stall-check.log adds six more alarms reading "a human or an agent must look". The blocking gates held and the advisory messages did not. That contrast is the paper's best evidence for "guards must block", and the paper does not report it.

Three statements also need correcting:
- The paper presents the "a human decides" gate as a guard that failed. The gate did block. What failed was the choice of base model made the next morning, on a comparison in which 322 of 705 requests had no completion. That choice was written into a launch script committed with the morning report at 07:41 local time (f68a00a91), and the records do not show who reviewed it.
- In that script, the line that logs "a human must look" is followed immediately by an unconditional "launching" line. The watcher was advisory by construction, and it had been written minutes earlier.
- §5.3's "a pipeline that ran overnight with no human present" is wrong for the watcher messages. They were logged at 07:40 local time, 45 seconds before the morning report was committed.

Fix. Replace line 229 with:
> Advisory messages did not stop the automation, whether or not a person was nearby. The pipeline's log holds six messages addressed to a human. Three came from blocking gates, and the pipeline stopped at each: two test-suite failures after dataset rebuilds, and a selection gate that declined to train. Two came from a watcher written that morning. It logged "a human must look" in the same second as it launched the next run, and again one second before pruning a live run's checkpoints; in its code, the warning and the unconditional launch sit on adjacent lines. A blocking gate hands a decision to a person, and the decision is only as good as the evidence handed with it. The morning after the selection gate declined, a hand-written launch script chose the base model it had declined, on a comparison in which 322 of 705 requests had no completion, and the records do not show who reviewed that choice. A guard must prevent the action it warns about, and a hand-off to a person must carry the evidence the decision needs and be recorded as a dated decision. The same holds for governance: a stop rule that did not name who could lift it was dissolved by a change of aim, without anyone deciding to lift it.

Adjust the abstract ("two warnings ... within a second"), line 161, and the last row of Table 5 to match.

### 12. Section 5.2 commits the kind of inference error the paper studies

Location: §5.2, line 225.

Problem.
- "The difference was their instruction" is a causal attribution the case cannot support. The reviews and the audit also differed from the working thread in timing (the audit came after the programme), in scope (code for one, claims for another), in hindsight, and possibly in model (the day-5 reviewer, "Astra", is not identified).
- "Where most of the value lies" has no count behind it. The questioning passes first detected 15 of the 32 incidents: 4 by the reviews and 11 by the audit.
- "Cheap" is not quantified, although the day-5 review's header records about five minutes (07:00-07:05 UTC).

Fix. Replace the text from "The two separate reviews ..." to "... where most of the value lies." with:
> The two reviews and the final audit first detected 15 of the 32 incidents, including 8 of the 9 inference errors, which the working thread had not found. They differed from the working thread in their instruction (to review or to doubt, rather than to make progress), but also in timing, scope, and hindsight, and the case cannot separate these factors. The instruction is the factor a practitioner can set cheaply: by its own header, the day-5 review took about five minutes and first detected four incidents.

Keep "It should run before a claim enters a plan", marked as a recommendation the case does not test.

### 13. The comparator narrative names the wrong run, and one claim lacks a population

Location: §4.4, line 140; §1, line 13.

Problem.
- Line 140's "A reading of the records of the next run flagged the phrasing problem about ten hours later" is inaccurate. The reading of "38 of 64" (commit e230b2146, 26 Sep 03:55) was of exp-023 (data version dv9), two runs after exp-021, not the next run. The decompose-to-solve outcomes (exact comparison, 100 problems per run) show which run has 64 mismatches:

  | Run | Answer mismatches | Execution errors |
  | --- | --- | --- |
  | exp-021 | 92 | 8 |
  | exp-022 | 41 | 59 |
  | exp-023 | 64 | 36 |

  The interval is 9.5 hours.
- Line 13's "the previous run's records" is ambiguous in the same way.
- "Most of the zeros the programme spent effort on were real failures" has no denominator. For the runs that targeted the two stuck books, the retrospective parser accepts the following numbers of the 100 scheduling answers per run:
  - exp-023 (dv9): 0, with about 18 more in wording the parser does not accept;
  - exp-024 (dv11): 2;
  - exp-025 (dv12): 54.
  The common-sense zeros (0 of 50 per run) had computational causes. These figures come from audit/revision-factcheck.md; recheck them before use.

Fix.
- Line 140:
> Two runs later, about nine and a half hours on, a reading of that run's 64 mismatched scheduling answers found 38 that stated the reference number, some of them counts rather than durations.
- Replace the last sentence of line 140 with:
> In the three runs that targeted the stuck books with new training data (data versions 9, 11 and 12), the parser accepted 56 of 300 scheduling answers, 54 of them in one run, and the common-sense zeros (0 of 50 in each run) had computational causes. Most of the zeros the programme spent effort on were real failures.
- Line 13:
> Fifteen hours earlier, a reading of the records of the run evaluated that night had found that 38 of its 64 mismatched scheduling answers stated the reference number ...

### 14. Claims whose denominator or population is unclear

Location: various. For each claim below, name its population.
- §6, line 245, "many of the conclusions drawn from them were not sound". The paper counts incidents, not conclusions. Write: "20 of the 32 incidents were errors in what an output was taken to mean (11) or in the conclusion drawn from it (9)".
- Line 134, "Five of the nine entered the record on the last two days, when the programme changed its aim". Three of the five (I20 and I29 at 19:34, I21 at 20:20) entered in the hour before the change of aim at 20:37 and fed it. Say so; the direction matters, as paper 04, §5.2 notes.
- Line 118, "Incidents occurred in every component". Environment is not one of the six components of §2.2. Write: "in all six components; three more were environment failures".
- Table 5, row 1, "All nine were found within hours to two days". I09 has no entry time. Write: "all nine during the programme; the eight that can be dated, within 40 hours".
- Abstract, "several operational warnings". Give the count (Item 11).
- Abstract and §6, "announced themselves", and §5.1, line 219, "Code defects ... break things". I05, I06 and I09 were latent and broke nothing, and I05 and I06 were found by review. Write: "were detected by breakage, by reading records, or by review".
- Line 134, the corrected diagnosis (I22). The status file was corrected four minutes after the second diagnosis, but summary.md still carries the uncorrected "regressed" claim. That is itself an example of a correction that did not propagate.
- Line 134, "The pattern is sharp." Delete it; it is rhetoric about counts between 1 and 8.

### 15. Latent incidents, and incidents without consequence, are not separated

Location: §3.3, line 71; §5.4, line 233.

Problem. The inclusion rule admits counterfactual incidents, but the paper never says how many there are:
- latent: I06, I09 and I32 (in each, the register's consequence begins "Latent");
- no false pass demonstrated: I05;
- nothing depended on the number: I29 ("No decision depended on it") and I30 ("The manuscripts do not use the number").

The construct-validity threat about "would have changed" cannot be weighed without these counts.

Fix. In §3.3, add:
> Of the 32 incidents, 26 had a realised consequence. Four are latent (I05, I06, I09, I32), and two changed only a reported number on which nothing depended (I29, I30).

Cite the sensitivity result from Item 1 in the construct-validity paragraph.

### 16. The dating rules and the lag computation need stating and a script

Location: §3.3, line 85; §4.3.

Problem.
- No script in the repository computes lagHours.
- Audit detections use a conventional time of 12:00 on 28 September.
- The entry rules differ between incidents:
  - I18's entry is the creation of the name (23 Sep 19:32), not its first misreading (26 Sep 14:56);
  - I19's entry is its first consequential use (25 Sep 18:27), not the creation of the comparator (18 Sep).
- I17's lag treats a UTC time ("21:46Z") as local time, an error of 2 hours.

The medians survive these choices, but a reviewer will ask for the rules.

Fix. Add a paragraph stating the rules:
> Entry is the first record that shows the defect affecting a record, decision, or artifact. Detection is the first record that shows awareness of it. Times are local; audit detections are dated to the audit's midpoint.

Recompute the lags under these rules. Add to the replication package the script that regenerates Tables 1-3 and the medians from incident-register.json; the paper's own argument requires it.

### 17. Undefined terms and hard-to-read tables

Location: §2.2; Tables 2-5.

Problem.
- These terms are used without definition:
  - "comparator" (first used at line 11 and never defined; paper 04, §2.1 has a one-line definition);
  - "seam" (line 91);
  - "working thread" (Table 3);
  - "evaluation chain";
  - "watcher";
  - "probe" and "probe scorer";
  - "oracle-assisted";
  - "export";
  - "selection gate" and "selection step";
  - Table 4's labels, if the table is kept.
- "Family" and "book" are used interchangeably: the two stuck "families" of line 11 are books in the register.
- Table 2 packs five seams into one cell.
- Table 2's example "exact phrasing read as correctness" states the error backwards.
- "Defect", "error" and "failure" are mixed as category names.

Fix.
- Add after line 49:
> We use a few of the programme's terms throughout. The comparator is the function that decides whether a program's executed answer matches the reference answer. An evaluation chain is the scripted sequence that converts a run's checkpoints, selects one, and evaluates it on the held-out problems. A watcher is a script that waits for a chain to finish and then starts the next step. A probe is a short capability test outside the held-out set. The export is the trainer's view of the dataset at one version. The working thread is the agent session, or sessions, doing the programme's main work, as distinct from review sessions.
- Split Table 2's representation row into five rows (seam, count, example).
- Correct the example to "exact-phrase mismatches read as wrong answers".
- Add one sentence on terminology, citing Avizienis et al.:
> We call each unit an incident. Its category names the kind of fault, and "error" in "representation error" and "inference error" refers to a human or agent mistake.

### 18. Reduce and declare the overlap with companion papers 01 and 04

Location: §1, lines 11-13; §4.4, line 142; §4.5, line 159; §4.6, line 170; the declarations.

Problem.
- The opening vignette, the solver test on 20 items, is the episode of paper 04, §4.1, and two of its sentences are nearly verbatim ("It was given the problem statements but not the reference answers ..." and "The record written at the time estimated ...").
- The "17b" identity case (§4.4) is paper 04's central case.
- The override of the stop rule, the unrecorded re-scoring, and the corrected diagnosis all appear in paper 04.
- §4.6's judge paragraph shares several eight-word sequences with paper 01: 98.2%, κ = 0.96, the 20 wrong answers, the 50 parser-equivalent answers, and the sentence about discarded batches.

Springer checks text similarity, and editors will ask how paper 03 differs from paper 04.

Fix.
- Rewrite the overlapping sentences in paper 03's own words.
- Cut §4.4's identity case to what illustrates the name → identity seam (about 60 words), and cite paper 04 for the full reconstruction.
- Cite paper 01 for the comparisons.
- Add to the introduction:
> Two companion manuscripts use the same programme: one reports its learning results [01], and one analyses the identity error of Section 4.4 from the perspective of research accountability [04]. This paper's contribution, the incident register and its detection analysis, appears in neither.
- Declare the related submissions in the cover letter.

### 19. Three codings a human coder will question: I28, I13 and I32

Location: Table 2; §3.4.

Problem.
- I28 (files deleted from the working tree four times) is coded as an environment failure, although the register records "no recorded cause". With several agent sessions working in one repository, a stray git operation by an agent is at least as plausible as a platform fault. Defaulting to E inflates the environment category, which carries the claim that "environment failures were detected quickly".
- I13's root cause is the choice to keep operational scripts in /tmp; the machine reset only exposed it. The codebook rule allows E, but the choice deserves a sentence.
- I32 (an agent reading reference files) is coded as a code defect. Coder B marked it "low" confidence and described a "procedure". It is agent conduct, for which the codebook has no category.

Fix.
- Mark I28 "cause unknown; coded E by default", or add an "unknown" category, and report environment failures as "3, one of unknown cause".
- Note in §3.4 that agent conduct (I32 and the scripted batch) has no category of its own and is captured by the actor field proposed in Item 6.

### 20. RQ3 and Table 5 claim more than the case shows

Location: §1, line 17; §4.7, lines 197-213.

Problem.
- "Checks derived from, and tested against, the observed failures" is circular.
- The "What the case shows" column mixes observations with counterfactuals ("only a blocking check would have").
- The check for inference errors says "before the claim enters any plan", but the case shows only an audit after the programme, so that timing is untested.
- The check for code defects omits tests that state intended behaviour (Item 2).

Fix.
- Rename RQ3: "What checks does the case suggest for each kind, and what does it show about the checks that existed?"
- In Table 5, row "name → identity": "a check that blocks any report whose identity disagrees with the manifest would have stopped the rewrite; a printed identity did not".
- Row "inference": add "the case observed only an audit after the programme; running the audit before a claim enters a plan is untested".
- Row "code defect": add the unit-test check.

### 21. Declarations and the replication package

Location: line 249.

Problem.
- "Coding agents were used ... as the second coder pair" misdescribes the design: both coders were agents.
- The declaration omits the other roles agents played in the analysis: compiling the register, writing the neutral descriptions and the codebook, possibly adjudicating, performing the final audit, judging, and fact-checking.
- "The authors checked every reported fact against the records" does not say how the check was done, by whom, or where its record is. For a paper whose thesis is that an unkept check is only an assertion, this matters.
- "Its location will be provided on submission" gives co-authors and reviewers nothing to inspect.

Fix. Replace the relevant sentences with:
> Coding agents were used throughout the programme studied (Section 2.3). In this study, agent sessions compiled the incident register and its neutral descriptions, wrote the codebook, performed both codings, performed the final audit and the judging of Section 4.8, and assisted in drafting. [Name] checked every number in the manuscript against the evidence files; the record of that check is audit/[file] in the replication package.

List the package contents by file name:
- incident-register.json
- incident-codebook.md
- incident-coding-input.json
- incident-coding-A.json, incident-coding-B.json and incident-coding-final.json
- incident-agreement.json
- reexecution-summary.json, with the script that produced it
- the new script that regenerates Tables 1-3 and the lags

Give an anonymised archive link for review now.

### 22. Add one figure: a timeline of the incidents

Location: §4.3 or §4.5.

Problem. The paper has no figure. The claims hardest to read from its tables are the two cascades and the censoring of audit detections.

Fix. Add Figure 1, generated from incident-register.json with the portfolio's dataviz conventions:
- the x-axis runs from day 1 to day 11;
- one row per incident, grouped by category;
- a bar from entry to detection for each incident, coloured by detection route;
- the first review (day 5) and the audit (day 11) drawn as vertical lines;
- the two cascades outlined.

The figure shows at a glance that all nine inference errors entered between the two claim-checking events and end at the audit line.

### 23. Smaller wording fixes

- Keywords: drop "empirical software engineering", which is redundant in this journal. Add "LLM-based coding agents", "incident analysis", "SE for machine learning", and "test oracle".
- Line 15: Sculley and colleagues "argued" rather than "showed"; theirs is a position paper.
- Line 13: "The test suite could not see it" → "No test of the comparator could fail, because it did what it was written to do."
- Line 142: mark "decisive evidence" as a translation, or paraphrase without quotation marks.
- Line 157: "started beside the interrupted one" → "started beside the resumed run"; that run had been resumed that morning.
- Line 157: also say that the "series done" line was first read as completion the same night, at 21:45:48Z. That reading started the base-model comparison whose incomplete records became I17, which strengthens the cascade.
- Line 66: say that the day-5 review is retained as a file and the day-8 review only in a commit message, and say which model performed each review.
