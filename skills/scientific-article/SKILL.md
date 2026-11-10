---
name: scientific-article
description: Write, adapt, and audit scientific manuscripts from research artifacts, with a finding-driven narrative, verified bibliography, journal-specific positioning, evidence-derived figures and tables, and editable Markdown and DOCX deliverables. Use for substantive scientific article preparation, not routine documentation or a literature summary alone.
---

# Scientific article

A publishable paper teaches its reader something they can reuse outside the authors' project, and every claim it makes can be traced to evidence. Both halves are mandatory. A paper that is fully traceable but teaches nothing is an audit report; a paper that tells a good story the records do not support is fiction. Most failed drafts fail the first half: they are accurate, hedged, crowded with numbers and internal labels, and give the reader no reason to care. Keep the evidence discipline below, but spend at least as much effort on finding the lesson and telling it well.

Read [references/storytelling.md](references/storytelling.md) before outlining and before writing any abstract. Read [references/audit-protocol.md](references/audit-protocol.md) before calling a draft finished.

## 1. Mine the whole research history, not the convenient part

Read project guidance, the research question, methods, run reports, analysis logs, decision records, and negative results from the first experiment to the last. Build a chronological table of every experimental arm: what was changed, what was hypothesised, what was measured, and what the authors concluded at the time. The most informative results are often early, ugly, or negative (a 0% that refused to move under six interventions says more than a 3-point gain). Do not restrict the paper to the arms that are easiest to reconstruct.

Rank findings by informativeness, not by recency or cleanliness:

- Size of the contrast relative to noise. 0 of 225 against 160 of 160 needs no statistics; 65.2% against 63.5% on one seed is barely a result.
- Whether it changes what a reader would do (choose data, design a language, build an evaluator, trust a number).
- Whether several independent measurements point the same way (a ladder, a dose series, a failure that survives every lever).
- Whether it surprised the authors. Recorded surprises, corrected diagnoses, and falsified hypotheses are research content.

Then write, for each candidate finding, one sentence of the form: *When X, Y happens, because (probably) Z; this matters because W.* Findings for which no such sentence can be written are details, not contributions.

## 2. Establish the evidence for the findings you will use

Make a source inventory with paths, hashes, record counts, model identities, data versions, and timestamps. Read nested training manifests before interpreting experiment names; distinguish a model's marketed size from its verified identity (a directory called `17b` may hold a 1.7B model).

Recompute every number the paper will print from item records. Check denominators, duplicate identifiers, outcome partitions, train/test boundaries, checkpoint selection, changed prompts or oracles, and whether compared conditions share items. Inspect informative successes and failures, and quote one or two real items; a concrete failing program is more persuasive than a paragraph of rates. A deterministic runtime guarantees only its execution contract; neither execution nor tests prove that a program represents the question.

Label each finding reproduced, corroborated, historical-only, or unresolved in a claim ledger that lives in the evidence package. Only reproduced or corroborated findings may carry a paper. Missing records stay missing; never reconstruct a plausible value. The ledger, hashes, and audit narrative are for the authors and reviewers: they go in the supplement, not in the paper's argument (except in a paper whose subject is research practice).

## 3. Position each paper around one question and one lesson

Before drafting, write the paper's one-sentence contribution: problem, finding, boundary. Then write the abstract (see storytelling reference) before the body, as a contract that the body must fulfil; revise it last.

Establish what prior work already knows, then say precisely what this study adds. Name real researchers where their results matter to the argument. Cite for propositions, not decoration.

For several journals from one body of work, each paper needs a different question, audience, lesson, and evidential core. Assign findings to papers explicitly in a portfolio table. A finding may appear in more than one paper, but no two papers may share their headline result or their conclusion. If the evidence supports only two or three genuinely distinct papers, write two or three; a forced fifth paper that restates the others damages all of them. Record the overlap and use sequential rather than concurrent submission where journals forbid overlap.

## 4. Calibrate once, precisely, and then write with confidence

