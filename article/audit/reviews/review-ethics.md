# Review: article/manuscripts/04-ai-and-ethics.md (AI and Ethics, double-anonymous)

Verdict: close, but not yet ready to hand to colleagues. The case is vivid and honest in tone, the prose is clear, and the thesis suits the journal. One focused revision (items 1 to 8) should make it ready.
Change 1 (case record): add the day-9 status-file answers that deleted the correct roster and invented a 17B "control experiment" two hours before the change of aim. Also show that the headline rested on the unrecorded re-scoring as well as on the misread name. Both facts change Sections 3.2, 5.2 and 5.3.
Change 2 (argument): rebuild Section 5.3 around answerability, authorship norms and tracing. Drop its false premise that the agents "did what they were asked with the information they were given". Answer the four strongest objections in a new subsection.
Change 3 (anonymity and overlap): the repository is public under the lead's name and contains every English phrase the paper quotes, so do not push this manuscript and restrict the repository or paraphrase. Rewrite the passages that repeat the ESE paper (03) near-verbatim, and make Section 6 normative rather than a second list of the ESE checks.
Items 9 to 25 are revisions a co-author round can absorb. None needs new experiments, only records already in the repository (commit hashes are given so each fact can be checked).

Conventions below: T is the change of aim (day 9, 20:37 local). Day 1 is 18 September. Quotations from Romanian records are my translations.

---

## 1. The timeline omits the status-file answers that invented the 17B control (Table 1; Sections 1, 3.2, 5.2, 5.3; abstract)

Problem. Section 3.2 says the correct identity "was in the roster and in the earlier draft, but those were not the records being read that evening". The abstract says the false supporting details came from "drafts written overnight". The records show something earlier and closer to the lead, and neither the paper, the incident register nor the claim ledger mentions it:
- 14:56 (T − 5 h 41 min, 0ff94e0ee). The "17b ... size does not help" note was appended at line 99 of the status file. At line 19 of the same file the roster still read "exp-017-qwen3-17b | Qwen3-1.7B | dv3". Line 39 promised the run would reach the chat "with the full identity (1.7B · Qwen3-1.7B · dv3 · training date)". So the correct identity sat 80 lines above the misreading, in the file being written.
- 18:31 (T − 2 h 06 min, 7cd94759d). The file was rewritten "as the current status only", and the roster disappeared.
- 18:35, 18:41 and 18:46 (T − 2 h 02 min to T − 1 h 51 min; 0da4c6eb8, f4b8ed3d0, 6b5a15309). Three further rewrites followed:
  - "the model 10 times larger (17 billion)" (18:35);
  - under a heading reading "Yes, we tested the 17-billion model", "Qwen3-17B (17 billion parameters), trained by us this week", with the run's evaluation path offered as evidence (18:41);
  - under the English heading "Which model is which — stated plainly", "We also trained Qwen3-17B once, as a control experiment, to check whether the failures came from the model being too small ... Therefore model size is not the problem" (18:46).
- 19:02 (20e617042). The version that records the stop rule still carries the "control experiment" section.

Why it matters.
- (a) An agent-written record for the lead invented a model name, a size ratio and a purpose two hours before the change of aim, not overnight.
- (b) Presenting a run as a planned control after its result was known is Kerr's HARKing, more literally than anything the paper now cites it for. It strongly supports the first alternative reading in 5.2.
- (c) Both headings read as answers to questions. If the lead asked which model was which, then 5.3's "accepted its first confirmation without asking for the model's identity" is wrong in a way that matters. The lead asked, and the process that had produced the claim answered from its own summaries. The failure was asking the wrong source, not a failure to ask. That is exactly the point of Duty 2, and it is fairer to the lead.

Fix. The lead should first check, from memory or the session records (these are not in the repository), whether those headings answered the lead's own questions. Then:
- Add to Table 1:
  - | Day 9, T − 2 h 06 min | Status file rewritten as "the current status only" | The roster, and the correct identity with it, is removed |
  - | Day 9, T − 2 h to T − 1 h 51 min | Status file, rewritten three times under headings that answer questions | Calls the run a model "ten times larger"; names a 17-billion-parameter model of the same release family, which does not exist; says it was trained as a control experiment to test whether the failures came from the model being too small |
- Extend the existing T − 5.7 h row with: "appended to the file whose roster, higher up, still listed the run as the 1.7B model".
- In the abstract, change "had labelled the model correctly the day before" to "had labelled the model correctly until that afternoon".

Proposed text (3.2, replacing the "Second, the claim moved through summaries" paragraph):
> Second, the claim moved through summaries, and the summaries rewrote themselves. When the afternoon note read the run as a 17B model, the same status file listed it, eighty lines higher, as the 1.7B model. Two hours before the change of aim the file was rewritten as the current status only, and the roster disappeared. In the next fifteen minutes it was rewritten three more times, under headings that answer questions: whether the 17-billion model had been tested, and which model was which. The answers named a 17-billion-parameter model that does not exist, called it ten times larger, and said it had been trained as a control experiment, to test whether the failures came from the model being too small. No such control was planned; the run had been named before its base model was chosen. The purpose was supplied after the result [@harking].

Anonymity: the 18:46 wording is English and sits in the public repository's history. Quote it in paraphrase, as above, while the repository is public (item 3).

## 2. Section 5.3 states the central claim on a false premise and does not argue it

