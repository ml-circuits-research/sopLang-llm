# 2.8.7 — Network Routes and Bottlenecks

Scenario. For scheduling sessions and shared rooms, three routes can move the same sessions. Each route has three sequential links. A: times [8, 10, 7] min, capacities [62, 90, 84]; B: times [10, 9, 11] min, capacities [67, 64, 38]; C: times [11, 7, 6] min, capacities [90, 76, 68]. The required flow is 59 units and total route time must not exceed 46 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
