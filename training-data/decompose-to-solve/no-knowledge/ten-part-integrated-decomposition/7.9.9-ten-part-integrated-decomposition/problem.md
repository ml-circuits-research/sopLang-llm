# 7.9.9 — Ten-Part Integrated Decomposition

Scenario. In reconstructing a non-political event from reports, a plan starts from 143 local units of reports. Convert by 0.75 to standard units, then allow 12% process loss. Each batch handles 23 standard units. Up to 1 batches can run in parallel, each wave taking 5 minutes. Setup takes 14 minutes and a mandatory buffer adds 11 minutes. There are at most 10 batch slots. Cost is 73 fixed plus 1.11 per pre-loss standard unit. The deadline is 60 minutes and the budget is 183.13 units. The data are deliberately mixed rather than grouped by calculation.

Main question. Is the plan feasible, and what intermediate outputs should be computed so that each subproblem uses the fewest necessary facts? Best decomposition (10 subproblems).
