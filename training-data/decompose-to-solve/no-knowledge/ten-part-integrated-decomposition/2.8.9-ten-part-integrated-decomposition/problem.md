# 2.8.9 — Ten-Part Integrated Decomposition

Scenario. In scheduling sessions and shared rooms, a plan starts from 159 local units of sessions. Convert by 1.25 to standard units, then allow 6% process loss. Each batch handles 21 standard units. Up to 3 batches can run in parallel, each wave taking 5 minutes. Setup takes 13 minutes and a mandatory buffer adds 12 minutes. There are at most 10 batch slots. Cost is 82 fixed plus 1.23 per pre-loss standard unit. The deadline is 61 minutes and the budget is 382.86 units. The data are deliberately mixed rather than grouped by calculation.

Main question. Is the plan feasible, and what intermediate outputs should be computed so that each subproblem uses the fewest necessary facts? Best decomposition (10 subproblems).
