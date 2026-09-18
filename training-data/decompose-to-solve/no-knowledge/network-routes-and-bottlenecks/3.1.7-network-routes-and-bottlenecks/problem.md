# 3.1.7 — Network Routes and Bottlenecks

Scenario. For estimating household electricity use, three routes can move the same energy-consuming devices. Each route has three sequential links. A: times [18, 7, 18] min, capacities [96, 54, 81]; B: times [9, 8, 14] min, capacities [59, 61, 92]; C: times [11, 8, 12] min, capacities [49, 37, 53]. The required flow is 59 units and total route time must not exceed 45 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
