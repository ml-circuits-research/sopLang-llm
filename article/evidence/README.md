# Evidence package

This directory contains derived, auditable evidence for the five manuscripts. Original evaluation records, model manifests, and training metadata remain at their repository paths. The files here do not replace those inputs or imply that an immutable public deposit has been made.

| File or pattern | Purpose |
| --- | --- |
| `results.json` | Ten-arm identities, outcome counts, subsets, command use, paired comparisons, and restricted diagnostics |
| `results.csv` | Compact outcome table for inspection and reuse |
| `source-hashes.json` | Paths and SHA-256 hashes for the 54 inputs used in reconstruction |
| `baseline-results.json` | Base-to-adapted paired comparisons, both scorers applied to both conditions, and response-availability limits |
| `baseline-source-hashes.json` | Additional source hashes for the baseline reconstruction; the combined audits check 72 unique inputs |
| `*-paired-diagnostics.jsonl` | Original responses, paired identifiers, scorer decisions, and missing-completion states for the base-model audit |
| `experiment-map.md` and `.json` | Meaningful experimental names in each paper linked to exact archived model/data conditions |
| `*-restricted.jsonl` | Per-item decisions from the coalition and dependency-join diagnostic parsers |
| `illustrative-graph.sop` | Executed architecture example used in the Informatica manuscript |
| `illustrative-arithmetic.sop` | Complete declaration-and-dependency example used across the portfolio |
| `bibliography.json` | Verified bibliographic identities used by citation resolution |
| `bibliography-audit.json` | Source locators, supported propositions, and limits of each citation |
| `crossref/*.json` | Cached primary publication metadata for DOI-bearing works |

Run `node article/scripts/extract-evidence.mjs` from the repository root to reconstruct results without training or model inference. The script reads the preserved inputs and fails when item counts, outcome partitions, or original comparator labels disagree. It writes new derived files here; it does not rewrite the experimental archive. [The claim ledger](../audit/claim-ledger.md) explains which interpretations are supported.

Then run `node article/scripts/audit-baselines.mjs` to reconstruct the archived direct-answer comparisons. This separate analysis reproduces the original prose labels and compiled-answer labels, pairs identifiers and reference answers, and applies each scorer to both sides. The historical content check recognizes numbers or normalized reference text; it does not establish semantic correctness. The supplementary Qwen3 comparison retains missing completions and is excluded from the main base-model table. Prompting, fine-tuning, execution, and generation budgets differ between direct-answer and compiled workflows; these are not equal-budget causal ablations. See the [baseline audit](../audit/baseline-audit.md).

The restricted parsers are retrospective diagnostics. Their output distinguishes match, parsed disagreement, unsupported grammar, and execution failure. They do not award general semantic correctness, reconstruct missing judge verdicts, or combine unrelated subsets into an aggregate semantic score.

Model identities come from manifest contents. Directory labels remain unchanged for provenance even when a name is misleading. Training finish times refer to the recorded training event; exp-014's time is approximate because its training manifest is absent. Dataset versions must accompany arm comparisons: a shared denominator does not establish a shared population or unchanged oracles.

Source books and locally cached full-text papers retain their own rights status. This derived evidence package makes no new redistribution claim for those materials. Public release of the complete reconstruction inputs requires an appropriate deposit, source-rights review, and persistent identifier, as recorded in the [author worksheet](../submission/author-information.md).
