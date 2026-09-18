# 4.7.9 — Ten-Part Integrated Decomposition

Scenario. In interpreting geological observations, a plan starts from 99 local units of field observations. Convert by 0.5 to standard units, then allow 10% process loss. Each batch handles 15 standard units. Up to 1 batches can run in parallel, each wave taking 4 minutes. Setup takes 18 minutes and a mandatory buffer adds 12 minutes. There are at most 11 batch slots. Cost is 78 fixed plus 1.47 per pre-loss standard unit. The deadline is 62 minutes and the budget is 218.87 units. The data are deliberately mixed rather than grouped by calculation.

Main question. Is the plan feasible, and what intermediate outputs should be computed so that each subproblem uses the fewest necessary facts? Best decomposition (10 subproblems).
