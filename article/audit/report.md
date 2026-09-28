# Manuscript portfolio audit

Completed on 28 September 2026. The deliverable contains five distinct English review manuscripts, each in editable DOCX and resolved Markdown, with a PDF preview. This is a documented self-audit of the evidence, argument, references, journal preparation, and rendered documents. It is not independent peer review or a prediction of acceptance.

## Overall result

The scientific and document-production passes are complete. The portfolio reconstructs 7,050 archived item records from ten experimental arms, verifies 54 source-file hashes, and preserves both positive and negative findings. All six targeted tests pass. All five DOCX archives pass integrity checks, and all 43 rendered pages were visually inspected. No clipped text, missing figure, stranded caption, or unresolved citation marker was found in the final rendering.

Submission administration remains incomplete: actual author details, declarations, public evidence access, and conditional venue requirements cannot be supplied from guesswork. The manuscripts are polished review drafts; they are not certified ready for upload. The [author worksheet](../submission/author-information.md) records the missing facts, and the [journal matrix](../submission/journal-matrix.md) records the official requirements and no-fee routes.

## 1. Evidence pass — passed with stated design limitations

The extraction reconstructs outcome counts from the archived JSONL records, checks unique identifiers and exhaustive outcome partitions, and reconciles counts with the original metrics. Reapplying the original normalized exact comparator reproduces every completed item's saved match/mismatch label. Source inputs, including nested model and training manifests where retained, are bound by SHA-256 in [source-hashes.json](../evidence/source-hashes.json). The pre-audit tracked revision is `922debb5242e10e3e9c4c7d8b7f85b927d09d54e`; content hashes additionally identify experimental files outside that tracked snapshot.

The central retained finding is the specialized-wire comparison: exp-014 has 379/705 normalized exact matches and exp-016 has 440/705. Procedural execution failures decline from 63/480 to 13/480. The comparison retains the same item identifiers and oracle strings, but one run per condition and a missing exp-014 training manifest preclude a clean causal estimate. Only 40 procedural exp-016 outputs declare one of the three specialized commands, fewer than the 63 additional procedural matches; direct execution of those commands is therefore not a complete mechanism explanation.

The negative target-decomposition result is retained with equal care: exp-021 has 460/705 matches and 57/705 execution failures; exp-022 has 448/705 matches and 135/705 execution failures. Later dataset versions are not treated as an unchanged benchmark merely because they contain 705 items. The dv7/dv13 join finds 655 shared identifiers, 50 removals, 50 additions, and 100 changed oracle strings among the shared items.

Two retrospective diagnostic parsers preserve every item decision and abstain outside their declared grammars. Exp-027 coalition comparison accepts 20/20 outputs against 5/20 original matches. Exp-021 dependency joins produce 64 matches, two parsed disagreements, 26 unclassified outputs, and eight execution failures among 100 items. These diagnostic populations are not combined into a general semantic score. Tests cover contradictory surplus text, duplicate coalition entries, unsupported answer forms, and safe-integer boundaries.

Historical interpretations requiring correction are recorded in the [claim ledger](claim-ledger.md). In particular, an experiment directory suggesting a 17B model actually identifies Qwen3-1.7B in its nested metadata; saved judge inputs lack the verdicts needed to reconstruct an earlier semantic aggregate; and the 20 successful coalition outputs contain no container-family declarations. These unsupported interpretations are absent from the empirical findings. Corrected mistakes appear as case evidence only in manuscripts 03 and 05, whose subjects include research practice and epistemic responsibility.

The illustrative graph circuit in manuscript 02 was executed against the current runtime. Its connected case returns `yes`, its disconnected case returns `no`, and an absent target produces a structured failure. This verifies the example's stated contract; it does not constitute a new neural experiment or formal proof.

## 2. Argument and prose pass — passed

Each manuscript has a central question, a reason that question matters, a defined evidential basis, and a discussion that answers the question within the available evidence:

