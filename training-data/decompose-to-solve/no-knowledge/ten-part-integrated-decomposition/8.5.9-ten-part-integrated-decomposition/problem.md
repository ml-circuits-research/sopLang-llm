# 8.5.9 — Ten-Part Integrated Decomposition

Scenario. In moving data through several file formats, a plan starts from 115 local units of records. Convert by 0.75 to standard units, then allow 6% process loss. Each batch handles 27 standard units. Up to 3 batches can run in parallel, each wave taking 6 minutes. Setup takes 19 minutes and a mandatory buffer adds 6 minutes. There are at most 9 batch slots. Cost is 51 fixed plus 1.83 per pre-loss standard unit. The deadline is 53 minutes and the budget is 279.23 units. The data are deliberately mixed rather than grouped by calculation.

Main question. Is the plan feasible, and what intermediate outputs should be computed so that each subproblem uses the fewest necessary facts? Best decomposition (10 subproblems).
