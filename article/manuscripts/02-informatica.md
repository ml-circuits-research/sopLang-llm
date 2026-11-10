# What the Generated Program Should Not Contain: Designing a Target Language for Small Language Models

## Abstract

Small language models can be fine-tuned to compile word problems into programs for an interpreter, which makes them cheap to run and their answers checkable. The target language then becomes a curriculum: every construct a model must emit is something it can learn wrongly, and little is known about which design choices matter. We study this with SOP Lang, a small dataflow language, using programs written by fine-tuned models of 0.5 to 1.7 billion parameters and a prompt-only comparison of abstraction levels on the same models before fine-tuning. Validation scaffolding repeated in every program was the commonest site of compile failures in an early run. A command that owns an algorithm shrank the generated code at equal accuracy. Refactoring the training programs into more steps coincided with more execution failures, which arose not in split programs but inside single computations, through a changed data representation. Assertions and output sentences were copied into problem types where they did not hold. Asked instead to name operations from a catalogue whose answers the language formats, all but the smallest untuned model matched plain JavaScript in the problem generator's wording but fell below it under a narrative rewording, through malformed plans and misnamed operations as well as misreadings. Single training runs support failure modes, not effect sizes. The resulting rules: keep generic contracts, recurring algorithms, and output conventions in the language, and check each example assertion against the types a model may confuse; a higher abstraction level remains a hypothesis to test.

Keywords: domain-specific languages; small language models; program-aided reasoning; fine-tuning; abstraction level; runtime contracts

## 1. Introduction

Program-aided reasoning lets a language model hand arithmetic and search to an interpreter: the model writes a program, and the interpreter executes it exactly [@pal; @pot]. A small model fine-tuned for this role runs cheaply on local hardware, and its answers can be checked by rerunning its programs. But it learns the target language only from example programs, together with whatever they contain: boilerplate, data representations, assertions, and output wording. The language designer therefore decides, often implicitly, what the model must get right.

The effects can be indirect. In the project studied here, the training programs of the book-derived problem types were refactored into more, smaller named steps, each verified to compute the same answer, and a 1.7-billion-parameter model was retrained with the same recipe. On a held-out scheduling problem with five tasks, two of them parallel, a safety buffer, and a deadline, the model trained on the original compact programs wrote seven scalar inputs and two lines of arithmetic and computed the correct 46 minutes and verdict, though in a sentence that exact matching rejected. The model trained on the refactored programs did not split its program. It stored the durations in a keyed object, called a `.values()` method that plain JavaScript objects lack, and crashed, as it did on 41% of the 100 problems of that type. The programs had changed where the refactoring never reached.

This paper asks which constructs a target language should keep out of the program a small model generates, and how far that move should go. Prior work covers language design for human programmers, intermediate representations and constrained decoding, and program-aided reasoning mostly with large models (Section 3), but not how a target language shapes what a small, fine-tuned model writes. We answer from one fine-tuning project, in two parts: five design decisions made during the project, each with its principle, evidence, and limits; and a prompt-only comparison in which the same small models, and two larger ones, received the same problems in three forms, from plain JavaScript to a plan that only names operations from a catalogue. Our contributions are:
- rules for what a model-facing language should own, each tied to an observed failure (Sections 5.1, 5.2, 5.4 and 5.5);
- a negative result: refactoring training programs into more steps coincided with more execution failures, which arose in programs the model did not split (Section 5.3);
- a prompt-only measurement: naming operations removed code and output-format errors and matched code in the generator's wording, but under rewording lost more than code did, through malformed plans and invented operation names as well as misreadings (Section 6).

## 2. SOP Lang

### 2.1 Programs as wiring diagrams

A SOP Lang program consists of named computations, called wires. A wire is declared by a line beginning with `@`, its name, and a command; the lines up to the next declaration are its body, and `$name` in a body reads another wire's value. These references define a dependency graph, which the runtime checks for cycles and executes in dependency order. A caller asks for output wires by name, here for `answer`.

The basic commands are `literal`, which holds a JSON value, and `jsEval`, which runs a JavaScript body in an isolated sandbox on copies of its dependencies. A compiled solution records the quantities it extracts in a `slots` wire and computes the answer from them, as in the program below for the scheduling problem of the introduction. It is illustrative, adapted from the compact-target model's program without its assertion line and with the later value-bearing answer form of Section 5.5.

```sop
@slots literal
{"aMinutes": 7, "bMinutes": 11,
 "cMinutes": 17, "dMinutes": 6,
 "eMinutes": 12, "bufferMinutes": 4,
 "limitMinutes": 43}

@answer jsEval
const join = Math.max($slots.bMinutes,
  $slots.cMinutes);
const minutes = $slots.aMinutes + join
  + $slots.dMinutes + $slots.eMinutes
  + $slots.bufferMinutes;
return minutes + " minutes: "
  + (minutes <= $slots.limitMinutes
    ? "feasible" : "not feasible");
```

