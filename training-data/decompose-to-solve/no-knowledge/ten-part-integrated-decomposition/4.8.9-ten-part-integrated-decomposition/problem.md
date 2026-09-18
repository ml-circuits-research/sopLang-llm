# 4.8.9 — Ten-Part Integrated Decomposition

Scenario. In planning an introductory astronomy observation, a plan starts from 134 local units of observations. Convert by 1 to standard units, then allow 12% process loss. Each batch handles 28 standard units. Up to 2 batches can run in parallel, each wave taking 7 minutes. Setup takes 9 minutes and a mandatory buffer adds 4 minutes. There are at most 11 batch slots. Cost is 90 fixed plus 2.20 per pre-loss standard unit. The deadline is 50 minutes and the budget is 444.89 units. The data are deliberately mixed rather than grouped by calculation.

Main question. Is the plan feasible, and what intermediate outputs should be computed so that each subproblem uses the fewest necessary facts? Best decomposition (10 subproblems).
