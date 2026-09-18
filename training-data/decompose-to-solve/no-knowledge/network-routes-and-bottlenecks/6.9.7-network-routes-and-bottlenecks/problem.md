# 6.9.7 — Network Routes and Bottlenecks

Scenario. For reconstructing the provenance of an artifact, three routes can move the same records. Each route has three sequential links. A: times [14, 18, 7] min, capacities [98, 50, 81]; B: times [13, 10, 18] min, capacities [63, 43, 79]; C: times [12, 8, 10] min, capacities [77, 88, 44]. The required flow is 44 units and total route time must not exceed 49 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
