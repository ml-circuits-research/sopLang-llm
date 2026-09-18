# 3.6.9 — Ten-Part Integrated Decomposition

Scenario. In managing a small inventory, a plan starts from 108 local units of stock units. Convert by 0.75 to standard units, then allow 10% process loss. Each batch handles 26 standard units. Up to 1 batches can run in parallel, each wave taking 5 minutes. Setup takes 14 minutes and a mandatory buffer adds 4 minutes. There are at most 5 batch slots. Cost is 90 fixed plus 0.92 per pre-loss standard unit. The deadline is 43 minutes and the budget is 232.83 units. The data are deliberately mixed rather than grouped by calculation.

Main question. Is the plan feasible, and what intermediate outputs should be computed so that each subproblem uses the fewest necessary facts? Best decomposition (10 subproblems).
