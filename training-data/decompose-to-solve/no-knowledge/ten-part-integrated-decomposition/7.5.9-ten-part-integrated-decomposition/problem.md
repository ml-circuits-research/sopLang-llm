# 7.5.9 — Ten-Part Integrated Decomposition

Scenario. In reasoning about a probabilistic decision, a plan starts from 75 local units of cases. Convert by 1 to standard units, then allow 10% process loss. Each batch handles 27 standard units. Up to 1 batches can run in parallel, each wave taking 5 minutes. Setup takes 18 minutes and a mandatory buffer adds 5 minutes. There are at most 6 batch slots. Cost is 76 fixed plus 1.32 per pre-loss standard unit. The deadline is 35 minutes and the budget is 160.64 units. The data are deliberately mixed rather than grouped by calculation.

Main question. Is the plan feasible, and what intermediate outputs should be computed so that each subproblem uses the fewest necessary facts? Best decomposition (10 subproblems).
