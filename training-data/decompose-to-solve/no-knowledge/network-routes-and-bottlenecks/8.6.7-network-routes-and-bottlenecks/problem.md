# 8.6.7 — Network Routes and Bottlenecks

Scenario. For designing a data-collection workflow, three routes can move the same data fields. Each route has three sequential links. A: times [15, 11, 10] min, capacities [82, 88, 37]; B: times [14, 13, 14] min, capacities [96, 89, 47]; C: times [12, 17, 18] min, capacities [84, 80, 81]. The required flow is 69 units and total route time must not exceed 54 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
