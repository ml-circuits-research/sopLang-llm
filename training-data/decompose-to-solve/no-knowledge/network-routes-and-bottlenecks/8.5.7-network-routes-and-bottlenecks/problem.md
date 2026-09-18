# 8.5.7 — Network Routes and Bottlenecks

Scenario. For moving data through several file formats, three routes can move the same records. Each route has three sequential links. A: times [7, 11, 13] min, capacities [65, 62, 94]; B: times [9, 10, 13] min, capacities [53, 57, 77]; C: times [11, 14, 17] min, capacities [47, 72, 56]. The required flow is 62 units and total route time must not exceed 48 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
