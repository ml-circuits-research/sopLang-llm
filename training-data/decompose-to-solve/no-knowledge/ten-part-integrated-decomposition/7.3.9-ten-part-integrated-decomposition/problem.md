# 7.3.9 — Ten-Part Integrated Decomposition

Scenario. In interpreting a public survey, a plan starts from 80 local units of responses. Convert by 1 to standard units, then allow 8% process loss. Each batch handles 16 standard units. Up to 1 batches can run in parallel, each wave taking 8 minutes. Setup takes 10 minutes and a mandatory buffer adds 12 minutes. There are at most 8 batch slots. Cost is 78 fixed plus 1.93 per pre-loss standard unit. The deadline is 75 minutes and the budget is 305.48 units. The data are deliberately mixed rather than grouped by calculation.

Main question. Is the plan feasible, and what intermediate outputs should be computed so that each subproblem uses the fewest necessary facts? Best decomposition (10 subproblems).
