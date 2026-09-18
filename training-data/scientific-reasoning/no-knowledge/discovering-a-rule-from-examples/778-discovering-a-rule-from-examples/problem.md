# 778 — Discovering a rule from examples

Given knowledge. Bones support the body, joints allow movement between certain bones, and muscles pull on bones when they contract. In the arm model, bending the forearm requires a movable joint, a muscle that contracts, and a bone through which the force is transmitted. Muscles pull; they do not push a bone from a distance. Different joints allow different types of movement.

Problem data. A means “the elbow joint can move”, B means “the flexor muscle contracts”. A box applies the same unknown logical rule: A=NO, B=NO → result=NO; A=NO, B=YES → result=YES; A=YES, B=YES → result=YES. Candidates: R1=A AND B; R2=A OR B; R3=exactly one; R4=neither A nor B.

Question. Eliminate candidate rules that are incompatible with even one example. Which rule remains? Use it for the new case A=YES, B=NO.
