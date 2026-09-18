# 470 — Minimum intervention in a system

Problem world. In the model, air occupies space, water flows through open spaces, and soils differ in how quickly they allow water to pass. Soil with different particles and spaces may retain more or less water; this property is measured in the test rather than guessed. To compare two soils, we pour the same amount of water and wait the same amount of time.

Case data. The system should be modified as little as possible. The targets are: comparison fair, more spaces free; forbidden effects: spaces reduced. Available interventions: loosening of the soil: cost 1, effects [more spaces free], undesired effects [none]. Adding of a layer permeable: cost 2, effects [drainage improved], undesired effects [none]. Measurement identical: cost 1, effects [comparison fair], undesired effects [none]. Compaction strong: cost 1, effects [surface smooth], undesired effects [spaces reduced].

Question. Find the minimum intervention: first minimize total cost, then, when costs are tied, minimize the number of actions. Prove minimality, not just feasibility.
