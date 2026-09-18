# 3.8.7 — Network Routes and Bottlenecks

Scenario. For planning a print run, three routes can move the same printed copies. Each route has three sequential links. A: times [18, 11, 11] min, capacities [65, 47, 81]; B: times [11, 16, 8] min, capacities [39, 36, 86]; C: times [15, 10, 9] min, capacities [73, 94, 90]. The required flow is 73 units and total route time must not exceed 54 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
