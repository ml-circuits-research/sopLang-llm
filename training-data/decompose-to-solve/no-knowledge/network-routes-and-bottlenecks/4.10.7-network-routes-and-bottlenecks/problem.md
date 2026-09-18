# 4.10.7 — Network Routes and Bottlenecks

Scenario. For combining repeated measurements, three routes can move the same measurements. Each route has three sequential links. A: times [12, 12, 13] min, capacities [55, 78, 62]; B: times [6, 9, 16] min, capacities [88, 70, 51]; C: times [17, 18, 7] min, capacities [91, 56, 67]. The required flow is 51 units and total route time must not exceed 42 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
