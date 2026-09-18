# 516 — Crossing the fictional border network of Elm

Knowledge context. Political maps can be treated as adjacency networks. This lets us reason about border crossings without relying on memorized real-world geography.

Given facts. Countries are represented by the fictional states Elm, Kite, Willow, Stone, Oak, Fern. Shared borders: Elm–Kite, Kite–Willow, Willow–Stone, Elm–Oak, Oak–Fern, Fern–Stone.

Rules. Crossing one border corresponds to traversing one graph edge. A route may use only listed borders. A state is unavoidable only if every feasible route passes through it.

Task. What is the fewest number of border crossings needed to travel from Elm to Stone? Is Kite necessarily crossed?
