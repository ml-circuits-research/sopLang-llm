# 1.8.9 — Ten-Part Integrated Decomposition

Scenario. In packing for a trip under weight and volume limits, a plan starts from 107 local units of packed items. Convert by 0.5 to standard units, then allow 12% process loss. Each batch handles 23 standard units. Up to 3 batches can run in parallel, each wave taking 7 minutes. Setup takes 20 minutes and a mandatory buffer adds 8 minutes. There are at most 5 batch slots. Cost is 70 fixed plus 1.84 per pre-loss standard unit. The deadline is 45 minutes and the budget is 221.90 units. The data are deliberately mixed rather than grouped by calculation.

Main question. Is the plan feasible, and what intermediate outputs should be computed so that each subproblem uses the fewest necessary facts? Best decomposition (10 subproblems).
