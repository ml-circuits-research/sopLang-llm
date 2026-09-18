# 987 — Robust decision-making under uncertainty

Given knowledge. In the home model, insulation slows heat transfer, natural light can reduce the use of electric lights, and electrical devices transform energy and also produce heat. The goal is comfort while using resources as efficiently as possible. Windows can provide light but can also be areas of heat transfer. A thick curtain can reduce some heat loss.

Problem data. The real state is unknown. The following scenarios are still possible: only “there is sufficient light” is faulty, only “unnecessary devices are switched off” is faulty. Only one condition is faulty in each scenario. Actions: X repairs A, cost 1; Y repairs B, cost 1; Z repairs A, B, cost 2; W repairs A, B, C, cost 4; V repairs B, C, cost 3.

Question. Choose one action now that guarantees a repair regardless of which still-possible scenario is real. Which guaranteed action is robust and has the minimum cost?

Additional information. The faulty conditions named above carry the labels B and C.
