# AGENTS.md

## Scope

This repository is the sopLang-llm project. It fine-tunes a small code-capable language model to compile problems into SOP Lang circuits, ships the runtime that executes those circuits, and builds the verified teaching pipeline that produces its training data. The vision handbook `vision/Small_Models_Compiled_Context_SOP_Lang_EN.docx` holds the research hypothesis and the engineering specification for the whole system. The design specifications under `docs/specs/` are the source of truth for documented behavior and structure.

## Mandatory Reading Order

1. Read `README.md` for the project purpose, overview, and onboarding paths.
2. Read `docs/index.html` for the system architecture and the documentation map.
3. Read `docs/specs/DS001-coding-style.md` for coding style, module structure, and test organization.
4. Read `docs/specs/DS002-sop-lang-core.md` for the language and runtime contract.
5. Read `docs/wiki.html` for the canonical terminology of the project.
6. Read the affected design specification under `docs/specs/` before changing code that touches it.

## Current Skill Catalog

The repository does not distribute skills as product artifacts. The agent skills available under `.agents/skills/` are imported tooling used while working in this repository; they are not part of the project's documented surface, and their guidance and dependency records stay inside their own folders. The product surfaces of this repository are the language runtime, the wire registry, the context adapter, the teaching pipeline, and the training data suite described by the design specifications.

## Long-running work

Every long-running job (training, evaluation chains, sweep runs) is started **detached** from the terminal and from the agent session, so the owner can close the desktop and leave the machine working: use `bash training/environment/start-detached.sh train <experiment> [flags]` (or `cmd <name> "<command>"`), which runs the work with `setsid nohup` in its own session and logs it where `bash training/environment/work-status.sh` reports it. A job started only under the session (or only `persist`) dies with the session and wastes the compute.

## Writing to the owner

Report concretely. Name the thing, the run, and the number in the same sentence; never use a shorthand the owner has not seen defined.

- Bad: "the demonstrations did not move the result on the unseen family".
- Good: "with 3 compiled examples in the prompt, the model answered 0 of 12 holdout problems correctly (evaluation/registry/adapt-smoke-3), the same as with no examples".
- Say which problems: instead of "the unseen family", write "the holdout problems, for example the counter-opening-hours and units-and-rates problems, which no training row uses".
- Say what changed between two numbers: which file, which parameter, which data.
- Percentages always carry their counts: "0.4% (1 of 265)", never "near zero".
- When comparing, name both sides: "the untuned student parsed 39 of 1000 rows, the fine-tuned student parsed 1000 of 1000".

## Repository Rules

- Everything written to disk is in English: documentation, specifications, code comments, identifiers, commit messages, test prose, and every generated artifact under `training-data/`, `teacher/`, `context/`, `runtime/`, and `docs/` — problem statements, solution circuits, explanations, prompts, manifests, reports, traces, and rejection records. Romanian is reserved for spoken communication with the repository owner only. The only permitted non-English text on disk is verbatim source material quoted for provenance (for example, a seed-book passage reproduced inside a rejection record) and deliberately non-linguistic payload in tests that exercise Unicode handling; any non-English content in a source that would flow into generated data must be quarantined from the accepted dataset.
- Treat the design specifications under `docs/specs/` as the source of truth. When wording diverges, the specifications win.
- Update the HTML documentation and the affected specifications whenever source behavior, interfaces, structure, dependencies, or constraints change.
- Keep DS numbering contiguous and gap-free. `DS000-vision.md`, `DS001-coding-style.md`, and exactly one `DS003-main-behavior.md` are mandatory.
- Give every `DSxxx-*.md` file exactly two frontmatter fields, `title` and `summary`, with `title` equal to the filename stem. Never add `id`, `status`, `owner`, or other metadata.
- Write rationale, limitations, assumptions, and contract boundaries as declarative statements inside `Core Content`. Do not create a separate decision log.
- Run the Main Behavior analysis again when source or product changes may alter the project's purpose, user outcomes, essential paths, interfaces, subsystems, hidden functional consequences, or architecture.
- Keep documentation prose unwrapped in source and let the specs viewer wrap text naturally.
- Regenerate `docs/specs/matrix.md` from the specification files instead of editing it by hand.
- Keep the seed books in `vision/` unchanged and treat them as read-only research material.
- The library and its tests use Node.js built-ins only. Do not add an external dependency without explicit approval and a matching entry in `dependencies.md`.

## Launch discipline

Every training launch passes `training/environment/preflight.sh` first, and a failed precondition is a refused launch, never a warning: no second trainer (one trainer at a time), no double supervision of the same experiment, at least 30 GiB free disk, and no resume from an incomplete checkpoint. The completion signal for a chain is `evaluation/registry/<exp>/metrics.json` — never the `series done` log line, which a failed chain also writes.

## Disk discipline

The night of 2026-09-23 was lost to a full disk: base-model downloads plus checkpoint saves filled the drive mid-save, corrupting a checkpoint and killing the arm at step 160 of 630. Disk space is part of the experiment design, not an afterthought:

- After an experiment's chain closes AND its winner is recorded (selection.json plus report.md), prune that experiment completely: delete every `training/checkpoints/<exp>/checkpoint-*` HF directory AND every non-winner GGUF under `evaluation/registry/<exp>/gguf/`. The kept artifacts are the winner's GGUF, every log, manifest, report, and item record — nothing else. Closed arms are never resumed; their HF checkpoints are dead weight (exp-013 alone held 116 GiB).
- Before starting a new download or a new arm, check the free space and prune closed arms first; never queue work that needs more space than is free.
- The disk guard (`training/environment/disk-guard.sh`) is the last line of defense: it warns below 40 GiB free and stops trainers AND downloads below 16 GiB free, well above the point where a mid-save interruption corrupts a checkpoint.

## Runtime Defaults

- Default executable language: Node.js using `.mjs` ECMAScript modules with explicit exports, relative imports that include file extensions, `node:` imports for built-ins, and async/await for asynchronous work.
- Default test organization: `node --test` with `node:assert/strict`, with unit, property, and end-to-end coverage for every semantic rule in the specifications.
- Default dependency policy: eliminate or avoid dependencies. Record accepted exceptions in `dependencies.md` with justification, alternatives, authorization, license, source and update URLs, startup checks, and removal opportunities.
- Runtime code keeps the language kernel, the wire registry, the context adapter, and the data pipeline in separate modules, and it must not silently change SOP Lang semantics to accommodate a model output. Parser or runtime changes require a version increment and migration of training data.
- Model behavior stays measurable: every neural call is explicit in the circuit, recorded in the trace, and counted against a request budget.

## Key Paths

- Design specifications: `docs/specs/`
- Specification entry point: `docs/specsLoader.html?spec=matrix.md`
- Canonical terminology: `docs/wiki.html`
- HTML documentation: `docs/`
- Research handbook and seed books: `vision/`
- Training data suite: `training-data/`
- Phase plan: `todo.md`
