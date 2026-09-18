# 3.6.7 — Network Routes and Bottlenecks

Scenario. For managing a small inventory, three routes can move the same stock units. Each route has three sequential links. A: times [13, 7, 18] min, capacities [98, 39, 47]; B: times [16, 14, 15] min, capacities [97, 37, 67]; C: times [9, 9, 12] min, capacities [83, 56, 36]. The required flow is 36 units and total route time must not exceed 48 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
