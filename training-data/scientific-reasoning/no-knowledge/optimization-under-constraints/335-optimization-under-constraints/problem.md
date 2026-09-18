# 335 — Optimization under constraints

Problem world. In the model, a magnet can attract certain magnetic materials without direct contact. Two magnet ends can attract or repel depending on orientation. We do not assume that all metals are magnetic; the result of the test is stated explicitly for every object. A thin nonmagnetic barrier does not necessarily stop the magnet’s effect in our model.

Case data. The target is to obtain all of the following conditions: effect magnetic detectable, orientation of attraction. The forbidden effects are: effect magnetic reduced. The options are: proximity of the magnet: cost 1, effects [effect magnetic detectable], undesired effects [none]. Changing of orientation: cost 1, effects [orientation of attraction], undesired effects [none]. Removing the obstacle large: cost 2, effects [path magnetic more favorable], undesired effects [none]. Removal of the magnet: cost 1, effects [space free], undesired effects [effect magnetic reduced].

Question. Choose the combination with the minimum total cost that reaches the target without a forbidden effect. Show why a cheaper solution does not work.
