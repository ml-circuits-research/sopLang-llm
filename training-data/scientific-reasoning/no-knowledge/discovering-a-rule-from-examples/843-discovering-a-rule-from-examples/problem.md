# 843 — Discovering a rule from examples

Given knowledge. Energy can be transferred and transformed. In the model, a battery stores chemical energy, a circuit transfers it electrically, a bulb produces light and heat, and a motor produces motion and heat. A device does not create energy from nothing. Useful energy depends on the purpose of the device.

Problem data. A means “there is a source of energy”, B means “the transfer path works”. A box applies the same unknown logical rule: A=NO, B=NO → result=NO; A=NO, B=YES → result=YES; A=YES, B=YES → result=NO. Candidates: R1=A AND B; R2=A OR B; R3=exactly one; R4=neither A nor B.

Question. Eliminate candidate rules that are incompatible with even one example. Which rule remains? Use it for the new case A=YES, B=NO.