The model extracts the values and writes the computation; the runtime owns execution, isolation, and resource budgets. A failure can therefore be located: a program that does not parse, an invalid graph, a body that does not compile or that throws, a wrong value, or a right value expressed differently from the reference.

### 2.2 Commands

The standard vocabulary has twelve commands. Three declarative commands own an algorithm, and their bodies name inputs instead of implementing a procedure: `graphPath` answers reachability over an undirected edge list with `yes` or `no`, `aggregate` filters a list by a declared predicate and reduces it to one number, and `fraction` reduces a ratio. Each validates its inputs and result. Five container commands build and query typed stores, `input` binds a value supplied by the caller, and `modelCall` is the only neural step a program can contain: an explicit, logged, and budgeted call to a language model.

### 2.3 The execution contract and the probe helper

Every `jsEval` body can call `probe(condition, message)`, which throws a structured error when its condition is false; the runtime has provided it since the data version of Section 5.1, before which each program defined its own. The command itself checks the generic contract: dependencies defined, a non-empty `slots` record, and a non-empty result. A failed probe ends the wire with an execution error that names the message, visible in the evaluation record.

## 3. Related work

**Program-aided reasoning and small models.** PAL and Program of Thoughts showed that a large model solves arithmetic word problems more reliably by writing a program for an interpreter than by computing in text [@pal; @pot], and Faithful Chain-of-Thought extends this to other symbolic languages run by deterministic solvers [@faithfulcot]. ToRA trains models on trajectories that interleave reasoning with program-based tool use [@tora], and 1.3B-parameter models trained on TinyGSM, synthetic problems with Python solutions, exceed 80% on a grade-school benchmark with a verifier [@tinygsm]. Specialization trades a small model's general abilities for the target task [@specializing], and small models can learn reasoning from larger models' traces [@magister]. These studies take the target language, usually Python, as given; we treat it as the variable.

**Code, calls, or plans.** Toolformer teaches a model to call external operations [@toolformer]. VisProg and ViperGPT have a large model compose programs over a fixed catalogue of vision modules [@visprog; @vipergpt], close to our operator plans, and LLMCompiler separates planning function calls from executing them [@llmcompiler], as SOP Lang separates a program from its execution. SatLM and Logic-LM ask for a declarative specification that a solver resolves [@satlm; @logiclm], the argument for declarative commands taken to its limit. CodeAct found executable code a more effective action format than JSON or text for most of the language-model agents it evaluated [@codeact]; we ask a related question for small models.

**Representations and constrained decoding.** Mernik and colleagues describe when and how to build a domain-specific language for human users [@dslsurvey], and dataflow languages, whose programs are graphs of operations driven by the availability of data, have a long history [@dataflowsurvey]; SOP Lang is a small dataflow language whose programmer is a model. The intermediate representation changes what a pretrained model generalizes to [@herzig], and a grammar in the prompt helps large models write domain-specific languages [@grammarprompt]. Constrained decoding enforces the target language during generation: by incremental parsing [@picard], by syntactic and semantic constraints [@synchromesh], through a controlled sublanguage [@shin2021], or with formal grammars and no fine-tuning [@geng2023]. We did not constrain decoding, which would remove the malformed plans and invented names of Section 6.

**Contracts and abstraction learning.** Design by contract places obligations where they can be stated and checked [@dbc]. Library learning grows a vocabulary of abstractions from a corpus of programs: by learning a library together with a neural search policy [@dreamcoder], by corpus-guided top-down synthesis [@stitch], or by language-model synthesis with compression and documentation [@lilo]. SOP Lang's declarative commands came from a manual version of that loop, counting recurring code in the training programs; we ask what such abstractions do to the programs a small model writes.

**Surface, demonstrations, and judges.** Language models are sensitive to details of prompt format [@sclar], demonstrations act largely through the format and inputs they show [@mindemos], and code generation tends to be less accurate in less popular programming languages [@multiple], which bears on a language taught only in the prompt. Transformers often reduce multi-step reasoning to matching fragments of computation seen in training [@faithfate], which fits the spliced assertions and borrowed sentences we observed. Language-model judges show biases [@llmjudge], including a preference for their own generations [@panickssery2024], which matters when judges and judged share a model family, as ours partly did.

## 4. The study

### 4.1 The fine-tuning project

