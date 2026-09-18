# 2.6.7 — Network Routes and Bottlenecks

Scenario. For preparing a software release, three routes can move the same release steps. Each route has three sequential links. A: times [13, 9, 18] min, capacities [62, 38, 80]; B: times [16, 14, 12] min, capacities [66, 55, 90]; C: times [16, 16, 9] min, capacities [97, 73, 45]. The required flow is 38 units and total route time must not exceed 40 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
