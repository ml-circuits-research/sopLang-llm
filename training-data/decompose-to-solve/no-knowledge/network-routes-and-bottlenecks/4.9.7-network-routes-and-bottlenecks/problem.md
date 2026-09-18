# 4.9.7 — Network Routes and Bottlenecks

Scenario. For checking a simple material or structural design, three routes can move the same structural elements. Each route has three sequential links. A: times [8, 7, 17] min, capacities [88, 49, 81]; B: times [18, 6, 18] min, capacities [95, 71, 79]; C: times [14, 6, 11] min, capacities [71, 37, 77]. The required flow is 37 units and total route time must not exceed 52 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
