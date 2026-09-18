# 212 — Predicting a change

Problem world. In a simple-circuit model, a battery, wires, and a bulb must form a closed path for the bulb to light. A break anywhere along the path opens the circuit. Some materials conduct and can bridge a gap; others are insulators. We do not use details about voltage or current; every conclusion follows only from the idea of a continuous path.

Case data. Before the change, the system is stable. Now we activate or increase “battery connected”. The causal rules are: battery connected → source available. Path continuous → circuit closed. Circuit closed → the bulb can receive energy. Bulb connected and circuit closed → bulb lit.

Question. Predict the effects that may appear downstream. Separate the direct effect from the indirect effects.
