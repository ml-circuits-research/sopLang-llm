# 415 — Minimum intervention in a system

Problem world. In our model, a sensory receptor detects a stimulus, sends a nerve signal, the control center interprets the information, and muscles can produce a response. If the signal does not reach the control center, a response based on that signal cannot be chosen correctly. A fast response is not automatically a correct response; the information must first be detected and transmitted.

Case data. The system should be modified as little as possible. The targets are: signal transmitted, stimulus easy of detected; forbidden effects: stimulus blocked. Available interventions: increasing the contrast: cost 1, effects [stimulus easy of detected], undesired effects [none]. Restoration of the path of signal: cost 2, effects [signal transmitted], undesired effects [none]. Release of the muscle: cost 1, effects [motion possible], undesired effects [none]. Covering of the receiver: cost 1, effects [protection], undesired effects [stimulus blocked].

Question. Find the minimum intervention: first minimize total cost, then, when costs are tied, minimize the number of actions. Prove minimality, not just feasibility.
