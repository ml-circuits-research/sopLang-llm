# 870 — Repeated processes and recurrence

Given knowledge. River water flows from upstream to downstream and can carry particles or substances. In the treatment-plant model, screening stops large objects, filtration retains smaller particles, and a separate disinfection stage is required to reduce microorganisms. A particle filter does not automatically remove all dissolved substances. A pollution source upstream can affect points downstream.

Problem data. The state x tracks the quantity “contaminant” (unit: contamination units). We start with x₀=4. At each cycle: we add 4, we subtract 2, then we apply the cap 14: x_(t+1)=min(14, x_t+4-2). We repeat 5 cycles.

Question. Calculate the five successive states and explain whether the cap changes the evolution compared with a simple constant-step progression.
