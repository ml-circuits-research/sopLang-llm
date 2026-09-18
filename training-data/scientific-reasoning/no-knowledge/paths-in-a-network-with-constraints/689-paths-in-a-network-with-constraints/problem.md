# 689 — Paths in a network with constraints

Given knowledge. For equal volumes, the material with smaller mass has lower density. In the model, an object floats in water if its average density is lower than the density of water; a hollow shape can contain air and reduce average density. A compact piece of metal can be denser than water. A metal ship can float because its total volume contains a great deal of air.

Problem data. The network has bidirectional edges with the following costs: surface of the water–zone of floating:1; zone of floating–the platform of test:2; surface of the water–the bottom of the container:2; the bottom of the container–the edge of the container:1; the edge of the container–the platform of test:1; zone of floating–the edge of the container:2. The link zone of floating–the platform of test is closed. The starting point is “surface of the water”, the destination is “the platform of test”.

Question. Find an allowed path with minimum cost. It is not enough to count nodes; you must add the edge costs and respect the closed link.
