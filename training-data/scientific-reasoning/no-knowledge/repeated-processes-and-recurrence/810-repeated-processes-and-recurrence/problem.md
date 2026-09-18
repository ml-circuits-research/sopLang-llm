# 810 — Repeated processes and recurrence

Given knowledge. An object remains stable in the model if the projection of its center of mass stays above its base of support. A wider base or moving mass inward can increase stability. In the model, the center of mass is the point at which we can treat mass as concentrated for balance analysis. Raising mass higher can make the system easier to tip.

Problem data. The state x tracks the quantity “mass” (unit: mass units). We start with x₀=4. At each cycle: we add 4, we subtract 2, then we apply the cap 12: x_(t+1)=min(12, x_t+4-2). We repeat 5 cycles.

Question. Calculate the five successive states and explain whether the cap changes the evolution compared with a simple constant-step progression.
