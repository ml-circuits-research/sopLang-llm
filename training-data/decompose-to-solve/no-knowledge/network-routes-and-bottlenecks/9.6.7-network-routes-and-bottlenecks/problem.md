# 9.6.7 — Network Routes and Bottlenecks

Scenario. For planning a learning sequence, three routes can move the same learning units. Each route has three sequential links. A: times [11, 9, 17] min, capacities [77, 48, 76]; B: times [13, 13, 6] min, capacities [100, 39, 48]; C: times [18, 14, 7] min, capacities [61, 39, 94]. The required flow is 39 units and total route time must not exceed 54 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
