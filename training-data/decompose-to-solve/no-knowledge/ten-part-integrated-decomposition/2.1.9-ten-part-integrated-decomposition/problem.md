# 2.1.9 — Ten-Part Integrated Decomposition

Scenario. In planning a multi-leg rail or air journey, a plan starts from 91 local units of connections. Convert by 1 to standard units, then allow 6% process loss. Each batch handles 24 standard units. Up to 1 batches can run in parallel, each wave taking 4 minutes. Setup takes 20 minutes and a mandatory buffer adds 10 minutes. There are at most 12 batch slots. Cost is 84 fixed plus 1.41 per pre-loss standard unit. The deadline is 66 minutes and the budget is 240.88 units. The data are deliberately mixed rather than grouped by calculation.

Main question. Is the plan feasible, and what intermediate outputs should be computed so that each subproblem uses the fewest necessary facts? Best decomposition (10 subproblems).
