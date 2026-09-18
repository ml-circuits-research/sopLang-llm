# 420 — Minimum intervention in a system

Problem world. In the model, microbes can transfer from a surface to the hands and then from the hands to the mouth if the hands are not cleaned. Correct washing with soap and water greatly reduces the number of microbes on the hands, without meaning that every microbe in the world disappears. To reduce risk, we can break the transmission chain at several points.

Case data. The system should be modified as little as possible. The targets are: microbes on hands reduced, surface clean; forbidden effects: recontamination. Available interventions: washing of the hands: cost 1, effects [microbes on hands reduced], undesired effects [none]. Cleaning of the surface: cost 1, effects [surface clean], undesired effects [none]. Covering of the food: cost 1, effects [food protected], undesired effects [none]. Use of the same towel dirty: cost 1, effects [deletion fast], undesired effects [recontamination].

Question. Find the minimum intervention: first minimize total cost, then, when costs are tied, minimize the number of actions. Prove minimality, not just feasibility.