Problem. The thesis gets about 180 words, and its key step is "The agents did what they were asked with the information they were given."
- That premise contradicts the paper's own evidence: invented "fine-tuned on the same synthetic data" and an experiment that "varies the model size" (3.1). It also contradicts item 1: the agents had the correct identity in the file they were editing, and nobody asked for a control experiment. An ethics reviewer will see the argument exonerating the agents in order to relocate responsibility. That is unnecessary, and it weakens the case.
- The paper never says which responsibility "stays". It borrows Santoni de Sio and Mecacci's forward-looking "active responsibility", but gives no account of the backward-looking question it raises: were the authors culpable for the error of day 9?
- It makes no link to authorship norms, where the claim is already established policy: AI tools are not authors because they cannot take responsibility. The paper's distinctive contribution is extending that ground from the prose to the evidence, and it should say so.

Fix. Replace 5.3 with an argument that does not depend on the agents having behaved well. It has three steps:
- Answerability is the sense at issue.
- Agents cannot hold it, which is the basis of the authorship policies.
- Culpability traces to earlier choices, and by day 9 the risk was foreseeable. The records show this: two written diagnoses had been withdrawn, in whole or in part, on day 5 (incident register I04, after a separate review; I08, after item reading), and a standing identity rule, issued on day 7, was never enforced (item 10). The citations are listed in item 14.

Proposed text:
> **5.3 Responsibility does not diffuse to the tools.** It is tempting to describe the case as a responsibility gap [@respgap], since the rewrite, the status answers, and the variants were produced by agents. We think the description is wrong, and not because the agents behaved well. They did not: with the correct identity in the file they were editing, they named a model that does not exist, gave it a purpose, and later described an experiment that never ran. The argument rests on three claims instead.
>
> First, the responsibility at issue is answerability: the standing obligation to give, and to be held to, an account of why a published claim is warranted [Shoemaker 2011]. An agent session cannot hold it. It cannot be asked next month to defend a claim, cannot be sanctioned, and cannot withdraw what it wrote. This is the ground on which publication-ethics bodies decline to list AI tools as authors [COPE 2023; ICMJE]. Those policies were written about text. The case shows that the same ground covers evidence, because in an agent-run programme the evidence the authors read is also text that agents write.
>
> Second, the lead's culpability for that evening does not require having seen the error. It traces to earlier choices [Fischer and Ravizza 1998]: a workflow in which agent summaries were the usual interface to the evidence, and in which every commit carried the lead's name. By the ninth day the risk was foreseeable. Two of its written diagnoses had been withdrawn, in whole or in part, four days earlier, and a standing instruction to state each model's identity from its records had been in force for two days without anything enforcing it. Ignorance that results from a foreseeable risk one chose to run is not blameless [Smith 1983].
>
> Third, answerability can be kept only by someone who remains able to check. Delegating implementation and first drafts therefore moves the human's work from producing evidence to auditing it, and that work is easy to under-provision because delegated output looks finished. The active responsibility that Santoni de Sio and Mecacci describe [@fourgaps], a forward-looking duty to secure good outcomes, belongs to the people who direct the agents. It is exercised through checks built into the work, not by reading summaries.

## 3. Anonymity: the repository is public under the lead's name and contains every English phrase the paper quotes

Evidence (checked 29 September).
- `origin` is github.com/ml-circuits-research/sopLang-llm, and the GitHub API reports `"visibility": "public"`.
- All 243 commits from 18 to 28 September carry the lead's name and personal e-mail.
- Files at the public HEAD contain these quotations verbatim: "the project's own 17B" (7 files), "four independent subagents" (2), "fine-tuned on the same pipeline", "fine-tuned on the same synthetic data", "varies the model size", "as good as large ones", "our own 17B", "no training, no further arms", and the 17B diagram node. A reviewer who pastes any of them into GitHub code search or a web search reaches the repository and the author.
- The public branch also holds an earlier AI and Ethics draft (article/manuscripts/05-ai-and-ethics.md, "Who is responsible for an executable claim?"). It names the system and argues that the duties "remain with human authors".
- The current manuscript, PORTFOLIO.md, the cover letters and docs/04-* are untracked, so they are not public yet.
- The DOCX and PDF metadata of the current build are clean: no author, and no local paths.

Fix, in this order:
1. Do not commit or push anything under article/ to the public remote before review ends.
2. Make the repository private for the review period, or remove the article drafts, status file and decision document from the public tree. Public archives, such as Software Heritage for public GitHub repositories, may already hold copies, and those cannot be withdrawn.
3. Therefore, in the anonymised manuscript, paraphrase every quotation that exists in English in the repository, and restore the verbatim quotations after acceptance. Suggested paraphrases:
   - "the project's own 17B" becomes "a 17B model of the project's own";
   - "four independent subagents" becomes "as independent judgements by four agent sessions";
   - "fixes the training pipeline and varies the model size" becomes "a comparison that held the training method fixed and changed only model size";
   - "until then, no training, no further arms" becomes "no training of any kind until then".
   Quotations translated from Romanian are not directly searchable and can stay.
4. Tell the editor about the related manuscripts. Cite them only in anonymised form (item 21).

## 4. Add a subsection answering the objections an ethics reviewer will raise (new 5.4; the current 5.4 becomes 5.5)