| Manuscript | Question and contribution | Main boundary retained |
| --- | --- | --- |
| Machine Learning | How does executable vocabulary change small-model compilation difficulty? | A strong developmental signal without replicated causal or general scaling claims |
| Informatica | Which computational obligations can move into explicit wire contracts? | Implemented architecture and examples separated from measured model capabilities |
| Empirical Software Engineering | Which claims survive reconstruction of an agent-assisted experimental archive? | A single archival case, without agent-versus-human error or productivity estimates |
| Open Research Europe | Which outcomes can be reconstructed and reused to design new abstraction experiments? | Local reproducibility separated from an as-yet-unmade public deposit and fresh confirmation |
| AI and Ethics | What makes delegated computation accountable as scientific evidence? | A normative argument grounded in a bounded case, without an empirical social-impact claim |

The revision removes unsupported causal verbs, broad reasoning claims, a universal model-size threshold, formal-verification language, measured energy savings, and claims that automatic wire discovery already exists. Repeated family instances are distinguished from independent task structures. Perfect syntax and graph acceptance is distinguished from successful execution and correct problem interpretation.

Training-data checks are explained concretely: execution against reference answers, selected probe assertions, structural validation, provenance, and input perturbations. Agreement within that pipeline is not presented as independent semantic validation. Coding-agent assistance is disclosed, including its relevance to correlated assumptions across generators, tests, analysis, and prose. Human scientific responsibility remains explicit. The future research programme proposes frozen transfer families, controlled vocabulary comparisons, several seeds, and tests of new wire contracts; none of those proposed experiments is described as completed.

The five papers share an experimental basis but have different argument structures, selections of results, tables, and discussions. Their relationship is disclosed in the submission material. They are alternative submission routes, not five presumed independent studies suitable for simultaneous overlapping submission.

## 3. Bibliography pass — passed with recorded access limits

The shared ledger contains 21 records: 17 research works, three official model cards, and one local companion-artifact record. Bibliographic identity and the proposition supported by each citation were checked separately. The [bibliography audit](bibliography.md) records primary-source links, passage locators, support paraphrases, and limits. DOI-bearing records were reconciled with publication metadata; publisher records and author versions support the remaining literature entries. The local artifact is explicitly unpublished and has no invented DOI.

Access limits are retained rather than concealed. Direct OpenReview retrieval of Program of Thoughts encountered a browser challenge; the author manuscript and repository identify its TMLR publication. The Dwork entry's adaptive-holdout proposition was checked against the authors' companion paper, with no theorem or quantitative claim imported into this study. An abstract or official model card is used only for the limited proposition it establishes. The Runeson and Höst issue year is 2009 despite its 2008 online-first date. Author names, including Hal Daumé III, were corrected against the bibliographic record.

Citation resolution rejects unknown keys and unsupported styles. Only cited records enter each manuscript's reference list. Final documents have 11, 11, 9, 14, and 11 references respectively. Reference styles follow the selected venue profiles; hyperlinks remain active in the DOCX files.

## 4. Journal-preparation pass — passed with administrative dependencies

Official scope, author instructions, charges, and review conditions were checked on 28 September 2026 and are linked in the [journal matrix](../submission/journal-matrix.md). Machine Learning, Empirical Software Engineering, and AI and Ethics have selected subscription routes without mandatory publication fees. Informatica uses its no-fee Normal track and the official Word template's layout and styles. Its six-page document is positioned as a technical paper. Open Research Europe supplies the European Commission-established route, with eligibility explicitly unverified for these authors.

The three Springer manuscripts use their applicable author-date or numbered references, native tables, numbered figures, and review layouts without invented publication metadata. AI and Ethics omits author metadata and repository URLs for double-anonymous preparation. Informatica has its corresponding template-based PDF, cover-letter draft, and a [self-review](informatica-author-review.md) using the journal's published author-assistance questions. Machine Learning has the separately prepared [contribution information sheet](../submission/machine-learning-contribution-sheet.md).

