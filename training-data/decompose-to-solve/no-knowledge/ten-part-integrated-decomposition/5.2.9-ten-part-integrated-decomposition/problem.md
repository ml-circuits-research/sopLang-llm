# 5.2.9 — Ten-Part Integrated Decomposition

A plan starts from 72 local units of catchment observations. Convert by 0.75 to standard units, then allow 10% process loss. Each batch handles 23 standard units. Up to 1 batches can run in parallel, each wave taking 7 minutes. Setup takes 17 minutes and a mandatory buffer adds 4 minutes. There are at most 9 batch slots. Cost is 40 fixed plus 2.09 per pre-loss standard unit. The deadline is 52 minutes and the budget is 140.48 units.

Question. Is the plan feasible, and what intermediate outputs should be computed so that each subproblem uses the fewest necessary facts?
