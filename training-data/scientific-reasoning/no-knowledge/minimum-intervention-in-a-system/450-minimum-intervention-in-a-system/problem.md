# 450 — Minimum intervention in a system

Problem world. In this model, a source produces sound when it vibrates. The vibration sets the surrounding medium in motion, and the variations reach a receiver. A larger vibration can produce a louder sound under comparable conditions; distance and obstacles can reduce what reaches the receiver. We do not confuse the sound source with the receiver that detects it.

Case data. The system should be modified as little as possible. The targets are: path free, receptor functional; forbidden effects: reduced desired signal. Available interventions: increasing the vibration: cost 1, effects [stronger signal], undesired effects [none]. Removing the obstacle: cost 1, effects [path free], undesired effects [none]. Replacing the receiver: cost 2, effects [receptor functional], undesired effects [none]. add the insulator: cost 1, effects [reduced external noise], undesired effects [reduced desired signal].

Question. Find the minimum intervention: first minimize total cost, then, when costs are tied, minimize the number of actions. Prove minimality, not just feasibility.
