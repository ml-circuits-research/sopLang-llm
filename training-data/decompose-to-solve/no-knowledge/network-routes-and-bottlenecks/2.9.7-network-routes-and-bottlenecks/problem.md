# 2.9.7 — Network Routes and Bottlenecks

Scenario. For coordinating procurement and delivery, three routes can move the same shipments. Each route has three sequential links. A: times [13, 7, 15] min, capacities [84, 40, 72]; B: times [13, 8, 17] min, capacities [93, 44, 78]; C: times [9, 17, 9] min, capacities [93, 45, 63]. The required flow is 40 units and total route time must not exceed 38 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
