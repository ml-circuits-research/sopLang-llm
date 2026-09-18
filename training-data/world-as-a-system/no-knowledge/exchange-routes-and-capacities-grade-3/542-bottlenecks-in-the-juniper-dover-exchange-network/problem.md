# 542 — Bottlenecks in the Juniper–Dover exchange network

Knowledge context. Trade and transport networks have capacities. A single narrow connection can limit a much larger network.

Given facts. Goods move from Juniper to Dover along two branches: Juniper→Riverbend capacity 7, Riverbend→Dover capacity 5; Juniper→Linden capacity 3, Linden→Dover capacity 7. The final warehouse at Dover can accept at most 9 units.

Rules. A branch cannot carry more than its smallest edge capacity. Independent branch capacities can be added, but a shared destination capacity can cap the total.

Task. What is the maximum number of units that can reach Dover in one period? Identify the bottleneck(s).
