# 3.3.7 — Network Routes and Bottlenecks

Scenario. For estimating travel fuel or energy needs, three routes can move the same journey kilometres. Each route has three sequential links. A: times [6, 7, 9] min, capacities [78, 58, 85]; B: times [9, 10, 7] min, capacities [75, 61, 60]; C: times [17, 15, 9] min, capacities [61, 100, 47]. The required flow is 50 units and total route time must not exceed 38 minutes. A route's flow capacity is limited by its narrowest link, not by the sum of link capacities.

Main question. Which route is feasible and fastest? Best decomposition (7 subproblems).
