# 5.9.7 — Network Routes and Bottlenecks

Scenario. For interpreting a basic hazard scenario, three routes can move the same hazard observations. Each route has three sequential links. A: times [8, 11, 9] min, capacities [95, 100, 93]; B: times [7, 8, 9] min, capacities [88, 80, 88]; C: times [7, 16, 15] min, capacities [38, 65, 78]. The required flow is 57 units and total route time must not exceed 37 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
