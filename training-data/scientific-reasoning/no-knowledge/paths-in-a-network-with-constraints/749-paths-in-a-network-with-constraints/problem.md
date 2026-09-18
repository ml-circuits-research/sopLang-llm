# 749 — Paths in a network with constraints

Given knowledge. In the kitchen model, heating transfers energy, dissolving forms a homogeneous mixture only for certain substances and quantities, and clean utensils reduce contamination. Experimental recipes can be compared only when quantities and times are measured in the same way. A dissolved substance has not disappeared; it is distributed through the solvent. Stirring can speed dissolving without changing the maximum amount allowed by the model.

Problem data. The network has bidirectional edges with the following costs: measurement zone–the heating container:1; the heating container–the cooling zone:2; measurement zone–mixing zone:2; mixing zone–the clean shelf:1; the clean shelf–the cooling zone:1; the heating container–the clean shelf:2. The container of heating–the cooling zone link is closed. The starting point is “measurement zone”, the destination is “the cooling zone”.

Question. Find an allowed path with minimum cost. It is not enough to count nodes; you must add the edge costs and respect the closed link.
