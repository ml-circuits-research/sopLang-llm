# 3.7.9 — Ten-Part Integrated Decomposition

Scenario. In interpreting population and area data, a plan starts from 106 local units of population groups. Convert by 1 to standard units, then allow 12% process loss. Each batch handles 15 standard units. Up to 2 batches can run in parallel, each wave taking 7 minutes. Setup takes 9 minutes and a mandatory buffer adds 6 minutes. There are at most 7 batch slots. Cost is 84 fixed plus 0.98 per pre-loss standard unit. The deadline is 66 minutes and the budget is 177.55 units. The data are deliberately mixed rather than grouped by calculation.

Main question. Is the plan feasible, and what intermediate outputs should be computed so that each subproblem uses the fewest necessary facts? Best decomposition (10 subproblems).
