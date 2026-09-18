# 7.2.9 — Ten-Part Integrated Decomposition

Scenario. In evaluating a causal claim from observational data, a plan starts from 70 local units of observations. Convert by 0.75 to standard units, then allow 12% process loss. Each batch handles 29 standard units. Up to 2 batches can run in parallel, each wave taking 6 minutes. Setup takes 8 minutes and a mandatory buffer adds 5 minutes. There are at most 7 batch slots. Cost is 79 fixed plus 1.00 per pre-loss standard unit. The deadline is 35 minutes and the budget is 113.65 units. The data are deliberately mixed rather than grouped by calculation.

Main question. Is the plan feasible, and what intermediate outputs should be computed so that each subproblem uses the fewest necessary facts? Best decomposition (10 subproblems).
