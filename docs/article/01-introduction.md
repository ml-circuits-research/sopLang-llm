# 1. Introduction

## The problem

A small language model is asked to solve a word problem. The natural way is to have it reason step by step and print an answer; the whole field of instruction fine-tuning and code generation is built on that reflex. This project takes the opposite stance: the model's job is not to *compute* the answer but to **compile the problem into a program**, and a separate, verified runtime executes that program. The model emits a circuit in **SOP Lang** — a minimal wire-based language whose unit of composition is a *wire* (a named value with declared dependencies), and whose extension interface is a small vocabulary of *wire commands* (`jsEval`, `literal`, `graphPath`, `aggregate`, `fraction`, and the container family). The runtime parses the circuit, analyzes its dependencies, topologically schedules it, and executes it in an isolated JavaScript realm. If the circuit does not parse, does not pass graph validation, or fails at run time, that is a *structured failure* — never a silently wrong number.

The research question is whether a small model can be taught, through fully synthetic training data, to produce such circuits reliably for statements it has never seen — and precisely where that generalization stops.

## Why this is interesting

Three ideas are bundled together, and each is independently falsifiable.

**Interpretable compiled plans.** The model's output is not a chain of thought but a dataflow graph: named wires, declared dependencies, and a typed answer. An inspection of a generated program shows *which* values were read, *which* operations were applied, and *what* the answer depends on. When a program fails, the failure carries a class and a named wire, not a vague prose sentence.

**The runtime owns correctness.** The model never has to be trusted to do arithmetic or to keep its own contracts. Correctness of scheduling, dependency soundness, acyclicity, and isolation lives in the runtime, not in the model. The model's remaining burden is the one thing that cannot be moved: choosing *which* plan to write for *this* statement. The measured consequence is that the model reaches ~99% syntactic and graph validity almost immediately after fine-tuning while semantic success lags far behind — the failure of interest is not "the model cannot write a program", it is "the model writes a legal program that answers the wrong question".

**The model learns to compose.** Because the language is compositional, generalization can be measured *structurally*. A plan is a fingerprint of its operators; holding out whole plans — rather than held-out wordings of known plans — tests whether the model recombines a trained operator vocabulary or merely replays memorized templates. The series shows the two are very different: composition generalizes inside a trained operator vocabulary and collapses at its boundary.

## The setting in one paragraph

The student is a code-capable base model in the sub-2-billion-parameter class (all sub-2B; the 1.7B is the scale reading). The teaching pipeline generates word problems and their reference SOP Lang solutions from a declared inventory of operators and families, verifies that every circuit executes and reproduces its printed answer, and splits the data structurally — whole compositions held out before any instance is rendered. Each training arm changes exactly one variable: a data tranche, a target structure, a base model, or a recipe parameter. Evaluation is a fixed chain: selection on a validation slice, a sealed holdout, and capability probes. The untrained bases answer the same statements in prose as a fair baseline. The headline ladder of the first series is the whole story in miniature: the untrained base cannot emit a parseable program at all; a fine-tuned student parses every statement and answers correctly ~98–99% of the rows whose plan it was shown, 12–25% of the rows whose plan it was not, and — in the earliest suites — 0 of 225 rows whose *families* it had never seen.
