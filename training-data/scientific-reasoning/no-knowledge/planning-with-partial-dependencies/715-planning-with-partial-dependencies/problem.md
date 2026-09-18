# 715 — Planning with partial dependencies

Given knowledge. In the circuit model, the metals used here are conductors, while plastic and rubber are insulators. Current appears only if there is a continuous conducting path between the source terminals; insulation is used to prevent contact with conducting parts. A conductor allows current to pass in the model. An insulator breaks the electrical path.

Problem data. The dependencies are: “the source is connected” without prerequisites; “the insulation is checked” without prerequisites; “the switch is closed” after “the source is connected”; “current flows through the path” after “the insulation is checked”; “the bulb shines” after “the switch is closed” and “current flows through the path”.

Question. Build a level-by-level plan: which tasks can be done in parallel, and which task must wait for several prerequisites? Also give one valid total ordering.
