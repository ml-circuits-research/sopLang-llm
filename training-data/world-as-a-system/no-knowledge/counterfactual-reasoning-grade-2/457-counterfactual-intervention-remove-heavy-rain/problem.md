# 457 — Counterfactual intervention: remove heavy rain

Knowledge context. Counterfactual reasoning asks what the model predicts if one condition were changed while the rest of the causal structure is held fixed.

Given facts. Causal rules for a simplified town model: heavy rain → high river; high river AND unclosed gate → flooded square; flooded square → market closes. Actual facts: heavy rain occurred and the gate was not closed. Cross-domain check: a survey team starts work at 8:00 and works for 2 hour(s) without a break.

Rules. A counterfactual intervention changes one specified fact and then recomputes consequences from the rules. Keep all other stated rules the same unless the intervention changes them. For the cross-domain check, finishing time = starting time + duration.

Task. Under the intervention “remove heavy rain”, what changes in the consequences? Cross-domain check: at what time does the team finish?
