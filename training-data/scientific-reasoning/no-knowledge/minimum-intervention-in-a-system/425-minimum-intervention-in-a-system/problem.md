# 425 — Minimum intervention in a system

Problem world. Choosing a material depends on the properties required by the object, such as waterproofness, flexibility, transparency, or thermal insulation. No material is “the best” in every situation; it is suitable if it meets the requirements of its use at the same time. In this problem, the properties are stated explicitly and do not need to be guessed from everyday experience.

Case data. The system should be modified as little as possible. The targets are: waterproof, thermal insulation; forbidden effects: transparency lost. Available interventions: adding a waterproof layer: cost 2, effects [waterproof], undesired effects [none]. Adding an insulating layer: cost 2, effects [thermal insulation], undesired effects [none]. using a transparent sheet: cost 1, effects [transparent], undesired effects [none]. opaque paint: cost 1, effects [protects surface], undesired effects [transparency lost].

Question. Find the minimum intervention: first minimize total cost, then, when costs are tied, minimize the number of actions. Prove minimality, not just feasibility.
