# 720 — Planning with partial dependencies

Given knowledge. Energy can be transferred and transformed. In the model, a battery stores chemical energy, a circuit transfers it electrically, a bulb produces light and heat, and a motor produces motion and heat. A device does not create energy from nothing. Useful energy depends on the purpose of the device.

Problem data. The dependencies are: “energy is stored” without prerequisites; “the circuit closes” without prerequisites; “energy is transferred” after “energy is stored” and “the circuit closes”; “the device transforms it” after “energy is transferred”; “the useful output and heat appear” after “the circuit closes”.

Question. Build a level-by-level plan: which tasks can be done in parallel, and which task must wait for several prerequisites? Also give one valid total ordering.