Training data came from two sources. Problem types derived from seven books of reasoning exercises generated statements from printed templates, each with a reference program and an independently computed answer (book-derived types). Procedural generators composed further types from elementary list operations, such as keeping the values above a threshold, totalling, or adding a fixed amount; a composition is a declared chain of such operations. Every accepted program was executed during dataset verification, with its inputs perturbed. The dataset went through thirteen versions, several changing more than one thing; we name each by what it changed, and the supplementary material lists them.

The instruction-tuned releases of Qwen2.5-Coder 0.5B and 1.5B [@qwen05; @qwen15] and Qwen3-1.7B [@qwen3] were fully fine-tuned (AdamW, learning rate 10⁻⁴, effective batch 32, sequences of up to 4,096 tokens, fixed seed; three epochs in early runs and two later; in later runs one training problem in ten was also posed as a request for plain JavaScript, with the same solution rewritten as a standalone program, to preserve code-writing ability), with checkpoints selected on a separate validation slice of 339 programs. The held-out set grew from 225 book-derived problems of types absent from training, 100 of them instances of one scheduling type, to 705, adding 440 instances of 11 compositions held out of training and 40 of a withheld procedural type. The selected checkpoint generated one program per problem greedily, the runtime executed it, and the answer was compared with the reference string after normalization (exact matching). Re-executing the 13,330 saved programs of 26 held-out evaluations of trained checkpoints reproduced every recorded outcome. The held-out problems were inspected repeatedly, so they form a development benchmark rather than an untouched test [@dwork].

Each compared condition was trained once, so we rely on differences visible in individual programs, repeated observations in later runs, and stated limits. Tests over problems do not settle such comparisons: between the runs of Section 5.3, execution failures on the 480 procedural problems, whose training programs did not change, rose from 3% to 6%, which Fisher's exact test calls significant (p = 0.004).

### 4.2 The prompt-only comparison

A new abstraction level cannot be tested here by training on it, but what it demands of a model can be measured by teaching it in the prompt to the released instruction-tuned models, which we call untuned because we did not fine-tune them.

The items were three instances of each of 11 held-out and 4 trained compositions, in two wordings with the same numbers and references. In the generator's wording each clause renders one operation ("Please keep only the records above 19, then count the kept records, then double it by the factor of 2. Report the result in litres."); the narrative wording resembles the book problems, with a scenario, paraphrased operations, one irrelevant number, and the question last ("... Finally, the keeper multiplies that figure by 2. Question. What is the final figure, in litres?"). The models were asked for one of three forms:
- **Operator plan:** JSON that names operations from a catalogue of the 23 operations the problem generator composes, such as `{"values": [...], "steps": [{"op": "keepAbove", "threshold": 19}, {"op": "count"}, {"op": "double", "multiplier": 2}]}`. The harness executes it with the generator's own implementations and formats the answer with the generator's report templates, so a correct plan reproduces the reference by construction, as the correct plans of all 520 generator-wording items of the pool do.
- **Plain JavaScript:** one function body that returns the answer as a short string, run as an `answer` wire in the same sandbox.
- **SOP Lang with `jsEval` bodies,** taught by a syntax guide.

The plans had three worked examples of trained compositions, JavaScript one, and SOP Lang three solved programs of trained types, one of them a composition. The pre-registered plan specified the same examples for all forms; this deviation favours the plans, whose examples showed the operations `keepBelow`, `largest`, `double` and `pathExists`.

The small models decoded greedily (Qwen3 without its thinking mode), within 768, 1,024 and 1,536 tokens for plans, JavaScript and SOP Lang. Claude Haiku 4.5 (claude-haiku-4-5-20251001) and Claude Sonnet 5 (claude-sonnet-5) answered the same items on 29 September 2026 in batched agent sessions, each reading one file of prompt templates and statements and writing one reply per item, instructed not to write or run code. No session saw two wordings of a problem, but plans and JavaScript for the same problems shared a session, so they are not independent answers. Full transcripts were not retained; orchestration records with each session's model, tool-call count, and instructions were.

