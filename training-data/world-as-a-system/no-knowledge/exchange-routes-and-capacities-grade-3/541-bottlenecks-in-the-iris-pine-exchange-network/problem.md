# 541 — Bottlenecks in the Iris–Pine exchange network

Knowledge context. Trade and transport networks have capacities. A single narrow connection can limit a much larger network.

Given facts. Goods move from Iris to Pine along two branches: Iris→Kite capacity 6, Kite→Pine capacity 5; Iris→Birch capacity 2, Birch→Pine capacity 7. The final warehouse at Pine can accept at most 9 units.

Rules. A branch cannot carry more than its smallest edge capacity. Independent branch capacities can be added, but a shared destination capacity can cap the total.

Task. What is the maximum number of units that can reach Pine in one period? Identify the bottleneck(s).
