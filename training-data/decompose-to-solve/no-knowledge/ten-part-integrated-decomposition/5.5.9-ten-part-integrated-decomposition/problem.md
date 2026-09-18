# 5.5.9 — Ten-Part Integrated Decomposition

Scenario. In planning an elevation-sensitive route, a plan starts from 118 local units of route segments. Convert by 0.75 to standard units, then allow 4% process loss. Each batch handles 14 standard units. Up to 1 batches can run in parallel, each wave taking 9 minutes. Setup takes 14 minutes and a mandatory buffer adds 7 minutes. There are at most 11 batch slots. Cost is 51 fixed plus 1.76 per pre-loss standard unit. The deadline is 89 minutes and the budget is 188.66 units. The data are deliberately mixed rather than grouped by calculation.

Main question. Is the plan feasible, and what intermediate outputs should be computed so that each subproblem uses the fewest necessary facts? Best decomposition (10 subproblems).
