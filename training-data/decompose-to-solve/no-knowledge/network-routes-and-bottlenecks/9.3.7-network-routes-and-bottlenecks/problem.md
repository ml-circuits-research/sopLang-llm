# 9.3.7 — Network Routes and Bottlenecks

Scenario. For planning a small project, three routes can move the same project tasks. Each route has three sequential links. A: times [13, 6, 17] min, capacities [62, 43, 48]; B: times [12, 7, 7] min, capacities [79, 95, 98]; C: times [14, 17, 7] min, capacities [73, 89, 51]. The required flow is 62 units and total route time must not exceed 55 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
