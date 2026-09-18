# 1 — Classification by multiple rules

Problem world. For the imaginary bean species F in this problem, a seed begins germination only if it has water, air, and a suitable temperature. Light is not required for the first step of germination, but it becomes important after the green shoot appears. In our model, if any required condition is missing, germination stops at that point.

Case data. Case A: has water: YES; has air: YES; the temperature is suitable: YES; the shoot receives light: NO. Case B: has water: YES; has air: NO; the temperature is suitable: YES; the shoot receives light: YES. Case C: has water: NO; has air: YES; the temperature is suitable: YES; the shoot receives light: YES. Case D: has water: YES; has air: YES; the temperature is suitable: YES; the shoot receives light: YES.

Question. The competition rule says that only the case meeting ALL requirements is accepted: has air, has water, the shoot receives light, the temperature is suitable; and the forbidden properties are: no additional forbidden property. Which case is accepted? It is not enough to find a case that meets only some of the conditions.
