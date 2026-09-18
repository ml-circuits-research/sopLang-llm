# 1.8.7 — Network Routes and Bottlenecks

Scenario. For packing for a trip under weight and volume limits, three routes can move the same packed items. Each route has three sequential links. A: times [11, 6, 16] min, capacities [70, 56, 91]; B: times [12, 11, 11] min, capacities [60, 51, 50]; C: times [6, 15, 17] min, capacities [100, 73, 45]. The required flow is 50 units and total route time must not exceed 48 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
