# Manuscript portfolio audit

Revised on 28 September 2026 after the author's review identified unclear language explanations, internal experiment jargon, repetitive comparisons, weak diagrams, and insufficiently direct interpretation. The earlier mechanical checks did not adequately assess those reader-facing problems. This report records the rewritten portfolio and the additional checks; it supersedes the earlier completion assessment.

The deliverable contains five English manuscripts in editable DOCX and resolved Markdown, with PDF previews. This is a documented internal audit, not independent peer review or a prediction of acceptance. Author declarations, public evidence access, and conditional journal requirements remain recorded in the [author worksheet](../submission/author-information.md) and [journal matrix](../submission/journal-matrix.md).

## 1. What changed for the reader

Every manuscript now introduces SOP Lang with a complete executable example before relying on its notation. Each defines named computations, declarations, bodies, command-specific interpretation, dollar-prefixed value references, dependency order, and the requested-output convention. The Informatica paper adds a concrete graph command and explains its undirected semantics.

The main papers use descriptive comparisons and local Experiment A/B/C labels. Exact repository identifiers, data versions, model releases, and finish times are preserved in the [experiment map](../evidence/experiment-map.md), rather than left for readers to decode. The document audit rejects internal run/data-version labels in manuscript source.

Percentages lead evaluation results, with denominators in methods or captions. Tables name both conditions and the scoring rule. Integer counts remain in machine-readable evidence. Changes in percentage points are distinguished from relative changes, and different populations are identified explicitly.

The five articles now select different evidence and develop different arguments:

| Manuscript | Central question | Selected evidence and interpretation |
| --- | --- | --- |
| Machine Learning | How does the target language change what a small model must learn? | Base-to-adapted reference comparisons; abstraction, decomposition, and model-choice experiments; removal of algorithm construction versus added coordination |
| Informatica | Which implementation obligations can move into explicit commands? | Runnable syntax and graph examples; vocabulary and decomposition comparisons; concrete command boundaries and an admission procedure |
| Empirical Software Engineering | Why can reproducible metrics support an incorrect claim? | Model identity, population continuity, missing judgments, scorer comparability, and mechanism attribution; reusable claim-audit operations |
| Open Research Europe | What does an overall model score hide? | Paired model performance by family and restricted answer-equivalence diagnostics; separating execution failures from representation penalties |
| AI and Ethics | What makes an executable scientific claim accountable? | Selected positive and corrected cases, a constructed shared-assumption counterexample, and four duties of scientific reporting |

The papers share a real experimental basis; they are not independent replications. Some overlap remains necessary to explain that basis. Their submission material discloses the relationship.

## 2. Evidence reconstruction and claim boundaries

The primary analysis reconstructs 7,050 item records across ten fine-tuned conditions and reproduces their archived outcome labels. The original 54 input hashes and the additional baseline inputs yield 72 unique source files checked against current contents. The [automated report](document-checks.json) records that coverage; [source-hashes.json](../evidence/source-hashes.json) and [baseline-source-hashes.json](../evidence/baseline-source-hashes.json) identify the files.

The positive vocabulary comparison raises normalized exact matching from 53.8% to 62.4% on 705 problems. Procedural matches rise from 78.5% to 91.7%, and procedural execution failures fall from 13.1% to 2.7% on 480 problems. Retained identifiers and oracle strings agree within the pair. Only 8.3% of procedural outputs directly use the added commands, so direct command execution does not fully explain the improvement. The text preserves both the useful result and that mechanism limit.

The negative decomposition comparison reduces matching from 65.2% to 63.5% and raises execution failures from 8.1% to 19.1% on 705 problems. The proposed coordination explanation is labeled as an interpretation, not a demonstrated cause of each failure.

The later model comparison has 705 shared identifiers, reference answers, and plan fingerprints. The adapted 1.7B system improves overall matching from 51.2% to 59.7% relative to the adapted 0.5B system, but dependency-join execution failures rise from 55% to 94%. Procedural execution failures instead decline from 15.4% to 4.2%. Model families and pretrained states differ, so the papers do not treat this as a controlled scaling experiment.

Restricted diagnostics remain separate from original evaluation. The coalition parser recognizes all outputs in its 20-problem subset against 25% exact matching. The 100-problem scheduling diagnostic yields 64% matches, 2% parsed disagreements, 26% unclassified outputs, and 8% execution failures. Unsupported prose remains unclassified, and unrelated subsets are not merged into an aggregate semantic score.

The [claim ledger](claim-ledger.md) retains corrections to historical model-size, judge-agreement, semantic-score, and container-mechanism claims. Corrected mistakes appear only where they serve the methods or ethics argument. The directed-graph example in three papers is clearly identified as a constructed counterexample, not an observed frequency of model error.

## 3. Recovered base-model comparisons

The previous assertion that the archive contained no matched direct-answer reference comparison was too broad. The revision reconstructs saved base-model responses and pairs them with SOP Lang adaptations on 585 shared identifiers and unchanged reference answers per model. It reproduces the original prose and compiled labels, then applies both scoring functions to both conditions.

The historical content check increases from 10.8% to 44.4% for the 0.5B base/adaptation pair and from 5.1% to 61.4% for the 1.5B pair. Normalized exact comparison is reported alongside it in the Machine Learning manuscript. “Base” means the released instruction-tuned checkpoint before SOP Lang adaptation.

