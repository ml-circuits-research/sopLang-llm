# Research manuscript portfolio

Four English manuscripts report distinct lessons from the SOP Lang fine-tuning programme. Each has its own question, headline evidence, and conclusion; [PORTFOLIO.md](PORTFOLIO.md) explains why these four, what each deliberately omits, and where they overlap. Final files are in [docs/](docs/); citation-key sources are in [manuscripts/](manuscripts/).

| Target | Question | Lesson | Deliverables |
| --- | --- | --- | --- |
| Machine Learning | What does a small model transfer when fine-tuned to write programs, and what does fine-tuning add over writing plain code? | Taught operations transfer in the taught wording: rewording removed much of the transfer, a taught book shape succeeded once restated in the teaching template, and the untuned 1.7B model writing JavaScript was unaffected; the limits are not properties of the task | [DOCX](docs/01-machine-learning.docx) · [Markdown](docs/01-machine-learning.md) · [PDF preview](audit/rendered/01-machine-learning.pdf) |
| Informatica | What should the program a small model generates not contain? | Keep contracts, recurring algorithms, and output conventions in the language; a refactoring of the examples changes the curriculum where it does not reach; a higher abstraction level removes code and format errors but leaves recognition and form, so it remains a hypothesis to test | [DOCX](docs/02-informatica.docx) · [Markdown](docs/02-informatica.md) · [PDF preview](audit/rendered/02-informatica.pdf) |
| Empirical Software Engineering | Where did the consequential errors of an agent-operated pipeline enter, and which process found each kind? | Detection followed what each process examined: code and environment failures were found during the programme, inference and reporting errors only by a final audit; advisory warnings failed where blocking gates held | [DOCX](docs/03-empirical-software-engineering.docx) · [Markdown](docs/03-empirical-software-engineering.md) · [PDF preview](audit/rendered/03-empirical-software-engineering.pdf) |
| AI and Ethics | Who answers for claims when agents run experiments and write the records? | A lost decimal point became a headline because it said what the programme wanted to be true; responsibility stays with the authors as answerability, reaches the records behind the text, and grounds checks fixed before results are known | [DOCX](docs/04-ai-and-ethics.docx) · [Markdown](docs/04-ai-and-ethics.md) · [PDF preview](audit/rendered/04-ai-and-ethics.pdf) |

The papers have not been submitted. Author identities, affiliations, funding, competing interests, public archive identifiers, and the Informatica Slovenian abstract remain author-owned facts; see [author information](submission/author-information.md), [cover letters](submission/cover-letters.md), the [journal matrix](submission/journal-matrix.md), and the [Machine Learning contribution sheet](submission/machine-learning-contribution-sheet.md).

## Evidence

Every number in the manuscripts is recomputed from per-item evaluation records, run manifests, and the version history:

- [evidence/early-series-verification.md](evidence/early-series-verification.md) covers the first series through the composition inventory, the diagnostics, retries, demonstrations, the benchmark sanity check, and the per-book results of every late run. It lists seven earlier narrative claims that the records contradict, with the corrected values; the manuscripts use the corrected values.
- [evidence/results.json](evidence/results.json) and [audit/baseline-audit.md](audit/baseline-audit.md) reconstruct the late runs and the base-model comparisons.
- [audit/claim-ledger.md](audit/claim-ledger.md) records claims excluded from scientific-result sections, including the "1.7B beats 17B" headline (the model was Qwen3-1.7B) and the unreconstructable 77.2% semantic score.
- [audit/adversarial-review-01-02.md](audit/adversarial-review-01-02.md) and [audit/adversarial-review-03-04.md](audit/adversarial-review-03-04.md) are separate review passes instructed to find reasons the claims are false; the manuscripts were revised against them, and [audit/revision-factcheck.md](audit/revision-factcheck.md) checks the revision.
- [evidence/reexecution-summary.json](evidence/reexecution-summary.json) records the re-execution of every saved generated program (13,330 records in 26 evaluation runs); every outcome reproduced.
- [evidence/incident-register.md](evidence/incident-register.md), the codebook, and the two independent codings support the Empirical Software Engineering paper.
- [evidence/comparison/README.md](evidence/comparison/README.md) holds the evaluation-only experiments run on existing checkpoints without training. They cover untuned models answering directly, writing plain JavaScript, writing SOP Lang from the prompt, or writing operator plans; rewording tests; book problems in the teaching wording; and the withheld type in full. Every record is scored at three levels, the last by two blind judges with retained verdicts (κ = 0.96). The plan and pre-registered readings are in [experiments/no-training-plan.md](experiments/no-training-plan.md).
- [evidence/incident-coding-sheet.md](evidence/incident-coding-sheet.md) is the sheet for a human second coder of the incident register; it is not yet completed, and the ESE manuscript (Section 4.5) fixes the protocol, including a regenerated sheet without component labels.
- [audit/reviews/](audit/reviews/) holds the four reviews of 29 September, each written by a separate session instructed to review as a demanding referee for its journal, and the revision logs that answer them item by item with the evidence checked. [evidence/comparison/ml-review-checks.md](evidence/comparison/ml-review-checks.md) recomputes the figures added in response.
- The bibliography ([evidence/bibliography.json](evidence/bibliography.json)) records, for every work, the proposition it supports and what it does not establish.

The first portfolio (five manuscripts built around one late comparison) is kept under [archive/2026-09-28-first-portfolio/](archive/2026-09-28-first-portfolio/) as provenance.

## Rebuilding

From the repository root:

```bash
node article/scripts/verify-early-series.mjs      # recompute early-series evidence (1-2 minutes)
node article/scripts/reexecute-evaluations.mjs    # re-execute every saved program (tens of minutes)
node article/scripts/incident-agreement.mjs       # inter-coder agreement for the incident register
node article/scripts/extract-evidence.mjs         # late-run evidence
node article/scripts/audit-baselines.mjs
node article/scripts/make-bibliography.mjs
node article/scripts/make-figures-portfolio.mjs   # data-derived figures
node article/scripts/build-manuscripts.mjs
node --test skills/scientific-article/scripts/build-docx.test.mjs
node article/scripts/render-audit.mjs --render    # requires LibreOffice and Poppler
```

No training or model inference is launched. Figure rasterization uses ImageMagick. The Informatica build requires the official template downloaded locally from the URL in the journal matrix. The manuscripts were prepared with the [scientific-article skill](../skills/scientific-article/SKILL.md), revised in this round to require a finding-driven narrative (see its [storytelling reference](../skills/scientific-article/references/storytelling.md)).
