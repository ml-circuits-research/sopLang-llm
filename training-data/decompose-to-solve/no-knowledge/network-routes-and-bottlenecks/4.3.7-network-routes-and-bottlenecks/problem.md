# 4.3.7 — Network Routes and Bottlenecks

Scenario. For planning a low-voltage electrical load, three routes can move the same electrical loads. Each route has three sequential links. A: times [7, 9, 6] min, capacities [75, 54, 99]; B: times [8, 6, 12] min, capacities [48, 69, 75]; C: times [10, 9, 13] min, capacities [66, 77, 98]. The required flow is 47 units and total route time must not exceed 37 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