Answers were scored by exact matching and at a semantic level: exact, or accepted by both of two judges, separate sessions of Claude Opus 5.5 (claude-opus-5-5) shown the statement, reference, and candidate only, under a rubric that ignored wording and unit words. Over all judged pairs, 2,048 distinct answers from this and the companion comparisons plus 25 injected calibration answers, they agreed on 98.3% (Cohen's κ = 0.97), rejected all 24 injected wrong answers, and accepted all 50 answers whose equivalence a deterministic parser establishes. Most larger-model answers (538 of 619) were judged in a later pass without calibration items, with agreement on 616 of the 619. Judges and larger models share a model family, so self-preference cannot be excluded [@panickssery2024].

Three instances per composition weight compositions equally and kept the comparison within one night of shared GPU time. Instances of a composition share its solution, so the real unit is the 11 held-out compositions. At 33 problems, the 95% confidence interval of a proportion is about ±17 percentage points; we read only differences of about 25 points or more. The 12 trained-composition problems per cell are in the supplementary material.

## 5. Five design decisions

### 5.1 Generic contracts belong in the executor

*A check that every program needs belongs to the runtime, not to the program.*

In the early data versions every `jsEval` body began with the same scaffolding: a local probe function, two assertions that `slots` was a non-empty object, an asynchronous wrapper opening with a local copy, `const slots = $slots;`, and a closing assertion that the result was not empty. In the first full 0.5B run about a quarter of all generated lines were scaffolding or assertions, and 58 of the 80 held-out programs that failed to compile (73%) contained a validation line spliced from two remembered programs (observed; line breaks added):

```js
probe(Number.isInteger(
  slots.durations.every(
    (value) => value > 0),
  "every item must have a positive duration");
```

A check that every duration is positive sits inside a check that one value is an integer, leaving a parenthesis unclosed. The project then moved the scaffolding into the executor: the sandbox provides `probe`, and the command validates `slots`.

The evidence does not show fewer failures afterwards. The splice occurred in that run only, not in the seven other scaffolded runs, and compile failures on the same 225 book-derived problems ranged from 10% to 36% per run before the change and were 19% and 37% in the two runs after it, in a data version that also changed the curriculum. The design argument needs no more: a construct identical in every program carries no information about the problem and can only be emitted wrongly. Design by contract places obligations where they can be checked [@dbc]; for a model programmer, obligations that hold for every program belong to the runtime.

### 5.2 A command should replace an algorithm, not a line

*When the model repeatedly transcribes an algorithm, give it a command whose body names the algorithm's inputs.*

`graphPath` was introduced because reachability questions made the model write a breadth-first search: an adjacency map, a queue, a visited set, and a loop. For one held-out procedural type (filter the values below a threshold, take the maximum, and ask whether it connects to a target node), the 1.5B model trained before the command wrote the search inline, in one computation wire of 27 lines, 15 of them the search itself. The 1.5B model trained with the command wrote three wires of 13 lines in all: `stage0`, which filters the values and takes the largest; the call below (observed); and a one-line `answer`.

```sop-fragment
@stage1 graphPath
from: $stage0
to: $slots.target
edges: $slots.edges
```

Both models solved all 40 problems of the type. A call that parses cannot contain an unterminated loop or a traversal that forgets the reverse edge, and unlike the refactoring of Section 5.3, this split removed an algorithm from what the model writes.

The evidence shows no accuracy benefit, since the inline search, seen many times in training, was already reliable. Overall accuracy rose between the two runs from 54% to 62% of the 705 held-out problems, and the project's design documentation credited the new commands, but the rise came from two procedural types whose programs used no new command. A command's accuracy benefit must be shown where the inline version fails; we keep the principle as a statement about error surface.

### 5.3 Refactoring the targets changes more than their structure

*A refactoring of the training programs changes the curriculum; measure it on the programs the model writes.*

A static check flagged 14% of the dataset's 10,640 programs as bloated: at most three wires but more than 25 lines of JavaScript. The next data version refactored the book-derived programs into more wires with shorter bodies, each computing one named value. Their `jsEval` wires went from 6,775 to 13,267. Statements, references, and dataset size were unchanged, and every refactored program reproduced its answer. Table 1 compares the two resulting runs.

Table 1. Compact against split training programs for the book-derived types (Qwen3-1.7B, same recipe, statements, and references; one run each, the compact-target run resumed from an interrupted run). Percentages of the count in parentheses.

| Measure | Compact targets | Split targets |
| --- | --- | --- |
| *Training programs* | | |
| Wires per program, whole dataset (10,640) | 2.2 | 2.8 |
| Scheduling book, programs with two or more computation wires (900) | 0% | 67% |
| *Programs generated for the held-out problems* | | |
| Parsed and formed a valid graph (705) | 100% | 100% |
| Failed at run time, scheduling problems (100) | 8% | 59% |
| Failed at run time, other book-derived problems (125) | 30% | 36% |
| Failed at run time, procedural problems, programs unchanged (480) | 3% | 6% |
| Scheduling programs with more than one computation wire (100) | 0% | 5% |
| Correct by exact match (705) | 65% | 64% |

The split-trained model failed at run time more than twice as often (19% against 8% of the 705), mostly on the scheduling problems; its rise on the other book-derived problems is within sampling noise. Exact matches changed by less than two points, and 10 of the 12 lost were procedural.

We expected the added wires to be the mechanism, but the generated programs do not show it. The split-trained model wrote one computation wire in 95% of its scheduling programs, and 55 of its 59 execution failures (93%) were such programs; on other book-derived problems its two-wire programs failed no more often (32% of 31) than its one-wire programs (37% of 94). What changed was inside the wire (observed; line breaks added):

```js
const slots = $slots;
const joinMinutes =
  Math.max(...slots.durations.values());
const completionMinutes =
  joinMinutes + slots.bufferMinutes;
probe(
  completionMinutes <= slots.limitMinutes,
  "the plan must stay within the stated safety buffer");
```

Of the 100 scheduling programs, 69% stored the durations in a keyed object (14% after compact training), and 41% then called `.values()` on it, a method of JavaScript's `Map` and Python's dictionaries but not of plain JavaScript objects, the form a JSON literal takes. In 44% the program took the maximum over all durations instead of computing the chain with its join, and 46% asserted that the schedule is feasible (none after compact training), which would stop every correct answer to the 46 problems whose reference is "not feasible". None of these habits was new: the training programs of both versions contained keyed maps of numbers (426 programs), assertions that a value stays within a limit (240), and `.values()` calls (41), in equal numbers. What differed was which habits the retrained model drew on for an unseen type. The failures also depended on wording: rewritten into the template of the procedural type that teaches their shape, 15 scheduling problems were all solved by the final-data 1.7B run, trained on the split form, which in the book's wording executed 1 of them and solved none; the compact-target run solved all 15 in both wordings.

Runs trained before the scheduling shape was taught failed to execute on 58% or more of these problems, and a third form, staged containers, on 36%, mostly in one-computation programs. A recorded revert to the compact form left this book's programs byte-identical to the split form, later versions kept that structure, and the three later 1.7B runs failed on 62%, 44% and 94% (a 0.5B run on 55%), on problems with the same identifiers and numbers but revised references and statements. Only the one run that combined compact programs with the taught shape stayed at 8%.

The lesson is not that decomposition is harmful: named values aid inspection, and containers need them. Refactoring the training programs changed the curriculum, and its effects appeared where the refactoring did not reach, in the representations and assertions chosen for a held-out type. One run per condition cannot separate that effect from retraining variation, so such a refactoring must be measured on the programs the model writes for held-out types, not judged from the targets.

### 5.4 Assertions are part of the curriculum

*An assertion in an example program must hold for every problem type the model may confuse with its own.*

Assertions make a training program fail loudly when its inputs or result are wrong, and the model learns them as part of what a program of a given kind looks like. One held-out rate type has fractional answers: a problem asks how much useful output a process of 12 cases per hour yields in 110 minutes when 5% of its throughput is lost to overhead, and the reference is "20.9 useful cases." The 1.7B model trained on the simplified-statement data wrote (observed, abridged to the first assertion):

```js
const rate = slots.nominalThroughput
  * (100 - slots.overheadPercent) / 100;
probe(Number.isInteger(rate) && rate > 0,
  "the useful rate must be a whole positive rate");
```

The computation is right, and without the assertions the program returns "20.9 cases." The first assertion stops it: a whole-number guard copied from types in which rates are counts. For this model, 72% of the 50 problems of the type stopped on its own assertion. Run without the assertions, 12 of those 36 programs (33%) print the reference numbers, but none would match exactly ("cases" against "useful cases"), so the borrowed guards stopped correct computations without changing the score. The feasibility guard of Section 5.3 follows the same pattern. Assertions also helped: a 0.5B model that confused two newly taught operations produced wrong values in 64 programs, and in every one the final assertion, that the answer is a non-negative whole number, stopped the wrong value before it was reported, making the failure visible though not solved.

The two cases differ less than they appear. Both are whole-number checks, true in the types the model learned them from; the first did harm because of where the model carried it. An earlier probe clean-up had removed parameter checks restating the runtime's contract and guards false for some valid input, but whole-number guards survived, being true where written: 455 book-derived training programs still carried one. After the rate-type failures, the final data version relaxed them to positivity checks in four books, leaving 220, and moved the rate type into training, so the effect on that type was never measured. An example assertion should therefore hold for every type the model may confuse with its own, the condition that Section 5.5 reaches for output wording.

### 5.5 Output conventions are learned across types

*The language, not each problem type's references, should define how an answer is printed.*

The books print their answers as prose, which the first data versions used as references. For the scheduling type the reference read: "The earliest safe completion time is 46 minutes, so the plan is not feasible. The critical insight is that B and C are parallel branches whose maximum duration controls the join." The compact-target model computed the right duration and verdict and printed "The earliest safe completion time is 46 minutes, so the plan does not meet the limit." Exact matching accepted none of its 100 scheduling outputs; a retrospective parser, written after seeing them, accepted 64%, a diagnostic rather than a score. Since the explanatory sentence cannot be derived from the problem, a later data version shortened this book's answers to value-bearing forms, such as "46 minutes: not feasible".

The change did not reach what the models printed. In the four runs after it, none of the 145 scheduling programs that ran printed the new form, although 100 training programs of another type in the same book printed exactly that form. Instead, 94% used the sentence frame of the procedural type that teaches the scheduling solution shape, "The earliest safe completion time is N minutes, so the plan ...", completed with the words of the statement's question, "meets the limit". That procedural type kept its prose sentence in every data version, because the rewrite covered the books, not the procedural types. The models took their output sentence from the type with the same solution shape.

The output convention must therefore be consistent across every type the model can mistake for the one being answered, and defined by the language rather than by each type's references, for example as a record of value, unit, and verdict that the runtime renders. Section 6 shows the same issue in the references themselves.

## 6. How far should the abstraction level rise? A prompt-only measurement

The five decisions all move work out of the generated program. At the limit the model only names operations from a catalogue and supplies the values, and the runtime produces the computation and the formatted answer. Table 2 gives the small models' results in the comparison of Section 4.2.

Table 2. Held-out compositions solved in the prompt-only comparison, in percent of 33 problems per cell, the same problems in both wordings: exact, or accepted by both judges; exact matches in parentheses. The fine-tuned model, which answered in its trained form, is shown for reference.

| Model | Form | Generator wording | Narrative wording |
| --- | --- | --- | --- |
| Qwen2.5-Coder 0.5B | Operator plan | 33% (33%) | 18% (18%) |
| Qwen2.5-Coder 0.5B | Plain JavaScript | 67% (9%) | 39% (6%) |
| Qwen2.5-Coder 0.5B | SOP Lang, jsEval | 15% (0%) | 30% (0%) |
| Qwen2.5-Coder 1.5B | Operator plan | 91% (91%) | 27% (27%) |
| Qwen2.5-Coder 1.5B | Plain JavaScript | 91% (30%) | 58% (21%) |
| Qwen2.5-Coder 1.5B | SOP Lang, jsEval | 39% (9%) | 3% (0%) |
| Qwen3 1.7B | Operator plan | 94% (85%) | 45% (45%) |
| Qwen3 1.7B | Plain JavaScript | 79% (18%) | 79% (6%) |
| Qwen3 1.7B | SOP Lang, jsEval | 70% (9%) | 18% (0%) |
| Qwen3 1.7B, fine-tuned (compact targets) | SOP Lang, trained | 100% (100%) | 73% (61%) |

One narrative problem shows what each form asks. It lists readings of 5, 38, 21, 29, 33, 18 and 23 litres, keeps those above 19, counts them, multiplies the count by 2, and asks for "the final figure, in litres"; the reference is "10 units." The untuned 1.7B model answered it in all three forms (observed; whitespace changed):

```json
{"values": [5, 38, 21, 29, 33, 18, 23],
 "unit": "litres",
 "steps": [
  {"op": "keepAbove", "threshold": 19},
  {"op": "count"},
  {"op": "multiply", "multiplier": 2}]}
```

```js
const entries = [5, 38, 21, 29, 33, 18, 23];
const kept = entries.filter(
  (value) => value > 19);
const count = kept.length;
const result = count * 2;
return result + " litres.";
```

```sop-fragment
@slots literal
{"entries": [5, 38, 21, 29, 33, 18, 23],
 "threshold": 19}

@kept jsEval
return $slots.entries.filter(
  (value) => value > $slots.threshold);

@count jsEval
return $kept.length;

@final jsEval
return $count * 2;
```

All three computed 10, and none matched exactly: the plan names `multiply`, which the catalogue calls `double`; the JavaScript prints the unit the statement asked for, not the reference's "units"; the SOP Lang program names its last wire `final`, not `answer`. Each failure is a convention of the target form, not a misreading of the problem.

**Code writing.** In the generator's wording, where each clause renders one catalogue operation and naming the operations is close to transcription, the 1.5B and 1.7B models solved as many problems with plans as with JavaScript (91% and 94%, against 91% and 79%, a gap too small to read). At 0.5B plans were less accurate than code (33% against 67%), and 45% of them named operations the catalogue lacks, such as `thirdLargest` or `convertRate`.

**Form as well as recognition.** In the narrative wording, plans fell to 27% and 45% at 1.5B and 1.7B, below JavaScript (58% and 79%); Table 3 shows how they failed. At 1.7B most of the drop was form: 24% of the plans lacked their final brace and 6% named `multiply`, while 65% of the 23 well-formed plans were correct, against 79% of the JavaScript programs, a difference too small to read. Appending the brace makes 4 of the 8 malformed plans exact, and renaming `multiply` 1 of the 2. At 1.5B well-formed plans were also wrong more often (32% of 28), so recognizing the operations in narrative prose was harder for that model; at 0.5B invented names dominated. Operation names are part of the design, since a `double` that takes a `multiplier` invited `multiply`, and plans can be generated under a grammar that admits only catalogue names [@geng2023], which we did not do. Our pre-registered reading held that if plans did not outperform code for the untuned small models, the case for raising the abstraction level weakens, the bottleneck being reading rather than writing code. Plans did not detectably outperform code in any small-model cell, although at 1.7B the plan's own form cost more than the reading did.

Table 3. How the untuned models' operator plans for the held-out compositions failed, in percent of 33 problems per cell.

| Model | Wording | Solved | Malformed JSON | Unknown operation | Well-formed, wrong or failed |
| --- | --- | --- | --- | --- | --- |
| Qwen2.5-Coder 0.5B | Generator | 33% | 3% | 45% | 18% |
| Qwen2.5-Coder 0.5B | Narrative | 18% | 3% | 42% | 36% |
| Qwen2.5-Coder 1.5B | Generator | 91% | 0% | 0% | 9% |
| Qwen2.5-Coder 1.5B | Narrative | 27% | 3% | 12% | 58% |
| Qwen3 1.7B | Generator | 94% | 3% | 0% | 3% |
| Qwen3 1.7B | Narrative | 45% | 24% | 6% | 24% |

**Output conventions.** A correct plan prints the reference string by construction (Section 4.2), which shows who owns the convention, not what the models can do. For 27 of the 33 problems the statement asks for a named unit ("Report the result in crates.") while the reference prints the generic word "units" ("14 units."), a generator convention that keeps an answer string from coinciding with a recorded value. Although the worked JavaScript example also printed "units", nearly all correct but inexact JavaScript answers printed the unit the statement asked for. The judges' rubric ignored unit words, so only exact matching is affected. The rule of Section 5.5 applies to references too: a convention the input does not determine will be missed.

**SOP Lang in the prompt.** Taught only in the prompt, SOP Lang was the weakest form at 1.5B and 1.7B in both wordings, although at 1.7B in the generator's wording its gap to JavaScript (70% against 79%) is too small to read; at 0.5B its rise from 15% to 30% between wordings shows the noise at this size. Its commonest failure was neither syntax nor code: in the narrative wording, 55% and 45% of the 1.5B and 1.7B programs computed a value but named no wire `answer` (30% and 9% in the generator's wording), a convention the other forms lack. Re-executed with their last wire as the output, 8 of the 15 such 1.7B narrative programs and 6 of the 10 such 1.5B generator-wording programs state the reference value, so the ranking would stand. A language can remove this convention by taking a program's single sink wire as its output.

