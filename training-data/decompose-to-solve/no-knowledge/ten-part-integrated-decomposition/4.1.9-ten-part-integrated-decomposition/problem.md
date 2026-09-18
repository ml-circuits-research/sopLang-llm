# 4.1.9 — Ten-Part Integrated Decomposition

Scenario. In analyzing a simple motion or load case, a plan starts from 99 local units of measurements. Convert by 1.5 to standard units, then allow 4% process loss. Each batch handles 15 standard units. Up to 1 batches can run in parallel, each wave taking 7 minutes. Setup takes 18 minutes and a mandatory buffer adds 5 minutes. There are at most 9 batch slots. Cost is 48 fixed plus 1.18 per pre-loss standard unit. The deadline is 116 minutes and the budget is 204.95 units. The data are deliberately mixed rather than grouped by calculation.

Main question. Is the plan feasible, and what intermediate outputs should be computed so that each subproblem uses the fewest necessary facts? Best decomposition (10 subproblems).
