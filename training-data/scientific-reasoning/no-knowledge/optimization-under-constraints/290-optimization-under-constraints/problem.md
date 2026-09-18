# 290 — Optimization under constraints

Problem world. In our model, a sensory receptor detects a stimulus, sends a nerve signal, the control center interprets the information, and muscles can produce a response. If the signal does not reach the control center, a response based on that signal cannot be chosen correctly. A fast response is not automatically a correct response; the information must first be detected and transmitted.

Case data. The target is to obtain all of the following conditions: signal transmitted, stimulus easy of detected. The forbidden effects are: stimulus blocked. The options are: increasing the contrast: cost 1, effects [stimulus easy of detected], undesired effects [none]. Restoration of the path of signal: cost 2, effects [signal transmitted], undesired effects [none]. Release of the muscle: cost 1, effects [motion possible], undesired effects [none]. Covering of the receiver: cost 1, effects [protection], undesired effects [stimulus blocked].

Question. Choose the combination with the minimum total cost that reaches the target without a forbidden effect. Show why a cheaper solution does not work.
