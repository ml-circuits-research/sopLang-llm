# 363 — Counterfactual reasoning

Problem world. In the model, a pollutant introduced into a stream can be transported downstream. Reducing pollution at its source stops part of the problem before it spreads. Cleanup downstream can help locally, but it does not necessarily replace stopping the source. A good decision compares desired effects, costs, and side effects using the given data.

Case data. The causal network is: pollutant at source → pollutant in water; flow downstream → pollutant transported; pollutant transported → exposure downstream; the source reduced → loading new smaller. In the normal situation, we start with “pollutant at source”. Now imagine that “pollutant in water” is completely blocked: it can neither be produced nor produce effects.

Question. Which effects that occurred before can no longer be obtained through this path? Explain the difference between the normal world and the counterfactual world.
