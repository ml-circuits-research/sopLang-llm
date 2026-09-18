# 8.4.7 — Network Routes and Bottlenecks

Scenario. For resolving software dependency constraints, three routes can move the same packages. Each route has three sequential links. A: times [9, 14, 14] min, capacities [87, 76, 35]; B: times [14, 8, 17] min, capacities [40, 82, 35]; C: times [13, 14, 12] min, capacities [53, 55, 55]. The required flow is 35 units and total route time must not exceed 37 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
