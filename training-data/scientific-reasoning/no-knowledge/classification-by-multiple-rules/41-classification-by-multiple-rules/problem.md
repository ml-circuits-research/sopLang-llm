# 41 — Classification by multiple rules

Problem world. In the model, microbes can transfer from a surface to the hands and then from the hands to the mouth if the hands are not cleaned. Correct washing with soap and water greatly reduces the number of microbes on the hands, without meaning that every microbe in the world disappears. To reduce risk, we can break the transmission chain at several points.

Case data. Case A: the hands are washed: YES; surface is clean: YES; the food is protected: YES; hands do not touch the mouth before washing: NO. Case B: the hands are washed: YES; surface is clean: NO; the food is protected: YES; hands do not touch the mouth before washing: YES. Case C: the hands are washed: NO; surface is clean: YES; the food is protected: YES; hands do not touch the mouth before washing: YES. Case D: the hands are washed: YES; surface is clean: YES; the food is protected: YES; hands do not touch the mouth before washing: YES.

Question. The competition rule says that only the case meeting ALL requirements is accepted: the food is protected, hands do not touch the mouth before washing, the hands are washed, surface is clean; and the forbidden properties are: no additional forbidden property. Which case is accepted? It is not enough to find a case that meets only some of the conditions.
