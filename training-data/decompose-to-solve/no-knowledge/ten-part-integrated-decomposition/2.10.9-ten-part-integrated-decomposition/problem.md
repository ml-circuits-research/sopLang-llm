# 2.10.9 — Ten-Part Integrated Decomposition

Scenario. In planning a staged evacuation exercise, a plan starts from 132 local units of evacuation groups. Convert by 1 to standard units, then allow 10% process loss. Each batch handles 18 standard units. Up to 3 batches can run in parallel, each wave taking 9 minutes. Setup takes 15 minutes and a mandatory buffer adds 11 minutes. There are at most 10 batch slots. Cost is 79 fixed plus 1.66 per pre-loss standard unit. The deadline is 63 minutes and the budget is 363.18 units. The data are deliberately mixed rather than grouped by calculation.

Main question. Is the plan feasible, and what intermediate outputs should be computed so that each subproblem uses the fewest necessary facts? Best decomposition (10 subproblems).
