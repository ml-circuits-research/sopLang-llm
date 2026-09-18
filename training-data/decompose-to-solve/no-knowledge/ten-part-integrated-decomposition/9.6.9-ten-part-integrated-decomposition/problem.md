# 9.6.9 — Ten-Part Integrated Decomposition

Scenario. In planning a learning sequence, a plan starts from 82 local units of learning units. Convert by 1.25 to standard units, then allow 12% process loss. Each batch handles 22 standard units. Up to 3 batches can run in parallel, each wave taking 7 minutes. Setup takes 9 minutes and a mandatory buffer adds 7 minutes. There are at most 10 batch slots. Cost is 78 fixed plus 1.44 per pre-loss standard unit. The deadline is 22 minutes and the budget is 265.34 units. The data are deliberately mixed rather than grouped by calculation.

Main question. Is the plan feasible, and what intermediate outputs should be computed so that each subproblem uses the fewest necessary facts? Best decomposition (10 subproblems).
