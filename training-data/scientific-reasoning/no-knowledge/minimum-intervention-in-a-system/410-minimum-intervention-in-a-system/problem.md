# 410 — Minimum intervention in a system

Problem world. In the simplified model, inhaled air brings oxygen into the lungs; oxygen passes into the blood, and the blood carries it to the cells. Cells produce carbon dioxide, which is carried by the blood back to the lungs and then exhaled. If one transport link is blocked, stages after that link receive less of the transported substance.

Case data. The system should be modified as little as possible. The targets are: air in lungs, oxygen transported; forbidden effects: air reduced. Available interventions: air fresh: cost 1, effects [oxygen in lungs], undesired effects [none]. Maintaining of the path of air free: cost 1, effects [air in lungs], undesired effects [none]. Circulation efficient: cost 2, effects [oxygen transported], undesired effects [none]. Blocking of the path of air: cost 1, effects [dust does not enter], undesired effects [air reduced].

Question. Find the minimum intervention: first minimize total cost, then, when costs are tied, minimize the number of actions. Prove minimality, not just feasibility.
