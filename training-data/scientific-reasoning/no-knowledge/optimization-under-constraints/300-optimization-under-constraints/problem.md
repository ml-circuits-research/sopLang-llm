# 300 — Optimization under constraints

Problem world. Choosing a material depends on the properties required by the object, such as waterproofness, flexibility, transparency, or thermal insulation. No material is “the best” in every situation; it is suitable if it meets the requirements of its use at the same time. In this problem, the properties are stated explicitly and do not need to be guessed from everyday experience.

Case data. The target is to obtain all of the following conditions: waterproof, thermal insulation. The forbidden effects are: transparency lost. The options are: adding a waterproof layer: cost 2, effects [waterproof], undesired effects [none]. Adding an insulating layer: cost 2, effects [thermal insulation], undesired effects [none]. using a transparent sheet: cost 1, effects [transparent], undesired effects [none]. opaque paint: cost 1, effects [protects surface], undesired effects [transparency lost].

Question. Choose the combination with the minimum total cost that reaches the target without a forbidden effect. Show why a cheaper solution does not work.
