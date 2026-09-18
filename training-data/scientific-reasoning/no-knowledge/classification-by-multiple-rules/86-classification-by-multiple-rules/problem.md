# 86 — Classification by multiple rules

Problem world. In a simple-circuit model, a battery, wires, and a bulb must form a closed path for the bulb to light. A break anywhere along the path opens the circuit. Some materials conduct and can bridge a gap; others are insulators. We do not use details about voltage or current; every conclusion follows only from the idea of a continuous path.

Case data. Case A: the battery is connected: YES; the wires form a path continuous: YES; the bulb is connected: YES; the switch is closed: NO. Case B: the battery is connected: YES; the wires form a path continuous: NO; the bulb is connected: YES; the switch is closed: YES. Case C: the battery is connected: NO; the wires form a path continuous: YES; the bulb is connected: YES; the switch is closed: YES. Case D: the battery is connected: YES; the wires form a path continuous: YES; the bulb is connected: YES; the switch is closed: YES.

Question. The competition rule says that only the case meeting ALL requirements is accepted: the battery is connected, the bulb is connected, the wires form a path continuous, the switch is closed; and the forbidden properties are: no additional forbidden property. Which case is accepted? It is not enough to find a case that meets only some of the conditions.
