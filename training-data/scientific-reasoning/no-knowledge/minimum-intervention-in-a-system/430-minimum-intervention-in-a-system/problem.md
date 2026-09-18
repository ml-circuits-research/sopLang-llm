# 430 — Minimum intervention in a system

Problem world. Our model mixture contains iron filings, pebbles, sand, and salt dissolved in water. A magnet attracts the iron filings; a sieve separates larger particles from smaller ones; filtration can retain sand while water passes through; evaporating the water can leave the salt behind. A method must be chosen according to the property that differs between the components.

Case data. The system should be modified as little as possible. The targets are: separated iron, sand separately; forbidden effects: separation delayed. Available interventions: magnet: cost 1, effects [separated iron], undesired effects [none]. Filter: cost 1, effects [sand separately], undesired effects [none]. Evaporation: cost 2, effects [salt recovered], undesired effects [none]. Mixing strong: cost 1, effects [dispersal uniform], undesired effects [separation delayed].

Question. Find the minimum intervention: first minimize total cost, then, when costs are tied, minimize the number of actions. Prove minimality, not just feasibility.
