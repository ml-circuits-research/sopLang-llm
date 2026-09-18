# 452 — Multi-step synthesis

Problem world. In our model, a push or pull can change an object’s motion. Friction opposes sliding and is greater on some surfaces than on others. If the applied force is the same, greater friction tends to make the object travel a shorter distance in our test. For a fair comparison, we keep the same object and the same push.

Case data. Case D has the properties: the same object is used: YES; the push is the same: YES; surface is known: YES; distance is measured the same: YES. The eligibility rule requires distance is measured the same, the same object is used, surface is known, the push is the same. For the process, we have the following connected rules: we apply a push → the object begins to move; the object begins to move → friction opposes motion; friction opposes motion → the object slows down. The stated order is: we apply a push → the object begins to move → friction opposes motion → the object slows down.

Question. Solve at three levels: (1) is the case eligible? (2) starting from the first stage, what state do we reach after three links? (3) what is the immediate predecessor of the final stage?
