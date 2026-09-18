# 665 — Planning with partial dependencies

Given knowledge. During exercise, muscles need more oxygen and energy, and pulse and breathing may increase. after exercise stops, the values tend to return gradually toward the resting level. In the model, recovery is tracked by measurements taken at the same time intervals. Sweating can contribute to water loss. A single measurement does not describe the whole recovery process.

Problem data. The dependencies are: “resting state is measured” without prerequisites; “the effort is performed” after “resting state is measured”; “the effort stops” after “resting state is measured”; “the measurement is repeated” after “the effort is performed” and “the effort stops”; “restoration is compared” after “the effort stops”.

Question. Build a level-by-level plan: which tasks can be done in parallel, and which task must wait for several prerequisites? Also give one valid total ordering.
