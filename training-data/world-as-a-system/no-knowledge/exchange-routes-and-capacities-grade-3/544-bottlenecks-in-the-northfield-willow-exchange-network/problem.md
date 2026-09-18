# 544 — Bottlenecks in the Northfield–Willow exchange network

Knowledge context. Trade and transport networks have capacities. A single narrow connection can limit a much larger network.

Given facts. Goods move from Northfield to Willow along two branches: Northfield→Dover capacity 9, Dover→Willow capacity 5; Northfield→Meadow capacity 5, Meadow→Willow capacity 7. The final warehouse at Willow can accept at most 9 units.

Rules. A branch cannot carry more than its smallest edge capacity. Independent branch capacities can be added, but a shared destination capacity can cap the total.

Task. What is the maximum number of units that can reach Willow in one period? Identify the bottleneck(s).
