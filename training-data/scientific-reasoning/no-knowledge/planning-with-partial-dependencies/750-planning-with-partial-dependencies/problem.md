# 750 — Planning with partial dependencies

Given knowledge. In the kitchen model, heating transfers energy, dissolving forms a homogeneous mixture only for certain substances and quantities, and clean utensils reduce contamination. Experimental recipes can be compared only when quantities and times are measured in the same way. A dissolved substance has not disappeared; it is distributed through the solvent. Stirring can speed dissolving without changing the maximum amount allowed by the model.

Problem data. The dependencies are: “the ingredients have been measured” without prerequisites; “temperature is controlled” without prerequisites; “they have been mixed” after “the ingredients have been measured” and “temperature is controlled”; “time is measured” after “they have been mixed”; “the result is compared” after “temperature is controlled”.

Question. Build a level-by-level plan: which tasks can be done in parallel, and which task must wait for several prerequisites? Also give one valid total ordering.
