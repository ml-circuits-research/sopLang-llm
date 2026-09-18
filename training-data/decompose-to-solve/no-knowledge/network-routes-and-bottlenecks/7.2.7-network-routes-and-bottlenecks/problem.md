# 7.2.7 — Network Routes and Bottlenecks

Scenario. For evaluating a causal claim from observational data, three routes can move the same observations. Each route has three sequential links. A: times [15, 14, 11] min, capacities [49, 56, 75]; B: times [6, 12, 9] min, capacities [78, 76, 55]; C: times [8, 12, 6] min, capacities [52, 86, 60]. The required flow is 52 units and total route time must not exceed 46 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
