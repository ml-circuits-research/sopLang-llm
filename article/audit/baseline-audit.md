# Base-model comparisons and their measurement limits

This analysis was added during the reader-focused revision on 28 September 2026. It corrects the earlier portfolio's overly broad statement that a direct-answer baseline was absent. Baseline files do exist. They require matched populations, explicit scoring, and response-availability checks before interpretation.

## Reconstructed comparisons

The early Qwen2.5-Coder-0.5B-Instruct and Qwen2.5-Coder-1.5B-Instruct base evaluations each contain 585 unique items. Every base identifier joins its corresponding adapted evaluation, with no changed reference-answer strings. The base receives the direct-answer prose prompt; the adapted model emits SOP Lang, whose executed answer is evaluated. “Base” means the released instruction-tuned checkpoint before SOP Lang adaptation.

The audit reproduces every original base content-match label. It then applies the same content rule to executed adapted answers and the same normalized exact rule to both sides. No neural generation is repeated. Source hashes and per-item decisions are preserved in `article/evidence/`.

| Base release | Problems | Base content check | Adapted content check | Base exact check | Adapted exact check |
| --- | --- | --- | --- | --- | --- |
| Qwen2.5-Coder-0.5B-Instruct | 585 | 10.8% (63) | 44.4% (260) | 0.0% (0) | 44.1% (258) |
| Qwen2.5-Coder-1.5B-Instruct | 585 | 5.1% (30) | 61.4% (359) | 0.2% (1) | 55.0% (322) |

These percentages describe different checks, not interchangeable accuracy estimates. The content check accepts every number in the reference appearing somewhere in the answer; for a non-numeric reference, it uses normalized containment. It can ignore number roles, units, order, and contradiction. For example, the presence of an expected number in an explicitly rejected calculation may be enough for acceptance. Exact comparison can reject a correct paraphrase. The manuscripts explain both limitations beside the table.

The observed workflow improvement is useful, but several interventions change together: fine-tuning, prompt, output representation, runtime execution, and output budget. The retained prose evaluator caps generation at 512 tokens; compiled evaluation allows 2,048. One run per condition does not identify any component's separate causal contribution. Exact identifiers and reference strings also do not recover missing historical compiled prompt bytes.

## Qwen3 response availability

The Qwen3 base record has 705 items, but 322 requests have no completion, or 45.7%. The error field says `response carries no completion`. That record cannot establish that the model attempted and failed to solve each missing item. No unsupported item-level explanation of the serving behavior is added.

The common historical content check accepts 357/705 base records, or 50.6%, and 549/705 adapted outputs, or 77.9%. The normalized exact check accepts 0/705 base prose records and 460/705 adapted outputs, or 65.2%. These numbers remain in the machine-readable audit to prevent selective disappearance, but are not promoted to a clean capacity ranking. Missing completions are not dropped from the denominator. In particular, the 77.9% content-check rate is not a semantic-accuracy result and is unrelated to the unsupported historical semantic aggregate.

## Provenance

The reconstruction script is [audit-baselines.mjs](../scripts/audit-baselines.mjs). Its inputs include the prose and compiled item records, both run manifests, compiled metrics and checkpoint selections, and released-model identity manifests. [baseline-source-hashes.json](../evidence/baseline-source-hashes.json) identifies these inputs. [baseline-results.json](../evidence/baseline-results.json) preserves the reconstructed rates' integer numerators, model identity, available timestamps, and settings. The [experiment map](../evidence/experiment-map.md) supplies the exact repository identifiers outside the manuscript narrative.

Original base identities resolve to `Qwen/Qwen2.5-Coder-0.5B-Instruct`, `Qwen/Qwen2.5-Coder-1.5B-Instruct`, and `Qwen/Qwen3-1.7B`. These come from model-manifest contents, not decimal punctuation inferred from filenames. The additional general Qwen2.5-1.5B prose run is not substituted for the coder base used in the paired comparison.

## Permitted claims

The adapted workflow performs substantially better than the corresponding base prose workflow under the two reported checks on the shared early task populations. The relative size ordering changes across those workflows. Neither observation establishes a universal size effect, independently validated semantic accuracy, or an isolated benefit of execution. The Qwen3 missing-output case illustrates why serving outcomes must be distinguished from observed task mistakes.
