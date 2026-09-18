# 892 — Robust decision-making under uncertainty

Given knowledge. Soil is a mixture that may contain mineral particles, humus, water, and air. In the model, a good layer for roots must retain some water while also leaving air spaces; too much water without air, or drainage that is too fast, can create problems. Sand generally has larger particles than clay. Humus comes from transformed organic remains.

Problem data. The real state is unknown. The following scenarios are still possible: only “the soil retains enough water” is faulty, only “the soil retains air spaces” is faulty, only “there is humus” is faulty. Only one condition is faulty in each scenario. Actions: X repairs A, cost 1; Y repairs B, cost 1; Z repairs A, B, cost 2; W repairs A, B, C, cost 4; V repairs B, C, cost 3.

Question. Choose one action now that guarantees a repair regardless of which still-possible scenario is real. Which guaranteed action is robust and has the minimum cost?

Additional information. The faulty conditions named above carry the labels A, B, and C.
