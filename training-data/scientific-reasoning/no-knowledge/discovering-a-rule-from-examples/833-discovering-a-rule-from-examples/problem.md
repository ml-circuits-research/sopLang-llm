# 833 — Discovering a rule from examples

Given knowledge. An echo occurs when sound is reflected and returns after a delay. Hard, smooth surfaces can reflect more sound, while soft or porous materials can absorb a larger share. Sound propagates through vibrations in a medium. A greater distance to the wall increases the echo’s return time.

Problem data. A means “there is absorbent material”, B means “the reflective surface is sufficiently covered”. A box applies the same unknown logical rule: A=NO, B=NO → result=NO; A=NO, B=YES → result=NO; A=YES, B=YES → result=YES. Candidates: R1=A AND B; R2=A OR B; R3=exactly one; R4=neither A nor B.

Question. Eliminate candidate rules that are incompatible with even one example. Which rule remains? Use it for the new case A=YES, B=NO.
