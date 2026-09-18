# 519 — Crossing the fictional border network of Zephyr

Knowledge context. Political maps can be treated as adjacency networks. This lets us reason about border crossings without relying on memorized real-world geography.

Given facts. Countries are represented by the fictional states Zephyr, Birch, Fern, Oak, Linden, Harbor. Shared borders: Zephyr–Birch, Birch–Fern, Fern–Oak, Zephyr–Linden, Linden–Harbor, Harbor–Oak.

Rules. Crossing one border corresponds to traversing one graph edge. A route may use only listed borders. A state is unavoidable only if every feasible route passes through it.

Task. What is the fewest number of border crossings needed to travel from Zephyr to Oak? Is Birch necessarily crossed?
