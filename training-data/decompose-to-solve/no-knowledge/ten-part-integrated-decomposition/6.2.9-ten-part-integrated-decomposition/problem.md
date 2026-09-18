# 6.2.9 — Ten-Part Integrated Decomposition

Scenario. In analyzing exchange along a historical trade network, a plan starts from 128 local units of trade links. Convert by 0.75 to standard units, then allow 8% process loss. Each batch handles 27 standard units. Up to 2 batches can run in parallel, each wave taking 8 minutes. Setup takes 20 minutes and a mandatory buffer adds 9 minutes. There are at most 7 batch slots. Cost is 58 fixed plus 1.81 per pre-loss standard unit. The deadline is 61 minutes and the budget is 307.03 units. The data are deliberately mixed rather than grouped by calculation.

Main question. Is the plan feasible, and what intermediate outputs should be computed so that each subproblem uses the fewest necessary facts? Best decomposition (10 subproblems).
