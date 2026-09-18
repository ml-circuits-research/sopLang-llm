# 237 — Predicting a change

Problem world. In the model, a pollutant introduced into a stream can be transported downstream. Reducing pollution at its source stops part of the problem before it spreads. Cleanup downstream can help locally, but it does not necessarily replace stopping the source. A good decision compares desired effects, costs, and side effects using the given data.

Case data. Before the change, the system is stable. Now we activate or increase “pollutant at source”. The causal rules are: pollutant at source → pollutant in water. Flow downstream → pollutant transported. Pollutant transported → exposure downstream. The source reduced → loading new smaller.

Question. Predict the effects that may appear downstream. Separate the direct effect from the indirect effects.