Plausibility comes from calibrated claims, not from hedging every sentence. State each claim at the strength the evidence supports, in its own wording ("in two model sizes and one model family", "on 225 problems from seven families"), and then stop qualifying it. Put threats to validity in one dedicated section, ordered by how much each could change the conclusion, each with what would test it. Avoid both failure modes:

- Naive claims: universal laws from one project ("abstraction helps small models"), headline contests ("our 1.7B beats a 17B"), causal verbs for uncontrolled comparisons, savings nobody measured, primacy claims.
- Defensive noise: the same caveat in every paragraph, "we interpret", "this does not establish", "one run per condition" repeated six times, limitations in the abstract that crowd out the finding.

An exploratory single-seed programme can publish strong qualitative findings (a boundary that held across nine arms, a mechanism visible in failing programs) when it presents them as such. It cannot publish small aggregate differences as effects.

## 5. Write for a reader outside the repository

Introduce every project-specific language, system, and term before using it; give a complete short example when syntax matters. Refer to conditions by what they change ("the composition-inventory curriculum", "the declarative-command targets"), never by run identifiers, data-version codes, or letters such as "Experiment A/B/C" that the reader must decode. Keep identifiers in a supplementary crosswalk.

Tell the research as it happened when the sequence is the argument: hypothesis, measurement, surprise, revised hypothesis. A series of interventions that each failed for a diagnosable reason is a compelling structure; a static table of ten conditions is not.

Each table must answer a question stated in the preceding sentence; each figure must show a mechanism, a boundary, or a contrast that prose cannot. Generate numerical graphics from audited data. Prefer real programs, failure excerpts, and ladders over boxes-and-arrows. Distinguish constructed examples from observed outputs.

Numbers have two jobs, and each gets its own form:
- **Design numbers are counts.** How many problems, families, runs, instances per composition: the reader needs them to understand what was done.
- **Results are percentages, with the denominator visible.** Put n in the table header or caption and percentages in the cells, so conditions with different denominators can be compared at a glance. In prose give the percentage and, where the count helps, the count ("91% (30 of 33)"); for floors and ceilings plain words work best ("none of the 225", "all 160"). A census rather than a sample, such as an incident register of one case, stays in counts, and the paper says why: percentages would invite a population estimate the design cannot support.
- **Justify every sample size where it is introduced.** Say why it was chosen (a budget, a whole population, a follow-up of a surprising sample) and what it can resolve: at n = 55 a proportion carries a 95% interval of about ±13 points, at n = 33 about ±17, at n = 15 about ±25. Items that share a program or template are not independent, so the real resolution is coarser. Then read only differences larger than that, describe smaller ones as no detectable difference, and do not rank conditions inside the noise. A qualitative study says so once, in the method, and then writes with confidence about the contrasts it can resolve.

Do not put more than two numbers in an abstract, and none unless the magnitude itself is the finding.

## 6. Verify journal and bibliography facts

Consult current official publisher pages for scope, article types, limits, anonymity, format, references, declarations, and charges; record URLs and access dates. For each reference, verify identity and the exact proposition it supports from the primary text, and keep a bibliography ledger (locator, support paraphrase, what the source does not establish, status). DOI resolution is not claim verification. Never invent DOIs, affiliations, grants, or declarations.

## 7. Audit, build, and deliver

Run the passes in [references/audit-protocol.md](references/audit-protocol.md), including the reader pass, which is where most drafts fail, and the adversarial verification pass, which is where confident drafts fail. Expect the adversarial pass to overturn some of your own interpretations; revise the claim to what the records show rather than defending the story, and record each correction in the claim ledger. Use [scripts/build-docx.mjs](scripts/build-docx.mjs) to render Markdown into editable DOCX with native tables and embedded figures (job format in [references/artifact-format.md](references/artifact-format.md); optional tools in [dependencies.md](dependencies.md)). Render to PDF when an office suite is available and inspect every page.

Ship the Markdown, the DOCX files, figure sources, evidence tables, claim ledger, bibliography audit, a portfolio table explaining what each paper claims and why it is distinct, and an honest audit report. Missing author identity, affiliation, funding, or archive DOI is an administrative dependency to list, not a fact to invent. Do not submit, contact editors, or make declarations for authors.
