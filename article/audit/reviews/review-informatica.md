# Review of the Informatica manuscript (article/manuscripts/02-informatica.md)

**Verdict: nearly ready. Circulate after one focused revision pass of about a day.** The prose is clear and unusually candid, and almost every number I rechecked reproduces from the item records. But three findings that careful colleagues would check first do not survive those records, and fixing them changes the argument, not just the wording.
**Change 1. Section 4.3's mechanism is contradicted by the generated programs.** On the scheduling problems, the model trained on split targets wrote the computation as one wire in 95 of 100 programs. Its extra failures sit in that one problem type, and they came with a new data representation (keyed maps in 69 programs, against 14) and a borrowed assertion that the plan is feasible (46, against 0), not with extra wires.
**Change 2. Section 4.6 reads failures of form as failures of recognition, and treats an exact match that holds by construction as a finding.** At 1.7B, 10 of the 18 failed plans in narrative wording were malformed JSON or a misnamed operation. The three forms had 3, 1 and 3 worked examples. Operator plans match exactly because the harness formats answers with the generator's own "N units." template, which contradicts the unit the statements ask for in 27 of the 33 problems.
**Change 3. After Section 4.6, Limitations is out of date, the headline rule outruns the evidence, and the literature is too thin.** JavaScript was compared, but only without fine-tuning. The abstraction-level rule that ends the abstract goes beyond an experiment whose pre-registered reading it did not meet. Eight references fall short of Informatica's state-of-the-art criterion.
**After these three:** promote 4.6 to its own section, introduced in the abstract, introduction and methods; lead the abstract and introduction with the design problem and the transferable lessons; and run two cheap reruns (operator plans with grammar-constrained decoding, and JavaScript with the same three worked examples; about 540 generations in all) to settle items 2 and 3.

Scope of this review: I checked the claims against `evaluation/registry/<run>/items(.jsonl|/holdout.jsonl)`, `article/evidence/comparison/*`, `article/audit/*`, `article/experiments/no-training-plan.md`, `evaluation/operator-plans.mjs`, `evaluation/run-items.mjs` and `docs/wire-types.html`. Line numbers refer to the manuscript as of 29 September 2026. I left alone the percentage conversion and the sample-size sentences, which are being handled separately, but I flag the differences too small to interpret (item 13). Every count quoted below was recomputed from the records during this review. The re-executions in items 2 and 9 are sensitivity checks, not scores.

---

## Prioritised findings

### 1. Section 4.3's "added interfaces" mechanism is contradicted by the generated programs

**Location:** Section 4.3, lines 157–163; Introduction, lines 11–15; Check 3, line 262.

**Problem.** Line 163 explains the split-target run's extra execution failures by the added wires: "every additional wire is an interface the model must generate consistently". The introduction opens with this comparison. The records of the two runs (exp-021 compact, exp-022 split; `items/holdout.jsonl`) do not show extra wires where the failures are:
- **Where the extra failures fell.** Of the 78 additional execution failures (57 to 135):
  - 51 fell on the 100 scheduling problems (8 to 59);
  - 19 fell on the 480 procedural problems, whose targets did not change (12 to 31);
  - 8 fell on the other 125 book-derived problems (37 to 45). That rise is inside the variation the unchanged procedural targets show.
- **Where the lost correct answers fell.** Of the 12 lost correct answers (460 to 448), 10 were procedural problems.
- **The failing programs were not split.** On the scheduling problems, the split-trained model still wrote one jsEval wire in 95 of 100 programs, and 55 of its 59 failures are one-wire programs. Yet in dv8, 600 of the 900 training programs of that book had two or more jsEval wires (2.44 on average; `git show 9a561fccd:training/data/all-books.jsonl`). The introduction's own example (item 1.1.4) is a one-wire program.
- **What changed was inside the one wire:**
  - 69 programs stored the durations in a keyed object, against 14 after compact training.
  - 46 asserted that the computed completion time is within the limit, for example `probe(completionMinutes <= slots.limitMinutes, "the plan must stay within the stated deadline")`, against 0 after compact training. This assertion stops every correct "not feasible" answer, and 46 of the 100 references are "not feasible".
- **Split programs did not fail more often.** Where the split model did write two wires (31 of 125 other book programs), those failed no more often (10 of 31) than its one-wire programs (35 of 94).
- **The failures depend on wording.** The evaluation-only rewording test (`article/evidence/comparison/paired-tables.md`, E3) shows this:
  - The final-data 1.7B run, trained on the split form, ran 1 of 15 book-worded scheduling problems and solved 15 of 15 when the same problems were reworded into the procedural scheduling template.
  - The dv12 run went from 8 to 15.
  - The compact run solved 15 in both wordings.

**Fix.** Keep Table 1 and the existing caveats; replace the mechanism and the lesson. Proposed replacement for line 163:

> "Named intermediate values make programs easier to inspect, and some commands, such as containers, need them; the lesson is not that decomposition is harmful. Nor do the generated programs show the mechanism we expected, that each added wire is one more interface to get wrong. On the held-out scheduling problems, the model trained on split targets still wrote the computation as one wire in 95 of 100 programs, and 55 of its 59 execution failures were such one-wire programs. What changed was inside the wire. 69 programs stored the durations in a keyed object (14 after compact training), and 46 asserted that the plan must be feasible (none after compact training), which stops every correct 'not feasible' answer. The failures also depended on wording: reworded into the template of the procedural scheduling type, the same problems were solved by split-form runs that failed them in the book's wording. Refactoring the training targets is a change to the curriculum whose effects appear where the refactoring did not reach. Its cost must be measured on the programs the model writes for held-out types, not inferred from the targets."

Also make these changes:
- **Section title.** Retitle 4.3, for example "Refactoring the targets changes more than their structure".
- **Introduction.** Reframe the anecdote. Proposed replacement for line 15: "The second program was no more split than the first: the model had chosen a different data representation, called a method that plain JavaScript objects lack, and crashed. It did the same on 41 of the 100 problems." Alternatively, lead with the Section 4.1 splice, whose mechanism the records do support.
- **Check 3.** See item 23.

