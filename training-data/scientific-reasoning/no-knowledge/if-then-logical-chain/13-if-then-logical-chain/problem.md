# 13 — If-then logical chain

Problem world. In the small meadow described here, grass is eaten by rabbits, and rabbits can be eaten by foxes. If the food available to one group decreases greatly, that group has fewer resources; the effect can then continue along the chain. We will not assume that animal numbers change instantly: we track only the likely direction of the effect after some time.

Case data. The local rules form a single chain: In the model, if “plants grow” has been completed, then “the rabbit eats plants” can begin. In the model, if “the rabbit eats plants” has been completed, then “the fox finds the rabbit” can begin. In the model, if “the fox finds the rabbit” has been completed, then “energy from food reaches the fox” can begin. We know that “plants grow” has been completed.

Question. What conclusions can we deduce successively? Show why each conclusion becomes a premise for the next rule.
