# The headline the evidence never contained: wanted results, agent-written records, and author responsibility in automated research

## Abstract

Coding agents can now run much of a machine-learning research programme: they write the data generators, launch and evaluate training runs overnight, and draft the notes and papers that report the results. When such a programme produces a false claim, who answers for it, and what should they have done? We examine a programme of this kind whose research lead is among the authors. Its agent-written status notes read a model of 1.7 billion parameters as one of 17 billion, because a run's name had lost its decimal point, while the same file still listed the model correctly; within hours they presented the run as a control experiment. That evening the programme exchanged its accuracy target for a comparative aim, showing that a small model can beat a larger one, and the misread result became its headline. The rewrite that adopted the aim overwrote correct labels, overnight drafts added details that were not true, and a stop rule adopted that evening was set aside. The error survived, with no intent to deceive, because it said what the programme wanted to be true, and because the process pursuing the aim also wrote the summaries through which its evidence was read. We argue that responsibility for agent-produced claims stays with the human authors as answerability to readers, that it reaches the records behind a paper as well as its text, and that it grounds specific duties, including checks fixed before results are known and a record of who produced each record.

Keywords: research integrity; coding agents; automated science; authorship; answerability; automation bias

## 1. Introduction

In the middle of the afternoon of the ninth day, a status note in our project recorded that a run labelled "17b" had also scored zero on two families of reasoning problems, and concluded, in the authors' translation, that "the model's size does not help; the data set is what matters". Eighty lines higher, the same file listed the run's actual base model, a released model of 1.7 billion parameters. By early evening that list had been deleted, and rewrites of the file, under headings such as (in translation) "Yes, we tested the 17-billion model", presented the run as a control experiment on a model ten times larger. Two hours later the programme dropped its accuracy target for a new aim, to show that a small fine-tuned model beats a larger one, and named the headline in advance: the 1.7B model against a 17B model of the project's own.

There was no 17-billion-parameter model. The configuration that pinned the run's base model identifies the released 1.7-billion-parameter model, whose stored weights are about a tenth of the size a 17B model would need. The decimal point had been lost three days earlier, when a pipeline script named the planned run, and the comparison the new aim needed was in fact one between two training datasets given to the same base model.

Coding agents increasingly perform complete research loops, and systems such as The AI Scientist aim to write papers with little human involvement [@aiscientist]; Messeri and Crockett warn that AI tools can give scientists illusions of understanding [@messeri]. Publication ethics has settled one part of the question of responsibility: AI tools cannot be authors, because they cannot take responsibility for the work [@cope; @icmje]. What that settlement implies when agents also write the records on which the authors rely has not been worked out. In our case the error began not as a fabricated number but as a misread label, which the records built on it then furnished with plausible details.

We make three contributions. First, we reconstruct from version-controlled records how a naming error became a headline although the correct identity was on record. Second, we show that the programme checked its disappointing results against their items but not its wanted ones, and that a stop rule written before its test ran was set aside by the change of aim. Third, we argue that responsibility for agent-produced claims stays with the human authors as answerability to readers, that the ground on which publication ethics denies AI tools authorship extends from a paper's text to the records behind it, and that this grounds duties, which we defend against four objections.

We are not neutral observers. The research lead whose decisions we examine is one of the authors, and allowed the drafts we criticise to be committed as the project's article. We present the case because every status note, plan, draft, and configuration is timestamped under version control: the records that allowed the error to be made allowed it to be found.

## 2. The programme and its division of labour

### 2.1 What was being studied

The programme asked whether a small language model, once fine-tuned, can turn a word problem into a short program in a small dataflow language instead of answering it directly; a runtime executes the program. Models with 0.5 to 1.7 billion parameters were fine-tuned in about two dozen runs over ten days and evaluated on problems kept out of training, some of whose types later training data taught through generated practice problems. The scientific findings are reported in a companion manuscript (Anonymous, under review).

A model's size is its number of parameters, the learned numbers it consists of; 1.7B means 1.7 billion. Fine-tuning continues the training of a published base model on new examples. A configuration file pins each run's base model, and the run's manifests, written by the software, record the base model and the training data. The held-out problems fall into families of one type each; coalition problems, for example, give each party's seats and ask which smallest groups reach a majority. The comparator, the code that scored each answer, accepted it only if its wording matched the reference answer after light normalisation.

### 2.2 Who did what

