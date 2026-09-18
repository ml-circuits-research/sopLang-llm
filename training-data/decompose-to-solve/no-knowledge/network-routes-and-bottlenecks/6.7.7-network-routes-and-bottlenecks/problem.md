# 6.7.7 — Network Routes and Bottlenecks

Scenario. For curating objects from different artistic periods, three routes can move the same artworks. Each route has three sequential links. A: times [13, 6, 7] min, capacities [61, 88, 63]; B: times [8, 7, 18] min, capacities [74, 61, 90]; C: times [16, 14, 18] min, capacities [82, 76, 47]. The required flow is 54 units and total route time must not exceed 36 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
