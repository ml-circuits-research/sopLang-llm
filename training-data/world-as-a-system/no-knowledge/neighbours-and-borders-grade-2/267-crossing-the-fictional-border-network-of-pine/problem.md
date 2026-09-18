# 267 — Crossing the fictional border network of Pine

Knowledge context. Political maps can be treated as adjacency networks. This lets us reason about border crossings without relying on memorized real-world geography.

Given facts. Countries are represented by the fictional states Pine, Elm, Juniper, Stone, Quartz, Yarrow. Shared borders: Pine–Elm, Elm–Juniper, Juniper–Stone, Pine–Quartz, Quartz–Yarrow, Yarrow–Stone.

Rules. Crossing one border corresponds to traversing one graph edge. A route may use only listed borders. A state is unavoidable only if every feasible route passes through it.

Task. What is the fewest number of border crossings needed to travel from Pine to Stone? Is Elm necessarily crossed?