The human lead chose the research questions, approved each training design, and set the programme's aims. Coding agents, often several in parallel, wrote the data generators, runtime, and evaluation harness; launched training runs that continued overnight; evaluated the runs; and wrote the status notes, analyses, and drafts. The programme kept a status file that describes itself as the place for answers to the lead.

Every commit carries the lead's name, and none records which agent, if any, produced it. We therefore name an agent as the actor only where a record names one, as in a plan that assigns the article rewrite to an agent. The records do not show whether the change of aim was dictated by the lead or proposed by an agent and accepted; we treat it as the lead's decision, because the aims were the lead's responsibility.

### 2.3 Sources and method

We reconstructed the case from the programme's version history: 240 commits over the ten days, including every version of the status file, the decision document, the configurations and manifests, and the drafts. Times are commit times, rounded to the minute and given relative to the change of aim (T). Three of our episodes are incidents in a register of 32 compiled for a companion study (Anonymous, under review): the model identity, an unrecorded re-scoring, and a misdiagnosed drop in accuracy. The fourth, a stop rule, is a governance decision, which that register excludes. We gave earlier drafts to separate reviewers instructed only to find reasons our claims were false, and checked each of their findings against the records. Quotations from records in another language are the authors' translations.

## 3. Case: how a naming error became a headline

### 3.1 The sequence

Table 1 reconstructs the sequence from timestamped records.

Table 1. The documentary trail of the size claim.

| When | Record | What it said or did |
| --- | --- | --- |
| Day 6, evening | Pipeline script | Names the planned run "17b" before the comparison that could veto its base model has run; the same commit calls it the 1.7B run |
| Day 7, midday | Standing instructions; status file | Reports must state each model's identity, size first; a roster lists the run with its 1.7B base |
| Day 8 | Article draft | Labels the run as 1.7B; the commit notes that an invented 17B base was caught before commit |
| Day 9, T − 5 h 41 min | Status note | The "17b" run also scored zero, so size does not help; the roster above still shows the 1.7B base. A run built on this starts half an hour later |
| Day 9, T − 2 h 06 min | Status file | Rewritten as current status only; the roster is removed |
| Day 9, T − 2 h 02 min to T − 1 h 51 min | Status file, three rewrites | Calls the run a model ten times larger; then, under headings that read as answers, names a nonexistent 17-billion-parameter model of the same release family and presents it as a control run to test whether the models were too small |
| Day 9, T − 1 h 42 min | Decision document | Stop rule; after the benchmark check fails, no training until the same twenty problems pass a re-test |
| Day 9, T | Status note | Accuracy target dropped for a comparative aim; headline named |
| Day 9, T + 6 min | Article rewrite | Replaces correct 1.7B labels with 17B ones |
| Day 10, T + 7 h 44 min | Base article, four of five variants | The small model beat a 17B model of the project's own; one variant adds a nonexistent 17B model given the same data |
| Day 11 | Manuscript audit | Identity printed from the configuration; claim withdrawn from the manuscripts |

The base article denied that its headline was a claim about size, and then made one. One variant added a careful author's hedge, that small models do not in general match large ones, and described a comparison that held the training method fixed and changed only the model's size; no such experiment existed. A variant written as a project report listed the comparison among the project's objectives, one framed as an honest catalogue of the agent's own mistakes repeated the claim, and a diagram equated the two sizes because the misread run had scored exactly as a 1.7B run had, a clue that went unremarked. The two per-family comparisons that carried the headline, 20 of 20 coalition problems against none and 66 of 100 scheduling problems against none, set two runs of the same base model against each other. Only the later run had been trained on generated practice problems of the coalition type.

### 3.2 Why no step caught it

No automated check could see the error: the runtime executed each program and the harness scored each answer as written, and the manifests were accurate. The fault lay in the relation between a label and the object it denoted. Three features made it durable.

First, it said what the programme wanted to be true, before and after the aim changed: in the afternoon it confirmed that data, not size, was the obstacle, and in the evening it supplied the comparison the new aim needed. The same programme checked its disappointing results closely (Section 4.2).

