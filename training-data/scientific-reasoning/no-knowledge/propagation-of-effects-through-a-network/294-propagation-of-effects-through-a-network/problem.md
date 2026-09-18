# 294 — Propagation of effects through a network

Problem world. In the model, microbes can transfer from a surface to the hands and then from the hands to the mouth if the hands are not cleaned. Correct washing with soap and water greatly reduces the number of microbes on the hands, without meaning that every microbe in the world disappears. To reduce risk, we can break the transmission chain at several points.

Case data. The network of dependencies has the arrows: contaminated surface → microbes on hands; microbes on hands → microbes can reach the mouth; the hands are washed correctly → microbes on hands reduced; microbes on hands reduced → reduced risk of transfer. We change “contaminated surface”.

Question. Mark every node the effect can reach, directly or indirectly. Do not include nodes for which no arrow path exists.
