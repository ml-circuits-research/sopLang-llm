# 295 — Optimization under constraints

Problem world. In the model, microbes can transfer from a surface to the hands and then from the hands to the mouth if the hands are not cleaned. Correct washing with soap and water greatly reduces the number of microbes on the hands, without meaning that every microbe in the world disappears. To reduce risk, we can break the transmission chain at several points.

Case data. The target is to obtain all of the following conditions: microbes on hands reduced, surface clean. The forbidden effects are: recontamination. The options are: washing of the hands: cost 1, effects [microbes on hands reduced], undesired effects [none]. Cleaning of the surface: cost 1, effects [surface clean], undesired effects [none]. Covering of the food: cost 1, effects [food protected], undesired effects [none]. Use of the same towel dirty: cost 1, effects [deletion fast], undesired effects [recontamination].

Question. Choose the combination with the minimum total cost that reaches the target without a forbidden effect. Show why a cheaper solution does not work.
