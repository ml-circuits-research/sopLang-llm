# 4.2.9 — Ten-Part Integrated Decomposition

Scenario. In comparing heat-loss or insulation choices, a plan starts from 73 local units of thermal observations. Convert by 1.5 to standard units, then allow 8% process loss. Each batch handles 26 standard units. Up to 1 batches can run in parallel, each wave taking 6 minutes. Setup takes 12 minutes and a mandatory buffer adds 5 minutes. There are at most 12 batch slots. Cost is 84 fixed plus 1.51 per pre-loss standard unit. The deadline is 52 minutes and the budget is 304.15 units. The data are deliberately mixed rather than grouped by calculation.

Main question. Is the plan feasible, and what intermediate outputs should be computed so that each subproblem uses the fewest necessary facts? Best decomposition (10 subproblems).
