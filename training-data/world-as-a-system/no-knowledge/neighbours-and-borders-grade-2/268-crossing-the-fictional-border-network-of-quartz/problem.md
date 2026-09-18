# 268 — Crossing the fictional border network of Quartz

Knowledge context. Political maps can be treated as adjacency networks. This lets us reason about border crossings without relying on memorized real-world geography.

Given facts. Countries are represented by the fictional states Quartz, Grove, Fern, Zephyr, Elm, Juniper. Shared borders: Quartz–Grove, Grove–Fern, Fern–Zephyr, Quartz–Elm, Elm–Juniper, Juniper–Zephyr.

Rules. Crossing one border corresponds to traversing one graph edge. A route may use only listed borders. A state is unavoidable only if every feasible route passes through it.

Task. What is the fewest number of border crossings needed to travel from Quartz to Zephyr? Is Grove necessarily crossed?
