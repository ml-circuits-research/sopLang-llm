# 8.6.9 — Ten-Part Integrated Decomposition

A plan starts from 141 local units of data fields. Convert by 1 to standard units, then allow 8% process loss. Each batch handles 17 standard units. Up to 1 batches can run in parallel, each wave taking 5 minutes. Setup takes 11 minutes and a mandatory buffer adds 11 minutes. There are at most 8 batch slots. Cost is 72 fixed plus 0.86 per pre-loss standard unit. The deadline is 64 minutes and the budget is 263.84 units.

Question. Is the plan feasible, and what intermediate outputs should be computed so that each subproblem uses the fewest necessary facts?
