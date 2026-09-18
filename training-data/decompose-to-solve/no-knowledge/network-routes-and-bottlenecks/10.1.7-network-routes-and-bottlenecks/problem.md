# 10.1.7 — Network Routes and Bottlenecks

Scenario. For planning a city festival with transport, energy, waste, and scheduling constraints, three routes can move the same festival operations. Each route has three sequential links. A: times [16, 9, 11] min, capacities [53, 48, 61]; B: times [14, 11, 11] min, capacities [85, 86, 35]; C: times [18, 12, 17] min, capacities [38, 59, 41]. The required flow is 48 units and total route time must not exceed 49 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
