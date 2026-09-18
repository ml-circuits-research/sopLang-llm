# 695 — Planning with partial dependencies

Given knowledge. Air occupies space and can be compressed. In a model of a closed syringe, pushing the plunger decreases the volume of the air and increases pressure; if the air has a path out, pressure does not increase in the same way. Air is matter even though we cannot see it. A balloon can stretch when the pressure inside increases.

Problem data. The dependencies are: “the opening is closed” without prerequisites; “volume is recorded” after “the opening is closed”; “the piston is pushed” after “the opening is closed”; “the volume decreases” after “volume is recorded” and “the piston is pushed”; “pressure is compared” after “the piston is pushed”.

Question. Build a level-by-level plan: which tasks can be done in parallel, and which task must wait for several prerequisites? Also give one valid total ordering.
