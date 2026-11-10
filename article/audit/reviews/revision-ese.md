# Revision log: manuscript 03 (Empirical Software Engineering)

Revised 2026-09-29 against the review in `review-ese.md` (23 items) and two coordinator updates. Every review claim used was checked against the records first; where a claim was wrong or could not be verified, it was not applied, and the reason is given below. The codings and the evidence files were not changed.

## What was produced

- `article/manuscripts/03-empirical-software-engineering.md`: the revised manuscript. New title "Where errors entered, and what found them: incidents in an agent-operated machine-learning research pipeline"; problem-first abstract (249 words, two numbers: "ten-day", "Two agent sessions"); new Section 2 (related work); new Sections 3.2 (terms) and 3.3 (who did what); method rewritten with dating rules, an honest account of the agent coding, and a pre-specified human-coding protocol with a visible `[PENDING: ...]` placeholder; RQ2 reframed as coverage (Table 3 now has a "What it examined" column); new Table 4 (all six messages addressed to a person); old Section 4.6 cut from 1,031 to about 390 words and moved after RQ3 as Section 5.7; threats restructured; Appendix A with Table 6 (all 32 incidents).
- `article/submission/03-empirical-software-engineering.json`: `shortTitle` updated; `tableWeights` keys replaced to match the new table headers exactly (verified with the project's `parseMarkdown`); weights tuned after a test render.
- `article/scripts/incident-tables.mjs` (new, read-only): regenerates Tables 1-3, sources per incident, the coverage shares, the dating rules and lags, the sensitivity check, what the coders saw, the commit-screen counts (via `git log`), the timing of inference errors against the change of aim, and the census of human-addressed log messages. `--json` gives a machine-readable summary.
- `article/scripts/scheduling-zeros.mjs` (new, read-only): tallies the held-out scheduling answers of the 1.7B runs trained with the scheduling shape (exact matches, execution errors, parser-accepted, right in other wording) and sums the three runs that targeted the stuck books.
- `bib-ese.json` (17 entries) and `bib-ese-audit.json` (17 records) in this folder, in the exact formats of `bibliography-additions.json` and `bibliography-additions-audit.json`; no key collides with `bibliography.json` or with `bib-ml.json`, `bib-informatica.json` or `bib-ethics.json`.
- Test build (scratch only, `/tmp/esebuild/`): with the 17 new entries merged into a temporary copy of the bibliography, `build-docx.mjs` produced a DOCX with 6 tables and 27 references; LibreOffice rendered it to 16 pages; Tables 2-6 were inspected as page images. Nothing under `article/docs/` was touched.

Word counts (sections 1-7, tables and headings included, counted the same way for both versions): 6,220 against 5,384 before (+15.5%); the old Section 4.6 alone was 1,031. Abstract 249 words. Declarations 216 words. Appendix A 767 words, outside the body; it can move to the supplement if the editor counts it. A 7-word shingle check against the current 01, 02 and 04 (re-run after their 08:05-08:07 revisions) finds only the shared language example and two short phrases.

## Item-by-item

### 1. RQ2 as a property of kinds, partly produced by the design — applied in modified form

Checked: `git show 0cdc4588c:astra_review.md` (dated 07:00-07:05 UTC on 22 Sep; scope includes "current research direction" and "experiment evidence"); commit 176b8a38a ("From the read-only script review"); register funnel and `candidate_map` (the two round-2 findings that mapped went to I03 and I15, both first detected earlier); entry times of the nine inference errors (all after 22 Sep 09:00 local, earliest I30 at 19:20); the audit-only sources (I23, I25, I26, I29, I30, I31 have only source c, five of them inference errors); the audit dating convention (every stored audit lag equals 28 Sep 12:00 minus entry, confirmed by recomputation and by the analysing session's own command that wrote the lags).

Applied: RQ2 renamed to "Which processes detected each kind, and what did each process examine?"; Table 3 gets a "What it examined" column and a "Detected during the programme" row (9 of 9, 8 of 11, 1 of 9, 3 of 3); the text reads the table as a coverage map; "the pattern is sharp" deleted; audit lags no longer reported; sensitivity check added (26 incidents; the audit still found 6 of 7 inference errors, and no code or environment incident); route scope added as a threat.

Modified: the review's medians (code 7.5 h from 8 dated, representation 14.4 h, environment 2.7 h from 2 dated) come from the stored `lagHours`, which have parsing artifacts: the lag script (in the analysing session's record) read any time written as "~09:00" or "before 12:58", and any entry that began with "unknown", as 12:00 of the day, and read "21:46Z" as local time. Under stated rules (entry = first record showing the defect affecting a record, decision or artifact; detection = first record showing awareness; Z times converted; "unknown" entries undated), `incident-tables.mjs` gives: code defects 7 dated, median 5.6 h, range 0.1-39.9 h; representation errors 5 dated, median 14.4 h, range 9.4-30.1 h; one dated environment failure (0.7 h); the one inference error found during the programme, 1.4 h. Stored and recomputed lags differ for eight incidents: I03 (9.4 → 0.1), I04 (19.2 → 16.2), I05 (19.3 → 16.3), I06 (10.2 → 7.2), I10 (0 → 0.4, an upper bound), I13 (5.4 → undated: the reset time is recorded only as "before 17:25"), I14 (0 → 0.7), I32 (0 → undated). The manuscript reports the recomputed values and says the stored ones predate the rules.

Not applied: "no process was charged with checking claims between the first review and the audit" is kept only in that form; the paper does not say "while the programme ran" without the qualifier, because the first review (day 5) did examine experiment evidence.

### 2. The test-suite sentence — applied

Checked: the inclusion rule's exclusion "defects caught by tests or verification gates before use" (register); excluded candidates caught by the data verification gate (94d1b7a44; the provenance-probe entry from raspuns.md; "six mistakes" #1); I05 consequence (`statesValue('2', '2 + 2 = 4')` returned true); 0cdc4588c message ("all 265 holdout solutions corrupted, every prompt byte-identical; the test now does exactly that"); 289 tests in the day-5 review's verified-state table; "suite 382" in e230b2146; the two "TEST SUITE FAILED ... stopping for a human" lines (24 Sep 15:41:55Z, 25 Sep 11:18:14Z).

Applied: "none of the 32 could have been" deleted; the zero is called partly definitional; at least four code defects (I05, I06, I10, I27) break a unit-testable intent and the fix for I06 added such a test; "test it thoroughly" removed; unit tests added to Table 5; the conclusion no longer says tests caught nothing in general.

Not applied: "the review that found I05 and I06 wrote small reproductions of them". The review file reproduced the readiness weakness (I01, R2, a mock server) and the numeric-scoring defect (I05, R9), but established the reference-solution dependency (I06) "by tracing source paths". The final text does not mention the reproductions (cut for length).

Added from the records: the two stops after rebuilds are in Table 4. The first was followed an hour later, two minutes after commit b5fd06f88 updated the tests' pinned dataset counts, by the next launch (78526295a); the second by c945ce3ec ("the arm is deliberately NOT launched", the lead's call).

