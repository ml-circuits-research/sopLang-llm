# 5.3.7 — Network Routes and Bottlenecks

Scenario. For interpreting seasonal climate information, three routes can move the same climate observations. Each route has three sequential links. A: times [10, 17, 11] min, capacities [61, 87, 82]; B: times [8, 10, 17] min, capacities [82, 63, 98]; C: times [13, 18, 13] min, capacities [86, 90, 92]. The required flow is 71 units and total route time must not exceed 49 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
