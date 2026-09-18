# 6.4.7 — Network Routes and Bottlenecks

Scenario. For analyzing a simplified representation system, three routes can move the same votes or seats. Each route has three sequential links. A: times [12, 10, 18] min, capacities [83, 74, 98]; B: times [11, 9, 12] min, capacities [58, 42, 67]; C: times [13, 7, 17] min, capacities [58, 59, 77]. The required flow is 73 units and total route time must not exceed 44 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
