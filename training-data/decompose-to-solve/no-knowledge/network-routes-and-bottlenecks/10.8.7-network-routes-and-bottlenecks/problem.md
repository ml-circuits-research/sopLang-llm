# 10.8.7 — Network Routes and Bottlenecks

Scenario. For planning a civic open-data release, three routes can move the same data sets. Each route has three sequential links. A: times [9, 6, 15] min, capacities [79, 81, 38]; B: times [12, 13, 12] min, capacities [60, 37, 63]; C: times [7, 18, 10] min, capacities [90, 61, 91]. The required flow is 38 units and total route time must not exceed 46 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
