# Audited journal manuscript portfolio

Five English manuscripts present different questions from the SOP Lang experimental programme. Each has an explicit research question, related work, supported results, limitations, native Word tables, and diagrams. The final files are in [docs/](docs/). Markdown sources use a shared verified bibliography and generate editable DOCX files.

| Target | Perspective | Deliverables |
| --- | --- | --- |
| Machine Learning | What abstraction changes in the learning target; base-to-adapted reference comparisons | [DOCX](docs/01-machine-learning.docx) · [Markdown](docs/01-machine-learning.md) · [PDF preview](audit/rendered/01-machine-learning.pdf) |
| Informatica | Language syntax, command contracts, and the work moved out of generated code | [DOCX](docs/02-informatica.docx) · [Markdown](docs/02-informatica.md) · [PDF preview](audit/rendered/02-informatica.pdf) |
| Empirical Software Engineering | Why reproducible metrics can still support an incorrect scientific interpretation | [DOCX](docs/03-empirical-software-engineering.docx) · [Markdown](docs/03-empirical-software-engineering.md) · [PDF preview](audit/rendered/03-empirical-software-engineering.pdf) |
| Open Research Europe | Model comparisons by task family and explicit answer-equivalence diagnostics | [DOCX](docs/04-open-research-europe.docx) · [Markdown](docs/04-open-research-europe.md) · [PDF preview](audit/rendered/04-open-research-europe.pdf) |
| AI and Ethics | Epistemic accountability, evidential independence, and duties to readers | [DOCX](docs/05-ai-and-ethics.docx) · [Markdown](docs/05-ai-and-ethics.md) · [PDF preview](audit/rendered/05-ai-and-ethics.pdf) |

The portfolio supports alternative submission routes. Shared experiments do not become independent studies through different wording. Substantially overlapping versions should not be under review concurrently where journal policies prohibit it; any later distinct publication needs disclosure of the common evidence and related work. The papers have not been submitted or published by this preparation process.

## What the evidence establishes

The audit reconstructs 7,050 item records across ten primary experimental conditions. Adding specialized commands increases normalized exact matching from 53.8% to 62.4%, while procedural execution failures decline from 13.1% to 2.7%. Splitting target computations into more wires has the opposite observed effect: matching falls from 65.2% to 63.5% and execution failures rise from 8.1% to 19.1%. Overall rates use 705 problems per condition; procedural rates use 480. The manuscripts retain both findings and distinguish the measured changes from the proposed explanation: removing algorithm construction can help, while adding interfaces can increase coordination demands.

A separate [baseline reconstruction](audit/baseline-audit.md) recovers comparisons between released instruction-tuned models and their SOP Lang adaptations. On 585 shared problems per pair, the historical content check rises from 10.8% to 44.4% for the 0.5B model and from 5.1% to 61.4% for the 1.5B model. This check is weak, and training, prompting, execution, and generation budget change together. The Machine Learning paper reports these limits beside the comparison rather than presenting the percentages as general semantic accuracy.

The Open Research Europe paper centers a different result. On a later shared set, the adapted 1.7B system has better overall exact matching than the adapted 0.5B system, 59.7% versus 51.2%, but its execution failures on parallel-task scheduling rise from 55% to 94%. Its tables separate family performance, execution, and answer representation. The methods and ethics papers use selected audit cases to develop their own arguments rather than repeat all experimental tables.

Unsupported claims from the old drafts are excluded from scientific-result reporting. A small number of corrected mistakes appear only where they serve the research-practice or epistemic argument. The [claim ledger](audit/claim-ledger.md) preserves the complete correction record. The historical materials under `docs/article/` remain provenance, not the current publication account.

## Journal requirements and completion state

The selected routes have no mandatory author publication fee under the checked policies: subscription publication for Machine Learning, Empirical Software Engineering, and AI and Ethics; the Normal open-access track for Informatica; and eligible publication on Open Research Europe. Optional paid services are not selected. Open Research Europe is the European Commission-established platform requested for the EU route, and eligibility is conditional. Official sources and the 28 September 2026 access date are recorded in the [journal matrix](submission/journal-matrix.md).

The manuscripts are polished review drafts, not certified submission-ready packages. Actual author identities, affiliations, funding, competing interests, prior-publication status, and public archive identifiers remain author-owned facts. Informatica also needs its short Slovenian abstract, which was not generated under the repository's English-only rule. ORE requires an established eligibility route and confirmation of the active platform's detailed submission requirements. These facts are listed in [author information](submission/author-information.md); no grant, affiliation, DOI, or declaration has been invented.

The supporting material includes [cover-letter drafts](submission/cover-letters.md), the [Machine Learning contribution sheet](submission/machine-learning-contribution-sheet.md), and the [Informatica author-assistance review](audit/informatica-author-review.md). The [audit report](audit/report.md) distinguishes automated checks, argument review, bibliography verification, and visual inspection.

## Files and reproducibility

`manuscripts/` contains citation-key Markdown source. `docs/` contains the five DOCX files, resolved Markdown, and build manifests. The current [figure manifest](assets/figure-manifest.json) identifies nine redesigned SVG figures and their high-resolution PNG exports; earlier assets remain as unused provenance. Across the papers, there are 12 editable tables and 13 figure placements. `evidence/` contains reconstructed results, baseline rescoring, source hashes, bibliographic metadata, and item-level restricted diagnostics. The [experiment map](evidence/experiment-map.md) connects reader-facing comparison names to exact archived conditions. `submission/` contains journal-specific build profiles and editorial preparation files. `audit/` contains checks, correction records, and rendered PDF previews.

Every manuscript introduces SOP Lang with a complete executable example and explains declarations, bodies, value references, dependency order, and output conventions. Experimental labels are local to each paper. Percentages lead the results, with denominators in methods or captions and integer counts retained in the evidence files.

The reusable [scientific-article skill](../skills/scientific-article/SKILL.md) is self-contained and uses Node.js built-ins for Markdown, citation resolution, and DOCX construction. Its [audit protocol](../skills/scientific-article/references/audit-protocol.md) and [artifact format](../skills/scientific-article/references/artifact-format.md) describe the workflow. It is discoverable through `.agents/skills/scientific-article` in this workspace. Project-specific extraction scripts remain in `article/scripts/` and intentionally read the repository's experimental archive.

From the repository root, rebuild evidence and documents with:

```bash
node article/scripts/extract-evidence.mjs
node article/scripts/audit-baselines.mjs
node article/scripts/make-bibliography.mjs
node article/scripts/make-figures.mjs
node article/scripts/build-manuscripts.mjs
node --test article/scripts/evidence.test.mjs skills/scientific-article/scripts/build-docx.test.mjs
node article/scripts/render-audit.mjs --render
node article/scripts/audit-documents.mjs
```

No training or model inference is launched. Bibliography generation uses already verified local metadata; it does not substitute for rechecking sources when claims change. Document generation requires Node.js 20 or later. Figure rasterization uses the existing ImageMagick installation. Render inspection additionally uses LibreOffice and Poppler. These optional tools are checked before use and are never installed automatically; see the skill's [dependency record](../skills/scientific-article/dependencies.md). The Informatica profile requires the official template downloaded locally from the URL recorded in the journal matrix.

Run `node article/scripts/render-audit.mjs` without `--render` to inspect existing PDFs and refresh page contact sheets. Visual review remains necessary even when the automated geometry and content checks pass. Original raw evaluation records and training manifests are required for full reconstruction; the derived evidence files alone do not replace them. Source books and local full-text reading caches are not included in redistribution bundles.
