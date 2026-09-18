# 545 — Bottlenecks in the Northfield–Riverbend exchange network

Knowledge context. Trade and transport networks have capacities. A single narrow connection can limit a much larger network.

Given facts. Goods move from Northfield to Riverbend along two branches: Northfield→Linden capacity 10, Linden→Riverbend capacity 5; Northfield→Harbor capacity 6, Harbor→Riverbend capacity 7. The final warehouse at Riverbend can accept at most 9 units.

Rules. A branch cannot carry more than its smallest edge capacity. Independent branch capacities can be added, but a shared destination capacity can cap the total.

Task. What is the maximum number of units that can reach Riverbend in one period? Identify the bottleneck(s).