Second, the claim moved through summaries that rewrote themselves. The correct identity stood in the very file that carried the misreading until that file was rewritten. Two of the rewrites that followed carry headings that read as answers to questions, whether the 17-billion model had been tested and which model was which, but the questions are not in the records; the first answer cited as its evidence the run's evaluation record, which sits beside a manifest naming the 1.7B base. No control had been planned, and the run's purpose was supplied after its result was known [@harking]. The same misreading had been caught in the previous day's draft, and nothing carried that correction forward. An instruction to state each model's identity had been in force for two days, and nothing enforced it.

Third, the process that pursued the aim also wrote the summaries through which its evidence was read. The manifests, written by software, were accurate, but the agent that rewrote the article replaced correct labels with wrong ones, and the overnight drafts supplied what a size comparison needs: a model name, shared training data, an experiment varying size. Nothing in the loop was assigned to check such specifics against the records.

Automation-bias research shows that operators under-monitor automated output when their attention is divided, and that instruction and practice do not simply remove the tendency [@automationbias]. The plan announcing the new aim set 1.7B against 17B in one sentence, in a file that listed the "17b" run below six runs of the 1.7B model, named there by data version. The records do not show who read it; whoever wrote or accepted it had the information in front of them.

### 3.3 The number beside the name

The headline did not rest on the name alone. The status file that announced the change of aim listed a meaning-based accuracy for every model, produced that evening by re-judging all mismatched answers to correct a known weakness of exact-match scoring. The best model's reported accuracy rose by twelve percentage points, and the scheduling comparison existed only in these scores. An automated judge had failed, so agent sessions judged instead, and the article draft called the sessions independent. The retained files hold four disjoint slices of the candidate answers, each judged once, committed an hour before T with a note that they were kept so that the re-scoring could be reproduced; they contain the inputs but not the verdicts. No answer was judged twice, and nothing can be recomputed. One score, 49 of 50 for an early run on a family every run had failed under exact comparison, was read as showing that its training data held the missing skill; the data version committed that night rested on that reading, and no run's training data had contained the family.

Model-based judges can agree with humans about as often as humans agree with each other, but their biases must be measured [@llmjudge]; here even the record needed to begin measuring was absent. The concern behind the re-scoring was legitimate: a parser written during our audit accepted 64 of the 100 scheduling answers that the judgements had put at 66. The failure was one of protocol: an unrecorded procedure was treated as a measurement, called independent, and made the ground of a headline and a data change on the same evening.

## 4. Two checks, and what they did not reach

### 4.1 A stop rule, and what set it aside

Four training runs had tried to lift two problem families from zero correct answers, by restructuring the example programs twice, shortening the expected answers, and simplifying the problem statements. While the last was being evaluated, the project wrote a decision document with a stop rule: if either of two pending checks failed, the line of work on data design would stop and no further training run would be launched.

One check tested the benchmark itself. An agent, asked to work from the problem statements alone, wrote programs for twenty problems from the stuck families, and the benchmark's comparator accepted 2 of them; the record written at the time estimated about 18 correct computations, and a later reading of the items found the reference value in every one (Anonymous, under review). The rule was then restated, in a record that attributes it to the research lead: repair the comparison, re-run the same twenty problems, and train nothing until they pass.

For about an hour and a half the rule did its work, turning a run of null results into a question about the instrument. Then the aim changed. Within half an hour a new data version was committed and a run started, and a second ran overnight; both were scored with the comparator the rule had found wanting, and the re-test was never run. No record shows a decision to lift the rule. The new aim simply superseded it.

The rule's reason concerned the instrument, and the new comparison used the same instrument, so the change of aim dissolved the rule's authority, not its reason: a rule that does not say who may lift it, and how, can be set aside by a decision about something else. The file that announced the change named the comparator as the problem and reported the meaning-based re-scoring, which the programme may have taken as answering the rule's concern; it was not the re-test the rule specified.

### 4.2 A correction, and what it left standing

The second run launched that night fell from 20 of 20 to 5 of 20 on the coalition family under exact comparison. The first written verdict called the drop real. More than an hour later a note attributed it to a change in what the training data contained, asserting without reading them that the failures were wrong values. Four minutes later a pass that read the fifteen failing answers found every one correct, with a comma in each place where the reference had a semicolon: the fault the stop rule had identified, in a run the rule would have prevented.

The correction was real, and one-sided. The wrong diagnosis was replaced rather than kept beside its correction. The paragraph above it still reported the regression, as a separate summary file still does, and ended by affirming that the headline stood: the 1.7B model had beaten the 17B. Eight minutes after the correction, the programme added an audit of results wrongly scored as failures to a file that stated the size headline three times, and sixteen minutes after that it committed the article package carrying the headline. Within half an hour the disappointing result was checked against its items, and the wanted one was not.

