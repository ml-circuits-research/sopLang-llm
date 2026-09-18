# 3.5.9 — Ten-Part Integrated Decomposition

Scenario. In comparing a constrained household budget, a plan starts from 125 local units of budget items. Convert by 0.5 to standard units, then allow 10% process loss. Each batch handles 25 standard units. Up to 2 batches can run in parallel, each wave taking 5 minutes. Setup takes 20 minutes and a mandatory buffer adds 12 minutes. There are at most 6 batch slots. Cost is 75 fixed plus 0.87 per pre-loss standard unit. The deadline is 58 minutes and the budget is 155.16 units. The data are deliberately mixed rather than grouped by calculation.

Main question. Is the plan feasible, and what intermediate outputs should be computed so that each subproblem uses the fewest necessary facts? Best decomposition (10 subproblems).
