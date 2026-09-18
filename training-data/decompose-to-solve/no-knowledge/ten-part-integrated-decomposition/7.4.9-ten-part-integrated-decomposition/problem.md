# 7.4.9 — Ten-Part Integrated Decomposition

Scenario. In reading and checking a quantitative chart, a plan starts from 73 local units of data points. Convert by 1.25 to standard units, then allow 12% process loss. Each batch handles 27 standard units. Up to 2 batches can run in parallel, each wave taking 5 minutes. Setup takes 19 minutes and a mandatory buffer adds 4 minutes. There are at most 11 batch slots. Cost is 60 fixed plus 1.07 per pre-loss standard unit. The deadline is 38 minutes and the budget is 230.83 units. The data are deliberately mixed rather than grouped by calculation.

Main question. Is the plan feasible, and what intermediate outputs should be computed so that each subproblem uses the fewest necessary facts? Best decomposition (10 subproblems).
