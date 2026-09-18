# 127 — Predicting a change

Problem world. For the imaginary bean species F in this problem, a seed begins germination only if it has water, air, and a suitable temperature. Light is not required for the first step of germination, but it becomes important after the green shoot appears. In our model, if any required condition is missing, germination stops at that point.

Case data. Before the change, the system is stable. Now we activate or increase “water available”. The causal rules are: water available → the seed becomes hydrated. The seed becomes hydrated → the processes of germination start. The processes of germination start → the young root emerges. The young root emerges → can appear the shoot.

Question. Predict the effects that may appear downstream. Separate the direct effect from the indirect effects.
