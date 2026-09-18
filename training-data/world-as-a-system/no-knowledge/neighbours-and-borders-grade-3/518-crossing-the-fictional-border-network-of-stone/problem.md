# 518 — Crossing the fictional border network of Stone

Knowledge context. Political maps can be treated as adjacency networks. This lets us reason about border crossings without relying on memorized real-world geography.

Given facts. Countries are represented by the fictional states Stone, Kite, Willow, Birch, Cedar, Riverbend. Shared borders: Stone–Kite, Kite–Willow, Willow–Birch, Stone–Cedar, Cedar–Riverbend, Riverbend–Birch.

Rules. Crossing one border corresponds to traversing one graph edge. A route may use only listed borders. A state is unavoidable only if every feasible route passes through it.

Task. What is the fewest number of border crossings needed to travel from Stone to Birch? Is Kite necessarily crossed?
