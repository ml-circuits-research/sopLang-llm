# 660 — Planning with partial dependencies

Given knowledge. Incisors cut, canines can tear, and molars crush and grind. Enamel protects the outside of the tooth. In the model, preparing a piece of food well requires cutting or tearing and then grinding before swallowing. Teeth have different shapes for different mechanical roles. Chewing increases the surface area of pieces of food.

Problem data. The dependencies are: “the piece is broken off” without prerequisites; “the piece is cut” without prerequisites; “the piece is broken into smaller pieces” after “the piece is broken off” and “the piece is cut”; “the pieces have been collected” after “the piece is broken into smaller pieces”; “it is swallowed” after “the piece is cut”.

Question. Build a level-by-level plan: which tasks can be done in parallel, and which task must wait for several prerequisites? Also give one valid total ordering.