### 3. The agent coding — applied, with facts the review could not see

Checked: `incident-coding-input.json` fields (id, component, description, consequence); the coding sheet headings ("### I01 (evaluation)"); component against category (environment → E 3 of 3; reporting → I 7 of 8); file times (register 21:45:47, codebook and coder input written together at 21:47:26, codings 21:48:10 and 21:48:12, agreement 21:48:32, final coding 21:49:00, all 28 Sep local); I22's neutral description ends with a sentence that pre-codes it; both resolutions follow coder B (final coding `adjudication` fields).

Who resolved the disagreements, and how (records outside the repository): the job timeline (`<home>/.claude/jobs/69b234c8/timeline.jsonl`, entries at 19:47:16Z-19:48:47Z) and the analysing session's transcript show that the analysing session (Claude Opus 5.5, the session that commissioned the register, wrote the codebook, and drafted the manuscripts) extracted the coder input, wrote the codebook, launched the two coders, computed agreement, and then wrote `incident-coding-final.json` itself with the two adjudications, about half a minute after the second coding arrived. The coder transcripts (`.../subagents/agent-a4f6da8925fd6751d.jsonl` for A, `agent-a3ab9e183f66c3de8.jsonl` for B) show both were Claude Opus 5.5, instructed to read only the codebook and the coder input and not to use git; each read exactly those two files, wrote its output with one shell command, and finished in about 40 seconds; B worked in reverse order. The register itself was compiled by another Claude Opus 5.5 session (`agent-a9195d5880a92ebe4`, 21:31-21:47 local), whose instructions asked for neutral descriptions and prescribed the route categories.

