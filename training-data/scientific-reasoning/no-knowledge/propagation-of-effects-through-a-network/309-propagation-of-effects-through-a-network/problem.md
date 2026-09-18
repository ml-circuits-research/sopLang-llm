# 309 — Propagation of effects through a network

Problem world. In our model, water may be solid, liquid, or water vapor. Sufficient heating can cause melting or evaporation, and cooling can cause condensation or freezing. A change of state does not mean that the water has ceased to exist; only the form in which we observe it has changed. We use only the heating and cooling relationships stated here, without relying on memorized temperature values.

Case data. The network of dependencies has the arrows: heating the ice → melting; melting → water liquid; heating continuous → evaporation; cooling of the vapor → condensation. We change “heating the ice”.

Question. Mark every node the effect can reach, directly or indirectly. Do not include nodes for which no arrow path exists.
