# 4.3.9 — Ten-Part Integrated Decomposition

Scenario. In planning a low-voltage electrical load, a plan starts from 148 local units of electrical loads. Convert by 1.5 to standard units, then allow 12% process loss. Each batch handles 25 standard units. Up to 1 batches can run in parallel, each wave taking 7 minutes. Setup takes 18 minutes and a mandatory buffer adds 10 minutes. There are at most 9 batch slots. Cost is 43 fixed plus 0.96 per pre-loss standard unit. The deadline is 121 minutes and the budget is 345.95 units. The data are deliberately mixed rather than grouped by calculation.

Main question. Is the plan feasible, and what intermediate outputs should be computed so that each subproblem uses the fewest necessary facts? Best decomposition (10 subproblems).
