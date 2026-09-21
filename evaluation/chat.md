# Local chat with the trained student

`evaluation/chat.mjs` is a small CLI for talking to a fine-tuned student on this
machine. It is deliberately not a general chatbot: the student was trained to
compile a problem statement into a SOP Lang circuit, so the CLI sends your
question with the recorded `compiled-plan-chat-1` profile, **executes the circuit
the model emits with the runtime, and prints the answer the circuit produced**.
Prose instead of a plan, or a plan that fails its own guards, is reported as a
failure — that is the honest signal, not a chat answer.

## Quick start

```bash
# interactive, using the best measured checkpoint; the CLI starts and stops the model
node evaluation/chat.mjs

# one question, then exit (good for scripts and for a quick check)
node evaluation/chat.mjs --once "A printing workshop may spend at most 385 units. Each crate costs 34 units, and the delivery fee is 38 units, charged once. How many whole crates can the workshop order, and how much money is left?"

# show the circuit the model compiled, next to the executed answer
node evaluation/chat.mjs --show-plan

# a named checkpoint instead of the newest winner
node evaluation/chat.mjs --experiment exp-003-sft-lr1e-4
node evaluation/chat.mjs --gguf evaluation/registry/exp-003-sft-lr1e-4/gguf/checkpoint-540.gguf

# attach to a server you already started (the CLI will not manage one)
bash evaluation/run-holdout.sh --help   # any server on --base works
node evaluation/chat.mjs --base http://127.0.0.1:8080 --no-server
```

Type `exit` or press Ctrl-C to leave; a server the CLI started is stopped on the
way out.

## What a good run looks like

```
starting llama-server with evaluation/registry/exp-003-sft-lr1e-4/gguf/checkpoint-540.gguf on port 8080 …
model: exp-003-sft-lr1e-4 (checkpoint-540)
questions are answered by executing the circuit the model compiles; --show-plan prints the circuit.

? A printing workshop may spend at most 385 units. Each crate costs 34 units, and the delivery fee is 38 units, charged once. How many whole crates can the workshop order, and how much money is left?
✔ answer (executed circuit): The workshop can order 10 whole crates and has 7 units left.
```

Three outcomes are possible, and each one means something different:

| what you see | what it means |
| --- | --- |
| `✔ answer (executed circuit): …` | the model compiled a plan, the runtime executed it, and the answer above is the value the circuit returned |
| `✗ the model did not emit a plan (…)` | the completion was prose or several programs; the question is outside what the checkpoint learned, or the checkpoint is not the fine-tuned one |
| `✗ the plan did not execute: failed:validation_error` | the plan compiled but failed its own probe harness: the extracted values or the computation were wrong for the statement. Re-run with `--show-plan` and read the circuit |

## What the CLI cannot tell you

The runtime executes what the model compiled; it does not know the dataset oracle.
An answer that executes but is wrong (a plausible formula for the wrong quantity)
therefore looks like a normal answer. Two things make that visible:

- dataset circuits carry the family probe harness, so a compiled plan that keeps
  those probes fails loudly on a wrong value, while a plan that drops them cannot
  fail — compare the plan you see with `--show-plan`;
- the scored instrument is the evaluation loop (`evaluation/run-eval.mjs`), which
  compares the executed answer with the oracle of the manifest row and classifies
  the item as `answer_match` or `answer_mismatch`. The CLI is for reading the
  model, not for measuring it.

## Which questions to ask

The seven verified books and the synthetic suite are what the student knows.
Questions shaped like those statements — self-contained, with the numbers in the
text, asking for one value — are answered by an executed circuit. Open-ended
questions, multi-turn conversation, or general knowledge are not what the
profile teaches, and the CLI will say so instead of inventing an answer.

Good sources for a test question:

```bash
# a statement from the training data (book or synthetic), ready to paste
node -e 'const r=require("node:fs").readFileSync("training/data/all-books.jsonl","utf8").split("\n")[0]; console.log(JSON.parse(r).messages[1].content)'

# a synthetic instance the student never trained on (the withheld family)
head -3 training-data/procedural-arithmetic/eval/no-knowledge/cheaper-rate-per-unit/cheaper-rate-per-unit-instance-001/problem.md
```

## Options

| flag | meaning |
| --- | --- |
| `--once "<question>"` | answer one question and exit; also accepts the question as a positional argument |
| `--show-plan` | print the generated SOP Lang circuit as well as the executed answer |
| `--gguf <path>` | serve that artifact (absolute path or repository-relative) |
| `--experiment <id>` | serve the winner recorded in `evaluation/registry/<id>/selection.json` |
| `--base <url>` | attach to a running server instead of starting one |
| `--port N` | port for the managed server (default 8080) |
| `--max-tokens N` | generation budget (default 1024) |
| `--threads N` | CPU threads for the managed server |

Without `--gguf` or `--experiment`, the CLI picks the checkpoint with the highest
oracle match among the selection runs under `evaluation/registry/` (ties broken by
parse validity, then recency); if none exists it falls back to
`training/checkpoints/base-f16.gguf`, the untuned model, which emits prose on
purpose and is useful for comparison.

## Notes for a longer session

- One exchange is one model call with greedy decoding, the same settings the
  evaluation loop uses, so what you see matches the reported metrics.
- The managed server holds the whole model on the GPU (~1 GiB for the 0.5B at
  F16) plus its context; stop it (Ctrl-C) before starting a training run.
- Every request goes through `evaluation/client.mjs`, the same client the
  evaluation harness uses, so a transport problem looks the same here as in a
  report.
