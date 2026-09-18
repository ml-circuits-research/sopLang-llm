# 2.7.7 — Network Routes and Bottlenecks

Scenario. For building a defensible historical timeline, three routes can move the same dated records. Each route has three sequential links. A: times [18, 8, 12] min, capacities [72, 90, 37]; B: times [17, 15, 16] min, capacities [80, 60, 71]; C: times [17, 14, 15] min, capacities [61, 66, 80]. The required flow is 37 units and total route time must not exceed 42 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
