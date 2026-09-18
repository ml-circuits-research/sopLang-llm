# 7.4.7 — Network Routes and Bottlenecks

Scenario. For reading and checking a quantitative chart, three routes can move the same data points. Each route has three sequential links. A: times [15, 18, 8] min, capacities [45, 49, 99]; B: times [13, 11, 7] min, capacities [81, 56, 65]; C: times [14, 12, 6] min, capacities [64, 65, 95]. The required flow is 48 units and total route time must not exceed 55 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
