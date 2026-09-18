# 5.4.9 — Ten-Part Integrated Decomposition

Scenario. In planning communication across time zones, a plan starts from 160 local units of time-zone events. Convert by 1.25 to standard units, then allow 10% process loss. Each batch handles 28 standard units. Up to 1 batches can run in parallel, each wave taking 9 minutes. Setup takes 11 minutes and a mandatory buffer adds 8 minutes. There are at most 5 batch slots. Cost is 49 fixed plus 2.16 per pre-loss standard unit. The deadline is 96 minutes and the budget is 589.77 units. The data are deliberately mixed rather than grouped by calculation.

Main question. Is the plan feasible, and what intermediate outputs should be computed so that each subproblem uses the fewest necessary facts? Best decomposition (10 subproblems).
