# 28 — If-then logical chain

Problem world. In the simplified model used here, food is broken into smaller pieces in the mouth, reaches the stomach, and then the small intestine, where much of the nutrients pass into the blood. In the large intestine, some water is recovered from the remaining material. The order of the organs matters: a substance cannot reach a later part of the intestine before passing through earlier parts of the route.

Case data. The local rules form a single chain: In the model, if “the mouth breaks up food” has been completed, then “food reaches the stomach” can begin. In the model, if “food reaches the stomach” has been completed, then “reaches the small intestine” can begin. In the model, if “reaches the small intestine” has been completed, then “nutrients pass into the blood” can begin. We know that “the mouth breaks up food” has been completed.

Question. What conclusions can we deduce successively? Show why each conclusion becomes a premise for the next rule.
