# 5.2.7 — Network Routes and Bottlenecks

Scenario. For reasoning about a river catchment, three routes can move the same catchment observations. Each route has three sequential links. A: times [6, 7, 9] min, capacities [49, 73, 62]; B: times [18, 6, 6] min, capacities [66, 77, 88]; C: times [13, 11, 13] min, capacities [84, 77, 41]. The required flow is 43 units and total route time must not exceed 47 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
