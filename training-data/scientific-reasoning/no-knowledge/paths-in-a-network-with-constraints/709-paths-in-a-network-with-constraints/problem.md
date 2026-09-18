# 709 — Paths in a network with constraints

Given knowledge. An echo occurs when sound is reflected and returns after a delay. Hard, smooth surfaces can reflect more sound, while soft or porous materials can absorb a larger share. Sound propagates through vibrations in a medium. A greater distance to the wall increases the echo’s return time.

Problem data. The network has bidirectional edges with the following costs: the source–the nearby wall:1; the nearby wall–the microphone:2; the source–the far wall:2; the far wall–the absorbent panel:1; the absorbent panel–the microphone:1; the nearby wall–the absorbent panel:2. The wall nearby–the microphone link is closed. The starting point is “the source”, the destination is “the microphone”.

Question. Find an allowed path with minimum cost. It is not enough to count nodes; you must add the edge costs and respect the closed link.
