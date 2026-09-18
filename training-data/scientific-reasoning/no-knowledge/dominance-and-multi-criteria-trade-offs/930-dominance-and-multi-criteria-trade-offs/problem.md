# 930 — Dominance and multi-criteria trade-offs

Given knowledge. Two gears that touch directly rotate in opposite directions. In the model, if a small gear drives a larger gear, the larger gear makes fewer rotations in the same time; an odd or even number of contacts can change the final direction. The teeth prevent slipping in the ideal model. An intermediate gear can change direction without being the useful output.

Problem data. Four options receive scores 1–5, where 5 means better performance on the corresponding criterion: C1=performance for “output speed”, C2=performance for “desired direction”, C3=performance for “the number of parts”. A=(5,3,3); B=(4,5,2); C=(3,4,5); D=(2,3,2).

Question. An option is dominated if another option is at least as good on every criterion and strictly better on at least one. Eliminate the dominated options and state whether the remaining frontier has a unique winner without additional priorities.