### 6.1 Must a small model be trained on the language?

A second sample of 115 held-out problems (55 composition, 55 book-derived, and 5 withheld-type problems) puts SOP Lang in the prompt beside plain JavaScript and fine-tuning. On the compositions the untuned 0.5B, 1.5B and 1.7B models solved 7%, 35% and 62% with SOP Lang in the prompt and 60%, 89% and 82% with JavaScript; fine-tuned on SOP Lang (the final-data 0.5B run, the declarative-command 1.5B run, and the compact-target 1.7B run) they solved 82%, 100% and 100%, gains over JavaScript of which only the 22 points at 0.5B exceed what 55 problems resolve. On the book problems no condition exceeded 18% except the fine-tuned 1.7B model (58%). A small model does not write SOP Lang from a description; it must be trained on it.

### 6.2 Larger models

Claude Haiku 4.5 and Claude Sonnet 5 solved every held-out composition in every form and both wordings, except Haiku's SOP Lang in the generator's wording (94%): what a small model must be trained on, a larger model reads. Their plans were always exact, but their correct JavaScript matched the reference string in only 18% (Haiku) and 9% (Sonnet) of the problems: on all 27 problems whose reference ends in "units.", both printed the unit the statement asked for. A convention the language owns matters at every scale. The protocol caveats of Section 4.2 apply.

