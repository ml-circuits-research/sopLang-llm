# 875 — Repeated processes and recurrence

Given knowledge. In the kitchen model, heating transfers energy, dissolving forms a homogeneous mixture only for certain substances and quantities, and clean utensils reduce contamination. Experimental recipes can be compared only when quantities and times are measured in the same way. A dissolved substance has not disappeared; it is distributed through the solvent. Stirring can speed dissolving without changing the maximum amount allowed by the model.

Problem data. The state x tracks the quantity “water” (unit: mL). We start with x₀=2. At each cycle: we add 3, we subtract 1, then we apply the cap 15: x_(t+1)=min(15, x_t+3-1). We repeat 5 cycles.

Question. Calculate the five successive states and explain whether the cap changes the evolution compared with a simple constant-step progression.
