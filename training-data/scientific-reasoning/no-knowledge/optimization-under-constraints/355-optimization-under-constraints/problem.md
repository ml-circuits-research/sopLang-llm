# 355 — Optimization under constraints

Problem world. In the model, Earth is approximated as a sphere rotating around its axis. The side facing the Sun is illuminated, while the opposite side is in night. As Earth rotates, a place can move from the illuminated region to the dark region and back again. These problems do not require astronomical distances or real durations; we use only the stated geometric model.

Case data. The target is to obtain all of the following conditions: change of orientation, tracking the same place. The forbidden effects are: cause ambiguous. The options are: rotation of the sphere: cost 1, effects [change of orientation], undesired effects [none]. Maintaining the source fixed: cost 1, effects [model comparable], undesired effects [none]. Marking of a point: cost 1, effects [tracking the same place], undesired effects [none]. Moving the source and of the sphere simultaneously: cost 1, effects [motion complex], undesired effects [cause ambiguous].

Question. Choose the combination with the minimum total cost that reaches the target without a forbidden effect. Show why a cheaper solution does not work.