Applied: abstract names the agent coders and the pending human coding; Section 4.4 states what the coders saw (including that the inputs carry category information: 3 of 3, 7 of 8, and the audit named in the consequence text of 6 of the 11 audit-detected incidents, computed by `incident-tables.mjs`), that the analysing session wrote the codebook after the register and resolved both disagreements in favour of coder B, that routes and dates were assigned by one session only, and that the codings are not independent human judgement. Section 4.5 is a pre-specified protocol with a visible `[PENDING: ...]` placeholder, a κ < 0.6 decision rule, a human adjudicator, a sheet without component labels or route-naming sentences, route coding, checking the 41 exclusions, screening the 45 unscreened commits, and coding the follow-up defects.

Modified: the review's sentence "neither saw ... the evidence pointers" is not quite true; some consequence texts quote commit identifiers and times. The manuscript says the coders did not see the register's route, date or evidence fields.

### 4. Abstract and introduction — applied in modified form

Applied: problem-first abstract (249 words); introduction opens with the problem, states the gap against named work, gives the case and lesson, RQs, bulleted contributions, and the companion manuscripts. The opening vignette moved into Section 5.4, rewritten.

Not applied: the review's proposed abstract has about ten numbers; the house rule allows at most two.

### 5. Section 4.6 — applied

Moved after RQ3 as Section 5.7 ("A follow-up: two checks applied to later work"), about 390 words; the three-level results table removed; one conclusion-changing example given in plain words (withheld type: exact 0 and 0; strict 33 and 5; judges 24 and 2, of 40; checked in `comparison/comparison.json`, `e9-js1-qwen3-17` and `e9-ft-exp021`) and one sentence on the operator-plan gap (44, 9, 49, 40 of 55 in `e8-ops3-l0-qwen3-17` and `e8-js1-l0-qwen3-17`, rounded from counts); "corrected" replaced; judges named (Claude Opus 5.5, verified in `comparison/judge-sessions.json` and the orchestration records); calibration limits stated; the self-reference and the "two independent judges" wording removed. The follow-up defects are described in prose rather than a table, for length.

### 6. Who did what — applied in modified form

Applied: Section 3.3. Verified facts: all 243 commits of 18-28 Sep carry the lead's git identity; the plan of day 9 (143605893) gives data repair and an article rewrite to two agents; the lead reads an owner-facing status file (385bb5b17) written in Romanian (0ff94e0ee); the handoff file (training/STATE.md) calls the day-5 review "the external review". From local session records outside the repository: the day-5 review was a Codex CLI session (codex-tui 0.155.1, model gpt-6-astra) that ran from 06:55 to 07:11 UTC and wrote astra_review.md (`~/.codex/sessions/2026/09/22/`); the audit's first round, which created claim-ledger.md and baseline-audit.md, was a Codex CLI session with gpt-6-astra on 28 Sep (`~/.codex/sessions/2026/09/28/`); the second round, the register, the codings and the judging were Claude Opus 5.5 sessions.

