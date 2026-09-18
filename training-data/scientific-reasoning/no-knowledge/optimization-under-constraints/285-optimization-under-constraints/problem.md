# 285 — Optimization under constraints

Problem world. In the simplified model, inhaled air brings oxygen into the lungs; oxygen passes into the blood, and the blood carries it to the cells. Cells produce carbon dioxide, which is carried by the blood back to the lungs and then exhaled. If one transport link is blocked, stages after that link receive less of the transported substance.

Case data. The target is to obtain all of the following conditions: air in lungs, oxygen transported. The forbidden effects are: air reduced. The options are: air fresh: cost 1, effects [oxygen in lungs], undesired effects [none]. Maintaining of the path of air free: cost 1, effects [air in lungs], undesired effects [none]. Circulation efficient: cost 2, effects [oxygen transported], undesired effects [none]. Blocking of the path of air: cost 1, effects [dust does not enter], undesired effects [air reduced].

Question. Choose the combination with the minimum total cost that reaches the target without a forbidden effect. Show why a cheaper solution does not work.
