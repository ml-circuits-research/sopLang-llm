# 325 — Optimization under constraints

Problem world. In this model, a source produces sound when it vibrates. The vibration sets the surrounding medium in motion, and the variations reach a receiver. A larger vibration can produce a louder sound under comparable conditions; distance and obstacles can reduce what reaches the receiver. We do not confuse the sound source with the receiver that detects it.

Case data. The target is to obtain all of the following conditions: path free, receptor functional. The forbidden effects are: reduced desired signal. The options are: increasing the vibration: cost 1, effects [stronger signal], undesired effects [none]. Removing the obstacle: cost 1, effects [path free], undesired effects [none]. Replacing the receiver: cost 2, effects [receptor functional], undesired effects [none]. add the insulator: cost 1, effects [reduced external noise], undesired effects [reduced desired signal].

Question. Choose the combination with the minimum total cost that reaches the target without a forbidden effect. Show why a cheaper solution does not work.
