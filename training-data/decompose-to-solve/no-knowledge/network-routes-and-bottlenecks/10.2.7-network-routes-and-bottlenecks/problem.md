# 10.2.7 — Network Routes and Bottlenecks

Scenario. For planning a museum expansion and collection move, three routes can move the same museum work packages. Each route has three sequential links. A: times [9, 15, 12] min, capacities [84, 35, 58]; B: times [15, 15, 14] min, capacities [81, 93, 36]; C: times [6, 12, 18] min, capacities [39, 41, 64]. The required flow is 35 units and total route time must not exceed 42 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
