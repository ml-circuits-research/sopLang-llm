# 655 — Planning with partial dependencies

Given knowledge. Bones support the body, joints allow movement between certain bones, and muscles pull on bones when they contract. In the arm model, bending the forearm requires a movable joint, a muscle that contracts, and a bone through which the force is transmitted. Muscles pull; they do not push a bone from a distance. Different joints allow different types of movement.

Problem data. The dependencies are: “the signal reaches muscle” without prerequisites; “the muscle contracts” without prerequisites; “the tendon is pulled” after “the signal reaches muscle”; “the bone rotates at the joint” after “the muscle contracts”; “the hand approaches” after “the tendon is pulled” and “the bone rotates at the joint”.

Question. Build a level-by-level plan: which tasks can be done in parallel, and which task must wait for several prerequisites? Also give one valid total ordering.
