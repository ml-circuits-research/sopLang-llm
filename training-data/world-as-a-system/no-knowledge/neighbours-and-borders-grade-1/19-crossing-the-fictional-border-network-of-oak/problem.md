# 19 — Crossing the fictional border network of Oak

Knowledge context. Political maps can be treated as adjacency networks. This lets us reason about border crossings without relying on memorized real-world geography.

Given facts. Countries are represented by the fictional states Oak, Juniper, Yarrow, Elm, Grove, Northfield. Shared borders: Oak–Juniper, Juniper–Yarrow, Yarrow–Elm, Oak–Grove, Grove–Northfield, Northfield–Elm.

Rules. Crossing one border corresponds to traversing one graph edge. A route may use only listed borders. A state is unavoidable only if every feasible route passes through it.

Task. What is the fewest number of border crossings needed to travel from Oak to Elm? Is Juniper necessarily crossed?
