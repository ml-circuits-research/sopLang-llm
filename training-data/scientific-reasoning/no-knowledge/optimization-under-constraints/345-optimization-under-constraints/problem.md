# 345 — Optimization under constraints

Problem world. In the model, air occupies space, water flows through open spaces, and soils differ in how quickly they allow water to pass. Soil with different particles and spaces may retain more or less water; this property is measured in the test rather than guessed. To compare two soils, we pour the same amount of water and wait the same amount of time.

Case data. The target is to obtain all of the following conditions: comparison fair, more spaces free. The forbidden effects are: spaces reduced. The options are: loosening of the soil: cost 1, effects [more spaces free], undesired effects [none]. Adding of a layer permeable: cost 2, effects [drainage improved], undesired effects [none]. Measurement identical: cost 1, effects [comparison fair], undesired effects [none]. Compaction strong: cost 1, effects [surface smooth], undesired effects [spaces reduced].

Question. Choose the combination with the minimum total cost that reaches the target without a forbidden effect. Show why a cheaper solution does not work.
