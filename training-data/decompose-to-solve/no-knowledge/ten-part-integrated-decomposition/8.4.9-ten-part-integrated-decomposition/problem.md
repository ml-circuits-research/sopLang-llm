# 8.4.9 — Ten-Part Integrated Decomposition

Scenario. In resolving software dependency constraints, a plan starts from 77 local units of packages. Convert by 1.5 to standard units, then allow 12% process loss. Each batch handles 16 standard units. Up to 3 batches can run in parallel, each wave taking 5 minutes. Setup takes 13 minutes and a mandatory buffer adds 6 minutes. There are at most 6 batch slots. Cost is 87 fixed plus 1.87 per pre-loss standard unit. The deadline is 26 minutes and the budget is 352.60 units. The data are deliberately mixed rather than grouped by calculation.

Main question. Is the plan feasible, and what intermediate outputs should be computed so that each subproblem uses the fewest necessary facts? Best decomposition (10 subproblems).
