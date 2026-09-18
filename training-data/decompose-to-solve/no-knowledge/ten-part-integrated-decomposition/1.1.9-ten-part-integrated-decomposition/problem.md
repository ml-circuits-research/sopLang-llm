# 1.1.9 — Ten-Part Integrated Decomposition

Scenario. In household faults and maintenance observations, a plan starts from 84 local units of observations. Convert by 1.5 to standard units, then allow 6% process loss. Each batch handles 19 standard units. Up to 3 batches can run in parallel, each wave taking 7 minutes. Setup takes 12 minutes and a mandatory buffer adds 5 minutes. There are at most 10 batch slots. Cost is 75 fixed plus 1.67 per pre-loss standard unit. The deadline is 48 minutes and the budget is 358.81 units. The data are deliberately mixed rather than grouped by calculation.

Main question. Is the plan feasible, and what intermediate outputs should be computed so that each subproblem uses the fewest necessary facts? Best decomposition (10 subproblems).
