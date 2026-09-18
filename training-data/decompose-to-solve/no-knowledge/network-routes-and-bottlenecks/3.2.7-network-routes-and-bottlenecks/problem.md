# 3.2.7 — Network Routes and Bottlenecks

Scenario. For planning water use and storage, three routes can move the same litres of water. Each route has three sequential links. A: times [14, 7, 8] min, capacities [96, 96, 66]; B: times [8, 10, 17] min, capacities [64, 41, 42]; C: times [12, 8, 7] min, capacities [72, 98, 59]. The required flow is 52 units and total route time must not exceed 37 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
