# 435 — Minimum intervention in a system

Problem world. In our model, water may be solid, liquid, or water vapor. Sufficient heating can cause melting or evaporation, and cooling can cause condensation or freezing. A change of state does not mean that the water has ceased to exist; only the form in which we observe it has changed. We use only the heating and cooling relationships stated here, without relying on memorized temperature values.

Case data. The system should be modified as little as possible. The targets are: melting, the vapor remain near; forbidden effects: water vapor lost. Available interventions: heating: cost 2, effects [evaporation, melting], undesired effects [none]. Cooling: cost 2, effects [condensation, freezing], undesired effects [none]. Covering of the container: cost 1, effects [the vapor remain near], undesired effects [none]. Opening wide: cost 1, effects [evaporation more light], undesired effects [water vapor lost].

Question. Find the minimum intervention: first minimize total cost, then, when costs are tied, minimize the number of actions. Prove minimality, not just feasibility.
