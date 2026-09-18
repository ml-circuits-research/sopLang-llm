# 324 — Propagation of effects through a network

Problem world. In this model, a source produces sound when it vibrates. The vibration sets the surrounding medium in motion, and the variations reach a receiver. A larger vibration can produce a louder sound under comparable conditions; distance and obstacles can reduce what reaches the receiver. We do not confuse the sound source with the receiver that detects it.

Case data. The network of dependencies has the arrows: the source vibrates → signal sound starts; signal sound starts → propagates through Environment; path free → the signal reaches better; the signal reaches → the receptor detects it. We change “the source vibrates”.

Question. Mark every node the effect can reach, directly or indirectly. Do not include nodes for which no arrow path exists.
