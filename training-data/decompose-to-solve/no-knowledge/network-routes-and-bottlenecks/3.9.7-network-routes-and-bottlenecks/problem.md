# 3.9.7 — Network Routes and Bottlenecks

Scenario. For planning a non-medical sports training schedule, three routes can move the same training intervals. Each route has three sequential links. A: times [17, 9, 11] min, capacities [47, 80, 64]; B: times [12, 9, 8] min, capacities [52, 36, 43]; C: times [16, 13, 17] min, capacities [49, 43, 69]. The required flow is 36 units and total route time must not exceed 37 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
