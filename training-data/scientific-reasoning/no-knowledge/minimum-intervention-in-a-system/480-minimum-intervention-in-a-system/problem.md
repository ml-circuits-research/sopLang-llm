# 480 — Minimum intervention in a system

Problem world. In the model, Earth is approximated as a sphere rotating around its axis. The side facing the Sun is illuminated, while the opposite side is in night. As Earth rotates, a place can move from the illuminated region to the dark region and back again. These problems do not require astronomical distances or real durations; we use only the stated geometric model.

Case data. The system should be modified as little as possible. The targets are: change of orientation, tracking the same place; forbidden effects: cause ambiguous. Available interventions: rotation of the sphere: cost 1, effects [change of orientation], undesired effects [none]. Maintaining the source fixed: cost 1, effects [model comparable], undesired effects [none]. Marking of a point: cost 1, effects [tracking the same place], undesired effects [none]. Moving the source and of the sphere simultaneously: cost 1, effects [motion complex], undesired effects [cause ambiguous].

Question. Find the minimum intervention: first minimize total cost, then, when costs are tied, minimize the number of actions. Prove minimality, not just feasibility.
