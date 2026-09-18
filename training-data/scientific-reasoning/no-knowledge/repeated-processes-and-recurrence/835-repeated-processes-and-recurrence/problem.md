# 835 — Repeated processes and recurrence

Given knowledge. An echo occurs when sound is reflected and returns after a delay. Hard, smooth surfaces can reflect more sound, while soft or porous materials can absorb a larger share. Sound propagates through vibrations in a medium. A greater distance to the wall increases the echo’s return time.

Problem data. The state x tracks the quantity “sound energy” (unit: load units). We start with x₀=3. At each cycle: we add 3, we subtract 1, then we apply the cap 12: x_(t+1)=min(12, x_t+3-1). We repeat 5 cycles.

Question. Calculate the five successive states and explain whether the cap changes the evolution compared with a simple constant-step progression.
