# 8.3.7 — Network Routes and Bottlenecks

Scenario. For planning backup and recovery, three routes can move the same data sets. Each route has three sequential links. A: times [14, 13, 8] min, capacities [75, 49, 49]; B: times [16, 9, 11] min, capacities [98, 67, 60]; C: times [18, 11, 13] min, capacities [97, 51, 45]. The required flow is 50 units and total route time must not exceed 40 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