### 2. Section 4.6: operator-plan failures are largely failures of form, not of recognition

**Location:** Section 4.6, "Code writing" and "Reading" bullets (lines 230, 232); abstract (line 5); Conclusion (line 276); Check 6 (line 268).

**Problem.** The text treats a failed plan as a failure to recognize operations: "with no code to get wrong", and "the model now had to recognize which catalogue operations the prose described". The records (`evaluation/registry/e8-ops3-*-paired/items.jsonl`) show a plan still has syntax and a vocabulary to get wrong:
- **1.7B, narrative wording.** 15 plans were correct and 18 failed:
  - 8 failed plans are JSON objects missing their final `}`;
  - 2 name an operation `multiply`, but the catalogue's multiply-by-a-parameter operation is called `double` and takes `multiplier`;
  - 8 are wrong answers.
  - Of the 23 well-formed plans, 15 were correct, against 26 of 33 JavaScript programs (Fisher exact p = 0.36, not distinguishable).
  - Appending the brace makes 4 of the 8 malformed plans correct, and renaming `multiply` fixes 1 of the 2, so the true score is up to 20.
- **0.5B.** 15 of 33 plans in generator wording, and 14 of 33 in narrative wording, name operations the catalogue lacks: `multiply`, `remainderDivideBy`, `convertRate`, `thirdLargest`, `divideRate`, `takeRate`, and others. This, not misreading, is the main 0.5B failure.
- **1.5B, narrative wording.** 5 plans are invalid. Of the 28 well-formed plans, 9 were correct, against 19 of 33 JavaScript programs (p = 0.07). Here a recognition deficit is plausible.

**Fix.**
- (a) Report failure classes per form: invalid plan, unknown operation, executed but wrong, correct. A four-column table under Table 2 is enough.
- (b) Replace the two bullets:

> "**Code writing.** In the generator's wording, the 1.5B and 1.7B models solved as many problems by naming operations as by writing JavaScript (30 and 31, against 30 and 26). A plan removes code but not form. At 0.5B, 15 of the 33 plans named an operation that the catalogue does not contain, and 11 were correct, against 22 for JavaScript."
>
> "**Reading.** In the narrative wording the operator plans fell to 9 and 15, below plain JavaScript (19 and 26). At 1.7B, most of the drop was malformed plans, not misread problems. 8 of the 18 failed plans were JSON objects missing their final brace, and 2 named an operation `multiply`, which the catalogue calls `double`; 15 of the 23 well-formed plans were correct. At 1.5B, well-formed plans were also wrong more often (9 of 28 correct), so recognizing the operations in narrative prose was harder for that model."

- (c) Strongly recommended and cheap: rerun the operator-plan condition with grammar-constrained decoding, restricting `op` to catalogue names. llama.cpp's server accepts a JSON schema or GBNF grammar per request. Rename `double` to `multiply` at the same time. The cost is 3 models × 2 wordings × 45 items = 270 generations. This separates recognition from form, and it is itself a language-design point: a plan language should be generated under its grammar.
- (d) Say explicitly that operation names are part of the language design: a `double` that takes a `multiplier` invited `multiply`.

### 3. Section 4.6: unstated design features that change how the results read

**Location:** lines 203–207 (setup), 231 ("Output conventions"), 238 (consequence 2), Check 5 (line 266), and the abstract ("produced exact answers, because the language formatted them").

**Problem.** Three features of the comparison are not stated.
- **Unequal worked examples.**
  - The operator plans had three solved compositions (`above-total-add-rate`, `below-largest-double`, `above-largest-path-exists`; `evaluation/operator-plans.mjs`).
  - JavaScript had one (`above-total-add-rate`).
  - SOP Lang had three solved programs, only one of them a composition (`evaluation/run-items.mjs`).
  - The pre-registration specified "the same examples of trained compositions" (`article/experiments/no-training-plan.md`, E8). Line 207 lists the counts but not the consequence: the plan form saw examples of `largest`, `double` and `pathExists`, and JavaScript saw none of them.
- **The catalogue and the formatter come from the generator.** The catalogue is the 23 operators from which the problem generator builds these compositions. The harness executes plans and formats answers with the generator's own implementations and report templates (`operator-plans.mjs` imports `OPERATORS` from `teacher/procedural/compositions.mjs`). So "Given the correct plans, the harness reproduces all 520 reference answers" (line 203) is a consistency check, and a correct plan matches exactly by construction. The "520" also conflicts with the 45 items per wording of line 202; it counts the whole generator-wording rung.
- **The references contradict the statements.** For 27 of the 33 held-out problems, the reference ends in "units." although the statement asks for litres, crates, parts, tickets or sheets. The other six are "yes." or "N minutes." as the statement asks.
  - "The river depot recorded 6, 21, 17, 4, 9 and 12 crates. ... Report the result in crates." has the reference "14 units.".
  - The JavaScript worked example itself returns `" units."` for a statement that asks for crates.
  - The JavaScript answers that "differed from the reference wording" are nearly all this unit word ("12 tickets." against "12 units.").
  - Sonnet's JavaScript returned the unit the statement named in every reply I sampled (`agent-models/answers-sonnet-c1.jsonl`).
  - So "matched the reference wording in only 3 to 6 of 33" shows the larger models refusing a convention that the input does not determine. That is Section 4.5's point, but here it applies to the reference, not the model.

**Fix.**
- State all three features in the setup paragraph.
- Present the format result as a statement about who owns the convention, not as a model capability. Proposed replacements for line 231 and consequence 2:

> "**Output conventions.** A correct plan prints the reference string, because the harness formats the answer with the same report templates that produced the references; this holds by construction. The JavaScript programs show what it saves. Most of their correct answers differed from the reference only in the unit word. For 27 of the 33 problems, the generator's reference ends in 'units.' although the statement asks for litres, crates, parts, tickets or sheets ('Report the result in crates.' has the reference '14 units.'), and the models wrote the unit the statement named. Capable models miss an output convention that the input does not determine; a convention the language owns cannot be missed."
>
> "**A language-owned output convention matters at every scale.** The larger models' correct JavaScript matched the reference string in only 3 to 6 of 33 problems, because they printed the unit the statement asked for."

