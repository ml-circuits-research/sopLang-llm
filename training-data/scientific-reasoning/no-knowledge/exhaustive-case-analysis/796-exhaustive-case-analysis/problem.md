# 796 — Exhaustive case analysis

Given knowledge. A lever has a fulcrum, a load, and a place where effort is applied. In the numerical model, for the same load, moving the effort farther from the fulcrum can reduce the force required. The fulcrum is the point around which the lever rotates. The effort arm is the distance between the applied effort and the fulcrum.

Problem data. A=there is a fulcrum; B=effort is applied on the correct side; C=effort arm is large enough. The target result is “the load can be lifted with the available force”. In this submodel, target appears exactly in cases in which A is YES or both B and C are YES. Each letter can be YES or NO.

Question. Systematically enumerate all 8 A/B/C combinations and identify exactly the favorable cases. Explain why the enumeration is complete.
