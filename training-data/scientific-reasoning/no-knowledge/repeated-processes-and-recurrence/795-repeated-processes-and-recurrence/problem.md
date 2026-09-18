# 795 — Repeated processes and recurrence

Given knowledge. Microorganisms can multiply on food when they find suitable conditions. In the model, cooling slows multiplication, drying reduces available water, and a clean container reduces initial contamination; none of these measures means that a food becomes sterile. Heat and moisture can speed some biological processes. “Cold” means slowing in the model, not absolute stopping.

Problem data. The state x tracks the quantity “water available” (unit: u.a.). We start with x₀=4. At each cycle: we add 3, we subtract 1, then we apply the cap 14: x_(t+1)=min(14, x_t+3-1). We repeat 5 cycles.

Question. Calculate the five successive states and explain whether the cap changes the evolution compared with a simple constant-step progression.
