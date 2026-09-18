# 5.6.9 — Ten-Part Integrated Decomposition

Scenario. In planning an activity near a coast, a plan starts from 95 local units of coastal observations. Convert by 0.5 to standard units, then allow 6% process loss. Each batch handles 28 standard units. Up to 2 batches can run in parallel, each wave taking 5 minutes. Setup takes 16 minutes and a mandatory buffer adds 7 minutes. There are at most 10 batch slots. Cost is 82 fixed plus 1.84 per pre-loss standard unit. The deadline is 20 minutes and the budget is 214.89 units. The data are deliberately mixed rather than grouped by calculation.

Main question. Is the plan feasible, and what intermediate outputs should be computed so that each subproblem uses the fewest necessary facts? Best decomposition (10 subproblems).
