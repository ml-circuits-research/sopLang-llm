# 10.5.7 — Network Routes and Bottlenecks

Scenario. For launching a small manufacturing line, three routes can move the same production batches. Each route has three sequential links. A: times [14, 18, 17] min, capacities [69, 90, 88]; B: times [16, 13, 14] min, capacities [40, 41, 80]; C: times [18, 12, 9] min, capacities [86, 39, 51]. The required flow is 39 units and total route time must not exceed 39 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
