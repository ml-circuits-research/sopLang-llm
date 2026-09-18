# 9.4.7 — Network Routes and Bottlenecks

Scenario. For comparing suppliers and delivery options, three routes can move the same orders. Each route has three sequential links. A: times [7, 15, 15] min, capacities [47, 95, 87]; B: times [6, 18, 14] min, capacities [85, 51, 84]; C: times [10, 6, 6] min, capacities [86, 50, 75]. The required flow is 50 units and total route time must not exceed 40 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
