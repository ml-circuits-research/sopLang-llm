# 8.2.9 — Ten-Part Integrated Decomposition

Scenario. In designing a basic authentication flow, a plan starts from 111 local units of authentication steps. Convert by 1.5 to standard units, then allow 6% process loss. Each batch handles 30 standard units. Up to 3 batches can run in parallel, each wave taking 9 minutes. Setup takes 13 minutes and a mandatory buffer adds 7 minutes. There are at most 7 batch slots. Cost is 79 fixed plus 2.18 per pre-loss standard unit. The deadline is 30 minutes and the budget is 505.04 units. The data are deliberately mixed rather than grouped by calculation.

Main question. Is the plan feasible, and what intermediate outputs should be computed so that each subproblem uses the fewest necessary facts? Best decomposition (10 subproblems).
