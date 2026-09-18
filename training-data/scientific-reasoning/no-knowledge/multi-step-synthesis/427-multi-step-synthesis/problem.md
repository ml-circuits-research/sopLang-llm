# 427 — Multi-step synthesis

Problem world. Our model mixture contains iron filings, pebbles, sand, and salt dissolved in water. A magnet attracts the iron filings; a sieve separates larger particles from smaller ones; filtration can retain sand while water passes through; evaporating the water can leave the salt behind. A method must be chosen according to the property that differs between the components.

Case data. Case iron has the properties: the component is attracted by a magnet: YES; is greater than the mesh of the sieve: NO; does not pass through the filter: YES; remains after evaporation of the water: YES. The eligibility rule requires the component is attracted by a magnet, does not pass through the filter, remains after evaporation of the water. For the process, we have the following connected rules: we use the magnet → we use the sieve; we use the sieve → we filter the liquid; we filter the liquid → we evaporate the water. The stated order is: we use the magnet → we use the sieve → we filter the liquid → we evaporate the water.

Question. Solve at three levels: (1) is the case eligible? (2) starting from the first stage, what state do we reach after three links? (3) what is the immediate predecessor of the final stage?
