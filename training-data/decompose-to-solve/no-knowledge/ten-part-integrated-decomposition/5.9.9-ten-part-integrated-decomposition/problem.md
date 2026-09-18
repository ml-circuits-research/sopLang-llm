# 5.9.9 — Ten-Part Integrated Decomposition

Scenario. In interpreting a basic hazard scenario, a plan starts from 120 local units of hazard observations. Convert by 0.5 to standard units, then allow 4% process loss. Each batch handles 29 standard units. Up to 2 batches can run in parallel, each wave taking 4 minutes. Setup takes 16 minutes and a mandatory buffer adds 10 minutes. There are at most 10 batch slots. Cost is 74 fixed plus 1.88 per pre-loss standard unit. The deadline is 26 minutes and the budget is 231.33 units. The data are deliberately mixed rather than grouped by calculation.

Main question. Is the plan feasible, and what intermediate outputs should be computed so that each subproblem uses the fewest necessary facts? Best decomposition (10 subproblems).
