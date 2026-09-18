# 56 — Classification by multiple rules

Problem world. In our model, water may be solid, liquid, or water vapor. Sufficient heating can cause melting or evaporation, and cooling can cause condensation or freezing. A change of state does not mean that the water has ceased to exist; only the form in which we observe it has changed. We use only the heating and cooling relationships stated here, without relying on memorized temperature values.

Case data. Case A: is heated: YES; can flows: YES; is cooled: NO; is in a container closed: YES. Case B: is heated: YES; can flows: NO; is cooled: YES; is in a container closed: YES. Case C: is heated: NO; can flows: YES; is cooled: YES; is in a container closed: YES. Case D: is heated: YES; can flows: YES; is cooled: YES; is in a container closed: YES.

Question. The competition rule says that only the case meeting ALL requirements is accepted: is cooled, is heated, is in a container closed, can flows; and the forbidden properties are: no additional forbidden property. Which case is accepted? It is not enough to find a case that meets only some of the conditions.
