# 680 — Planning with partial dependencies

Given knowledge. Two gears that touch directly rotate in opposite directions. In the model, if a small gear drives a larger gear, the larger gear makes fewer rotations in the same time; an odd or even number of contacts can change the final direction. The teeth prevent slipping in the ideal model. An intermediate gear can change direction without being the useful output.

Problem data. The dependencies are: “the input rotates” without prerequisites; “the first gear drives the second” after “the input rotates”; “the direction reverses” after “the input rotates”; “motion is transmitted onward” after “the first gear drives the second” and “the direction reverses”; “the output rotates” after “the direction reverses”.

Question. Build a level-by-level plan: which tasks can be done in parallel, and which task must wait for several prerequisites? Also give one valid total ordering.
