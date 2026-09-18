# 1.2.9 — Ten-Part Integrated Decomposition

Scenario. In a local public-transport journey, a plan starts from 74 local units of journey legs. Convert by 0.5 to standard units, then allow 8% process loss. Each batch handles 22 standard units. Up to 1 batches can run in parallel, each wave taking 9 minutes. Setup takes 19 minutes and a mandatory buffer adds 11 minutes. There are at most 11 batch slots. Cost is 90 fixed plus 1.83 per pre-loss standard unit. The deadline is 64 minutes and the budget is 183.50 units. The data are deliberately mixed rather than grouped by calculation.

Main question. Is the plan feasible, and what intermediate outputs should be computed so that each subproblem uses the fewest necessary facts? Best decomposition (10 subproblems).
