# 304 — Propagation of effects through a network

Problem world. Our model mixture contains iron filings, pebbles, sand, and salt dissolved in water. A magnet attracts the iron filings; a sieve separates larger particles from smaller ones; filtration can retain sand while water passes through; evaporating the water can leave the salt behind. A method must be chosen according to the property that differs between the components.

Case data. The network of dependencies has the arrows: magnet applied → separated iron; sieving → pebbles separate; filtration → sand separately; evaporation → salt recovered. We change “magnet applied”.

Question. Mark every node the effect can reach, directly or indirectly. Do not include nodes for which no arrow path exists.
