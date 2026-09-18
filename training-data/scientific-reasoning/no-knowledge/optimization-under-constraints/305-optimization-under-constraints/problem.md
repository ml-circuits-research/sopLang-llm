# 305 — Optimization under constraints

Problem world. Our model mixture contains iron filings, pebbles, sand, and salt dissolved in water. A magnet attracts the iron filings; a sieve separates larger particles from smaller ones; filtration can retain sand while water passes through; evaporating the water can leave the salt behind. A method must be chosen according to the property that differs between the components.

Case data. The target is to obtain all of the following conditions: separated iron, sand separately. The forbidden effects are: separation delayed. The options are: magnet: cost 1, effects [separated iron], undesired effects [none]. Filter: cost 1, effects [sand separately], undesired effects [none]. Evaporation: cost 2, effects [salt recovered], undesired effects [none]. Mixing strong: cost 1, effects [dispersal uniform], undesired effects [separation delayed].

Question. Choose the combination with the minimum total cost that reaches the target without a forbidden effect. Show why a cheaper solution does not work.
