# 10.8.9 — Ten-Part Integrated Decomposition

Scenario. In planning a civic open-data release, a plan starts from 72 local units of data sets. Convert by 1.25 to standard units, then allow 8% process loss. Each batch handles 16 standard units. Up to 2 batches can run in parallel, each wave taking 7 minutes. Setup takes 8 minutes and a mandatory buffer adds 4 minutes. There are at most 11 batch slots. Cost is 42 fixed plus 1.16 per pre-loss standard unit. The deadline is 32 minutes and the budget is 215.30 units. The data are deliberately mixed rather than grouped by calculation.

Main question. Is the plan feasible, and what intermediate outputs should be computed so that each subproblem uses the fewest necessary facts? Best decomposition (10 subproblems).
