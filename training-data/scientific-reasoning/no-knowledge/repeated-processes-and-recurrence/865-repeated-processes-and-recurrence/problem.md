# 865 — Repeated processes and recurrence

Given knowledge. In the home model, insulation slows heat transfer, natural light can reduce the use of electric lights, and electrical devices transform energy and also produce heat. The goal is comfort while using resources as efficiently as possible. Windows can provide light but can also be areas of heat transfer. A thick curtain can reduce some heat loss.

Problem data. The state x tracks the quantity “energy” (unit: kJ-model). We start with x₀=3. At each cycle: we add 3, we subtract 1, then we apply the cap 13: x_(t+1)=min(13, x_t+3-1). We repeat 5 cycles.

Question. Calculate the five successive states and explain whether the cap changes the evolution compared with a simple constant-step progression.
