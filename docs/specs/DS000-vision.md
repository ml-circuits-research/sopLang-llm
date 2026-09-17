---
title: DS000-vision
summary: Defines the research hypothesis of sopLang-llm, the three proposals that realize it, the intended audiences, the measured success criteria, and the falsification criteria that constrain reported claims.
---

## Introduction

sopLang-llm fine-tunes a small code-capable language model to compile a problem into an [executable SOP Lang circuit](wiki.html#definition-sop-lang) instead of generating the final answer directly. A runtime resolves the circuit's dependencies, executes deterministic computation, invokes explicitly declared tools or neural judgments where semantics remain necessary, and returns the requested result. The model is trained primarily to interpret a task, decompose it, select available capabilities, and compile the solution into a program. It is relieved of as much arithmetic, bookkeeping, formatting, filtering, aggregation, and classical algorithmic work as possible.

The vision handbook `vision/Small_Models_Compiled_Context_SOP_Lang_EN.docx` is the authoritative source for this specification. This document records the project's purpose, the proposals that define its scope, the results that count as success, and the results that falsify the stated claims.

## Core Content

### Purpose and optimization target

The conventional system computes `answer = M(P)`, where a model `M` produces an answer for a problem `P` inside one autoregressive response. This project computes `C = M(P, capabilities)` and then `answer = R(C)`, where `C` is a SOP Lang circuit produced by the model and `R` is the runtime that executes it.

During execution, `R` may call `M` again through explicit neural wires, but every such call is visible in the circuit and in the trace. The model can still make semantic judgments, and those judgments become components of an explicit computation rather than invisible continuations inside a single monolithic response.

Many operations that occupy language-model capacity are not intrinsically linguistic. Arithmetic, sorting, deterministic string transformation, joins, grouping, graph traversal, counting, regular expressions, numerical optimization, schema validation, and serialization are better handled by conventional algorithms when their inputs are known. A model can be excellent at deciding that a problem requires a weighted average and still be a poor calculator. The model's most valuable learned behavior is therefore not unlimited internal reasoning. It is good stopping behavior: the ability to recognize when semantic interpretation remains necessary and when the current subproblem has become mechanical enough to delegate.

### The three proposals

Fine-tuned compilation. The student model is trained to emit SOP Lang rather than final prose. Whenever a subproblem has reached a form that ordinary code or another deterministic mechanism can solve, further neural reasoning stops. The model emits a small `jsEval` program, a container operation, a call to an available external wire type, or another explicit circuit fragment. The final result is the consequence of executing that circuit.

[Compiled context.](wiki.html#definition-compiled-context) A model with a modest context window processes a book, a legal corpus, or a long research record by first planning persistent typed containers, then reading the source in chunks and compiling each chunk into inert SOP Lang contributions to those containers. The accumulated circuit is executed after ingestion, creating a persistent semantic state that is queryable by ordinary code and by later neural calls. The model repeatedly sees a local fragment, the relevant schema, and selected state, and produces a patch to a larger external representation. Compiled context replaces one very large transient prompt with a versioned, inspectable semantic state whose size is limited primarily by external storage rather than by the model's attention window. It is not infinite context and it does not guarantee perfect memory.

Verified teaching. [A coding agent acts as the teacher](wiki.html#definition-teacher-agent) and builds problem factories: parameterized generators, mutation operators, oracles, validators, and difficulty schedules. The teacher uses the books in `vision/` as seed environments from which to derive authentic semantic situations, produces candidate SOP Lang solutions, executes them, rejects failures, creates counterexamples, and preserves the full provenance of every accepted example. The teacher is an agentic data-production system rather than a single prompt to a larger model.

### What success means

The strongest claim the project can support is that on problem classes where a substantial fraction of computation can be externalized into explicit tools and deterministic transformations, a smaller model trained to decompose and compile achieves task-level performance comparable to a larger direct-answer model while using less neural computation and producing a more auditable execution path. This claim can be false, and the experiments are designed to detect that outcome.

Task success is measured on final executable results, not by comparing generated SOP Lang text to a reference program, because different programs can be semantically equivalent. Circuit validity is measured separately from final correctness. The number and cost of neural calls are counted. The fraction of operations delegated to deterministic mechanisms is measured because it tests whether externalization can substitute for some neural computation. Long-horizon experiments measure whether performance degrades as decomposition depth increases. Long-document experiments move relevant evidence across source positions and determine whether compiled context reduces the position sensitivity associated with long prompts.

The project distinguishes compilation cost from reuse cost. Compiling a large book into typed containers can be expensive; if the representation is reused for many questions, the amortized cost can still be attractive. Every efficiency claim states whether it concerns initial compilation, incremental update, or subsequent query execution.

### What success does not mean

A successful system does not prove that neural networks have become interpretable in the mechanistic sense. The weights of the student model remain a black box. What becomes more interpretable is the computation that produces the task result. If the final answer depends on a filtered set of claims, a numerical score, a contradiction judgment, and a serialization step, the trace identifies those inputs and operations exactly, and an operator can intervene on a wire, rerun downstream computations, or compare two circuit revisions. This is execution transparency, not a complete explanation of why the model chose the circuit.

### Falsification criteria

The small-model efficiency hypothesis is not supported if the student requires greater total neural compute than the larger baseline for equal accuracy. The compiled-context hypothesis is not supported if ingestion losses make final accuracy worse than a simpler retrieval baseline at similar cost. The unseen-tool hypothesis is not supported if the student fails when command names are randomized despite clear manifests. The anti-smoothing hypothesis is not supported if rare-critical preservation does not improve after controlling for output length and model-call budget.

A negative result remains publishable when it identifies a sharp limitation. An experiment can show that sub-billion models learn SOP Lang syntax and deterministic delegation but cannot reliably perform task-conditioned decomposition over ambiguous long documents. That result establishes where model capacity remains necessary.

### Evidence standards

Every important architectural choice in the project is accompanied by the rationale, the failure it is intended to prevent, and the experiment needed to determine whether the choice was useful. The project distinguishes what is defined by design, what is a plausible engineering hypothesis, and what remains an empirical question until measured. Quantitative claims reference experiment identifiers and trace to raw per-item records. The manuscript reports negative results and limitations, and an experiment that has not been run may be described only as planned work.

### Audiences

The project serves engineers who have not previously fine-tuned language models, coding agents that build the system and run the experiments, and reviewers who evaluate whether the combination of an intermediate representation, a training method, and empirical evidence changes the capability-efficiency frontier. The documentation set states the system contract in operational terms for each audience and keeps the research hypothesis separate from the implementation requirements that realize it.
