# 897 — Robust decision-making under uncertainty

Given knowledge. Animals can respond to seasons through migration, hibernation, storing food, or changing their coat. In the model, a strategy succeeds if the animal secures energy, protection, and access to resources under the season’s conditions. Migration means seasonal movement between regions. Hibernation greatly reduces activity during certain periods.

Problem data. The real state is unknown. The following scenarios are still possible: only “there is sufficient energy” is faulty, only “there is protection from the cold” is faulty. Only one condition is faulty in each scenario. Actions: X repairs A, cost 1; Y repairs B, cost 1; Z repairs A, B, cost 2; W repairs A, B, C, cost 4; V repairs B, C, cost 3.

Question. Choose one action now that guarantees a repair regardless of which still-possible scenario is real. Which guaranteed action is robust and has the minimum cost?

Additional information. The faulty conditions named above carry the labels A and B.
