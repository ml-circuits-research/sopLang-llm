# 106 — Classification by multiple rules

Problem world. In our model, rock fragments can be broken off by weathering, transported by water or wind, and then deposited when the transporting agent loses energy. Repeated deposits can form layers. Traces or remains of organisms can become trapped in sediments and, under certain conditions, become fossils. A fossil does not form instantly; the problem uses only the logical order of the stages, not their real duration.

Case data. Case A: there are rock fragments: YES; there is a transport agent: YES; deposition occurs: YES; sediments can accumulate in layers: NO. Case B: there are rock fragments: YES; there is a transport agent: NO; deposition occurs: YES; sediments can accumulate in layers: YES. Case C: there are rock fragments: NO; there is a transport agent: YES; deposition occurs: YES; sediments can accumulate in layers: YES. Case D: there are rock fragments: YES; there is a transport agent: YES; deposition occurs: YES; sediments can accumulate in layers: YES.

Question. The competition rule says that only the case meeting ALL requirements is accepted: deposition occurs, there are rock fragments, there is a transport agent, sediments can accumulate in layers; and the forbidden properties are: no additional forbidden property. Which case is accepted? It is not enough to find a case that meets only some of the conditions.
