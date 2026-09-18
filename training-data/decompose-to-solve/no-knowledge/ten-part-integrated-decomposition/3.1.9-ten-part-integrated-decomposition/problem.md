# 3.1.9 — Ten-Part Integrated Decomposition

Scenario. In estimating household electricity use, a plan starts from 109 local units of energy-consuming devices. Convert by 0.75 to standard units, then allow 12% process loss. Each batch handles 14 standard units. Up to 2 batches can run in parallel, each wave taking 9 minutes. Setup takes 15 minutes and a mandatory buffer adds 12 minutes. There are at most 9 batch slots. Cost is 62 fixed plus 1.91 per pre-loss standard unit. The deadline is 79 minutes and the budget is 214.87 units. The data are deliberately mixed rather than grouped by calculation.

Main question. Is the plan feasible, and what intermediate outputs should be computed so that each subproblem uses the fewest necessary facts? Best decomposition (10 subproblems).
