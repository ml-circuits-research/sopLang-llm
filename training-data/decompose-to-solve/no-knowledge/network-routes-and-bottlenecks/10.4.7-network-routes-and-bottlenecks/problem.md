# 10.4.7 — Network Routes and Bottlenecks

Scenario. For planning a fictional training exercise in relief distribution, three routes can move the same relief deliveries. Each route has three sequential links. A: times [18, 11, 8] min, capacities [66, 39, 74]; B: times [10, 13, 11] min, capacities [59, 60, 77]; C: times [7, 16, 14] min, capacities [44, 45, 98]. The required flow is 59 units and total route time must not exceed 54 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