### 6.3 Design consequences

For language design the measurement supports a conditional position. Naming general operations removed code-writing and output-format errors and, in the generator's wording at 1.5B and 1.7B, matched code in accuracy; it beat code nowhere, which by our pre-registered reading weakens the case for a higher abstraction level, and it leaves recognition and form to the model. We therefore state as a hypothesis, not a result, that a small model's language should consist of a few general operations whose names say what they do, generated under a grammar that admits only those names, with training data presenting each operation in many wordings. We did not train a model on plans, and a companion paper found that fine-tuning in one wording did not carry over to another. A catalogue also narrows what can be said: on the 40 problems of the withheld procedural type, outside the catalogue, the untuned 1.7B model writing JavaScript solved 60% and the two fine-tuned 1.7B runs 5% and none, so generated `jsEval` bodies are an escape hatch only if code writing survives specialization. Handing problems outside the catalogue to a larger model, with invalid plans and failed invariants as signals and `modelCall` as the mechanism, is a design this suggests; we have not built or measured it.

## 7. Discussion

### 7.1 The language is the curriculum

The design decisions share one principle: a small model fine-tuned on programs learns their surface as readily as their substance, reproducing scaffolding, representations, assertions, and output wording where they do not apply. A construct that must be emitted correctly but carries no information about the problem carries only risk; one that carries information should take the smallest form that carries it. The prompt-only measurement extends this to the form of the output: an operation name, a closing brace, or an output wire's name must also be got right.

