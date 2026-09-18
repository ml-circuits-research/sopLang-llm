# 254 — Propagation of effects through a network

Problem world. For the imaginary bean species F in this problem, a seed begins germination only if it has water, air, and a suitable temperature. Light is not required for the first step of germination, but it becomes important after the green shoot appears. In our model, if any required condition is missing, germination stops at that point.

Case data. The network of dependencies has the arrows: water available → the seed becomes hydrated; the seed becomes hydrated → the processes of germination start; the processes of germination start → the young root emerges; the young root emerges → can appear the shoot. We change “water available”.

Question. Mark every node the effect can reach, directly or indirectly. Do not include nodes for which no arrow path exists.
