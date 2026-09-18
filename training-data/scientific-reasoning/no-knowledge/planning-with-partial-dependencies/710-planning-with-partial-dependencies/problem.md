# 710 — Planning with partial dependencies

Given knowledge. An echo occurs when sound is reflected and returns after a delay. Hard, smooth surfaces can reflect more sound, while soft or porous materials can absorb a larger share. Sound propagates through vibrations in a medium. A greater distance to the wall increases the echo’s return time.

Problem data. The dependencies are: “the source produces sound” without prerequisites; “sound reaches the wall” after “the source produces sound”; “part is reflected” after “the source produces sound”; “part is absorbed” after “sound reaches the wall” and “part is reflected”; “the microphone receives the echo” after “part is reflected”.

Question. Build a level-by-level plan: which tasks can be done in parallel, and which task must wait for several prerequisites? Also give one valid total ordering.
