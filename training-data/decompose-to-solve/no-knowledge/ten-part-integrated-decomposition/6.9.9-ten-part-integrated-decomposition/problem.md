# 6.9.9 — Ten-Part Integrated Decomposition

Scenario. In reconstructing the provenance of an artifact, a plan starts from 127 local units of records. Convert by 1.25 to standard units, then allow 6% process loss. Each batch handles 21 standard units. Up to 2 batches can run in parallel, each wave taking 8 minutes. Setup takes 19 minutes and a mandatory buffer adds 10 minutes. There are at most 6 batch slots. Cost is 42 fixed plus 1.86 per pre-loss standard unit. The deadline is 79 minutes and the budget is 331.71 units. The data are deliberately mixed rather than grouped by calculation.

Main question. Is the plan feasible, and what intermediate outputs should be computed so that each subproblem uses the fewest necessary facts? Best decomposition (10 subproblems).
