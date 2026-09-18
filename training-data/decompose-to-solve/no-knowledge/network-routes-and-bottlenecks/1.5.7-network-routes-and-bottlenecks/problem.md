# 1.5.7 — Network Routes and Bottlenecks

Scenario. For choosing between service plans with different constraints, three routes can move the same service units. Each route has three sequential links. A: times [17, 8, 18] min, capacities [52, 81, 62]; B: times [9, 9, 10] min, capacities [93, 64, 81]; C: times [18, 13, 8] min, capacities [90, 45, 92]. The required flow is 49 units and total route time must not exceed 41 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
