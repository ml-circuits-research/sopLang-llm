# 340 — Optimization under constraints

Problem world. In a simple-circuit model, a battery, wires, and a bulb must form a closed path for the bulb to light. A break anywhere along the path opens the circuit. Some materials conduct and can bridge a gap; others are insulators. We do not use details about voltage or current; every conclusion follows only from the idea of a continuous path.

Case data. The target is to obtain all of the following conditions: bulb in path, path continuous. The forbidden effects are: source eliminated. The options are: closing the switch: cost 1, effects [closed path], undesired effects [none]. Replacement of the wire broken: cost 2, effects [path continuous], undesired effects [none]. Connection of the bulb: cost 1, effects [bulb in path], undesired effects [none]. Removal of the battery: cost 1, effects [circuit certain for work], undesired effects [source eliminated].

Question. Choose the combination with the minimum total cost that reaches the target without a forbidden effect. Show why a cheaper solution does not work.
