# 467 — Multi-step synthesis

Problem world. In the model, air occupies space, water flows through open spaces, and soils differ in how quickly they allow water to pass. Soil with different particles and spaces may retain more or less water; this property is measured in the test rather than guessed. To compare two soils, we pour the same amount of water and wait the same amount of time.

Case data. Case D has the properties: the same amount of soil: YES; the same amount of water: YES; the same time of drainage: YES; the same container: YES. The eligibility rule requires the same amount of water, the same amount of soil, the same container, the same time of drainage. For the process, we have the following connected rules: we pour water onto the soil → water enters the spaces between particles; water enters the spaces between particles → a part is retained; a part is retained → the remainder drains away. The stated order is: we pour water onto the soil → water enters the spaces between particles → a part is retained → the remainder drains away.

Question. Solve at three levels: (1) is the case eligible? (2) starting from the first stage, what state do we reach after three links? (3) what is the immediate predecessor of the final stage?
