# 2.1.7 — Network Routes and Bottlenecks

Scenario. For planning a multi-leg rail or air journey, three routes can move the same connections. Each route has three sequential links. A: times [16, 18, 14] min, capacities [86, 67, 51]; B: times [13, 10, 15] min, capacities [98, 39, 98]; C: times [6, 9, 15] min, capacities [39, 65, 73]. The required flow is 39 units and total route time must not exceed 50 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
