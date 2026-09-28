---
name: scientific-article
description: Write, adapt, and audit scientific manuscripts from research artifacts, with verified bibliography, journal-specific positioning, evidence-derived figures and tables, and editable Markdown and DOCX deliverables. Use for substantive scientific article preparation, not routine documentation or a literature summary alone.
---

# Scientific article

Produce a coherent argument that a reviewer can trace to evidence. Treat an existing draft as a set of candidate claims, not as a trusted record. Keep the workflow and its resources within this folder. Project-specific evidence, manuscripts, and journal policies belong in the article workspace supplied by the user.

## Establish the evidence before the story

Read project guidance, the research question, methods, source records, and existing variants. Make a source inventory with paths, hashes, record counts, model identities, data versions, timestamps, and missing artifacts. Read nested training manifests before interpreting experiment names. Distinguish a model's marketed size from an independently verified parameter count.

Recompute every headline result from item records. Check denominators, duplicate identifiers, outcome partitions, dataset composition, train/test boundaries, checkpoint selection, changed prompts or oracles, and whether comparisons use the same items. Inspect informative successes and failures. A deterministic runtime guarantees only its implemented execution contract; neither execution nor tests prove that the emitted program represents the question correctly.

Label evidence as reproduced, corroborated, historical-only, proposed, or unresolved. A missing judge decision, log, baseline, seed, funding fact, or public archive must remain missing. Never replace it with a plausible reconstruction. New retrospective checks must preserve their code and item decisions, state their restricted scope, and stay distinct from the original evaluation.

## Position the contribution

Write one sentence containing the problem, supported finding, and boundary. Build an argument outline in which each section resolves the question raised by the previous section. Establish what prior work already does before identifying the contribution. Name real researchers where their results matter; names must explain intellectual relationships, not decorate the introduction.

Write for a reader outside the repository. Introduce every project-specific language or system before using it in the argument. When syntax matters, provide a complete short example and explain declaration boundaries, names versus commands, body formats, references, execution order, and output conventions. A glossary alone is insufficient. Name the few comparisons needed by the paper, for example Experiment A with general-code and specialized-command conditions. Keep directory identifiers, data-version codes, and checkpoint names in a supplementary crosswalk rather than the main narrative. State what changed before giving the result. Lead with percentages when requested, identify denominators in captions or population definitions, and retain counts in the evidence package.

Separate observation, proposed explanation, and practical consequence in the discussion. State the interpretation directly, then identify the control needed to distinguish it from alternatives. Check whether valid base-model comparisons exist; align populations and scoring rules, and separate missing responses from observed task failures. For multiple papers, vary the substantive evidence selected for each research question rather than reproducing the same comparison table in every version.

For multiple journals, define a different central question, audience, article type, evidential emphasis, and discussion for each manuscript. Each paper must explain why its question matters and how its results answer it. Select results for that question; variants need not share the same tables or narrative. Keep unsupported historical claims out of scientific-result sections. A corrected error may appear as a documented case example in a paper whose subject is research practice, without implying that human-only work would avoid it. Shared data do not become independent studies by changing the title. Prepare overlapping manuscripts as alternative submission routes unless substantive independence is established and overlap is disclosed. Do not submit, contact editors, or make declarations for authors without authorization.

## Verify journal and bibliography facts

Consult current official publisher pages for scope, accepted article types, word/page limits, review anonymity, file format, figures, reference style, declarations, charges, and eligibility. Record URLs and access dates. Distinguish a free subscription route, diamond open access, optional paid services, and conditional funded publication. A geographic location or project name does not establish funding eligibility. Use a provided official template when required; otherwise format an editable review manuscript, not invented publisher proofs.

For each reference, verify title, authors, year, venue, identifier, and the exact proposition used. Read the relevant primary-source passage, not just a search snippet. Keep a bibliography ledger with a locator, a short support paraphrase, what the source does not establish, and metadata/claim-verification status. DOI resolution alone is not claim verification. Prefer the published version over a preprint and do not invent DOIs. Keep every citation local to the supported proposition and ensure bibliography and in-text citations agree in both directions.

## Draft and illustrate

Write the methods and results before finalizing the abstract and introduction. Define terms before using them. Give enough detail to reconstruct sampling, exclusions, execution, comparisons, and analysis. Report counts beside percentages and preserve unsuccessful variants. Account for repeated families, repeated benchmark use, single seeds, confounding, and missing baselines. Use uncertainty estimates only when their sampling assumptions fit the data; a finite descriptive census need not carry a misleading inferential interval.

Each table must answer an explicit question and each diagram must explain a mechanism, comparison, or boundary. Generate numerical graphics from audited data. Use vector originals, readable grayscale distinctions, descriptive alternative text, numbered captions, and nearby prose explaining the implication. Illustrative examples must be labeled and executed where feasible. Never render generated scientific figures with an image model when exact code or vector construction can represent the content.

Prefer annotated programs, actual dependency graphs, explicit counterexamples, and directly labeled quantitative comparisons over generic sequences of boxes. Show the mechanism or relationship the reader needs to understand, with readable type at the final column width. Distinguish constructed examples from observed outputs and prospective experiment designs from completed experiments.

Write connected paragraphs with concrete subjects and qualified conclusions. Remove unsupported causal verbs, claims of primacy, benchmark superlatives, speculative savings, repeated conclusions, and rhetorical contrasts. Keep implementation paths in an artifact appendix rather than interrupting the argument.

## Audit, revise, and deliver

Follow [references/audit-protocol.md](references/audit-protocol.md). Perform separate evidence, adversarial argument, bibliography, journal-fit, and layout passes. A script can detect missing citations or broken images; it cannot certify scientific validity. Record what was inspected and changed, and do not describe self-review as independent peer review.

Use [scripts/build-docx.mjs](scripts/build-docx.mjs) to render supported Markdown into editable OOXML, with native tables and embedded figures. The script takes a JSON job path; see [references/artifact-format.md](references/artifact-format.md). Its ZIP and Markdown helpers are bundled. Optional local rendering tools and their limits are recorded in [dependencies.md](dependencies.md). The builder does not fetch references, submit manuscripts, or establish journal compliance by itself.

Render the DOCX to PDF when a local office suite is available, inspect every page for clipping, missing glyphs, figure legibility, broken tables, and stranded captions, and inspect extracted text for omissions. Correct and rebuild until evidence and presentation defects are resolved. Ship Markdown, five DOCX files when five are requested, figure sources, evidence tables, bibliography audit, journal-selection rationale, and an honest audit report. Missing author identity, affiliation, funding, competing-interest declaration, archive DOI, or journal eligibility is an explicit administrative dependency, not permission to invent facts or abandon completed manuscripts.
