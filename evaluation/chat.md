# Local chat with the trained student

`evaluation/chat.mjs` is a small CLI for talking to a fine-tuned student on this
machine. It is deliberately not a general chatbot: the student was trained to
compile a problem statement into a SOP Lang circuit, so the CLI sends your
question with the recorded `compiled-plan-chat-2` profile, **executes the circuit
the model emits with the runtime, and prints the answer the circuit produced**.
Prose instead of a plan, or a plan that fails its own guards, is reported as a
failure — that is the honest signal, not a chat answer.

## Quick start

```bash
# interactive, using the artifact of the default experiment; the CLI starts and stops the model
node evaluation/chat.mjs

# one question, then exit (good for scripts and for a quick check)
node evaluation/chat.mjs --once "A printing workshop may spend at most 385 units. Each crate costs 34 units, and the delivery fee is 38 units, charged once. How many whole crates can the workshop order, and how much money is left?"

# show the circuit the model compiled, next to the executed answer
node evaluation/chat.mjs --show-plan

# a named checkpoint instead of the default
node evaluation/chat.mjs --experiment exp-009-mix10
node evaluation/chat.mjs --gguf evaluation/registry/exp-009-mix10/gguf/checkpoint-728.gguf

# attach to a server you already started (the CLI will not manage one)
node evaluation/chat.mjs --base http://127.0.0.1:8087
```

Type `exit`, `/exit`, or press Ctrl-C to leave; a server the CLI started is
stopped on the way out.

## Interactive commands

A line entered at the `? ` prompt that starts with `/` is a command of this CLI,
not a question: it is answered from the session record, so it costs no tokens and
is not counted as an evaluation turn. `/help` prints the same list.

| command | what it does |
| --- | --- |
| `/help` | list the interactive commands |
| `/show-plan` | print the plan of the previous turn, its wire names, whether it executed, and its divergence |
| `/stats` | print the number of turns and the token totals the server reported |
| `/model` | print the served artifact, its alias, and the base URL |
| `/export <path>` | write the session transcript to a JSONL file (overwrites it) |
| `/exit` | leave the session (bare `exit`, `quit`, and Ctrl-D do the same) |

`/show-plan` is the command form of `--show-plan`, with the answer to the
question every failed turn raises. It prints the program the model emitted, the
wires the parser found in it, whether the runtime executed it, and — when it did
not — the divergence name in the vocabulary of `evaluation/run-diagnostic.mjs`:
`no_completion`, `wrapper_rejected`, `invalid_syntax`, or `runtime_failure`. The
CLI holds no dataset oracle, so a turn whose circuit executed is reported as
`none` instead of being scored.

```
? Emma bought 3 boxes of cookies. Each box has 12 cookies inside. If she shares 8 cookies with her brother, how many cookies does she have left?
✔ answer (executed circuit): -93.

? /show-plan
? Emma bought 3 boxes of cookies. Each box has 12 cookies inside. If she shares 8 cookies with her brother, how many cookies does she have left?
--- generated plan ---
@slots literal
{
  "bought": 3,
  "perBox": 12,
  "toShare": 8
}

@answer jsEval
const probe = (condition, message) => { if (!condition) { throw new Error("probe failed: " + message); } };
…
--- end of plan ---

wires: @slots literal, @answer jsEval
executed: yes
divergence: none (the circuit executed; this CLI holds no reference answer to compare its answer against)
```

## What a good run looks like

```
starting llama-server with evaluation/registry/exp-009-mix10/gguf/checkpoint-728.gguf on port 8087 …
model: exp-009-mix10 (checkpoint-728)
questions are answered by executing the circuit the model compiles; --show-plan prints the circuit.
type /help for the interactive commands (/show-plan, /stats, /model, /export, /exit).

? A printing workshop may spend at most 385 units. Each crate costs 34 units, and the delivery fee is 38 units, charged once. How many whole crates can the workshop order, and how much money is left?
✔ answer (executed circuit): The workshop can order 10 whole crates and has 7 units left.
```

Four outcomes are possible, and each one means something different:

| what you see | what it means |
| --- | --- |
| `✔ answer (executed circuit): …` | the model compiled a plan, the runtime executed it, and the answer above is the value the circuit returned. The circuit cannot know whether that value answers the statement; only the evaluation loop compares it with an oracle |
| `✗ the model did not emit a plan (…)` | the completion was prose or several programs; the question is outside what the checkpoint learned, or the checkpoint is not the fine-tuned one |
| `✗ the plan did not parse: …` | the completion was accepted as a program but is not valid SOP Lang; use `/show-plan` or `--show-plan` to read the text the model emitted |
| `✗ the plan did not execute: failed:validation_error` | the plan parsed and failed its JavaScript body or its own probe harness: the extracted values or the computation were wrong for the statement. Use `/show-plan` or `--show-plan` and read the circuit |

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
| `--once "<question>"` | ask one question, print the answer, and exit |
| `--show-plan` | print the generated SOP Lang circuit as well as the executed answer |
| `--gguf <path>` | serve that artifact (absolute path or repository-relative) |
| `--experiment <id>` | serve the winner recorded in `evaluation/registry/<id>/selection.json` (default `exp-008-sft-shapes`) |
| `--base <url>` | attach to a running server instead of starting one |
| `--port N` | port for the managed server (default 8087) |
| `--max-tokens N` | generation budget (default 1024) |
| `--threads N` | CPU threads for the managed server |
| `--help` | print the usage, including the interactive commands |

Without `--gguf` or `--experiment`, the CLI serves the selected checkpoint of
`exp-008-sft-shapes`; `artifactFor` in `evaluation/artifacts.mjs` is what resolves
a bare invocation to the best measured winner, and
`training/checkpoints/base-f16.gguf`, the untuned model, which emits prose on
purpose, is the fallback it uses when no `selection.json` exists.

## Notes for a longer session

- One exchange is one model call with greedy decoding, the same settings the
  evaluation loop uses, so what you see matches the reported metrics.
- The managed server holds the whole model on the GPU (~1 GiB for the 0.5B at
  F16) plus its context; stop it (Ctrl-C) before starting a training run.
- Every request goes through `evaluation/client.mjs`, the same client the
  evaluation harness uses, so a transport problem looks the same here as in a
  report.