Herzig and colleagues found that a better-designed intermediate representation improved compositional generalization in pretrained models [@herzig]; consistently, our model trained on compact targets failed to execute less often. Gulwani and colleagues treat the program space as a central dimension of synthesis difficulty [@synthesis]; for a learned synthesizer, the designer shapes that space through what the language can express and what example programs habitually contain. CodeAct favoured code over JSON as an agent's action format [@codeact]; our small models ranked the two the same way under rewording, partly because of the plan format's own syntax and vocabulary, which constrained decoding addresses [@picard; @synchromesh].

### 7.2 A checklist for model-facing languages

We propose seven checks for a language whose main programmer is a small model.

**Check 1.** Does a construct appear identically in most programs? Move it into the executor; it was a site of failure, although fewer failures after its removal were not shown.

**Check 2.** Does the model repeatedly transcribe an algorithm? Give it a declarative command whose body names inputs, and measure accuracy where the inline version fails.

**Check 3.** Does a refactoring of the example programs remove something the model must write? If not, keep the old form; if you refactor, measure the programs the model writes for held-out types.

**Check 4.** Would each example assertion hold for the other types a model could mistake for this one? Weaken or delete the rest.

**Check 5.** Is the output convention defined once by the language and consistent with what the statements ask for? Rewritten references did not change what the model printed, and capable models printed the unit the statement named.