Problem. Section 5.2 weighs alternative readings of why the error survived. Nothing weighs objections to the normative claim. The four standard ones are:
- the moral crumple zone (Elish 2019);
- ought implies can, given the volume of agent output;
- shared responsibility with the providers of the tools (many hands, and Nissenbaum's fourth barrier, "ownership without liability", which the paper omits);
- no intent: research-misconduct definitions require fabrication, falsification or plagiarism committed "intentionally, knowingly, or recklessly" and exclude honest error (US Federal Research Misconduct Policy, OSTP 2000).

The last one is where this paper can say something the ESE paper cannot: what makes reliance on unverified agent prose honest error rather than recklessness.

Proposed text:
> **5.4 Objections.** *The moral crumple zone.* Elish shows how responsibility for failures of automated systems falls on the nearest human, who had nominal control and little real control [Elish 2019]. Our thesis could be read as building such a zone around authors. It does not, because authors are not operators placed at the end of a system designed by others: they choose what to delegate, which checks to run, and what to publish. That is why the duties in Section 6 are duties of design rather than of vigilance.
>
> *Ought implies can.* On the ninth day the status file alone was committed seventeen times, and the programme made 240 commits in ten days. No author can read such a record. The duty is not to read everything. It is to publish only claims that have passed checks the author can vouch for, and to delegate no faster than those checks can run.
>
> *Many hands.* The providers of coding agents share responsibility for a known tendency of their systems to fill gaps with plausible specifics, and journals share responsibility for what they ask authors to disclose [@manyhands; @nissenbaum]. These are enabling duties. They do not reduce the authors' answerability to readers, just as a faulty instrument does not relieve the authors who publish its readings of the duty to correct them.
>
> *No intent.* Definitions of research misconduct cover fabrication, falsification and plagiarism committed intentionally, knowingly or recklessly, and exclude honest error [OSTP 2000]. No one intended the invented control experiment. But had the variant that described it been submitted, its methods would have reported an experiment that never ran, under the authors' names. Whether that counts as honest error or as recklessness depends on what checks a reasonable author of agent-assisted research is expected to run. The duties that follow are our proposal for that standard of care.

(The counts are checked: 17 commits touched the status file on 26 September, and 240 commits fall between 18 and 27 September, which matches the ESE paper.)

## 5. Section 3.3 is not a second, separate instance: the headline rested on the unrecorded re-scoring, and so did the night's data change

Evidence.
- At T, the status file listed "dv7 containers: 77.2% (best)" and "qwen3-17b: 64.8%" (143605893).
- The rewrite at T + 6 min stated the headline as two per-family comparisons, "0/20 on world-as-a-system and 0/100 on decompose-to-solve" against "20/20 and 66/100 under the same semantic scorer" (b6a00809b, 01-introduction.md). The 66 of 100 exists only in the unrecorded judgements.
- At T − 17 min, the note diagnosing why no model had solved the "common-sense" problem family rested on "49/50 semantic" (5ea409157). That note is the basis of the data version committed at T + 24 min (incident I21), which no run's training data supported.
- The judge files were committed at T − 1 h 02 min "for reproducibility of the semantic re-evaluation" (2847fd576). They hold 833 inputs and no verdicts.

The paper instead calls 3.3 "another headline number" and says only that it "was repeated in notes and drafts". That understates it: both unverified results fed one decision.

Fix. Retitle 3.3 ("The number beside the name") and open it with the link. In 3.1, change "The per-family comparison that carried the headline, 20 of 20 coalition problems solved against none" to "The two per-family comparisons that carried the headline, 20 of 20 coalition problems against none and 66 of 100 scheduling problems against none, the second of which existed only in the judgements described in Section 3.3".

Proposed text (3.3, first paragraph):
> The headline did not rest on the name alone. The status file that announced the change of aim listed a meaning-based accuracy for every model: 77.2% for the best 1.7B run, 64.8% for the "17b" run. The rewrite committed six minutes later compared the two runs on two families, and the second comparison existed only in those scores. They had been produced that evening, to correct a known weakness of exact-match scoring, by re-judging every model's mismatched answers. An automated judge had failed to run, so agent sessions judged instead, and the article draft called them independent. The retained files show four disjoint slices of the candidate answers, each judged once. They were committed with a note saying they were kept so that the re-scoring could be reproduced, and they contain the inputs but not the verdicts. Disjoint slices are not independent ratings, since no answer was judged twice, and without the verdicts the scores cannot be recomputed. One of them, 49 of 50 for an early run on a family every run had failed under exact comparison, was read as showing that the early run's training data held the missing skill. The data version committed that night was built on that reading; no run's training data had contained the family.

## 6. Overlap with the ESE paper is near-verbatim in places, and three duties duplicate its checks

Pairs a similarity check will flag:
- Ethics 4.1, second paragraph (the twenty-problem solver test) against ESE Section 1, first paragraph. Shared sentences include: "given the statements but not the reference answers", "began opening stored reference files during the run and was stopped; none of its programs copies a reference", "They passed on 2 of 20", "The record written at the time estimated that about 18", "judged all twenty to state the reference value and verdict", and "exact comparison ... rejected both".
- Ethics 5.4 against ESE 5.2: the Kapoor and Narayanan sentence and its "analogue within one ... programme".
- Ethics 4.1, last paragraph, against the last two sentences of ESE 5.3: a stop rule that does not name who may lift it can be dissolved by a change of aim.
- Ethics 4.2 against the end of ESE 4.3: the diagnosis corrected four minutes later by a pass that read the fifteen failing answers.
- Ethics Duty 4 against the third bullet of ESE 4.6: the protocol "took minutes", κ = 0.96.
- Ethics Duties 2, 4 and 5 against ESE Table 5 rows: identity from the manifest with a blocking check; two blind judges with retained verdicts; a separate pass told to find reasons a headline is false.

Risk. The editor may see redundant publication, and a reviewer may call this "the ESE paper with a normative coda": at present the case sections take 1,675 of about 4,300 words, and the analysis and duties 1,281.

Fix.
1. Cite the ESE paper, anonymised, as the source of the incident register and the solver test. Cut the solver-test paragraph to two sentences (proposed below).
2. Rewrite the other shared sentences.
3. Differentiate by content. Keep what only this paper has: items 1, 5 and 8, the dissolved stop rule, and the asymmetry. Spend the saved words on 5.3, the new 5.4, and a normative Section 6 (item 12).
4. In the AI and Ethics cover letter, disclose the overlap specifically: the same programme's incidents are analysed from a software-engineering perspective in a manuscript under review elsewhere, the two share the facts of the case but not the argument, and the manuscript is supplied to the editor.

Proposed text (4.1, replacing the solver-test paragraph):
> One of the checks tested the benchmark itself: an agent, working without the trained model and without the reference answers, wrote programs for twenty problems from the two stuck families, and the benchmark's own comparator accepted 2 of them. A reading of the items judged that all twenty stated the reference value, and that the comparator had rejected them for wording [Anonymous, under review].

## 7. The title and abstract frame the case as "goal pressure", but the error served the programme's standing aim before the goal changed

Evidence.
- At 14:56, under the accuracy goal, the misreading was "decisive evidence" that "the data set is what matters".
- At 18:46 the status file said: "It is small on purpose: the whole research goal is to make a small model compile problems into circuits". It presented the "17B" as a control confirming that size was not the problem.
- Section 5.2 then concedes that influence may have run the other way.

The abstract's "On the evening the programme exchanged its accuracy target for a comparative goal ... its records produced the result the new goal needed" has two faults. The order is wrong: the result preceded the goal. And "records produced" is agentless, in a paper about who acted. The same applies to "the process pursuing the goal also wrote the evidence that would have tested it": the manifest that would have tested the claim was written by the trainer. The agents wrote the summaries through which the evidence was read.

Fix. Reframe the mechanism as congruence with what the programme wanted to be true, which peaked at the change of aim.
- Title option: "The headline the evidence never contained: wanted results, agent-written evidence, and author responsibility in automated research". Update `shortTitle` in submission/04-ai-and-ethics.json.
- Rename 5.1 to "Wanted results without an intent to deceive".
- The abstract is about 280 words. Springer's usual limit is 150 to 250; check the journal's.

Proposed abstract, second and third paragraphs:
> The programme had been pursuing an accuracy target. On its ninth day, agent-written status notes read a 1.7-billion-parameter model as a 17-billion-parameter one, because the run's name had lost its decimal point, and within hours described the run as a control experiment showing that model size did not matter. The status file had listed the model correctly until that afternoon. That evening the programme adopted a comparative goal, showing that a small model can outperform a larger one, and the misread result became its headline. The article rewrite that adopted the goal overwrote a correct label, and drafts written overnight added supporting details that were not true. A stop rule attributed to the research lead, written less than two hours earlier, had halted training until the benchmark could be shown sound; the change of aim reopened training without the check the rule required.
>
> No step required an intent to deceive. The error plausibly survived because it said what the programme wanted to be true, and because the process that pursued the goal also wrote the summaries through which the evidence was read. We argue that responsibility for agent-produced claims stays with the human authors, as answerability to readers, and we propose duties that follow: declared stopping conditions with a named owner, identities derived mechanically from artifacts, checks fixed before results are known, a record of who produced each record, and retained evidence that lets readers disagree.

## 8. Section 4.2 presents a partial correction as a success and misses the paper's best evidence of asymmetric scrutiny

Evidence.
- The run that "fell from 20 of 20 to 5 of 20" was the second of the two runs launched over the stop rule. Its false drop came from exactly the fault the rule had identified that evening. Sections 4.1 and 4.2 read as unrelated.
- The correction deleted the wrong diagnosis instead of keeping it beside the correction (17243a362). The programme's separate summary file (summary.md) still says the data change "regressed the container book" (incident I22). The paper's own example does not meet its Duty 6.
- Directly above the corrected diagnosis, the same file's "Final night result" paragraph kept two statements. It still said "world-as-a-system regressed 20/20 -> 5/20" (the corrected claim, left uncorrected one paragraph away), and it ended "the article headline stands: the 1.7B trained through the loop beats the 17B" (c3dc256ab, lines 44 to 50).
- Eight minutes later (04:05, T + 7 h 28 min, c3dc256ab) the programme added a section titled "False-failure audit". That file restates the size headline three times (lines 29, 39 and 49). Sixteen minutes after that came the article package with the headline (922debb52). There was an audit of false failures and none of false successes.
- "someone read the items": the records show an agent pass ("item-reading by the working thread" in the incident register).

Fix. Rewrite 4.2 as the within-file contrast, and retitle Section 4 (for example "Two checks, and what they did not reach"). The first feature in 3.2 ("the same programme examined its null results at length (Section 4)") then has concrete support.

Proposed text (4.2):
> **4.2 A correction, and what it left standing.** The second of the two runs launched that night fell from 20 of 20 to 5 of 20 on the coalition family under exact comparison. The first written verdict called the drop a real signal. More than an hour later a second note attributed it to a change in the training data and asserted, without reading them, that the failures were wrong values. Four minutes later an agent pass read the fifteen failing answers: every one listed the correct coalitions and seat counts, separated by commas where the reference used semicolons. The drop was the fault the stop rule had identified that evening, appearing in a run the rule would have prevented.
>
> The correction was real, and it was one-sided. The wrong diagnosis was replaced rather than kept beside its correction. The paragraph directly above it still reported the regression, as does another summary to this day. The same paragraph ended with the statement that the article's headline still stood: the 1.7B model had beaten the 17B. Eight minutes later the programme added to that file an audit of results wrongly scored as failures, and the file restated the size headline three times. Sixteen minutes after that, the article package carrying the headline was committed. Within half an hour and one file, the disappointing result was checked against its items and the wanted one was not.

## 9. "Its consequences stayed internal" and "the claim is withdrawn" are inaccurate while the public repository carries the claim uncorrected (5.2, third reading; Table 1, last row)

Evidence. The public main branch (HEAD 01f688f20) and the working tree hold the claim with no correction notice:
- docs/article/README.md ("beats the project's own 17B model");
- 01-introduction.md ("A 17B model was fine-tuned on the same pipeline");
- 04-results.md;
- variants 1, 3, 4 and 5;
- summary.md ("The comparison headline remains the 1.7B beating the 17B").

The claim was withdrawn from the manuscripts, not from the programme's public record.

Fix. Before circulating the paper, add a dated correction notice at the top of each of those files. This applies Duty 6 to the authors' own record and adds no identifying text beyond what the files already hold.

Proposed text (5.2):
> Third, the error was caught before any submission, by an audit that printed each model's identity from its configuration. Its consequences were nonetheless not small, and not wholly internal: the rationale of one training run, the framing of the change of aim, the two training runs that followed it, and a set of drafts in a publicly visible repository, which carried the claim until correction notices were added.

Table 1, last row: "Claim withdrawn from the manuscripts; correction notices added to the drafts".

## 10. A written identity rule existed, failed, and is missing from the paper; this bears on automation bias and on Duty 3

Evidence. On day 7 at 12:11, six minutes before the roster, the agents' standing instructions (AGENTS.md, commit 0628968d8) gained a rule. Reports "state a model's identity as size, base, data version, and training finish time", and new runs are named with the size first ("exp-018-1.7b-qwen3-dv3"). Two days later the status file stated the identity wrongly, and invented one, in breach of that rule.

The paper cites automation-bias research that "instruction and practice do not simply remove it" (3.2). It then proposes Duty 3 ("Verify goal-congruent results more, not less"), which is itself an instruction. It also risks the mirror bias, since scrutinising only wanted results is also asymmetric.

Fix.
- Add the rule to Table 1: "Day 7, midday | Agents' standing instructions | Every report must state a model's identity from its records: size, base model, data version, training time". Add one sentence in 3.2: "An instruction requiring exactly this had been in force for two days. Nothing enforced it."
- Recast Duty 3 as a procedure.

Proposed text (Duty 3):
> **Fix the checks before the result is known, and apply them in both directions.** The programme audited its disappointing results and not its wanted ones: when it recorded an audit of results wrongly scored as failures, the same file restated the size headline three times. Asking authors to scrutinise welcome results harder is an instruction of the kind that fails under load [@automationbias]. The alternative is procedural. Fix in advance which checks any result must pass before it enters a plan or a draft (its item records, its manifest, one example read in full), and run them whatever the result says. This is the logic of blind analysis in physics [MacCoun and Perlmutter 2015], and a remedy for what Nuzzo calls asymmetric attention [Nuzzo 2015].

## 11. Attributions do not follow the paper's own rule (Section 2.2)

- Abstract: "a stop rule written by the research lead". Section 4.1 has "attributed in the record to the research lead", and the only record is a commit message ("Per the owner's stop rule", 52249feb7). Use the 4.1 wording in the abstract.
- 3.2: "the human reader of the evening's plan saw the sentence ...". This asserts a perception no record shows, and Section 7 says attention was not recorded. Section 2.2 also allows that the lead dictated the plan, in which case the lead wrote the sentence rather than saw it.
- 5.3: "accepted its first confirmation without asking for the model's identity": see item 1.
- 4.2: "someone read the items": it was an agent pass.
- 5.3: "The humans" (plural): the programme had one human lead (2.2). Likewise Section 1's "We directed the programme": if some co-authors did not, say which author did (item 22).

Fix. Distinguish three kinds of statement:
- what the records show;
- what the lead recalls, labelled as recollection (a participant's testimony is admissible in a case study if marked);
- to whom the paper assigns responsibility regardless of either.

Proposed text (3.2):
> Whoever read the evening's plan saw the sentence "the 1.7B ... beats our own 17B" with both numbers side by side, in a file that listed the "17b" run below six runs of the 1.7B model. [The lead recalls reading it that evening / The records do not show who read it.]

## 12. Section 6: ground the duties normatively, separate them from the ESE checks, and add the duty the case most directly motivates

Problems.
- (a) The duties are introduced as "modest, mechanical where possible". Readers of this journal will ask why they are obligations of authors, and to whom they are owed.
- (b) Three of them duplicate ESE Table 5 (item 6).
- (c) The case's most distinctive structural fact appears only as an evidentiary limitation (2.2). All 243 commits in the period carry the lead's name, with no marker of agent involvement, so the record cannot say who wrote what. That is itself an ethical design choice.
- (d) Duty 5's "separate review pass with a different instruction" needs a caveat the ESE paper states: judges from the same model family show consistency, not independence of perspective. It also needs a link to organised scepticism (Merton).
- (e) Duty 6 should require keeping the superseded text and correcting every copy (items 8 and 9).
- (f) Institutions hold enabling duties. One paragraph on them answers the many-hands objection without diluting the thesis.

Proposed text (opening of Section 6):
> The following duties are addressed to the human authors of agent-assisted research. They follow from the answerability argued for in Section 5.3. An author may publish a claim only if the author can give an account of why it is warranted, and must therefore keep the work in a state in which that account can be given, and checked by others. Each duty is motivated by a failure or a success in the case. Each is designed to work without relying on the vigilance that automation-bias research shows to be unreliable.

Proposed new duty:
> **Record who produced each record.** Every commit in the programme carried the lead's name, so the version history cannot say which record a person wrote and which an agent wrote. The software made many hands look like one. Each record should carry the producing session, its instruction, and the person who approved it, where one did. Without this, neither the authors nor a reader can later tell a checked claim from an unchecked one.

Addition to Duty 5:
> A separate agent session is not an independent perspective: sessions of the same model family can agree for shared reasons. For a headline claim, the certifying pass should include a person reading the primary records, which is the local form of the organised scepticism that science otherwise supplies through review [Merton].

Addition to Duty 6:
> Keep the superseded text beside its correction rather than overwriting it, correct every copy, and add a correction notice to any record others can see.

Closing paragraph:
> Others hold enabling duties. Journals can ask authors to state which steps of the evidence chain agents performed and which checks a person ran; providers of coding agents can record the producing session in every commit by default. Neither relieves the authors.

## 13. Section 5.1 exonerates the change of aim with a claim the portfolio contradicts

Problem. The paper says: "Changing the programme's aim was a legitimate decision; the accuracy target had become unreachable for reasons unrelated to the models." Three records contradict this:
- ESE 4.4: "For the other stuck family the zeros had a computational cause ... Most of the zeros the programme spent effort on were real failures".
- The stop rule prescribed repairing the instrument and re-testing, not changing the aim.
- The decision document (T − 1 h 42 min, 4dd28815b) had named a modest headline in advance for the failure case ("Accept the measured best (65.2%) ... as the session's result and write it into the article as the headline finding"), and ruled "No invented numbers in the article".

Proposed text:
> Changing a programme's aim can be legitimate. This change came at a particular moment. The programme's instrument had just been found unreliable, a decision document written two hours earlier had named a modest headline for exactly that case, and a comparison of the desired shape seemed already available. The change reopened the question of which comparison mattered without reopening the question of whether the instrument could answer it.

## 14. Missing literature an AI and Ethics reviewer will expect

Confident these exist (verify the page numbers when adding them):
- Publication-ethics positions on AI and authorship, the natural anchor for the thesis:
  - COPE Council (2023), *COPE position statement: Authorship and AI tools*, 13 February 2023;
  - ICMJE, *Recommendations for the Conduct, Reporting, Editing, and Publication of Scholarly Work in Medical Journals* (update of May 2023, section on AI-assisted technology);
  - Thorp, H. H. (2023), ChatGPT is fun, but not an author, *Science* 379(6630), 313;
  - Editorial (2023), Tools such as ChatGPT threaten transparent science; here are our ground rules for their use, *Nature* 613, 612;
  - the publisher's own editorial policy on AI (Springer Nature), which the journal applies.
- Research integrity:
  - Office of Science and Technology Policy (2000), Federal Policy on Research Misconduct, *Federal Register* 65(235), 76260–76264;
  - ALLEA (2023), *The European Code of Conduct for Research Integrity*, revised edition (check the exact wording of its AI clauses before quoting).
- Responsibility theory:
  - Shoemaker, D. (2011), Attributability, answerability, and accountability, *Ethics* 121(3), 602–632;
  - Fischer, J. M., and Ravizza, M. (1998), *Responsibility and Control*, Cambridge University Press (tracing);
  - Smith, H. (1983), Culpable ignorance, *Philosophical Review* 92(4), 543–571;
  - Elish, M. C. (2019), Moral crumple zones, *Engaging Science, Technology, and Society* 5, 40–60.
- Epistemic dependence, for why agent testimony is not a colleague's: Hardwig, J. (1991), The role of trust in knowledge, *Journal of Philosophy* 88(12), 693–708.
- Dependent agreement (for Section 5.5): Goldman, A. I. (2001), Experts: Which ones should you trust?, *Philosophy and Phenomenological Research* 63(1), 85–110.
- Asymmetric scrutiny (for Duty 3 and Section 5.1):
  - Nuzzo, R. (2015), How scientists fool themselves – and how they can stop, *Nature* 526, 182–185;
  - MacCoun, R., and Perlmutter, S. (2015), Blind analysis: Hide results to seek the truth, *Nature* 526, 187–189;
  - Nickerson, R. S. (1998), Confirmation bias: A ubiquitous phenomenon in many guises, *Review of General Psychology* 2(2), 175–220.
- Organised scepticism (for Duty 5): Merton, R. K. (1942; reprinted 1973), The normative structure of science, in *The Sociology of Science*, University of Chicago Press.
- An identity-authentication precedent (optional, for Duty 2 and 5.2's "human teams misname too"): Capes-Davis, A., et al. (2010), Check your cultures! A list of cross-contaminated or misidentified cell lines, *International Journal of Cancer* 127(1), 1–8. Journals now require authentication of cell lines. That is the mechanical-identity duty in an older field.

Flag, and check before citing (I believe these exist, but have not verified the details):
- Resnik and Hosseini on the ethics of AI in scientific research, published in *AI and Ethics* (about 2024), worth citing in the target journal if confirmed;
- Hosseini, Rasmussen and Resnik (2023), Using AI to write scholarly publications, *Accountability in Research*;
- Nyholm (2018), on responsibility-loci in human–robot collaboration, *Science and Engineering Ethics*;
- Tigard (2021), There is no techno-responsibility gap, *Philosophy & Technology*;
- Hicks, Humphries and Slater (2024), ChatGPT is bullshit, *Ethics and Information Technology*, relevant to "prose filled the gaps with plausible specifics".

The existing 16 references are accurate as cited. One fix: Santoni de Sio and Mecacci name four gaps, so write "four", not "several".

## 15. The AI-use statement should model the disclosure the paper recommends, including what happened to this paper's own drafts

Problem. The statement is generic ("Coding agents were used throughout ..."), names no agent product or version, and says nothing about checks. The publisher's policy expects AI use to be documented in the methods. The author worksheet (article/submission/author-information.md) names the tool used for the drafting and audit work and says the inventory for the programme period is incomplete; say so.

The strongest reflexive evidence is unused. The claim ledger records that earlier drafts of this paper said the stop rule "halted training until the benchmark was shown sound" and that "each artifact was locally accurate". Both were false, and both were corrected after a separate adversarial review. Also, the audit that caught the 17B error was agent-assisted and mechanical (identities printed from the configurations). Saying so is fair to agents and supports Duties 2 and 5.

Proposed text:
> **Use of AI tools.** The programme's agents were [products and model versions, as far as the records allow; the inventory for the programme period is incomplete and we have not reconstructed it by guesswork]. They performed the roles described in Section 2.2, and no commit in the period records which agent produced it. For this manuscript, agents assisted in reconstructing the timeline from the version history, in drafting, and in checking claims against the records. The audit that resolved the model's identity from its configuration was agent-assisted and mechanical. Two agent sessions, instructed only to find reasons the claims were false, reviewed an earlier draft. They found that it described the stop rule as having halted training until the benchmark was shown sound, and the drafts as locally accurate. Both statements were false and were corrected. The authors checked every factual statement against the records, are answerable for the content, and list no agent as an author.

## 16. Add a short method section: sources, selection, times, translation, roles (new 2.3)

Problem. The paper has no method section. A reviewer will ask four things:
- why these episodes, out of the 32 incidents the programme's records document;
- how the times were established;
- who reconstructed the case, and with what help;
- how disconfirming evidence was sought.

Proposed text:
> **2.3 Sources and method.** We reconstructed the case from the programme's version history: 240 commits over ten days, each timestamped, including every version of the status file written for the lead, the decision document, run configurations and manifests, and the article drafts. Times in Table 1 are commit times, given relative to the change of aim. From a register of 32 consequential incidents compiled for a companion study [Anonymous, under review], we selected the four episodes that turn on what a record was taken to show rather than on a defect in code: the model identity, the unrecorded re-scoring, the stop rule, and the corrected diagnosis. One author directed the programme; [the other authors joined for the audit and took no part in the events described]. Agents assisted in the reconstruction (see Use of AI tools). An author read every quoted record in its original language, and quotations from records written in another language are the authors' translations.

## 17. Section 4.1: the stop rule protected the instrument, so its reason survived the change of aim

Problem. "A pre-declared stop rule is effective while the goal it serves stands" misdescribes the rule. It protected the validity of the comparator. The new goal was measured with the same comparator, so the rule's reason survived the change of aim and only its authority dissolved.

There is also a fair alternative reading to weigh. The file that announced the change of aim opens its bottom line with "One word: the comparator" and reports the meaning-based re-scoring. The programme may have taken that re-scoring as answering the rule's concern. If so, it was not the re-test the rule specified.

Optional: the same pattern occurred one step earlier. The base-selection gate logged "NOT training — a human decides", and the next morning's report chose the base anyway (incident I17). That choice produced the run whose name was later misread. The ESE paper covers the details, so one sentence is enough.

Proposed text (replacing the last paragraph of 4.1):
> We draw two conclusions. The rule's reason did not depend on the goal: it concerned the instrument, and the new comparison was measured with the same instrument. What the change of aim dissolved was the rule's authority, not its reason. A rule that does not say who may lift it, and how the lifting is recorded, can therefore be set aside by a decision about something else. The records allow one qualification. That evening's re-scoring may have been taken as answering the rule's concern, but it was not the re-test the rule specified.

## 18. Structure: state the thesis in the Introduction and give Section 5 a road map

Problems.
- The Introduction's contributions paragraph never states the thesis. It appears in the abstract and then only at 5.3.
- The move from the case to the argument is abrupt. 5.1 opens with the literature on questionable research practices.
- The alternative readings of the causal story (5.2) come before the normative claim, and the normative claim has no objections section.

Fix.
- Third contribution: "Third, we argue that responsibility for agent-produced claims stays with the human authors, as answerability to readers, and that it grounds specific duties, which we connect to ...".
- Open Section 5 with: "The case raises three questions: why an error the records contradicted survived for two days (5.1, 5.2), who answers for it when agents wrote most of the records involved (5.3, 5.4), and what those who answer owe (Section 6)."
- Order Section 5 as: 5.1 wanted results; 5.2 alternative readings; 5.3 responsibility; 5.4 objections (item 4); 5.5 internal agreement.
- Trim the Conclusion's restatement of the case, and end on the answerability point.

## 19. Section 5.1: the Goodhart paragraph does not fit the mechanism

Problem. "No one gamed anything" concedes that no measure became a target. The mechanism described is selective scrutiny: confirmation bias and motivated reasoning. Goodhart fits the earlier phase more literally. The accuracy target on the held-out benchmark led the programme to inspect that benchmark repeatedly and to rewrite some of its reference answers while pursuing the target (incidents I07 and I23).

Fix. Either apply Strathern there in two sentences, or replace the paragraph with the asymmetric-attention literature (Nuzzo 2015; Nickerson 1998) and the within-file evidence from item 8.

## 20. Section 5.4 (internal agreement): cite the epistemology, and use the case's sharpest instance

Problem. The point is right but thin, and it duplicates ESE 5.2 near-verbatim (item 6).

Fix. Ground it in the epistemology of testimony: agreement among sources adds nothing when each depends on the others (Goldman 2001). Replace the Kapoor analogue sentence with the case's own instance.

Proposed text:
> On the morning after the change of aim, the status file stated the size headline three times, each derived from the one before: in the plan, in the report of the first overnight run, and in the night's final result. Agreement among sources is evidence only when the sources could have disagreed independently [Goldman 2001]. Evidence that could have disagreed existed: the configuration, the roster and the earlier draft all recorded the correct identity. The roster was deleted, and the draft was overwritten.

## 21. Companion-paper citation and declarations for double-anonymous review

- "The scientific findings are reported elsewhere." Make this an anonymised citation ("[Anonymous, under review; supplied to the editor]"), as for the ESE paper.
- Move "Author identities, affiliations, funding, and competing-interest declarations are to be completed before submission" to the title page. It does not belong in the anonymised file.
- Build the anonymised evidence package with commit metadata stripped and files renamed, and translate the non-English records in it, keeping the originals for the editor. The records' language narrows the authors' identity.
- The figures "κ = 0.96" and "65.2% to 77.2%" also appear in the other portfolio manuscripts. That is harmless unless those become public before review ends.

## 22. Limitations: add selection, stakes, author roles, and agent-assisted reconstruction

The current section has 88 words. Add four points:
- the four episodes were chosen from 32 incidents, for their bearing on responsibility (item 16);
- the authors have a reputational stake in how the episode is told. The lead is both subject and author, and "we" merges the lead with co-authors who may not have directed the programme;
- the reconstruction was agent-assisted, so the paper's method shares the risk it describes. Say what checked it (item 15);
- the lead's recollection, where used, is testimony and not record (item 11).

## 23. Gloss the technical terms for readers who are not machine-learning specialists

Terms currently unglossed or glossed late:
- parameters; fine-tuning; base model; training run; configuration and manifest; data version; held-out set; problem family; coalition problems;
- exact comparison (2.1 glosses "comparator" but not what it compared);
- "target programs", "a new idiom", "compressed the reference answers" (4.1);
- "a procedurally generated family teaching exactly the coalition shape" (3.1);
- "a shift in the training distribution" (4.2);
- data leakage (5.4); "subagents", "agent sessions"; "detached"; "blind judges"; κ.

Proposed text (added to 2.1):
> A few terms recur. A model's size is its number of parameters, the learned numbers it consists of; 1.7B means 1.7 billion. Fine-tuning continues the training of a published base model on new examples. Each training run starts from one base model and one version of the training data, and records both in a configuration file and in a manifest, a machine-written summary of the run. The held-out set is a fixed collection of problems kept out of training and used only for evaluation. Its problems fall into families of one type each; coalition problems, for example, give the seats of three parties and a majority threshold, and ask which coalitions are the smallest that still win. The comparator accepted an answer only if its wording matched the reference answer after light normalisation.

Specific replacements:
- 4.1: "They restructured the target programs, moved them to a new idiom, compressed the reference answers, and simplified the problem statements" becomes "They changed the form of the example programs twice, shortened the expected answers, and simplified the problem statements".
- 3.1: "The later data version contained a procedurally generated family teaching exactly the coalition shape that the earlier one lacked" becomes "The later run had been trained on generated practice problems of exactly the coalition type; the earlier run had not".
- 4.2: "a shift in the training distribution" becomes "a change in what the training data contained".

## 24. Numbers that do not help a non-specialist, and the time format

- Table 1: "T − 5.7 h" and "T − 1.6 h" are decimal hours, mixed with minutes elsewhere. Use "T − 5 h 41 min" and "T − 1 h 35 min" throughout.
- Table 1: "on the third data version" (day 7 roster row) adds nothing. Delete it.
- Section 1: "its weights occupy about 4 GB, an order of magnitude less than a 17B model would" becomes "its stored weights are a tenth of the size a 17-billion-parameter model would need". This makes the same point without a unit the reader must interpret.
- Section 6, Duty 4: "the judges agreed at κ = 0.96". Replace it with the result a non-specialist can read: "the two judges rarely disagreed, and accepted none of twenty answers planted as wrong". Or gloss κ as chance-corrected agreement, where 1 is perfect. The "took minutes" claim duplicates ESE 4.6; keep it in only one paper.
- Keep 2 of 20, about 18 of 20, 20 of 20 against none, 65.2% to 77.2%, and the fifteen failing answers. They are facts of the narrative, and each carries the argument.

## 25. Minor wording and accuracy

- Section 1: "In the early afternoon of the ninth day" becomes "In the middle of the afternoon" (the note was committed at 14:56).
- 4.1: "An agent wrote programs by hand" becomes "An agent, working without the trained model, wrote programs". "By hand" is odd for an agent.
- 3.2: "listed the '17b' run below six 1.7B runs of the same model family". The file labelled those runs by data version, not size, so write "below six runs of the 1.7B model, listed there by data version".
- 2.1: "Each run was evaluated on a held-out set of problem types absent from its training data" contradicts 3.1, where later data taught the coalition type deliberately. Write "on a fixed set of problems kept out of its training data; later data versions taught some of these problem types deliberately".
- 5.3: Nissenbaum names four barriers. Add the fourth, "ownership without liability", which fits the provider objection (item 4).
- Keywords: replace "goal-directed evaluation" with "authorship; accountability; automation bias".
- Optional vivid details, to paraphrase while the repository is public (item 3):
  - the base article opened by denying it made a size claim, then made one;
  - the commit that carried the package said all figures were reproduced verbatim from the measured records;
  - the original sanity-test design had a second, independent agent score the solutions, and the executed test used the benchmark's own comparator instead.
