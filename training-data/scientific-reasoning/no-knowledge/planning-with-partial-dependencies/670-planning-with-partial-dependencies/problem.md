# 670 — Planning with partial dependencies

Given knowledge. Microorganisms can multiply on food when they find suitable conditions. In the model, cooling slows multiplication, drying reduces available water, and a clean container reduces initial contamination; none of these measures means that a food becomes sterile. Heat and moisture can speed some biological processes. “Cold” means slowing in the model, not absolute stopping.

Problem data. The dependencies are: “equal portions have been prepared” without prerequisites; “the preservation method is applied” without prerequisites; “the same time is kept” after “equal portions have been prepared”; “the change is observed” after “the preservation method is applied”; “the samples have been compared” after “the same time is kept” and “the change is observed”.

Question. Build a level-by-level plan: which tasks can be done in parallel, and which task must wait for several prerequisites? Also give one valid total ordering.
