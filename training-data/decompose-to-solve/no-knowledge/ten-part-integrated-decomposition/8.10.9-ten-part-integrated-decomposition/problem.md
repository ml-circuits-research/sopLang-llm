# 8.10.9 — Ten-Part Integrated Decomposition

Scenario. In diagnosing a service incident, a plan starts from 114 local units of service components. Convert by 0.75 to standard units, then allow 4% process loss. Each batch handles 22 standard units. Up to 3 batches can run in parallel, each wave taking 6 minutes. Setup takes 15 minutes and a mandatory buffer adds 8 minutes. There are at most 12 batch slots. Cost is 50 fixed plus 1.27 per pre-loss standard unit. The deadline is 51 minutes and the budget is 223.49 units. The data are deliberately mixed rather than grouped by calculation.

Main question. Is the plan feasible, and what intermediate outputs should be computed so that each subproblem uses the fewest necessary facts? Best decomposition (10 subproblems).