Two venue-specific conditions remain: Informatica's short Slovenian abstract must be arranged before submission because repository files must be English; ORE's active eligibility and detailed platform instructions require confirmation during its announced transition. The inaccessible legacy ORE guideline endpoint is recorded. AI and Ethics also requires an appropriate professional email or supporting research credentials. These are named completion dependencies, not assertions of compliance.

## 5. Artifact and visual pass — passed

| Final DOCX | Pages in inspected PDF | Abstract words | Keywords | References | Native tables | Embedded figures |
| --- | --- | --- | --- | --- | --- | --- |
| [Machine Learning](../docs/01-machine-learning.docx) | 10 | 200 | 6 | 11 | 2 | 3 |
| [Informatica](../docs/02-informatica.docx) | 6 | 194 | 5 | 11 | 3 | 2 |
| [Empirical Software Engineering](../docs/03-empirical-software-engineering.docx) | 8 | 201 | 6 | 9 | 3 | 2 |
| [Open Research Europe](../docs/04-open-research-europe.docx) | 11 | 192 | 6 | 14 | 4 | 2 |
| [AI and Ethics](../docs/05-ai-and-ethics.docx) | 8 | 201 | 6 | 11 | 1 | 2 |
| Total | 43 | — | — | — | 13 | 11 |

The 11 figure placements use eight original SVG diagrams with high-resolution PNG exports. The numerical outcome chart reads the reconstructed result table. Figures are legible in grayscale; captions, figure callouts, and table callouts are present and sequential. Tables remain editable Word tables. Headers identify review manuscripts rather than fabricated journal issues, and page numbers are native fields.

The final layout revision keeps tables intact, prevents isolated final references, and fixes bibliography ordering and citation details. Contact sheets were regenerated using only the current PDF's page count, so obsolete page images from earlier drafts cannot enter the final inspection. All pages were inspected after the last document rebuild. The documents render in LibreOffice with no missing glyph markers or out-of-page text. Native Microsoft Word pagination can differ slightly; the inspected PDF previews are supplied as the visual record.

The [automated document checks](document-checks.json) verify current source and DOCX hashes, counts against the evidence table, citation keys, abstract lengths, native table/figure counts, removal of unresolved drafting markers, absence of identifying core metadata, and presence of rendered references. [Geometry checks](render-geometry.json) record page and word counts. External `unzip -t` checks pass for all five DOCX archives.

## Executed checks and tooling

The following commands completed successfully in the preparation workflow:

```bash
node article/scripts/extract-evidence.mjs
node article/scripts/make-bibliography.mjs
node article/scripts/make-figures.mjs
node article/scripts/build-manuscripts.mjs
node --test article/scripts/evidence.test.mjs skills/scientific-article/scripts/build-docx.test.mjs
node article/scripts/render-audit.mjs --render
node article/scripts/render-audit.mjs
node article/scripts/audit-documents.mjs
git diff --check
```

The final [test log](tests.log) records six passing tests and no failures or skipped tests. The portable skill was copied to a temporary directory and built an editable document from a different working directory. Twelve added ECMAScript modules passed `node --check`. Local links in the article and skill trees were checked against existing files. No runtime dependency was added, no model training or inference was started, no original experimental record or source book was altered, and no manuscript was submitted or sent to another person.

The self-contained [scientific-article skill](../../skills/scientific-article/SKILL.md) includes its audit procedure, format documentation, Markdown/citation renderer, OOXML/ZIP builder, tests, and dependency record. It uses Node.js built-ins. Existing LibreOffice, ImageMagick, and Poppler installations support optional layout and figure checks; they are not automatically installed or redistributed.

## Remaining scientific limits

The archive is developmental and synthetic, with repeated families and one run per condition. The nominal holdout was repeatedly inspected. Historical prompt bytes and some early training metadata are incomplete. There is no matched direct-answer baseline, fresh external test, independent semantic relabeling, controlled scaling comparison, or measured productivity/energy result. Reconstruction checks what the saved artifacts support; it cannot create missing evidence. These limits are part of the manuscripts' scientific interpretation, while author identities, declarations, eligibility, translations, and deposit identifiers remain separate submission tasks.
