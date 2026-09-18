# 1.9.7 — Network Routes and Bottlenecks

Scenario. For managing a queue with limited service capacity, three routes can move the same customers. Each route has three sequential links. A: times [8, 13, 8] min, capacities [77, 50, 45]; B: times [10, 16, 11] min, capacities [76, 84, 84]; C: times [14, 16, 12] min, capacities [45, 81, 95]. The required flow is 47 units and total route time must not exceed 50 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
