# Prose evaluation — cmp-base-holdout-prose-15g

Artifact: `training/checkpoints/base-1.5b-general-f16.gguf`. Items: 705 (every eval statement).

The model was asked to answer each statement directly in prose; the completion
was compared with the printed answer of the problem. A non-numeric answer is
credited only by normalized containment; a numeric answer is credited only when
every number the printed answer states appears in the completion.

| metric | numerator | items | rate |
| --- | --- | --- | --- |
| printed answer matched | 80 | 705 | 11.3% |
| generation failed | 0 | 705 | 0.0% |

| book | items | matched | rate |
| --- | --- | --- | --- |
| adult-reasoning | 10 | 0 | 0.0% |
| common-sense | 50 | 0 | 0.0% |
| decompose-to-solve | 100 | 1 | 1.0% |
| logical-reasoning | 10 | 0 | 0.0% |
| mathematical-thinking | 10 | 2 | 20.0% |
| procedural-arithmetic | 480 | 77 | 16.0% |
| scientific-reasoning | 25 | 0 | 0.0% |
| world-as-a-system | 20 | 0 | 0.0% |
