# 5.5.7 — Network Routes and Bottlenecks

Scenario. For planning an elevation-sensitive route, three routes can move the same route segments. Each route has three sequential links. A: times [15, 10, 18] min, capacities [52, 58, 35]; B: times [15, 13, 14] min, capacities [72, 61, 76]; C: times [12, 6, 9] min, capacities [51, 61, 98]. The required flow is 51 units and total route time must not exceed 37 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
