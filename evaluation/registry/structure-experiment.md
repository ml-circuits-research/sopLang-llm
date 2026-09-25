# Structure experiment: does modularizing the training targets help the student?

Recorded 2026-09-25, before the refactor. The question for the article: keeping the model, the data
content, the statements, the oracles, and the printed answers identical - only the STRUCTURE of the
training targets differs (monolithic hand-written jsEval bodies against modular multi-wire plans) -
does the student's measured quality change?

## Why the bloated bodies were never split

The series prioritized, in order: coverage (the operator vocabulary), the declarative wires
(graphPath/aggregate/fraction), and the container shapes. The book families' 40-67-line compute
bodies are case-based with book-fixed printed answers, and restructuring them safely required the
container gates and the declarative commands that did not exist until dv7. The assertion audits
cleaned the probes without touching structure; the structure was deliberately deferred, not missed.

## The indicator

The static checker reports the bloat indicator on the shipped suite: total wires, average wires per
plan, average jsEval lines per plan, jsEval lines per wire, and the count of plans with at most
three wires but more than 25 jsEval lines. On dv7: 2.19 wires per plan against 15.4 jsEval lines
(7.0 lines per wire), with 1,468 plans (13.8%) in the bloat class. The experiment moves that
indicator and measures whether the holdout follows.

## Design

- Baseline: exp-021-1.7b-qwen3-dv7 (Qwen3-1.7B, dv7, the current data) - the monolithic-structure
  arm whose holdout is measured.
- Arm: dv8 - the same dataset content, but the book families' flagged compute bodies are refactored
  into modular multi-wire plans (jsEval stages plus the declarative commands and containers where
  they genuinely fit). Statements, oracles, printed answers, and the dataset row counts stay
  identical; only the emitted circuit structure changes. The verify gate proves the invariant:
  every refactored circuit must reproduce its printed answer and react to its inputs.
- exp-022-1.7b-qwen3-dv8: the same base (Qwen3-1.7B) and the same recipe (2 epochs, lr 1e-4,
  batch 4 / grad-accum 8, gradient checkpointing, preservation-10, save-steps 150, patience 5).
  The only variable against exp-021 is the target structure.
- Decision: the holdout oracle match and the procedural execution errors of exp-022 against
  exp-021, plus the bloat indicator before and after. A measured delta is the article's indicator
  that modular training targets help; no delta is a measured null, also publishable.

## Status

- dv7 baseline: exp-021 training (measured at its holdout).
- dv8 refactor: queued after exp-021's chain closes.
- exp-022: queued after the dv8 rebuild and verification.
