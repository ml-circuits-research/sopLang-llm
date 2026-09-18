# 364 — Propagation of effects through a network

Problem world. In the model, a pollutant introduced into a stream can be transported downstream. Reducing pollution at its source stops part of the problem before it spreads. Cleanup downstream can help locally, but it does not necessarily replace stopping the source. A good decision compares desired effects, costs, and side effects using the given data.

Case data. The network of dependencies has the arrows: pollutant at source → pollutant in water; flow downstream → pollutant transported; pollutant transported → exposure downstream; the source reduced → loading new smaller. We change “pollutant at source”.

Question. Mark every node the effect can reach, directly or indirectly. Do not include nodes for which no arrow path exists.
