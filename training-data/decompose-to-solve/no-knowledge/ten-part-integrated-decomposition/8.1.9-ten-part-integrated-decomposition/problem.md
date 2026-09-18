# 8.1.9 — Ten-Part Integrated Decomposition

Scenario. In diagnosing or planning a small computer network, a plan starts from 113 local units of network links. Convert by 1 to standard units, then allow 12% process loss. Each batch handles 29 standard units. Up to 2 batches can run in parallel, each wave taking 4 minutes. Setup takes 18 minutes and a mandatory buffer adds 7 minutes. There are at most 12 batch slots. Cost is 49 fixed plus 1.09 per pre-loss standard unit. The deadline is 42 minutes and the budget is 228.72 units. The data are deliberately mixed rather than grouped by calculation.

Main question. Is the plan feasible, and what intermediate outputs should be computed so that each subproblem uses the fewest necessary facts? Best decomposition (10 subproblems).