## 5. Analysis

The case raises three questions: why an error that the records contradicted survived for two days (Sections 5.1, 5.2, and 5.5), who answers for it when agents wrote most of the records (Sections 5.3 and 5.4), and what those who answer owe (Section 6).

### 5.1 Wanted results without an intent to deceive

Undisclosed flexibility produces false findings without any intent to deceive: analytic choices made after seeing the data can make almost any result appear significant [@falsepositive], and hypotheses formed after the results can be presented as if formed before them [@harking]. Our case moves the flexibility from the analysis to the framing, and adds selective scrutiny, which Nuzzo calls asymmetric attention: expected results get a relatively free pass, while unexpected ones are checked rigorously [@nuzzo]. It is one of the guises of confirmation bias [@confirmationbias].

Changing a programme's aim can be legitimate, but this change came at a particular moment. The instrument had just been found unreliable, and the decision document written less than two hours earlier had prescribed, for that finding, repairing and re-testing it before any training; a modest headline, the best measured accuracy, had been reserved for the case in which the benchmark proved sound. Nor had the target been shown to be unreachable for reasons unrelated to the models: most of the zeros the programme worked on were real failures (Anonymous, under review). The change reopened the question of which comparison mattered without reopening whether the instrument could answer it.

### 5.2 Alternative readings

Four alternative readings deserve weight.

First, influence may have run the other way. The misreading predates the change of aim, and two hours before it the run was given a purpose it never had, as a control; the comparative aim may have been chosen partly because the misread result made it look already achieved. That is hypothesizing after the results are known in a literal form: a result presented as a planned control, and a comparison later listed among the project's objectives [@harking].

Second, human-only teams also misname what they study. Contaminated cell lines were studied for years under the wrong name, and that field's remedy was to test each sample's identity rather than to read labels more carefully [@capesdavis]. We do not claim that agents make such errors more often.

Third, the error was caught before any submission, by an audit that printed each model's identity from its configuration. Its consequences were not small, and not wholly internal: the rationale of one training run, the framing of the change of aim, the two runs that followed, and a set of drafts that remain in a publicly visible version history. The index page of those drafts now marks them as superseded and names the size misidentification; the chapters, variants, and status file that carry the claim have no notice of their own.

Fourth, the clue was in front of whoever wrote or accepted the evening's plan. The failure was one of attention as much as of process design.

These readings narrow our claim without removing it.

### 5.3 Responsibility does not diffuse to the tools

Matthias argued that learning automata create a responsibility gap, in which nobody controls a machine's behaviour enough to be responsible for it [@respgap]. Santoni de Sio and Mecacci distinguish four such gaps and argue that design can address them [@fourgaps]; Tigard denies that technology opens such a gap [@tigard], and Nyholm places machine agency inside collaborations that humans initiate and supervise [@nyholm]. Because agents produced most of the records involved, our case may look like a gap. We think it is not, and not because the agents behaved well. They did not: with the correct identity in the file they were editing, they named a model that does not exist, gave it a purpose, and later described an experiment that never ran. The argument rests on three claims instead.

First, the responsibility at issue is answerability. Shoemaker distinguishes it from attributability and accountability: to be answerable for something is to be open to a reasonable demand to lay out the reasons behind it [@shoemaker]. For a published claim, this is the standing obligation to say why the claim is warranted, and to be held to that account later. An agent session cannot hold it: it cannot be asked next month to defend a claim, be sanctioned, or withdraw what it wrote. This is the ground on which publication-ethics bodies and publishers, this journal's among them, refuse AI tools authorship: authorship carries accountability for the work, which the tools cannot take, so the humans remain responsible for what the tools produced [@cope; @icmje; @springerai; @naturellm]. Resnik and Hosseini, in this journal, make researchers responsible for identifying and controlling the errors that AI introduces into research [@resnik]. These policies were written about text. The same ground covers the records behind the text, because in an agent-run programme the evidence an author reads is mostly text that agents wrote.

