# Incident codebook (fixed before coding)

Each incident receives exactly one primary category and, for category R only, one seam.

**C — Code defect.** The code does not do what its own specification, documentation, or evident intent says (a loop that never runs, a scorer that reads the wrong number, a race between processes, a parser bug, a leak of hidden data into an input the code was meant to exclude).

**R — Representation error.** The code or procedure works as specified, but one artifact is taken as evidence of something it does not represent. Seams:
- `name-identity`: a name, label, or path is taken as the identity of a model, dataset, or checkpoint.
- `score-construct`: a score or comparator output is taken as the capability or correctness it is meant to indicate.
- `intervention-distribution`: an intervention on an input (a prompt, a condition, a data view) is taken as isolating one factor, but also changes the input's distribution.
- `record-state`: a log line, report, file, or signal is taken as evidence of a system state (completion, which inputs were used) it does not reliably indicate.
- `population-population`: one evaluation population or item set is treated as another (changed items, missing responses counted as failures, unequal sets compared).

**I — Inference or reporting error.** The evidence was represented correctly, but the stated conclusion goes beyond it: an unsupported causal attribution, an over-generalization, a miscount or wrong number in a report, or an unrecorded procedure presented as a measurement.

**E — Environment failure.** A resource or platform failure outside the project's code (disk, memory, host reset, files removed by the environment).

Rules: code what the incident primarily is, not what caused it upstream. If an incident fits two categories, choose the one whose correction would have prevented it. Record a confidence (high, medium, low) and a one-sentence reason.
