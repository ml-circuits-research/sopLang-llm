# 855 — Repeated processes and recurrence

Given knowledge. In the greenhouse model, plants need light and water, temperature must remain within a stated range, and fruit formation in the species used requires pollination. Windows can cool and ventilate, watering adds water, and insect access can increase pollination. Too much water can reduce the air in the soil. Ventilation can lower temperature and humidity.

Problem data. The state x tracks the quantity “water” (unit: model L). We start with x₀=4. At each cycle: we add 3, we subtract 1, then we apply the cap 11: x_(t+1)=min(11, x_t+3-1). We repeat 5 cycles.

Question. Calculate the five successive states and explain whether the cap changes the evolution compared with a simple constant-step progression.
