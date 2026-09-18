# 8.7.7 — Network Routes and Bottlenecks

Scenario. For assigning permissions in a small organization, three routes can move the same permissions. Each route has three sequential links. A: times [10, 12, 15] min, capacities [98, 73, 97]; B: times [10, 10, 7] min, capacities [92, 47, 54]; C: times [14, 15, 11] min, capacities [68, 88, 59]. The required flow is 73 units and total route time must not exceed 53 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