Not applied: splitting Table 3's first row into agent and lead, and adding "introduced by" and "first detected by" fields to the register. The records attribute only I11 to the lead (said in the text); adding fields would change the evidence files. The tool and model of the working-thread sessions of 18-27 Sep are not identified by any record found; a placeholder asks the authors.

### 7. Case-study method — applied

Appendix A (Table 6) lists all 32 incidents with component, category and seam, route and recomputed lag; incident identifiers are cited in the text; case and unit of analysis stated; sources per incident reported (15 one, 13 two, 4 three; six only on the audit ledger); data gaps listed; threats restructured (instrument and researcher bias, screening gap, route scope and timing, construct validity, external validity and reliability).

Not applied: "a revelatory case in Yin's sense" and "one of the first agent-operated research programmes" (primacy claim, and Yin not verified here).

### 8. Related work — applied in modified form

A short Section 2 (about 330 words, six paragraphs) with 17 new references, each verified (Crossref, arXiv, OpenAlex, or the article text) and recorded in `bib-ese-audit.json` with the proposition used and what it does not establish: Islam et al. 2019; Humbatova et al. 2020; Nahar et al. 2022; Zhang et al. 2022; Jimenez et al. 2024 (SWE-bench; venue from the authors' arXiv comment because OpenReview blocked the fetch); Yang et al. 2024; Watanabe et al. 2026 (TOSEM, the published version of the agentic pull-request study); Avizienis et al. 2004; Hatton and Roberts 1994; Storer 2017; Barr et al. 2015; Chen et al. 2018; Cemri et al. 2025 (NeurIPS); Ahmed et al. 2025 (MSR); Flanagan 1954; Ralph et al. 2020; Bainbridge 1983.

Not used (verified to exist but left out for length): Thung et al. 2012, Zhang et al. 2018 (TensorFlow bugs), Serban et al. 2020, Wan et al., Paleyes et al. 2022, Miller 2006, Wilson et al. 2014, Heaton and Carver 2015, Gilardi et al. 2023, Reason 2000, Ralph and Tempero 2018, Sjøberg and Bergersen 2023, Shankar et al. 2022, Li et al. 2025. Not used because not verified: Pineau et al. 2021, Lwakatare et al. 2019, Gunawi et al. 2016, Beyer et al. 2016, Yin, Runeson et al. 2012 (book).

### 9. Title, Section 4.1 heading, overreach — applied

New title; heading "The item records were reproducible"; scope stated (24 fine-tuned checkpoints and two quantised variants, 13,330 records, from `reexecution-summary.json`; generation not re-run; diagnostics, adaptation and base-model runs not re-executed); "not in how records were kept" removed; I03 and I27 named.

### 10. The commit screen — applied in modified form

Checked with `git log`: 240 commits fall in 18-27 Sep (the register's own command wording, "--until=2026-09-29", would include three commits of 28 Sep and give 243); 25 subject lines match; 70 full messages match; 45 match only in the body. All five example hashes are among the 45.

Applied: "subject line" throughout; "wrong" added to the term list; the post-programme exclusion stated; the ledger row renamed; the abstract no longer claims every candidate was screened; the stop-rule exclusion explained; the gap disclosed as a threat that biases the register towards the headline, with two verified examples.

Not applied: the preferred fix (screen the 45 and update Table 1). Table 1 and the register are evidence files that this revision may not change, and a screen by an agent session would repeat the single-agent problem of item 3. A preliminary triage is below, and the human protocol includes the screen.

### 11. The guard evidence — applied, with one correction to the review

Checked: the six human-addressed lines in `evaluation/registry/overnight-pipeline.log` and the lines after them; six "a human or an agent must look" alarms in `stall-check.log`; `overnight-tail.sh` as committed in f68a00a91 (07:41:28 local): `wait_chain` logs "chain closed WITHOUT metrics — a human must look" and returns, and the next lines log "launching" and start the run unconditionally; the watcher's first warning at 05:40:43Z is 45 seconds before that commit and the second at 05:45:09Z about four minutes after it.

Applied: Table 4 with all six messages; the selection gate described as a gate that held, followed by a hand-written launch script with no recorded review; "no human present" replaced by "the failure was not that nobody was awake but that nobody could act in time"; Section 6.3 rewritten; the abstract, Table 5 and the conclusion adjusted.

Modified: the review calls the 08:24:18Z "CHAIN FAILURE ... a human must look" message "answered". Commit 3812a7924 (11:16 local) records that the sentinel's exit fired on a stale failure line between training completion and the new chain starting, killing the queue; the chain started 81 seconds after the message and the tail was re-armed at 09:16:24Z. The table calls it a false alarm after which the sentinel's exit stopped the queue. The stall-sentinel alarms are mentioned and their follow-up is marked as not traced.

### 12. Section 5.2 — applied in modified form

Applied: 15 of 32 first detections by the reviews and the audit, eight of nine inference errors; the factors (instruction, timing, scope, hindsight, possibly model) cannot be separated; the recommendation is marked as untested.

Not applied as stated: "by its own header, the day-5 review took about five minutes". The header gives a time window ("approximately 07:00-07:05 UTC"), not a duration; the Codex session record shows the session running from 06:55 to 07:11 UTC. The manuscript says "about a quarter of an hour".

### 13. The comparator narrative — applied, with one claim not applied

Checked: decompose-to-solve outcomes per run from `evaluation/registry/<run>/items/holdout.jsonl` (exp-021 92 mismatches and 8 execution errors; exp-022 41 and 59; exp-023 64 and 36); exp-021 scored 25 Sep 18:27 and e230b2146 at 26 Sep 03:55 (9.5 h); restricted-parser counts 64, 0, 0, 2, 54 (the `*-restricted.jsonl` files and `scheduling-zeros.mjs`); right-in-other-wording counts 18 and 5 (`scheduling-zeros.mjs`, same test as `ml-review-checks.mjs` section 5).

Applied: the reading is of "a later run's records" (two runs after the first, 9.5 hours on); the final sentence now gives 142 of 300 execution failures, 56 parser-accepted (54 in one run) and 23 more right in other wording, for the three runs that targeted the stuck books (data versions 9, 11, 12).

Not applied: "the common-sense zeros (0 of 50 in each run) had computational causes". A check of the item records finds common-sense mismatches that contain every reference number (12 of 19 mismatches in the data-version-9 run, 9 of 44 in the data-version-11 run), and the audit reproduced the guard mechanism for only 15 of 36 failures in the data-version-12 run. The claim is not established, and the sentence "Most of the zeros the programme spent effort on were real failures" was replaced by the measured counts.

### 14. Populations of claims — applied

"20 of the 32 incidents" with 11 and 9; five inference errors on days 9-10 and three before the change of aim, with the times checked by script (I20 and I29 64 minutes before, I21 18 minutes before; the text says "within about an hour" rather than "in the hour"); "all six components; three more were environment failures"; "the dated ones within 40 hours" (seven dated under the stated rules, not eight); "announced themselves" and "broke something" removed for latent code defects; I22's uncorrected summary file mentioned; "the pattern is sharp" deleted.

### 15. Latent incidents — applied

26 realised; I05, I06, I09, I32 latent or without demonstrated effect; I29 and I30 changed only numbers nothing depended on (phrases asserted against the register's consequence texts in the script).

### 16. Dating rules and script — applied, and extended

Rules stated in Section 4.3 and implemented in `incident-tables.mjs`. The recomputation found parsing artifacts for eight incidents beyond the one the review named (see item 1). Under the stated entry rule, I18's entry is its first recorded misreading (26 Sep 14:56 in the register), not the creation of the name; commit b747dc15a suggests an earlier misreading, caught before commit on 25 Sep (see the triage below).

### 17. Terms and tables — applied

Terms defined in Section 3.2; Table 2 split into seam rows; the example corrected to "exact-phrase mismatches read as wrong answers"; one sentence on the fault-error-failure vocabulary with Avizienis et al.; "oracle-assisted" replaced by "assisted".

### 18. Overlap with 01 and 04 — applied

Rewritten: the solver-test paragraph, the Kapoor and Narayanan sentence (now used only in related work, with the proposition recorded in the bibliography audit), the stop-rule sentences, the four-minute correction (now told from the working thread's reading of the failing answers), and the judge statistics. The identity case is cut to about 90 words with a pointer to the companion manuscript. A 7-word shingle comparison now finds one shared 7-gram with 04 ("0.5 to 1.7 billion parameters"), and with 01 only the shared language example and the phrase "untuned 1.7B model writing JavaScript and"; with 02, the parameter range and "exact or accepted by both of two".

### 19. Codings of I28, I13, I32 — applied in modified form

I28 described as "no recorded cause, coded E by default", with the alternative stated; I32 as agent conduct without a category of its own. The codings themselves are unchanged. I13's /tmp choice is visible in the text ("scripts kept in /tmp") but not discussed further, for length.

### 20. RQ3 and Table 5 — applied

RQ3 renamed; Table 5's last column rewritten as observations; the inference row says an earlier pass is untested; unit tests added; the metamorphic-relation link moved into the table.

### 21. Declarations — applied

File list given; agent roles in the study listed (register, descriptions, codebook, codings and adjudication, audit, judging, drafting and revising); placeholders for the person who checked the numbers and the record of that check, and for the archive link.

### 22. Timeline figure — not applied

A figure needs a new asset under `article/assets/`, which this revision may not create. Suggested design, if the authors want it: generated from `incident-tables.mjs --json` (per-incident entry and detection), days 1-11 on the x-axis, one row per incident grouped by category, a bar from entry to detection coloured by route, vertical lines for the first review (day 5, 09:00) and the audit (day 11), and the two cascades outlined.

### 23. Wording — applied

Keywords replaced; "argued"; the comparator sentence; "decisive evidence" removed; "beside the resumed one"; the 23:45 local (21:45:48Z) first reading of "series done" and its link to the base-model comparison; each review's model named where the records allow.

## Coordinator updates

- Judge sessions: all Claude Opus 5.5, checked in `comparison/judge-sessions.json` (14 listed) and the transcripts of the pass-2 judges; the fourth pass is not yet in `judge-sessions.json`, so the manuscript says "Claude Opus 5.5 sessions" without a count.
- Orchestration records: checked in `comparison/agent-sessions/` (README and JSON files); the manuscript says full transcripts were not retained but orchestration records with each session's model, number of tool calls, last tool and instructions were, so the tool-use audit can be re-checked in part. The superseded Sonnet b4 record's last tool is a `python3` command, consistent with the scripted batch.
- Judge statistics: checked in `comparison/judge-agreement.json` (2,073 pairs = 2,048 answer pairs + 25 injected pairs; observed agreement 0.9826, κ 0.9653, 36 disputed; 50 parser-equivalent answers accepted by both). After the coordinator's correction, the injected pairs are 24 distinct known-wrong answers plus one correct control: `judge-calibration-key.json` has 25 "different" rows, but pid cbb8c5c11c8c appears twice (checked), and `judge-agreement.json` now reports knownWrong 24, accepted by neither judge. The manuscript uses "36 of 2,073 pairs (κ = 0.97)", "none of 24 injected answers known to be wrong", and "one of four judging passes had none" (calibration items). The duplicated key row is itself a small miscount in an audit artifact; the manuscript does not mention it, for length.
- The newline defect: checked in `comparison/ml-review-checks.md` section 4 (the simplified-statement run: 7 of 15 coalition programs identical with the newline removed, 15 of 15 with it restored). Added as one sentence in Section 5.7; the follow-up now lists four defects, coded in the authors' reading as two code defects, a population → population error, and agent conduct.

## New numbers and their sources

| Number in the manuscript | Source |
| --- | --- |
| 45 commits match only in the message body (70 full-message matches of 240) | `incident-tables.mjs` (git log, 18-27 Sep) |
| 15, 13 and 4 incidents with one, two and three sources; six only on the audit ledger | `incident-tables.mjs` (register `candidate_map`) |
| 26 with a realised consequence; 4 latent or without demonstrated effect; 2 numbers nothing depended on | `incident-tables.mjs` (phrases asserted in the register) |
| 3 of 3 environment incidents coded E; 7 of 8 reporting incidents coded I; audit named in 6 of 11 coder texts | `incident-tables.mjs` |
| 9 of 9, 8 of 11, 1 of 9, 3 of 3 detected during the programme | `incident-tables.mjs` (final coding routes) |
| Median about 6 h (7 dated) and 14 h (5 dated); every dated in-programme detection within 40 h; Table 6 lags | `incident-tables.mjs` (stated dating rules) |
| Stored lags differ for eight incidents | `incident-tables.mjs` |
| Audit found 6 of 7 inference errors among 26 realised incidents | `incident-tables.mjs` |
| Five inference errors on days 9-10; three within about an hour before the change of aim | `incident-tables.mjs` (change of aim from commit 143605893) |
| Six human-addressed messages; six stall alarms; Table 4 times | `incident-tables.mjs` (logs), local time = UTC + 2 |
| 142 of 300 execution failures; 56 accepted (54 in one run); 23 more right in other wording | `scheduling-zeros.mjs` |
| 289 tests on day 5; 382 by day 9 | astra_review.md (0cdc4588c); e230b2146 message |
| 24 fine-tuned checkpoints and two quantised variants | `reexecution-summary.json` |
| Codebook within two minutes of the register; coders returned within a minute; adjudication within a minute | file times (`stat`), coder transcripts, job timeline (records outside the repository) |
| First review took about a quarter of an hour | Codex session record, 22 Sep 06:55-07:11 UTC (outside the repository) |
| Watcher warnings within five minutes of the morning report's commit | overnight-pipeline.log (05:40:43Z, 05:45:09Z) and f68a00a91 (07:41:28 local) |
| 36 of 2,073 pairs, κ = 0.97; none of 24 injected wrong answers; one of four passes without calibration | `comparison/judge-agreement.json` (knownWrong 24); `judge-calibration-key.json` (one duplicated pid); `comparison/README.md`; coordinator |
| 8 of 15 programs changed by the missing newline | `comparison/ml-review-checks.md` section 4 (`article/experiments/ml-review-checks.mjs`) |
| Identity recorded correctly three times; one misreading caught before commit | run manifest; 351835e37 (roster); b747dc15a (draft and its commit message) |
| 20 of 32 (11 + 9) | Table 2 |

Rounding: κ 0.9653 → 0.97; 44, 9, 49 and 40 of 55 → 80%, 16%, 89%, 73% (from counts); medians 5.6 → "about 6", 14.4 → "14".

## Preliminary triage of the 45 unscreened commits

Done by this agent session during the revision, from the full commit messages; not checked by a person and not entered in the register.

- Concern registered incidents (19): 922debb52 (six-mistakes list), a3572074c (I24), fa913ac88 (I20, I29), d7146aab5 (I19), 52249feb7 (I19), e230b2146 (I19, I23), 3812a7924 (I15 recurrence), b8be865d5 (I15), 1ddbb0640 (I10), 215eed190 (I11), 865b9dd73 (I01), 9f92b5c4f (I08), 0159cb242 (I31), d2357a0a6 (I08), ca388ef56 (I08), 7236007f6 (I03, I04), d00869e66 (I06), 6bc6899cd (I02), 6c3e35322 (I03).
- Concerns an already excluded candidate (1): bcf55b270 (provenance probe, caught by the verification gate).
- Would be excluded by the rule (21): 6f950605c, 02ebd9b97, e748be001 (caught by verification), 74b5d8cf0 (retry-hint design, no recorded consequence), 87ce8a968, 6701d048d, aa2e2608a, 6e42a1557 (interactive chat only), f3517f87a and 0d525d7df (defects caught by tests), 834f1ab51 (target design iteration), 4ee021c58 (interpretation refined by a new measurement; two loud crashes), 385bb5b17, 016216b83 (bug fixed before reporting), 41db77c0a, 0e1bcfd48 (report-step crash and wrong key fixed before reporting), 56583ebe3, 48ad88a2f, a9a9905c3 (loud failure prevented), e4a17df97, 3bfe5bca4 (stale prose replaced).
- Bear on the register (4):
  - e2a37db42 (22 Sep 09:21): "exp-002 and exp-003 are corrected to 0 of 225 (earlier summaries said 1)". The wrong count entered training/STATE.md at 6c3e35322 (21 Sep 21:24); the day-5 review had recomputed exp-003 as 0 of 225 from item records. A reporting miscount found during the programme, right after a review that checked claims.
  - b747dc15a (25 Sep 16:20): "Two fabrication passes were caught and fixed before commit: the base is Qwen3-1.7B (never a 17B), and the prose-baseline row carries only the numbers the report actually records." An earlier instance of I18's misreading, caught on day 8; if merged into I18, its first detection moves into the programme. The invented prose-baseline numbers are a second caught candidate.
  - b1bf166bc (23 Sep 14:35): the watchdog "can no longer spawn duplicate supervisors (the defect that ran three exp-014 trainers at once)". A possible orchestration incident not in the register; its consequence is not recorded beyond this sentence (the programme's own draft, docs/article/05-discussion.md, claims two nights lost to three concurrent trainers, which I did not verify).
  - 9d5042cb8 (22 Sep 18:12): the author's own review found two gaps in the jsEval contract 14 minutes after it was introduced; latent, borderline under the rule.

## Points that need the human authors

1. Name the tool and model of the working-thread agent sessions of 18-27 September (placeholder in Section 3.3). No transcripts of them were found among the records.
2. Confirm the tool and model attributions taken from local session records outside the repository (day-5 review and the audit's first round: Codex CLI, gpt-6-astra; register, codings, adjudication, audit second round and judges: Claude Opus 5.5), and decide whether to archive the coder transcripts, the job timeline that records the adjudication, and the Codex session records in the replication package.
3. Confirm the description of the lead's role (Section 3.3).
4. Run the human coding: name the coder and the adjudicator; regenerate the coding sheet without component labels and without sentences that name the detecting process (the current `incident-coding-sheet.md` shows the component in every heading); prepare the route accounts; insert the results at the `[PENDING: ...]` placeholder.
5. Decide on the 45 unscreened commits (triage above). At least two would change Table 1 and Table 3; updating the register, its coding and the stored lags is an evidence-file change this revision did not make. `incident-tables.mjs` regenerates the tables after any such change.
6. Merge `bib-ese.json` and `bib-ese-audit.json` into the bibliography and its audit, then rebuild. Note that `article/scripts/audit-documents.mjs` still expects five manuscripts; the 03 build itself works with the merged bibliography (checked in a scratch folder).
7. Fill the declaration placeholders: who checked every number and where that record is; the anonymised archive link; author details, funding, competing interests. Declare the companion manuscripts in the cover letter (not edited here).
8. Decide whether Table 6 stays as Appendix A or moves to the supplement, and whether to add the timeline figure (design under item 22).
9. The stored `lagHours` in `incident-coding-final.json` predate the dating rules and differ for eight incidents; regenerate that field if the evidence files are revised.
10. Check the manuscript's reading that the day-5 review triggered the 1-of-225 correction (e2a37db42); the records show the review's recount and the correction four minutes after the review remediation commit, but no explicit link.
