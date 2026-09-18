# 359 — Propagation of effects through a network

Problem world. In our model, rock fragments can be broken off by weathering, transported by water or wind, and then deposited when the transporting agent loses energy. Repeated deposits can form layers. Traces or remains of organisms can become trapped in sediments and, under certain conditions, become fossils. A fossil does not form instantly; the problem uses only the logical order of the stages, not their real duration.

Case data. The network of dependencies has the arrows: spoilage → fragments of rock; water in motion → transport; speed of the water decreases → deposition; deposits repeated → layers. We change “spoilage”.

Question. Mark every node the effect can reach, directly or indirectly. Do not include nodes for which no arrow path exists.