**Check 6.** Could the model name an operation instead of writing its code? This matched code only in the generator's wording and above 0.5B; generate plans under their grammar, and budget training data for recognition.

**Check 7.** Does the language ask the model to remember an arbitrary convention, such as the output wire's name, an operation name that does not say what it does, or a plan's closing brace? Let the runtime supply it, or constrain decoding to it.

### 7.3 Limitations

Each comparison between training conditions rests on one run per condition and one greedy decode, and retraining alone more than doubled the procedural execution failures on unchanged programs. Data versions sometimes changed several things, and the held-out set, inspected repeatedly, is a development benchmark whose scheduling references and statements were revised. We compared SOP Lang with plain JavaScript only without fine-tuning; no model was fine-tuned on JavaScript or on operator plans, so whether a fine-tuned small model writes SOP Lang more reliably than plain code, and whether training on many wordings makes plans robust, remain open. The prompt-only comparison gave the forms unequal worked examples, favouring the plans; its catalogue came from the operations that generated the problems; and its exactness was measured against references formatted by the plans' own code. Its semantic scores rest on two judges from the larger models' own model family, whose pass over the larger models had no calibration items, and the larger models answered in batched sessions that paired plans with JavaScript, without retained transcripts. The problems are small word problems, and whether fine-tuned larger models also copy guards and output conventions was not tested.

## 8. Conclusion

Designing a language for a small model means deciding what the model must get right. In the project studied here, the constructs that caused failures were rarely the computations the problems required: they were the scaffolding every program repeated, the representations and assertions that a refactoring of the training programs brought out in programs it had not touched, the guards borrowed from other types, and the output wording learned from the nearest related type. In each case we examined, moving something out of the generated program changed the kind of failure, and far less often the number of correct answers. Taken to its limit, where the model only names operations, the move removed code and output-format errors but not errors in the plan's own form, and left recognition and form as the main difficulties. A language designer should expect both effects, measure both, and keep the model's job to the part of the program that depends on the problem.

## Availability

The SOP Lang runtime and command documentation, the data generators, the per-item evaluation records with every generated program quoted here, the judges' verdicts, the orchestration records of the agent sessions, and the scripts that recompute the reported counts are supplementary material; a public archive with a persistent identifier will be deposited on acceptance. Coding agents helped implement the software and draft this manuscript; the authors checked every reported figure against the item records.

<!-- REFERENCES -->