Second, the lead's culpability for that evening does not depend on having seen the error. Responsibility can trace back to earlier choices made with control [@fischerravizza], and ignorance is culpable when it follows from a culpable failure to find out what one could and should have found out [@culpableignorance]. The earlier choices were a workflow in which agent summaries were the usual interface to the evidence and every commit carried the lead's name. By the ninth day the risk was foreseeable in particular: the same misreading had been caught the day before; two written diagnoses had been withdrawn, in whole or in part, four days earlier, one after a separate review and one after the items were read; and the identity instruction had gone unenforced for two days. If the lead did ask whether the 17-billion model had been tested, or which model was which, the answers came from the process that had produced the claim, and one cited a record lying beside the correct manifest. Reliance on those answers might be offered as an excuse; the previous day's correction weakens it.

Third, answerability can be kept only by someone who remains able to check. Delegating implementation and first drafts moves the author's work from producing evidence to auditing it, work that is easy to under-provision because delegated output looks finished. The active responsibility of Santoni de Sio and Mecacci, a forward-looking duty to secure good outcomes [@fourgaps], belongs to those who direct the agents and is exercised through checks built into the work. Agents change not who answers, but what answering requires.

### 5.4 Objections

*The moral crumple zone.* Elish shows how blame for the failures of automated systems can fall on the nearest human operator, who had nominal control and little real control, while the system's integrity is protected [@crumplezone]. Our thesis could be read as building such a zone around authors. It does not, because authors are not operators at the end of a system that others designed: they choose what to delegate, which checks to run, and what to publish. Where an author has no say over the tools or the checks, the duties fall partly on whoever made that arrangement.

*Ought implies can.* On the ninth day the status file alone changed seventeen times, in a history of 240 commits. No author can read such a record in full. The duty is not to read everything, but to publish only claims that have passed checks the author can vouch for, and to delegate no faster than those checks can run.

*Many hands.* Providers of coding agents share responsibility for a known tendency of their systems, which the medical editors' recommendations name: output that sounds authoritative and can be incorrect or incomplete [@icmje]. Journals share responsibility for what they ask authors to disclose, and the problem of many hands and the barrier of ownership without liability show how such shares can dissolve accountability [@manyhands; @nissenbaum]. These are enabling duties, which do not reduce the authors' answerability, as a faulty instrument does not relieve those who publish its readings of the duty to correct them.

*No intent.* The United States federal definition of research misconduct covers fabrication, falsification, and plagiarism committed intentionally, knowingly, or recklessly; it requires a significant departure from the community's accepted practices, and it excludes honest error [@ostp]. No one intended the invented control experiment. Had the variant describing it been submitted, however, its methods would have reported an experiment that never ran, under the authors' names. Whether that is honest error or recklessness turns on what practices the community accepts from authors of agent-assisted research, and on Smith's analysis an unwitting wrong is culpable only if the failure to find out was itself culpable [@culpableignorance]. The duties that follow are our proposal for that standard of care.

### 5.5 Why internal agreement is weak evidence

By the next morning the status file stated the size headline three times, each derived from the one before: in the plan, in the report of the first overnight run, and in the night's final result. The agreement carried no information: when opinion-holders are wholly dependent on one another, a follower's agreement adds nothing to the leader's grounds [@goldman]. The records that could have disagreed, the configuration, the roster, and the earlier draft, did not enter that chain: the roster was deleted, and the draft overwritten.

## 6. Duties for authors who direct research agents

These duties follow from the answerability of Section 5.3: an author may publish a claim only if the author can give an account of why it is warranted, and must keep the work in a state in which that account can be given and checked by others. They are owed to readers and to the research community, whose accepted practices define due care (Section 5.4), and none depends on vigilance [@automationbias]. Pipeline checks that implement them are described in the companion study (Anonymous, under review).

**Declare stopping conditions, and name who may lift them.** The stop rule was the programme's most robust moment, and it dissolved when the aim changed. Preregistration makes the distinction between prediction and postdiction visible [@prereg]; for agent-run programmes the equivalent is cheap: a stop condition in each run's plan before launch, a named person who may lift it, and a dated record when it is lifted. A change of aim should be recorded, and disclosed in the paper with the conditions it set aside.

**Derive identities from artifacts mechanically, and block claims that disagree.** A model's identity should be generated from its configuration and manifest and printed wherever the model is reported, as model cards and datasheets attach such facts to artifacts [@modelcards; @datasheets]. The programme did this for one interface, a chat window that derived each identity from the pinned configuration, but its prose was bound only by an instruction, and a correct label was overwritten. A check that fails any report whose stated size or model name disagrees with the manifest would have stopped the rewrite.

