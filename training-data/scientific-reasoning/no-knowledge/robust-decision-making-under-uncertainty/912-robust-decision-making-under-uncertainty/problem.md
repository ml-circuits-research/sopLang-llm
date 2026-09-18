# 912 — Robust decision-making under uncertainty

Given knowledge. During exercise, muscles need more oxygen and energy, and pulse and breathing may increase. after exercise stops, the values tend to return gradually toward the resting level. In the model, recovery is tracked by measurements taken at the same time intervals. Sweating can contribute to water loss. A single measurement does not describe the whole recovery process.

Problem data. The real state is unknown. The following scenarios are still possible: only “measurements have been taken at equal intervals” is faulty, only “the effort has ended” is faulty, only “the values gradually approach the resting level” is faulty. Only one condition is faulty in each scenario. Actions: X repairs A, cost 1; Y repairs B, cost 1; Z repairs A, B, cost 2; W repairs A, B, C, cost 4; V repairs B, C, cost 3.

Question. Choose one action now that guarantees a repair regardless of which still-possible scenario is real. Which guaranteed action is robust and has the minimum cost?

Additional information. The faulty conditions named above carry the labels A, B, and C.
