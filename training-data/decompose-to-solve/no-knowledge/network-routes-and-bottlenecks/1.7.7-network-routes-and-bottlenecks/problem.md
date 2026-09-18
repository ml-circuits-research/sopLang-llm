# 1.7.7 — Network Routes and Bottlenecks

Scenario. For following a multi-step administrative procedure, three routes can move the same documents. Each route has three sequential links. A: times [14, 14, 6] min, capacities [71, 62, 77]; B: times [9, 15, 14] min, capacities [76, 47, 69]; C: times [13, 14, 11] min, capacities [62, 96, 47]. The required flow is 48 units and total route time must not exceed 45 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