- Either rerun JavaScript with the same three worked examples as the plans (135 generations per wording), or list the unequal examples as a limitation (item 5).
- Say that the "units." convention is a defect of the generator's references, to be fixed in a later data version.

### 4. The abstraction-level recommendation goes further than the measurement

**Location:** abstract, last sentence (line 5); last paragraph of 4.6 (line 244); Conclusion (line 276); Check 6 (line 268).

**Problem.**
- **(a) The pre-registered reading was not met.** The plan (`no-training-plan.md`, E8) reads: "If operator plans outperform code for the untuned small models, especially under the book-style wording ..., the papers can argue ... raising the abstraction ... suits small models better ... If they do not, the argument must be weakened: the bottleneck is then reading the problem rather than writing the code." Plans outperformed code in no small-model cell: they were equal at 1.5B in generator wording, lower or indistinguishable elsewhere. The abstract nevertheless ends by recommending a higher abstraction level.
- **(b) The training claim is untested.** "Its training data should present each operation in many wordings, because recognition ... becomes the skill to learn" was not tested; no model was trained on plans. The companion paper's rewording table also shows that training in one wording does not carry over: the 1.5B extended-inventory run fell from 24 of 24 to 8 of 24 held-out compositions in narrative wording.
- **(c) A catalogue narrows what can be said.** Consider the withheld stock-and-lead-time type, which lies outside the procedural inventory (`model-comparison.md`). The untuned 1.7B model writing JavaScript solved 24 of 40 of these problems; the two fine-tuned 1.7B runs solved 2 and 0. The "escape hatch" assumes code-writing survives specialization, and these runs contradict that.
- **(d) The system design is unbuilt.** The pairing of a small and a larger model ("gets both the cheap, exact common case and the robust rare one") has no router and no cost measurement behind it.

**Fix.** Proposed replacement for line 244:

> "For language design, the measurement supports a conditional position. Naming simple, general operations and leaving code and formatting to the runtime removed code-writing and output-convention errors, and in the generator's wording, at 1.5B and 1.7B, it matched code in accuracy. It did not beat code anywhere, which is the outcome our pre-registered reading said would weaken the case for a higher abstraction level. What the higher level leaves to the model is recognition, mapping wording onto operations, and form, because a plan still has syntax and names that small models got wrong. We therefore state as a hypothesis, not a result, that a small model's language should consist of a few general operations whose names say what they do, generated under a grammar that admits only those names, with training data that presents each operation in many wordings. We did not train a model on plans. A catalogue also narrows what can be said. Problems outside it need generated code, and our fine-tuned models had lost part of that ability: on a withheld type, the untuned 1.7B model writing JavaScript solved 24 of 40 problems and the fine-tuned 1.7B models 2 and 0 [companion paper]. Pairing a small model on the catalogue with a larger model for the rest is a design this suggests, with invalid plans and failed invariants as natural signals for handing a problem on; we have not built or measured it."

Two further replacements:
- **Abstract, last clause:** "... and, as a hypothesis to test by training, raise the abstraction level towards a small catalogue of general operations, generated under a grammar, so that recognizing them across wordings becomes what the model must learn."
- **Conclusion (line 276):** "the same move removes code and format errors and leaves one hard problem" becomes "the same move removed code and output-format errors, though not errors in the form of the plan itself, and in our one prompt-only comparison it left recognition as the main difficulty".

### 5. Limitations (Section 5.3) is out of date after 4.6, and incomplete

**Location:** line 272.

**Problem.**
- "We did not compare SOP Lang with the obvious alternative target, plain JavaScript or Python emitted by the same model under the same budget" is no longer accurate. Section 4.6 compares plain JavaScript and SOP Lang written by the same untuned models in the same sandbox, and the 115-problem sample adds fine-tuned SOP Lang against untuned JavaScript (item 10). What is missing is a model fine-tuned on JavaScript.
- "Larger models may be less sensitive to surface regularities" is now partly measured.
- The threats specific to 4.6 are absent.

**Fix.** Proposed replacement paragraph:

> "Each comparison between training conditions rests on one training run per condition, evaluated with one greedy decode. Where later runs bear on a comparison we report them, and we do not attribute small aggregate differences to design choices; the procedural execution failures that rose from 12 to 31 without any change to their targets show how far a single retraining can move a count. Data versions sometimes changed more than one thing. The held-out set was inspected repeatedly during the programme, so it served as a development benchmark rather than an untouched test, and one data version rewrote its scheduling references while another simplified some of its statements. We compared SOP Lang with plain JavaScript only without fine-tuning (Section 4.6): taught in the prompt, SOP Lang was less accurate than JavaScript for the untuned small models and about as accurate for two larger models. No model was fine-tuned on JavaScript or on operator plans. So whether a fine-tuned small model writes SOP Lang more reliably than plain code, and whether training on many wordings makes operator plans robust, remain open. The prompt-only comparison gave the three forms different numbers of worked examples. It used an operator catalogue built from the operators that generated the problems, and it scored exactness against references formatted by the same code as the plans. Its semantic scores rest on two judges that were sessions of one language-model family; the pass that judged the larger models contained no calibration items. The larger models answered in batched agent sessions rather than independent calls, with operator plans and JavaScript for the same problems in one session, and the session transcripts were not retained. The problems are word problems over small numeric and textual inputs, and the rules may need revision for richer domains. The fine-tuned models are small. The two larger models, which we did not fine-tune, were unaffected by the rewording that affected the small ones; whether fine-tuned larger models also copy guards and output conventions was not tested."

### 6. Related work is too thin for Informatica: 8 references, one line each

**Location:** Introduction bullets (lines 19–24); Section 5.1.