The historical content check can accept an answer containing the expected numbers while ignoring units, roles, ordering, or contradictory text. Exact matching has the opposite problem of rejecting valid paraphrases. These are diagnostic comparisons, not general semantic-accuracy estimates. Fine-tuning, prompting, execution, and generation budgets change together: the retained prose evaluator caps generation at 512 tokens, while compiled evaluation allows 2,048. Paired identifiers and oracles also do not prove identical historical prompt bytes.

A separate Qwen3 response audit retains 45.7% missing completions. That comparison is excluded from the main base-model table; missing responses are not described as demonstrated reasoning failures. The [baseline audit](baseline-audit.md) gives the exact files, labels, settings, and exclusions. No new neural inference was run.

## 4. Figures, examples, and document layout

Nine current SVG figures and high-resolution PNG exports replace the earlier generic diagrams. The [figure manifest](../assets/figure-manifest.json) identifies them. They explain program syntax, actual dependency order, a command's directed/undirected boundary, paired percentage changes, family-specific failures, restricted scoring, claim/evidence links, shared parsing assumptions, and a proposed future experiment. Earlier unused assets remain preserved.

The final visual pass caught and repaired missing arrowheads in rasterized SVGs and a crowded prospective-design label. Directed edges are now drawn with explicit arrow polygons. Contact-sheet generation was also corrected to select only current page images when a document's page count changes the filename padding.

All six SOP code blocks across the five manuscripts execute with their stated results. Tests also cover reversed declaration order and the directed-graph counterexample. The graph example distinguishes connected, disconnected, and absent-target inputs.

| Document | Pages | Native tables | Figure placements | Abstract words | Cited references |
| --- | --- | --- | --- | --- | --- |
| Machine Learning | 11 | 3 | 3 | 190 | 11 |
| Informatica | 5 | 3 | 2 | 197 | 9 |
| Empirical Software Engineering | 9 | 2 | 3 | 202 | 8 |
| Open Research Europe | 9 | 3 | 3 | 190 | 11 |
| AI and Ethics | 8 | 1 | 2 | 204 | 11 |
| Total | 42 | 12 | 13 | — | — |

All 42 pages have been visually inspected after the rewrite, with the final changed document and corrected Open Research Europe contact sheet inspected again. Figures, captions, tables, references, and page transitions are present and legible. Automated geometry checks find no text outside the defined page boundaries. These checks do not claim to simulate every Word version.

The Informatica file uses the official template's two-column layout and is positioned as a five-page technical paper. Other files use journal-appropriate review layouts and citation styles. AI and Ethics omits identifying core metadata and repository URLs. No publication metadata, author identity, public DOI, or grant has been invented.

## 5. Bibliography and journal preparation

The shared verified ledger contains 21 entries: 17 research works, three official model cards, and one local companion-artifact record. Only cited entries enter each paper. The [bibliography audit](bibliography.md) records primary-source links, supported propositions, passage locators, and access limits. Existing access limits, including the unavailable legacy ORE detailed-guideline endpoint, remain visible.

The revision uses that verified literature for the same bounded propositions. It does not import claims from a citation merely because its title is relevant. The local companion artifact remains unpublished, without a fabricated persistent identifier.

Official venue requirements and no-fee routes were checked on 28 September 2026 and remain linked in the [journal matrix](../submission/journal-matrix.md). Subscription routes are selected for the three Springer journals; Informatica uses its Normal track. Open Research Europe supplies the European Commission-established route, conditional on actual author eligibility and the active platform requirements. The [cover letters](../submission/cover-letters.md), [Machine Learning contribution sheet](../submission/machine-learning-contribution-sheet.md), and [Informatica self-review](informatica-author-review.md) now match the revised titles and contributions.

## 6. Executed checks

The reconstruction and build workflow is documented in the [portfolio guide](../README.md). The latest document audit checks 72 source hashes, current manuscript/DOCX hashes, citation resolution, abstract lengths, 24 quantitative table rows against integer evidence, table/figure callouts, native Word content, and rendered reference presence.

The [test log](tests.log) records eight passing tests and no failures or skipped tests. These include adversarial restricted-parser cases, population boundaries, all manuscript examples, dependency semantics, and the portable builder's operation from another working directory. DOCX ZIP integrity, ECMAScript syntax, local links, and whitespace checks are also part of the final verification.

The [scientific-article skill](../../skills/scientific-article/SKILL.md) and its audit protocol now explicitly require reader onboarding, meaningful experiment names, percentage-first comparisons, distinct evidence selection, and diagrams that explain a concrete relationship. Its builder uses Node.js built-ins. No dependency was installed, no training or model inference was launched, no source book or original experiment record was altered, and no manuscript was submitted.

## Remaining scientific limits

The archive remains developmental, synthetic, structurally concentrated, and repeatedly inspected. Each reported condition has one training run. Historical prompt bytes and some early training metadata are missing. The recovered base comparisons do not supply an equal-budget ablation; there is no new external confirmation set, independent semantic relabeling, controlled scaling study, or measured agent-productivity or energy result. The manuscripts state those limits at the relevant inferences while presenting the reproducible positive results directly.
