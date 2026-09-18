# 793 — Bottlenecks in the Cedar–Oak exchange network

Knowledge context. Trade and transport networks have capacities. A single narrow connection can limit a much larger network.

Given facts. Goods move from Cedar to Oak along two branches: Cedar→Stone capacity 9, Stone→Oak capacity 6; Cedar→Meadow capacity 4, Meadow→Oak capacity 8. The final warehouse at Oak can accept at most 10 units.

Rules. A branch cannot carry more than its smallest edge capacity. Independent branch capacities can be added, but a shared destination capacity can cap the total.

Task. What is the maximum number of units that can reach Oak in one period? Identify the bottleneck(s).
