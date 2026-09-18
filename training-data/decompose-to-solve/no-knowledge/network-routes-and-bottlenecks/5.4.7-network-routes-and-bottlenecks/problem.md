# 5.4.7 — Network Routes and Bottlenecks

Scenario. For planning communication across time zones, three routes can move the same time-zone events. Each route has three sequential links. A: times [12, 9, 10] min, capacities [44, 53, 35]; B: times [16, 10, 9] min, capacities [42, 87, 36]; C: times [9, 14, 17] min, capacities [67, 76, 82]. The required flow is 67 units and total route time must not exceed 47 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