**Problem.** Informatica's review form asks "Adequate state-of-the-art section?" and "Fair and adequate literature citation?". With 8 references in one-sentence bullets, a reviewer will answer No. Section 4.6 in particular has close precedents that are not cited.

**Fix.** Add a Related Work section, after Section 2 or as the new Section 2, in five short paragraphs. Each paragraph should end with how this paper differs: small fine-tuned models, and what the target language teaches them.
- **(a) Program-aided reasoning by small models.**
  - PAL and PoT (already cited).
  - Faithful Chain-of-Thought (Lyu et al., 2023).
  - TinyGSM (Liu et al., 2023).
  - ToRA (Gou et al., ICLR 2024).
  - Fu et al., "Specializing Smaller Language Models towards Multi-Step Reasoning", and Magister et al., "Teaching Small Language Models to Reason" (both in the portfolio's verified bibliography).
- **(b) Action and target representations.**
  - **CodeAct** (Wang et al., "Executable Code Actions Elicit Better LLM Agents", ICML 2024) compares code with JSON or text actions. It is the closest precedent to operator plans against JavaScript; its finding favours code for large models, which Section 4.6 should discuss.
  - VisProg (Gupta and Kembhavi, CVPR 2023) and ViperGPT (Surís et al., ICCV 2023): language models composing programs over a module catalogue.
  - LLMCompiler (Kim et al., ICML 2024; in the bibliography): a dependency graph of function calls, close to SOP Lang wires.
  - SatLM (Ye et al., NeurIPS 2023) and Logic-LM (Pan et al., Findings of EMNLP 2023): declarative targets solved by solvers. These are the argument for declarative commands taken to its limit.
  - Gorilla (Patil et al.): API-call generation. Verify the venue.
- **(c) DSL design, intermediate representations and constrained decoding.**
  - Mernik et al., Herzig et al., and grammar prompting (all cited).
  - PICARD (Scholak et al., EMNLP 2021), Synchromesh (Poesia et al., ICLR 2022), Shin et al., "Constrained Language Models Yield Few-Shot Semantic Parsers" (EMNLP 2021), and Geng et al., grammar-constrained decoding (EMNLP 2023). These bear directly on items 2 and 9.
  - Dataflow languages: Johnston, Hanna and Millar, "Advances in dataflow programming languages", ACM Computing Surveys 2004. SOP Lang is introduced as a dataflow language.
- **(d) Abstraction and library learning.** DreamCoder (Ellis et al., PLDI 2021; in the bibliography), Stitch (Bowers et al., POPL 2023) and LILO (Grand et al., ICLR 2024). These are the natural frame for "admit commands that own recurring algorithms" and for growing a vocabulary.
- **(e) Wording, format and judging.**
  - MultiPL-E (Cassano et al., IEEE TSE 2023): accuracy falls with how rare a language is, which is the context for SOP Lang taught in the prompt.
  - Sclar et al. on prompt-format sensitivity (in the bibliography).
  - Min et al., "Rethinking the Role of Demonstrations" (EMNLP 2022): demonstrations teach format.
  - Dziri et al., "Faith and Fate" (in the bibliography): assembling memorized fragments, which is the context for the splice.
  - Zheng et al., "Judging LLM-as-a-Judge" (in the bibliography): judge biases, including self-preference.

Entries marked "in the bibliography" are already verified in `article/evidence/bibliography.json`. I am confident the others exist but have not verified their metadata; run them through the bibliography audit before citing.

### 7. The abstract and introduction do not lead with the problem and the transferable lessons

**Location:** abstract (line 5); Introduction (lines 11–28).

**Problem.**
- **Abstract.** It states the design problem well in sentence 1, but:
  - it never says why the problem matters;
  - "characteristic splice failure" overstates a failure seen in one of eight scaffolded runs (line 99);
  - "familiar wording" is undefined: for untuned models, the "generator's wording" is familiar only because the prompt's worked examples use it;
  - it ends on the untested rule (item 4);
  - it gives no scope sentence (single runs, observational).
- **Introduction.** It opens with a system-specific anecdote carrying five numbers before the problem appears (paragraph 3). Item 1 shows the anecdote does not illustrate the mechanism it is used for. There is no contributions list, so the lessons first appear in Section 4.

**Fix.**
- Proposed opening paragraph for the introduction:

> "Small language models run cheaply on local hardware, and program-aided reasoning lets them hand arithmetic and search to an interpreter [@pal; @pot]. When such a model is fine-tuned to write programs in a purpose-built language, the language designer decides what the model must get right. Every construct the model must emit is something it must learn, and something it can learn wrongly: boilerplate, data representations, assertions, output wording. This paper asks which constructs a target language should keep out of the generated program, and how far that move should go."

- Then a contributions list (three bullets):
  - The transferable rules with their evidence: Sections 4.1, 4.2, 4.4 and 4.5.
  - The negative result on refactoring training targets, stated as in item 1.
  - The prompt-only abstraction measurement (item 8).
- Abstract edits:
  - "was the site of a characteristic splice failure" becomes "was, in one run, the most common site of compile failures";
  - "in familiar wording" becomes "in the problem generator's wording, which the prompt's examples also used";
  - add "Each comparison rests on single training runs; we report the failure modes they reveal rather than effect sizes.";
  - add half a sentence on why it matters (cost, local deployment, auditable execution).

### 8. Structure: "five design decisions" in a section with six, and 4.6 is not introduced

**Location:** line 28 ("five design decisions"); heading, line 78; line 200 ("The five decisions above"); line 250; line 242 ("confirms the last point").

**Problem.**
- Section 4 is titled "Five design decisions" but contains six subsections, and the checklist has six checks.
- 4.6 uses a different kind of evidence: untuned models, prompts, judges, and larger models through agent sessions. Neither the introduction nor Section 3 describes it; the judges appear for the first time in 4.6 as "two blind judges".
- Table 2 mixes two protocols.
- The paragraph on the 115-problem sample sits after the larger models and says it "confirms the last point", but it supports the first consequence (SOP Lang must be learned by small models), not the last (format at scale).

**Fix.**
- Make 4.6 its own section: "5. How far should the abstraction level rise? A prompt-only measurement". Renumber the Discussion as 6.
- Add a paragraph to Section 3 describing the evaluation-only comparisons:
  - the items;
  - the three forms;
  - the models, including the exact releases;
  - greedy decoding;
  - the three scoring levels and the judges.
- Order the new section as: design; small-model table with a failure breakdown; "must small models be trained on it?" (the 115-problem sample, item 10); larger models, in a separate table or clearly separated rows; design consequences.
- Change "confirms the last point" to "supports the first consequence".
- Proposed replacement for line 28:

> "This paper provides such evidence from one fine-tuning programme, in two parts. First, we examine five design decisions made during the programme; for each we state the principle, the evidence in generated programs and outcome counts, and what the evidence does not show. Several decisions had clear effects on the kind of failure and weaker or no effects on the number of correct answers; we report both. Second, we ask how far the same move can go. In a prompt-only comparison without training, we give the same small models, and two larger ones, the same problems in three forms of increasing abstraction, from plain JavaScript to naming operations from a catalogue."

### 9. SOP Lang taught in the prompt fails mostly on an output-naming convention, not on syntax or code

**Location:** line 232 ("It demands both an unfamiliar syntax and code"); line 237; line 242.

**Problem.** In narrative wording, the most common failure of prompt-taught SOP Lang at 1.5B and 1.7B was a program that parsed and computed a value but named its final wire `final`, `keeper` or `crates` instead of `answer`. That is 18 and 15 of the 33 programs; in generator wording it is 10 and 3 (`e8-sopicl3-*-paired`, detail "Requested wire 'answer' does not exist"). The other two forms never carry this convention: the harness wraps a JavaScript body in `@answer jsEval`, and plans have no output name. I re-executed these programs with their last wire as the output. At 1.7B in narrative wording, 8 of the 15 then print the reference number, which would raise 6 to at most 14. At 1.5B in generator wording, 6 of 10 do, raising 13 to at most 19. These re-executions need the judges to confirm. The ranking against JavaScript stands, but the gap is partly a convention the model must remember, which is exactly this paper's thesis.

**Fix.**
- Replace the last two sentences of line 232:

> "SOP Lang with `jsEval` bodies, taught only in the prompt, was the weakest form at 1.5B and 1.7B in both wordings. Its most common failure was not the syntax or the code: in narrative wording, 18 and 15 of the 33 programs computed a value but did not name their final wire `answer`, the name the harness asks for. The other two forms do not carry that convention."

- Add a design consequence: "a language can take the program's single sink wire as its output by default".
- Report the re-execution as a sensitivity analysis, scored by the judges.

### 10. The 115-problem paragraph reports only the comparison that favours fine-tuning on SOP Lang

**Location:** line 242.

**Problem.** The paragraph reports SOP Lang taught in the prompt (4, 19, 34 of 55 compositions) against fine-tuned SOP Lang (45, 55, 55). The same sample (`model-comparison.md`) has three more things a reader needs:
- **Plain JavaScript by the same untuned models:** 33, 49 and 45 of 55.
- **Book problems, where fine-tuning helped only at 1.7B:**
  - fine-tuned: 4, 6 and 32;
  - untuned JavaScript: 1, 10 and 10;
  - SOP Lang taught in the prompt: 2, 9 and 1.
- **The 5 withheld-type problems** that make 115 from 55 + 55.

The fine-tuned runs also come from three different data versions, and the paragraph does not name them.

**Fix.** Proposed replacement:

> "A second sample of 115 held-out problems (55 from the held-out compositions, 55 from the book-derived types, and 5 from a withheld procedural type) supports the first consequence and puts it in context. Taught SOP Lang in the prompt, the untuned 0.5B, 1.5B and 1.7B models solved 4, 19 and 34 of the 55 composition problems. Writing plain JavaScript they solved 33, 49 and 45. Fine-tuned on SOP Lang, they solved 45, 55 and 55 (the final-data 0.5B run, the 1.5B run on the declarative-command data, and the compact-target 1.7B run). On the 55 book problems the conditions were close at the two smaller sizes (JavaScript 1, 10 and 10; SOP Lang in the prompt 2, 9 and 1; fine-tuned 4, 6 and 32). A small model does not write SOP Lang from a description. Fine-tuned on it, the model surpassed plain JavaScript on compositions at every size, and on book problems only at 1.7B [companion paper]."

This paragraph also answers the reviewer question behind item 5.

### 11. Section 4.4: "keep only invariants of the answer" does not address the failure it follows

**Location:** line 186; Check 4 (line 264).

**Problem.**
- **Both guards were true where they were learned.** The harmful whole-number guard came from types in which rates are counts. The helpful "non-negative whole number" guard is the same `Number.isInteger` kind (as `article/audit/adversarial-review-01-02.md` notes), and it would stop a correct answer in any held-out type with fractional answers. What made the first harmful was not what it stated but where the model carried it, so "invariant of the answer" does not separate the two cases.
- **The chronology does not support "resulting policy".**
  - The probe clean-up that removed parameter checks, boilerplate and false guards was data version 5 (25 September).
  - The rate-type failure is from data version 12 (26 September), after that clean-up.
  - The programme's actual response was data version 13, which "relaxed the 'whole positive' integer probes to mild positive probes across scientific/adult/logical/common-sense families" (`training-data/VERSION.history`).

**Fix.** Proposed replacement for the middle of line 186:

> "The two cases differ less than they first appear. Both guards were true in the types the model learned them from. What made the first harmful was not what it stated but where the model carried it: the whole-number rate guard came from types in which rates are counts. An earlier data version had already removed parameter checks that restate the runtime's contract, boilerplate, and guards false for some valid input. The whole-number guards survived that clean-up because they were true where they were written. After the rate-type failures, the final data version relaxed whole-number guards to plain positivity checks across four books. The rule we draw is that an assertion in an example program should hold for every problem type the model may confuse with its own, not only for its own. This is the same condition Section 4.5 reaches for output wording."

- Check 4 becomes: "Would each assertion in the example programs still hold for the other types a model could mistake for this one? Weaken or delete the rest."
- Optionally add the scheduling example from item 1: 46 of the split-trained model's 100 programs asserted feasibility, which stops every correct "not feasible" answer.

### 12. Judges and larger-model protocol: the disclosures are missing

**Location:** line 207 ("two blind judges (agreement κ = 0.96)"); line 234.

**Problem.**
- A general computer-science reader will take "two blind judges" to mean people. They were two agent sessions of one language-model family (the companion ESE manuscript says so).
- κ = 0.96 is pooled over all 2,039 pairs of the portfolio, not these items.
- The larger models' answers were judged in a third pass with no calibration items (616 of 619 agreement; `article/audit/larger-models-factcheck.md`, F2).
- Their JavaScript scores are almost all judge verdicts: 6 and 3 exact of 33.
- The judge model is not named. If it belongs to the same family as Haiku and Sonnet, there is a self-preference risk.
- "With their tool use audited" (line 234) cannot be checked, because no session transcripts were retained (`comparison/README.md`; fact-check F4).
- The judges also accepted "3120 units." against the reference "3120 minutes." in 3 of the 1.7B plans, a leniency worth one sentence.

**Fix.**
- Proposed replacement for the end of line 207:

> "Answers that did not match exactly were judged by two language-model judges. These were separate agent sessions of one model family that saw only the statement, the reference and the answer, with model and form hidden. An answer counts as solved when it matches exactly or both judges accept it. Across all 2,019 answers judged in this and the companion comparisons, the judges agreed on 98.2% (κ = 0.96), accepted none of 20 injected wrong answers, and accepted all 50 answers a parser proves equivalent. The larger models' answers were judged in a later pass without calibration items (agreement on 616 of 619)."

- On line 234, replace "with their tool use audited" with "instructed not to run code; the session transcripts were not retained".
- Name the judge model, and cite Zheng et al. on judge biases.

### 13. Differences too small to interpret, and claims that lean on them

**Location:** lines 157, 230, 232, 237; Table 2.

**Problem and fix.** Flag these explicitly or avoid wording that interprets them. I give Fisher exact p-values over items only as orientation; they ignore run-to-run variance, which is the larger source (next bullet).
- **The yardstick.** The rise in procedural execution failures on unchanged targets (12 to 31 of 480) is "significant" at the item level (p = 0.004). So item-level significance between single runs is not evidence of a design effect. State this once, in Section 3.
- **Table 1.**
  - 460 against 448 correct: the text already declines to interpret it.
  - Other book-derived execution errors, 37 against 45 of 125 (p = 0.35): do not count it toward the split effect.
- **1.7B, generator wording.** Plans against JavaScript, 31 against 26 of 33 (p = 0.15): keep "as many", never "more".
- **Haiku.** SOP Lang against JavaScript, 31 against 33 (p = 0.49): replace "nearly so for Haiku" with "as accurate within 2 of 33 problems".
- **0.5B SOP Lang.** It rose from 5 to 10 of 33 in the harder wording (p = 0.24). Mention it once as a measure of noise at this size and sample.
- **1.7B, narrative wording, well-formed plans.** 15 of 23 against JavaScript 26 of 33 (p = 0.36): see item 2.
- **Trained controls (12 per cell).** Examples: 1.7B plans 10 of 12 against JavaScript 12 of 12. Report them, since the method paragraph mentions them (line 202), but do not interpret them.
- **Section 4.1.** Compile failures of 23 to 80 per run before the change, against 42 and 83 after: already handled well.

### 14. Table 1 mixes populations and hides where the effect is

**Location:** lines 142–155.

**Problem.**
- The first row is a property of the training targets (wires per "shipped plan"); the others describe generated programs on the held-out set.
- "Shipped plan" is the static checker's unit: every solution program in the dataset tree, including procedural types that did not change (`skills/data-quality/scripts/static-check.mjs`). "The number of jsEval wires rose by 56%" reads as a statement about the book-derived types, but in the book-derived training rows the jsEval wires nearly doubled (6,775 to 13,267, +96%).
- The table gives no breakdown by problem group.

**Fix.**
- Split the table into "Training targets" rows and "Generated programs on the held-out set" rows.
- Define "shipped program" at first use, and give the population of the +56% and the 14% to 3% figures.
- Add these rows:

| Group (count) | Compact targets | Split targets |
| --- | --- | --- |
| Execution errors, procedural (480; targets unchanged) | 12 | 31 |
| Execution errors, scheduling (100) | 8 | 59 |
| Execution errors, other book-derived (125) | 37 | 45 |
| Correct answers: procedural / other book-derived / scheduling | 438 / 22 / 0 | 428 / 20 / 0 |
| Scheduling programs with more than one computation wire | 0 | 5 |

### 15. Section 4.3: an omitted run, a changing population, and a technical error

**Location:** lines 15, 159, 161.

**Problem.**
- **(a) The omitted third arm.** The contemporaneous design record calls data version 9 the third arm of this structure experiment (`evaluation/registry/structure-experiment.md`). Its training programs for this book were multi-wire (3 to 5 wires in a "container idiom"). Its 1.7B run scored 428 of 705 and failed to execute on 36 of the 100 scheduling problems, again writing one computation wire in 87 of 100. Section 4.3's history leaves it out.
- **(b) "Those 100 problems" changed.** From data version 11 the scheduling references were rewritten ("46 minutes: not feasible"), and data version 12 simplified the statements of this book. Across runs, "those 100 problems" are the same identifiers and numbers, not the same text or references.
- **(c) A technical error.** Line 161 says `.values()` is "a method that a keyed collection has in other languages but not in JavaScript". But JavaScript `Map` objects do have `.values()`, and the training programs use `new Map()` (Section 4.2's listing). Only plain objects lack it.

**Fix.**
- (a) Add one sentence: "A third target form, a multi-wire container idiom, failed to execute on 36 of the 100 problems, again in programs the model wrote as a single computation."
- (b) Add "same problem identifiers and numbers; the references were rewritten in data version 11 and the statements simplified in data version 12".
- (c) Replace with "a method that Python dictionaries and JavaScript `Map` objects have, but plain JavaScript objects, the form a JSON literal takes, do not".

### 16. The design sections do not consistently separate principle, evidence and limits

**Location:** Sections 4.1–4.5.

**Problem.** In 4.1 and 4.2 the principle appears only in the last paragraph (lines 101, 138). In 4.1 the words spent on what the evidence does not show exceed those on the finding. Half of 4.2 is about a misattribution in internal documentation (lines 133–136), which interests the ESE paper more than a language designer. Section 4.4 is the model to follow.

**Fix.** Give every section the same three beats, and open each with a one-sentence rule in italics. Proposed openers:
- **4.1:** "*A check that every program needs belongs to the runtime, not to the program.*"
- **4.2:** "*When the model repeatedly transcribes an algorithm, give it a command whose body names the algorithm's inputs.*"
- **4.3:** "*A refactoring of the training targets is a change to the curriculum; measure it on the programs the model writes.*"
- **4.4:** "*An assertion in an example program must hold for every type the model may confuse with its own.*"
- **4.5:** "*The language, not each problem type's references, should define how an answer is printed.*"

Then follow with "What we observed" and "What this does not show", each at most one paragraph. Cut lines 133–136 to one sentence: "Overall accuracy rose between the two runs (53.8% to 62.4%), but the rise came from two other types whose programs used no new command, so the command cannot claim it." Move the details to a note or to the ESE paper.

### 17. Section 4.2 shows the fragment but not the program

**Location:** lines 105–131.

**Problem.** The exp-016 program with the command has three computation wires (`@stage0 jsEval`, `@stage1 graphPath`, `@answer jsEval`), where the exp-014 program had one. "About fifteen generated lines ... became three" is true of the search portion only. The whole program went from about 27 body lines to about 13, and it gained two wires. That is exactly the trade-off 4.3 is about. There are two smaller problems:
- `$stage0` (line 126) is unexplained;
- the inline listing (lines 107–120) is abridged and renamed, without saying so.

**Fix.**
- Show the whole command program (it is 16 lines including declarations), or state whole-program line and wire counts.
- Add one sentence: "The command version has two more wires than the inline version; unlike the refactoring of Section 4.3, the split removed an algorithm from what the model writes."
- Explain `$stage0` ("the wire that computes the largest kept value").
- Label the inline listing "(abridged; loop variables renamed)".

### 18. Sections 2 and 3 lack what a reader needs to orient and to replicate

**Location:** lines 34–76.

**Problem and fix.** Add a compact setup table or paragraph covering the following.
- **Training recipe:** full fine-tuning, 2 epochs, learning rate 1e-4, effective batch 32, maximum sequence length 4,096, seed 3407, a 10% preservation mixture, and checkpoint selection on a separate selection set of trained and untrained programs (the "validation accuracy" of line 99; 339 items in the early runs). These are the values recorded in the manifests; see `article/audit/revision-factcheck.md`.
- **Training-set size:** 9,935 rows in the data versions compared in Table 1.
- **Held-out set:** 705 problems = 480 procedural + 225 book-derived, of which 100 are scheduling problems. It is a development benchmark (claim ledger).
- **Decoding:** greedy (temperature 0), token limits per form, and Qwen3 run with thinking disabled.
- **Exact model releases:** Qwen2.5-Coder-0.5B-Instruct, Qwen2.5-Coder-1.5B-Instruct and Qwen3-1.7B, cited to their model cards (already in the bibliography). Give exact identifiers and access dates for Claude Haiku 4.5 and Claude Sonnet 5.
- **Re-execution scope:** the held-out evaluations of trained checkpoints (13,330 records in 26 runs), not the evaluation-only comparisons. Line 74 says "every saved program".
- **The command set.** Section 2.2 names only some of the commands. `docs/wire-types.html` lists twelve: `literal`, `jsEval`, `graphPath`, `aggregate`, `fraction`, `modelCall`, `input`, and five container commands. Give a one-line table. `modelCall` (an explicit, budgeted neural call) matters for the small-model/large-model design of 4.6.
- **When `probe` arrived.** Section 2.3 describes the sandbox-provided `probe` as if it had always existed. Add "(provided by the runtime from the data version described in Section 4.1)".
- **Failure stages.** Add "a body that does not compile" to the list on line 52, because Section 4.1 counts compile failures.

### 19. Terms a general computer-science reader will stumble on

**Location:** throughout.

**Problem and fix.** Define terms at first use, or replace them:
- **"programme" and "program".** The research programme (11 uses) sits beside programs of code, and readers and copy editors will trip on it. Prefer "project" or "study".
- **"plan".** It carries four meanings: SOP Lang program (4.3, "shipped plans", "Keep plans compact"), operator plan (4.6), a project plan's feasibility ("the plan is not feasible"), and a solution strategy ("lost the plan"). Reserve "plan" for operator plans and say "program" elsewhere; retitle 4.3.
- **Other undefined terms:**
  - "shape" (solution structure);
  - "type", "composition" and "procedural type" against "book-derived type";
  - "tranche";
  - "validation accuracy";
  - "students" (line 242);
  - "shipped";
  - "the statement-simplification version" (line 169), and the other named data versions.
- **"Untuned".** It means "not fine-tuned by us"; these are instruction-tuned releases.
- **A data-version table.** Add a small table (version: what changed: runs used in this paper) built from `training-data/VERSION.history`, so a phrase like "the statement-simplification version" has a referent.

### 20. Code examples need explanation and honest labels

**Location:** lines 38–50, 92–95, 107–129, 171–180.

**Problem.**
- The 4.1 and 4.2 listings use `slots.` without `$`, and 4.4 and 2.1 use `$slots.`. The reason, a scaffolding line `const slots = $slots;`, is not among the scaffolding items listed on lines 83–86.
- `current` in the 4.2 listing is undefined.
- The 4.4 listing is "(abridged)", but it was also edited: `slots.` became `$slots.`, and a third probe was removed.
- The 2.1 program is adapted. Its return statement uses the later value-bearing reference form. The compact-target model's actual program for the same problem printed a sentence ("... so the plan does not meet the limit."), which exact matching scored wrong. The introduction calls that program's conclusion correct without saying it scored wrong.

**Fix.**
- Add `const slots = $slots;` to the scaffolding list, or normalize the listings.
- Label the listings "abridged and lightly edited".
- Caption the 2.1 program "illustrative, adapted from a generated program".
- In the introduction, add "(its sentence differed from the reference wording, so exact matching scored it wrong; Section 4.5)".

### 21. Section 4.5 can rest on four runs instead of one

**Location:** line 194.

**Problem.** The section rests on one run: 54 of 100 programs printed the procedural sentence. The records support a much stronger statement. In the four runs after the references were rewritten (the 1.7B runs on data versions 11, 12 and 13, and the 0.5B run on data version 13):
- 145 scheduling programs ran, and none printed the new form ("46 minutes: not feasible");
- 118 ended with the procedural type's clause ("... so the plan meets / does not meet the limit."), and most of the rest printed variants of that sentence.

**Fix.** Add: "In the four runs after the rewrite, none of the 145 scheduling programs that ran printed the new form; 118 ended with the procedural type's sentence." Two further links are worth making:
- Tie the rule of 4.5 to item 3. The generator's own "N units." references (27 of the 33 held-out compositions) are not derivable from the statements either, and even the larger models declined to reproduce them.
- Make the structured-result proposal concrete, for example a `result` record `{value, unit, verdict}` that the runtime renders.

### 22. Table 2: labels, caption, and a missing reference row

**Location:** lines 209–227.

**Problem.**
- The caption says "untuned models" but includes Haiku and Sonnet.
- It does not say that "solved" means exact or accepted by both judges.
- Small models are labelled only by size.
- The larger-model rows come from a different protocol (item 12).
- One row would give the section its context: the fine-tuned compact-target 1.7B model on the same 33 items and both wordings. It solved 33 (33 exact) and 24 (20 exact) (`paired-tables.md`, E2). Trained on SOP Lang, a small model is exact and nearly as robust as untuned JavaScript in narrative wording.

**Fix.**
- New caption: "Held-out compositions solved (exact, or accepted by both judges; exact matches in parentheses), 33 problems per cell, the same problems in both wordings."
- Label the rows "Qwen2.5-Coder 0.5B", "Qwen2.5-Coder 1.5B" and "Qwen3 1.7B".
- Move the larger models below a rule headed "Larger models, batched agent sessions (reference)".
- Add the fine-tuned 1.7B row.
- Add the failure-class columns from item 2, or a companion table.

### 23. Discussion, checklist and conclusion: bring them in line with the corrected findings

**Location:** lines 250–268 and 276.

**Problem and fix.**
- **5.1 "pure risk" (line 250).** Section 4.4's useful case shows that repeated code can carry value. Say "carries risk and no information about the problem".
- **Herzig sentence (line 252).** "The model wrote programs that executed more reliably when the target avoided unnecessary interfaces" is not supported at the program level (item 1). Write "the model trained on the compact targets failed to execute less often".
- **Check 3** becomes: "Does a proposed refactoring of the example programs remove something the model must write? If not, keep the old form, and if you refactor, measure the programs the model writes for held-out types; our split-trained model changed representations and assertions in programs it did not split."
- **Check 4:** see item 11.
- **Check 5:** add "including the references themselves: a reference convention the input does not determine is missed even by capable models".
- **Check 6:** add "at 1.5B and 1.7B, in the generator's wording; at 0.5B plans were less accurate than code", and "generate plans under their grammar".
- **New Check 7, from the 4.6 records:** "Does the language ask the model to remember an arbitrary convention: the name of the output wire, an operation name that does not say what it does, the closing brace of a plan? Let the runtime supply it, or constrain decoding to it."
- **Conclusion.** "Taking something out of the generated program reliably changed the kind of failure" becomes "in each case we examined, changed the kind of failure". Revise the "removes code and format errors" sentence as in item 4.

### 24. Title and keywords

**Location:** lines 1 and 7.

**Problem.**
- The title reads as a design paper rather than an experience report, and it does not cover the abstraction-level question.
- "for a Small Model" is awkward.
- The keywords miss the terms readers will search for.

**Fix.**
- Title options:
  - "What the Generated Program Should Not Contain: Lessons from Designing a Target Language for Small Language Models"
  - "Designing a Target Language for Small Language Models: Evidence from Generated Programs"
- Keywords: add "program-aided reasoning", "abstraction level", "fine-tuning" and "dataflow languages"; drop "code generation" if space is short.

### 25. Informatica formalities, overlap with the companion papers, and a figure

**Location:** the whole manuscript.

**Problem and fix.**
- **Formal requirements** (from the journal's review form):
  - a short Slovenian abstract (Povzetek);
  - author names, affiliations and e-mail addresses;
  - funding and competing-interest declarations;
  - a data-availability statement with a persistent identifier;
  - references in first-citation numeric order (already produced by the build).
- **Overlap.** The ML manuscript reports the same splice example (58 of 80), the same 64 assertion-caught failures, the same 115-problem comparison (its Table 6), and the larger models' SOP Lang and JavaScript rows (its Table 7).
  - Cite the companion as a reference entry, not "a companion paper".
  - Disclose the overlap in the cover letter.
  - Keep the design decisions and the operator-plan comparison as this paper's own contributions.
  - The ESE manuscript reports the operator-plan result on a different, unpaired sample (1.7B: 49 of 55 semantic, 44 exact), and a reader of both will compare. Add one sentence there, or here, saying the samples differ.
- **Figure.** The paper has none. A figure showing one problem in the three forms of 4.6 would help a general reader more than any other addition: the JavaScript body, the SOP Lang program, and the operator plan, each annotated with what the runtime owns. A dependency-graph drawing of the 2.1 program would also help.
