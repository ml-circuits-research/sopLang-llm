# 1.9.9 — Ten-Part Integrated Decomposition

Scenario. In managing a queue with limited service capacity, a plan starts from 118 local units of customers. Convert by 1.25 to standard units, then allow 6% process loss. Each batch handles 18 standard units. Up to 1 batches can run in parallel, each wave taking 6 minutes. Setup takes 17 minutes and a mandatory buffer adds 7 minutes. There are at most 6 batch slots. Cost is 75 fixed plus 1.46 per pre-loss standard unit. The deadline is 83 minutes and the budget is 279.11 units. The data are deliberately mixed rather than grouped by calculation.

Main question. Is the plan feasible, and what intermediate outputs should be computed so that each subproblem uses the fewest necessary facts? Best decomposition (10 subproblems).
