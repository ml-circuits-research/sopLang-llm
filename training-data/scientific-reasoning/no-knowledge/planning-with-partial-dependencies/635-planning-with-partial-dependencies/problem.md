# 635 — Planning with partial dependencies

Given knowledge. Seeds can be dispersed by wind, water, or animals. In the model, a seed reaches a new place only if it leaves the parent plant and remains capable of germinating after transport. Light seeds or seeds with wings can be carried more easily by wind. Some fruits have hooks that attach to fur.

Problem data. The dependencies are: “the fruit ripens” without prerequisites; “the seed detaches” after “the fruit ripens”; “the agent transports it” after “the fruit ripens”; “the seed is deposited” after “the seed detaches” and “the agent transports it”; “begins the test of germination” after “the agent transports it”.

Question. Build a level-by-level plan: which tasks can be done in parallel, and which task must wait for several prerequisites? Also give one valid total ordering.
