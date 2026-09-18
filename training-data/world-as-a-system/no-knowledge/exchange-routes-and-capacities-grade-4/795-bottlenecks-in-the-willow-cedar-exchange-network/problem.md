# 795 — Bottlenecks in the Willow–Cedar exchange network

Knowledge context. Trade and transport networks have capacities. A single narrow connection can limit a much larger network.

Given facts. Goods move from Willow to Cedar along two branches: Willow→Iris capacity 11, Iris→Cedar capacity 6; Willow→Meadow capacity 6, Meadow→Cedar capacity 8. The final warehouse at Cedar can accept at most 10 units.

Rules. A branch cannot carry more than its smallest edge capacity. Independent branch capacities can be added, but a shared destination capacity can cap the total.

Task. What is the maximum number of units that can reach Cedar in one period? Identify the bottleneck(s).
