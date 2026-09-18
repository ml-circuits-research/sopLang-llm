# 111 — Classification by multiple rules

Problem world. In the model, a pollutant introduced into a stream can be transported downstream. Reducing pollution at its source stops part of the problem before it spreads. Cleanup downstream can help locally, but it does not necessarily replace stopping the source. A good decision compares desired effects, costs, and side effects using the given data.

Case data. Case A: the pollution source is reduced: YES; water is monitored: YES; waste are collected: YES; the habitat is not destroyed of intervention: NO. Case B: the pollution source is reduced: YES; water is monitored: NO; waste are collected: YES; the habitat is not destroyed of intervention: YES. Case C: the pollution source is reduced: NO; water is monitored: YES; waste are collected: YES; the habitat is not destroyed of intervention: YES. Case D: the pollution source is reduced: YES; water is monitored: YES; waste are collected: YES; the habitat is not destroyed of intervention: YES.

Question. The competition rule says that only the case meeting ALL requirements is accepted: water is monitored, waste are collected, the habitat is not destroyed of intervention, the pollution source is reduced; and the forbidden properties are: no additional forbidden property. Which case is accepted? It is not enough to find a case that meets only some of the conditions.
