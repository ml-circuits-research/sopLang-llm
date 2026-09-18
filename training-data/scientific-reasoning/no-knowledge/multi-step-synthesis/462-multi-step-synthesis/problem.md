# 462 — Multi-step synthesis

Problem world. In a simple-circuit model, a battery, wires, and a bulb must form a closed path for the bulb to light. A break anywhere along the path opens the circuit. Some materials conduct and can bridge a gap; others are insulators. We do not use details about voltage or current; every conclusion follows only from the idea of a continuous path.

Case data. Case D has the properties: the battery is connected: YES; the wires form a path continuous: YES; the bulb is connected: YES; the switch is closed: YES. The eligibility rule requires the battery is connected, the bulb is connected, the wires form a path continuous, the switch is closed. For the process, we have the following connected rules: we connect the battery → we close the path through the wires; we close the path through the wires → the path passes through the bulb; the path passes through the bulb → the bulb lights up. The stated order is: we connect the battery → we close the path through the wires → the path passes through the bulb → the bulb lights up.

Question. Solve at three levels: (1) is the case eligible? (2) starting from the first stage, what state do we reach after three links? (3) what is the immediate predecessor of the final stage?
