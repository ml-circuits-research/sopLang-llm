# 11 — Classification by multiple rules

Problem world. In the small meadow described here, grass is eaten by rabbits, and rabbits can be eaten by foxes. If the food available to one group decreases greatly, that group has fewer resources; the effect can then continue along the chain. We will not assume that animal numbers change instantly: we track only the likely direction of the effect after some time.

Case data. Case A: has access to food: YES; has access to water: YES; has shelter: YES; is not blocked by an obstacle: NO. Case B: has access to food: YES; has access to water: NO; has shelter: YES; is not blocked by an obstacle: YES. Case C: has access to food: NO; has access to water: YES; has shelter: YES; is not blocked by an obstacle: YES. Case D: has access to food: YES; has access to water: YES; has shelter: YES; is not blocked by an obstacle: YES.

Question. The competition rule says that only the case meeting ALL requirements is accepted: has access to water, has access to food, has shelter, is not blocked by an obstacle; and the forbidden properties are: no additional forbidden property. Which case is accepted? It is not enough to find a case that meets only some of the conditions.
