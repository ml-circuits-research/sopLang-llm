# 3.5.7 — Network Routes and Bottlenecks

Scenario. For comparing a constrained household budget, three routes can move the same budget items. Each route has three sequential links. A: times [15, 7, 7] min, capacities [55, 43, 75]; B: times [17, 9, 12] min, capacities [71, 43, 56]; C: times [11, 13, 10] min, capacities [39, 70, 67]. The required flow is 43 units and total route time must not exceed 38 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
