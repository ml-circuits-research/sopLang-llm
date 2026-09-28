# Audited journal manuscript portfolio

Five English manuscripts present different questions from the SOP Lang experimental programme. Each has an explicit research question, related work, supported results, limitations, native Word tables, and diagrams. The final files are in [docs/](docs/). Markdown sources use a shared verified bibliography and generate editable DOCX files.

| Target | Perspective | Deliverables |
| --- | --- | --- |
| Machine Learning | Executable vocabulary, learning difficulty, and limits of small models | [DOCX](docs/01-machine-learning.docx) · [Markdown](docs/01-machine-learning.md) · [PDF preview](audit/rendered/01-machine-learning.pdf) |
| Informatica | Language architecture, command contracts, and admission of new wires | [DOCX](docs/02-informatica.docx) · [Markdown](docs/02-informatica.md) · [PDF preview](audit/rendered/02-informatica.pdf) |
| Empirical Software Engineering | Artifact auditing of coding-agent-assisted research | [DOCX](docs/03-empirical-software-engineering.docx) · [Markdown](docs/03-empirical-software-engineering.md) · [PDF preview](audit/rendered/03-empirical-software-engineering.pdf) |
| Open Research Europe | Reconstructable evidence, negative results, and a future discovery protocol | [DOCX](docs/04-open-research-europe.docx) · [Markdown](docs/04-open-research-europe.md) · [PDF preview](audit/rendered/04-open-research-europe.pdf) |
| AI and Ethics | Epistemic accountability, evidential independence, and duties to readers | [DOCX](docs/05-ai-and-ethics.docx) · [Markdown](docs/05-ai-and-ethics.md) · [PDF preview](audit/rendered/05-ai-and-ethics.pdf) |

The portfolio supports alternative submission routes. Shared experiments do not become independent studies through different wording. Substantially overlapping versions should not be under review concurrently where journal policies prohibit it; any later distinct publication needs disclosure of the common evidence and related work. The papers have not been submitted or published by this preparation process.

## What the evidence establishes

The audit reconstructs 7,050 item records across ten arms. The strongest specialized-wire comparison increases normalized exact matches from 379/705 to 440/705, with procedural execution failures declining from 63/480 to 13/480. A target-decomposition change instead reduces matches from 460/705 to 448/705 and increases execution failures from 57/705 to 135/705. The manuscripts retain both findings, state the single-run and development-benchmark limitations, and propose new wire-discovery experiments without claiming to have performed them.

Unsupported claims from the old drafts are excluded from scientific-result reporting. A small number of corrected mistakes appear only where they serve the research-practice or epistemic argument. The [claim ledger](audit/claim-ledger.md) preserves the complete correction record. The historical materials under `docs/article/` remain provenance, not the current publication account.

## Journal requirements and completion state

The selected routes have no mandatory author publication fee under the checked policies: subscription publication for Machine Learning, Empirical Software Engineering, and AI and Ethics; the Normal open-access track for Informatica; and eligible publication on Open Research Europe. Optional paid services are not selected. Open Research Europe is the European Commission-established platform requested for the EU route, and eligibility is conditional. Official sources and the 28 September 2026 access date are recorded in the [journal matrix](submission/journal-matrix.md).

The manuscripts are polished review drafts, not certified submission-ready packages. Actual author identities, affiliations, funding, competing interests, prior-publication status, and public archive identifiers remain author-owned facts. Informatica also needs its short Slovenian abstract, which was not generated under the repository's English-only rule. ORE requires an established eligibility route and confirmation of the active platform's detailed submission requirements. These facts are listed in [author information](submission/author-information.md); no grant, affiliation, DOI, or declaration has been invented.

The supporting material includes [cover-letter drafts](submission/cover-letters.md), the [Machine Learning contribution sheet](submission/machine-learning-contribution-sheet.md), and the [Informatica author-assistance review](audit/informatica-author-review.md). The [audit report](audit/report.md) distinguishes automated checks, argument review, bibliography verification, and visual inspection.

## Files and reproducibility

`manuscripts/` contains citation-key Markdown source. `docs/` contains the five DOCX files, resolved Markdown, and build manifests. `assets/` contains eight original SVG figures and high-resolution PNG exports. `evidence/` contains reconstructed results, source hashes, primary bibliographic metadata, and item-level restricted diagnostics. `submission/` contains journal-specific build profiles and editorial preparation files. `audit/` contains checks, correction records, and rendered PDF previews.

The reusable [scientific-article skill](../skills/scientific-article/SKILL.md) is self-contained and uses Node.js built-ins for Markdown, citation resolution, and DOCX construction. Its [audit protocol](../skills/scientific-article/references/audit-protocol.md) and [artifact format](../skills/scientific-article/references/artifact-format.md) describe the workflow. It is discoverable through `.agents/skills/scientific-article` in this workspace. Project-specific extraction scripts remain in `article/scripts/` and intentionally read the repository's experimental archive.

From the repository root, rebuild evidence and documents with:

```bash
node article/scripts/extract-evidence.mjs
node article/scripts/make-bibliography.mjs
node article/scripts/make-figures.mjs
node article/scripts/build-manuscripts.mjs
node --test article/scripts/evidence.test.mjs skills/scientific-article/scripts/build-docx.test.mjs
node article/scripts/render-audit.mjs --render
node article/scripts/audit-documents.mjs
```

No training or model inference is launched. Bibliography generation uses already verified local metadata; it does not substitute for rechecking sources when claims change. Document generation requires Node.js 20 or later. Figure rasterization uses the existing ImageMagick installation. Render inspection additionally uses LibreOffice and Poppler. These optional tools are checked before use and are never installed automatically; see the skill's [dependency record](../skills/scientific-article/dependencies.md). The Informatica profile requires the official template downloaded locally from the URL recorded in the journal matrix.

Run `node article/scripts/render-audit.mjs` without `--render` to inspect existing PDFs and refresh page contact sheets. Visual review remains necessary even when the automated geometry and content checks pass. Original raw evaluation records and training manifests are required for full reconstruction; the derived evidence files alone do not replace them. Source books and local full-text reading caches are not included in redistribution bundles.
