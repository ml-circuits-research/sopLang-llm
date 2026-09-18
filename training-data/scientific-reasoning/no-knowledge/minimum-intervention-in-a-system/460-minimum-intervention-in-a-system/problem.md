# 460 — Minimum intervention in a system

Problem world. In the model, a magnet can attract certain magnetic materials without direct contact. Two magnet ends can attract or repel depending on orientation. We do not assume that all metals are magnetic; the result of the test is stated explicitly for every object. A thin nonmagnetic barrier does not necessarily stop the magnet’s effect in our model.

Case data. The system should be modified as little as possible. The targets are: effect magnetic detectable, orientation of attraction; forbidden effects: effect magnetic reduced. Available interventions: proximity of the magnet: cost 1, effects [effect magnetic detectable], undesired effects [none]. Changing of orientation: cost 1, effects [orientation of attraction], undesired effects [none]. Removing the obstacle large: cost 2, effects [path magnetic more favorable], undesired effects [none]. Removal of the magnet: cost 1, effects [space free], undesired effects [effect magnetic reduced].

Question. Find the minimum intervention: first minimize total cost, then, when costs are tied, minimize the number of actions. Prove minimality, not just feasibility.