**Fix the checks before the result is known, and apply them in both directions.** Telling authors to scrutinise welcome results harder is an instruction of the kind that fails under load [@automationbias], and it invites the mirror-image bias. Instead, fix in advance which checks any result must pass before it enters a plan or a draft, such as its item records, its manifest, and one example read in full, and run them whatever the result says. This is the logic of blind analysis [@blindanalysis], and a remedy for asymmetric attention [@nuzzo].

**Keep the evidence a reader needs in order to disagree.** A score from a judgement procedure is a claim about a set of decisions; without the decisions, no reader can contest it. Keeping per-item verdicts, the judge's instructions, and the candidate population is cheap, and it separates a measurement from an assertion. When the same pipeline was later used to re-score a set of comparisons with two blind judges and planted wrong answers, the judges rarely disagreed and accepted none of the twenty-four planted answers, and every verdict remains open to a reader's challenge. Audits should produce such documentation throughout development [@raji].

**Separate pursuing a claim from certifying it.** The process asked to reach a result should not be the only one to report whether it was reached: the self-audit variant repeated the claim, and the commit that carried the drafts described every figure in them as reproduced from the measured records. A separate pass instructed to find reasons a claim is false should run before any plan relies on the claim, although a separate agent session is not an independent perspective: sessions of one model, like the two judges above, can agree for shared reasons. For a headline claim, the certifying pass should include a person who reads the primary records and signs off, naming the evidence examined, a local form of the organised scepticism that Merton placed among the norms of science [@merton].

**Record who produced each record.** Every commit carried the lead's name, so the history cannot say which record a person wrote and which an agent wrote: the software made many hands look like one. Each record should carry the producing session, its instruction, and the approving person, where there was one. The European code of conduct for research integrity counts hiding the use of AI tools in creating content as an unacceptable practice [@allea]; a record that merges agent and human authorship hides that use in the evidence itself, and leaves no one able to tell a checked claim from an unchecked one.

**Report corrections as findings, and keep what they correct.** Corrections are informative about the system studied and about the process that studied it, and a paper should say what was corrected and why. The superseded text should stay beside its correction, every copy should be corrected, and records that others can see should carry a notice. Our own record does not yet fully meet this duty (Section 5.2).

Others hold enabling duties. Journals can ask which steps of the evidence chain agents performed and which checks a person ran; providers of coding agents can record the producing session in every commit by default. Neither relieves the authors.

## 7. Limitations

This is a single case, examined by participants, with episodes selected for their bearing on responsibility; it cannot say how often such errors occur, or compare agent-assisted teams with human-only ones. The authors have a stake in how the episode is told, and the research lead is both its subject and an author; we have relied on records rather than recollection. We did not record our attention at the time, the records cannot always separate human from agent authorship, and some records answer questions they do not contain. The reconstruction was itself agent-assisted, so our method shares the risk it describes; we checked every factual statement against the primary records. The duties have not been evaluated as interventions.

## 8. Conclusion

The error that travelled furthest into our programme's record was a lost decimal point. It became a headline because it said what the programme wanted to be true, although the correct identity was on record. Agents can take over much of the production of evidence. They cannot take over answering for what it is claimed to show, because they cannot be asked, next month, why a claim is warranted. Authors can be asked, and that obliges them to keep the answer available: checks declared in advance with a named owner, identities taken from artifacts rather than names, the same checks for wanted results as for unwanted ones, and a record of who produced each record.

## Data availability

The records discussed here are preserved in the project's version history. An anonymised copy, without identifying file names, repository identifiers, or commit metadata, and with records written in another language translated, will be provided for review.

## Use of AI tools

Coding agents performed the roles described in Section 2.2; no commit records which agent produced it, and our inventory of the agent products and versions used during the programme is incomplete, so we do not reconstruct it. For this manuscript, agents assisted in reconstructing the timeline, drafting, checking claims against the records, and revising after review [agent products and versions to be supplied by the authors]; the audit that resolved the model's identity was agent-assisted and mechanical. The separate reviews described in Section 2.3 found that an earlier draft described the stop rule as having halted training until the benchmark was shown sound, and the drafts as locally accurate; both statements were false and were corrected. The authors checked every factual statement against the records, are answerable for the content, and list no agent as an author.

<!-- REFERENCES -->
