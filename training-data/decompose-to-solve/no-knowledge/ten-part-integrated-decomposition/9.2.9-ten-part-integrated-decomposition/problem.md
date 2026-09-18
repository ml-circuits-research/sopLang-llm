# 9.2.9 — Ten-Part Integrated Decomposition

Scenario. In designing a communication chain, a plan starts from 123 local units of messages. Convert by 0.75 to standard units, then allow 12% process loss. Each batch handles 18 standard units. Up to 2 batches can run in parallel, each wave taking 5 minutes. Setup takes 8 minutes and a mandatory buffer adds 8 minutes. There are at most 10 batch slots. Cost is 70 fixed plus 1.61 per pre-loss standard unit. The deadline is 41 minutes and the budget is 214.09 units. The data are deliberately mixed rather than grouped by calculation.

Main question. Is the plan feasible, and what intermediate outputs should be computed so that each subproblem uses the fewest necessary facts? Best decomposition (10 subproblems).
