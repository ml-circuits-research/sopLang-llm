# 675 — Planning with partial dependencies

Given knowledge. A lever has a fulcrum, a load, and a place where effort is applied. In the numerical model, for the same load, moving the effort farther from the fulcrum can reduce the force required. The fulcrum is the point around which the lever rotates. The effort arm is the distance between the applied effort and the fulcrum.

Problem data. The dependencies are: “the support is fixed” without prerequisites; “the load is positioned” without prerequisites; “the point of effort is chosen” after “the support is fixed” and “the load is positioned”; “the force is applied” after “the point of effort is chosen”; “the load rises” after “the load is positioned”.

Question. Build a level-by-level plan: which tasks can be done in parallel, and which task must wait for several prerequisites? Also give one valid total ordering.
