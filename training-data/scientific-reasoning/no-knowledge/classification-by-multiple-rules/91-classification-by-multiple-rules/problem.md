# 91 — Classification by multiple rules

Problem world. In the model, air occupies space, water flows through open spaces, and soils differ in how quickly they allow water to pass. Soil with different particles and spaces may retain more or less water; this property is measured in the test rather than guessed. To compare two soils, we pour the same amount of water and wait the same amount of time.

Case data. Case A: the same amount of soil: YES; the same amount of water: YES; the same time of drainage: YES; the same container: NO. Case B: the same amount of soil: YES; the same amount of water: NO; the same time of drainage: YES; the same container: YES. Case C: the same amount of soil: NO; the same amount of water: YES; the same time of drainage: YES; the same container: YES. Case D: the same amount of soil: YES; the same amount of water: YES; the same time of drainage: YES; the same container: YES.

Question. The competition rule says that only the case meeting ALL requirements is accepted: the same amount of water, the same amount of soil, the same container, the same time of drainage; and the forbidden properties are: no additional forbidden property. Which case is accepted? It is not enough to find a case that meets only some of the conditions.
