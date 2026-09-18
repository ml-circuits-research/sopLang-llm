# 5.8.7 — Network Routes and Bottlenecks

Scenario. For comparing urban travel modes, three routes can move the same urban trips. Each route has three sequential links. A: times [18, 12, 10] min, capacities [46, 99, 81]; B: times [13, 10, 17] min, capacities [54, 97, 70]; C: times [10, 12, 13] min, capacities [68, 96, 50]. The required flow is 50 units and total route time must not exceed 52 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
