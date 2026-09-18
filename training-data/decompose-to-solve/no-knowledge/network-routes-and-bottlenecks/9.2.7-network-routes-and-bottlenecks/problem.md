# 9.2.7 — Network Routes and Bottlenecks

Scenario. For designing a communication chain, three routes can move the same messages. Each route has three sequential links. A: times [17, 7, 8] min, capacities [69, 59, 49]; B: times [17, 13, 17] min, capacities [80, 60, 96]; C: times [9, 6, 12] min, capacities [95, 78, 69]. The required flow is 48 units and total route time must not exceed 54 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
