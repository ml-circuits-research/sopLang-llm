# 289 — Propagation of effects through a network

Problem world. In our model, a sensory receptor detects a stimulus, sends a nerve signal, the control center interprets the information, and muscles can produce a response. If the signal does not reach the control center, a response based on that signal cannot be chosen correctly. A fast response is not automatically a correct response; the information must first be detected and transmitted.

Case data. The network of dependencies has the arrows: stimulus visible → the receptor detects it; the receptor detects it → nerve signal; nerve signal → information interpreted; information interpreted → command for muscle. We change “stimulus visible”.

Question. Mark every node the effect can reach, directly or indirectly. Do not include nodes for which no arrow path exists.
