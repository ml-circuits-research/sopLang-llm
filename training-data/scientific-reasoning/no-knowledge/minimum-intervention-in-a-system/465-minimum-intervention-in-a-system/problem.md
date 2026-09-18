# 465 — Minimum intervention in a system

Problem world. In a simple-circuit model, a battery, wires, and a bulb must form a closed path for the bulb to light. A break anywhere along the path opens the circuit. Some materials conduct and can bridge a gap; others are insulators. We do not use details about voltage or current; every conclusion follows only from the idea of a continuous path.

Case data. The system should be modified as little as possible. The targets are: bulb in path, path continuous; forbidden effects: source eliminated. Available interventions: closing the switch: cost 1, effects [closed path], undesired effects [none]. Replacement of the wire broken: cost 2, effects [path continuous], undesired effects [none]. Connection of the bulb: cost 1, effects [bulb in path], undesired effects [none]. Removal of the battery: cost 1, effects [circuit certain for work], undesired effects [source eliminated].

Question. Find the minimum intervention: first minimize total cost, then, when costs are tied, minimize the number of actions. Prove minimality, not just feasibility.
