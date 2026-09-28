# Evidence package

This directory contains derived, auditable evidence for the five manuscripts. Original evaluation records, model manifests, and training metadata remain at their repository paths. The files here do not replace those inputs or imply that an immutable public deposit has been made.

| File or pattern | Purpose |
| --- | --- |
| `results.json` | Ten-arm identities, outcome counts, subsets, command use, paired comparisons, and restricted diagnostics |
| `results.csv` | Compact outcome table for inspection and reuse |
| `source-hashes.json` | Paths and SHA-256 hashes for the 54 inputs used in reconstruction |
| `*-restricted.jsonl` | Per-item decisions from the coalition and dependency-join diagnostic parsers |
| `illustrative-graph.sop` | Executed architecture example used in the Informatica manuscript |
| `bibliography.json` | Verified bibliographic identities used by citation resolution |
| `bibliography-audit.json` | Source locators, supported propositions, and limits of each citation |
| `crossref/*.json` | Cached primary publication metadata for DOI-bearing works |

Run `node article/scripts/extract-evidence.mjs` from the repository root to reconstruct results without training or model inference. The script reads the preserved inputs and fails when item counts, outcome partitions, or original comparator labels disagree. It writes new derived files here; it does not rewrite the experimental archive. [The claim ledger](../audit/claim-ledger.md) explains which interpretations are supported.

The restricted parsers are retrospective diagnostics. Their output distinguishes match, parsed disagreement, unsupported grammar, and execution failure. They do not award general semantic correctness, reconstruct missing judge verdicts, or combine unrelated subsets into an aggregate semantic score.

Model identities come from manifest contents. Directory labels remain unchanged for provenance even when a name is misleading. Training finish times refer to the recorded training event; exp-014's time is approximate because its training manifest is absent. Dataset versions must accompany arm comparisons: a shared denominator does not establish a shared population or unchanged oracles.

Source books and locally cached full-text papers retain their own rights status. This derived evidence package makes no new redistribution claim for those materials. Public release of the complete reconstruction inputs requires an appropriate deposit, source-rights review, and persistent identifier, as recorded in the [author worksheet](../submission/author-information.md).
