# 3.4.9 — Ten-Part Integrated Decomposition

Scenario. In scaling food portions and label quantities, a plan starts from 106 local units of servings. Convert by 1 to standard units, then allow 10% process loss. Each batch handles 22 standard units. Up to 1 batches can run in parallel, each wave taking 9 minutes. Setup takes 19 minutes and a mandatory buffer adds 9 minutes. There are at most 12 batch slots. Cost is 57 fixed plus 1.01 per pre-loss standard unit. The deadline is 92 minutes and the budget is 150.92 units. The data are deliberately mixed rather than grouped by calculation.

Main question. Is the plan feasible, and what intermediate outputs should be computed so that each subproblem uses the fewest necessary facts? Best decomposition (10 subproblems).
