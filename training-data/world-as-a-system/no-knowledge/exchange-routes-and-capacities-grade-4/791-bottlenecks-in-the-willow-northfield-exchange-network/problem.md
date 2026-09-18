# 791 — Bottlenecks in the Willow–Northfield exchange network

Knowledge context. Trade and transport networks have capacities. A single narrow connection can limit a much larger network.

Given facts. Goods move from Willow to Northfield along two branches: Willow→Iris capacity 7, Iris→Northfield capacity 6; Willow→Oak capacity 2, Oak→Northfield capacity 8. The final warehouse at Northfield can accept at most 10 units.

Rules. A branch cannot carry more than its smallest edge capacity. Independent branch capacities can be added, but a shared destination capacity can cap the total.

Task. What is the maximum number of units that can reach Northfield in one period? Identify the bottleneck(s).
