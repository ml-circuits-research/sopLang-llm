# 16 — Classification by multiple rules

Problem world. In this problem, a habitat provides resources such as water, food, shelter, and a tolerable temperature. An adaptation is a characteristic that helps an organism in a particular environment; the same characteristic is not equally useful in every environment. For animal Z in the model, good survival requires water, food, and shelter at the same time.

Case data. Case A: there is water: YES; there is food: YES; shelter is available: NO; temperature is tolerable: YES. Case B: there is water: YES; there is food: NO; shelter is available: YES; temperature is tolerable: YES. Case C: there is water: NO; there is food: YES; shelter is available: YES; temperature is tolerable: YES. Case D: there is water: YES; there is food: YES; shelter is available: YES; temperature is tolerable: YES.

Question. The competition rule says that only the case meeting ALL requirements is accepted: shelter is available, there is water, there is food, temperature is tolerable; and the forbidden properties are: no additional forbidden property. Which case is accepted? It is not enough to find a case that meets only some of the conditions.
