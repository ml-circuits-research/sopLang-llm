# 543 — Bottlenecks in the Stone–Cedar exchange network

Knowledge context. Trade and transport networks have capacities. A single narrow connection can limit a much larger network.

Given facts. Goods move from Stone to Cedar along two branches: Stone→Willow capacity 8, Willow→Cedar capacity 5; Stone→Juniper capacity 4, Juniper→Cedar capacity 7. The final warehouse at Cedar can accept at most 9 units.

Rules. A branch cannot carry more than its smallest edge capacity. Independent branch capacities can be added, but a shared destination capacity can cap the total.

Task. What is the maximum number of units that can reach Cedar in one period? Identify the bottleneck(s).
