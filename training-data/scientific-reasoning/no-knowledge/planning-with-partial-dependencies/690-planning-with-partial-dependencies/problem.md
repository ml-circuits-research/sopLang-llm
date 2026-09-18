# 690 — Planning with partial dependencies

Given knowledge. For equal volumes, the material with smaller mass has lower density. In the model, an object floats in water if its average density is lower than the density of water; a hollow shape can contain air and reduce average density. A compact piece of metal can be denser than water. A metal ship can float because its total volume contains a great deal of air.

Problem data. The dependencies are: “mass is measured” without prerequisites; “volume is measured” without prerequisites; “the ratio is calculated” after “mass is measured” and “volume is measured”; “the object is placed in water” after “the ratio is calculated”; “the final position is observed” after “volume is measured”.

Question. Build a level-by-level plan: which tasks can be done in parallel, and which task must wait for several prerequisites? Also give one valid total ordering.
