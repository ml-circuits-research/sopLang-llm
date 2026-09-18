# 5.7.7 — Network Routes and Bottlenecks

Scenario. For allocating land among competing uses, three routes can move the same land parcels. Each route has three sequential links. A: times [14, 9, 8] min, capacities [61, 93, 56]; B: times [9, 18, 14] min, capacities [79, 73, 43]; C: times [15, 7, 18] min, capacities [90, 43, 95]. The required flow is 43 units and total route time must not exceed 48 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
