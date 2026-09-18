# 3.3.9 — Ten-Part Integrated Decomposition

Scenario. In estimating travel fuel or energy needs, a plan starts from 105 local units of journey kilometres. Convert by 0.75 to standard units, then allow 12% process loss. Each batch handles 23 standard units. Up to 3 batches can run in parallel, each wave taking 4 minutes. Setup takes 15 minutes and a mandatory buffer adds 4 minutes. There are at most 8 batch slots. Cost is 68 fixed plus 1.30 per pre-loss standard unit. The deadline is 19 minutes and the budget is 244.33 units. The data are deliberately mixed rather than grouped by calculation.

Main question. Is the plan feasible, and what intermediate outputs should be computed so that each subproblem uses the fewest necessary facts? Best decomposition (10 subproblems).
