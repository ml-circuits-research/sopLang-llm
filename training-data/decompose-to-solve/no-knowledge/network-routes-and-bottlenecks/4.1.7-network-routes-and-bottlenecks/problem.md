# 4.1.7 — Network Routes and Bottlenecks

Scenario. For analyzing a simple motion or load case, three routes can move the same measurements. Each route has three sequential links. A: times [10, 16, 18] min, capacities [44, 66, 50]; B: times [18, 11, 13] min, capacities [79, 74, 68]; C: times [15, 16, 10] min, capacities [35, 59, 81]. The required flow is 35 units and total route time must not exceed 51 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
