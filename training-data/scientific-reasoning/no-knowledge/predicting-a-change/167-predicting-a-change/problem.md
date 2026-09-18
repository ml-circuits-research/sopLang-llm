# 167 — Predicting a change

Problem world. In the model, microbes can transfer from a surface to the hands and then from the hands to the mouth if the hands are not cleaned. Correct washing with soap and water greatly reduces the number of microbes on the hands, without meaning that every microbe in the world disappears. To reduce risk, we can break the transmission chain at several points.

Case data. Before the change, the system is stable. Now we activate or increase “contaminated surface”. The causal rules are: contaminated surface → microbes on hands. Microbes on hands → microbes can reach the mouth. the hands are washed correctly → microbes on hands reduced. Microbes on hands reduced → reduced risk of transfer.

Question. Predict the effects that may appear downstream. Separate the direct effect from the indirect effects.
