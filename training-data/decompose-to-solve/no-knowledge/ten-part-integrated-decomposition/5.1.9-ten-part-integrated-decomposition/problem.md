# 5.1.9 — Ten-Part Integrated Decomposition

Scenario. In using a map to plan a route or field survey, a plan starts from 121 local units of map segments. Convert by 0.5 to standard units, then allow 4% process loss. Each batch handles 22 standard units. Up to 3 batches can run in parallel, each wave taking 9 minutes. Setup takes 19 minutes and a mandatory buffer adds 5 minutes. There are at most 6 batch slots. Cost is 50 fixed plus 1.67 per pre-loss standard unit. The deadline is 38 minutes and the budget is 175.51 units. The data are deliberately mixed rather than grouped by calculation.

Main question. Is the plan feasible, and what intermediate outputs should be computed so that each subproblem uses the fewest necessary facts? Best decomposition (10 subproblems).
