# Agent-session records of the evaluation-only comparisons

These files record the agent sessions that answered as the larger models (Claude Haiku 4.5 and Claude Sonnet 5) and the sessions that judged answers. They were extracted on 2026-09-29 from the orchestration records of the session that ran them, with local paths replaced by `<repo>` and `<home>`.

| File | What it records |
| --- | --- |
| `larger-models-first-batches-superseded.json` | The first design (batches b1 to b5, both models). Superseded: its batches mixed conditions or wordings of the same problem. |
| `larger-models-c-batches.json` | The accepted batches c1 to c6 (E8 in each wording, E9, E3 in each wording), both models. |
| `larger-models-d-batches.json` | The accepted batches d1 (direct answers) and d2 (plain JavaScript) of the main comparison, both models. |
| `judging-passes-1-2.json` | Judge sessions A and B for chunks 0 to 3. |
| `judging-pass-3.json` | Judge sessions A and B for chunks 5 and 6 (the larger models' answers). |
| `sonnet-session-af579dfb553058142.jsonl` | The only full transcript retained: the compliant re-run of Sonnet batch b4, which wrote its replies item by item. The batch was later superseded with the rest of the first design. |

Each orchestration record gives, per session: the label, the exact model identifier (`claude-haiku-4-5-20251001`, `claude-sonnet-5`, or `claude-opus-5-5` for every judge), the number of tool calls, the last tool used, the token count, the duration, and the orchestration script with the instructions every session received. Judge sessions for chunk 4 were run outside these orchestrations; `../judge-sessions.json` lists all fourteen judge sessions and their model.

What these records do not contain: the full transcripts of the accepted batches. The audit of each session's tool use (no scripts or code execution to produce replies) can therefore be re-checked only through the tool-call counts and the instructions, not call by call.
