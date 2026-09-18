# 766 — Crossing the fictional border network of Quartz

Knowledge context. Political maps can be treated as adjacency networks. This lets us reason about border crossings without relying on memorized real-world geography.

Given facts. Countries are represented by the fictional states Quartz, Grove, Harbor, Juniper, Fern, Linden. Shared borders: Quartz–Grove, Grove–Harbor, Harbor–Juniper, Quartz–Fern, Fern–Linden, Linden–Juniper.

Rules. Crossing one border corresponds to traversing one graph edge. A route may use only listed borders. A state is unavoidable only if every feasible route passes through it.

Task. What is the fewest number of border crossings needed to travel from Quartz to Juniper? Is Grove necessarily crossed?
