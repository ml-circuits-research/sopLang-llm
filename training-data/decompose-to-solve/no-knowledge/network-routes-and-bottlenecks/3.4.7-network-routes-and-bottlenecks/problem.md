# 3.4.7 — Network Routes and Bottlenecks

Scenario. For scaling food portions and label quantities, three routes can move the same servings. Each route has three sequential links. A: times [12, 13, 14] min, capacities [97, 84, 53]; B: times [14, 8, 10] min, capacities [70, 47, 38]; C: times [10, 9, 13] min, capacities [89, 91, 99]. The required flow is 51 units and total route time must not exceed 38 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
