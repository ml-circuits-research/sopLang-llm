# 417 — Multi-step synthesis

Problem world. In the model, microbes can transfer from a surface to the hands and then from the hands to the mouth if the hands are not cleaned. Correct washing with soap and water greatly reduces the number of microbes on the hands, without meaning that every microbe in the world disappears. To reduce risk, we can break the transmission chain at several points.

Case data. Case D has the properties: the hands are washed: YES; surface is clean: YES; the food is protected: YES; hands do not touch the mouth before washing: YES. The eligibility rule requires the food is protected, hands do not touch the mouth before washing, the hands are washed, surface is clean. For the process, we have the following connected rules: microbes reach the surface → has transferred onto the hands; has transferred onto the hands → hands touch the mouth; hands touch the mouth → microbes can enters body. The stated order is: microbes reach the surface → has transferred onto the hands → hands touch the mouth → microbes can enters body.

Question. Solve at three levels: (1) is the case eligible? (2) starting from the first stage, what state do we reach after three links? (3) what is the immediate predecessor of the final stage?
