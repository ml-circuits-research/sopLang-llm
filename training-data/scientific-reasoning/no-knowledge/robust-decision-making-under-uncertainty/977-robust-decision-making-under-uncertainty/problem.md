# 977 — Robust decision-making under uncertainty

Given knowledge. In the greenhouse model, plants need light and water, temperature must remain within a stated range, and fruit formation in the species used requires pollination. Windows can cool and ventilate, watering adds water, and insect access can increase pollination. Too much water can reduce the air in the soil. Ventilation can lower temperature and humidity.

Problem data. The real state is unknown. The following scenarios are still possible: only “the water is within the range” is faulty, only “temperature is within range” is faulty. Only one condition is faulty in each scenario. Actions: X repairs A, cost 1; Y repairs B, cost 1; Z repairs A, B, cost 2; W repairs A, B, C, cost 4; V repairs B, C, cost 3.

Question. Choose one action now that guarantees a repair regardless of which still-possible scenario is real. Which guaranteed action is robust and has the minimum cost?

Additional information. The faulty conditions named above carry the labels A and B.
