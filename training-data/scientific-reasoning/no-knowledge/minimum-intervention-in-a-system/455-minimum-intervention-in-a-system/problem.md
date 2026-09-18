# 455 — Minimum intervention in a system

Problem world. In our model, a push or pull can change an object’s motion. Friction opposes sliding and is greater on some surfaces than on others. If the applied force is the same, greater friction tends to make the object travel a shorter distance in our test. For a fair comparison, we keep the same object and the same push.

Case data. The system should be modified as little as possible. The targets are: comparison fair, friction reduced; forbidden effects: friction increased. Available interventions: surface more smooth: cost 2, effects [friction reduced], undesired effects [none]. The same push: cost 1, effects [comparison fair], undesired effects [none]. Gears: cost 2, effects [movement more light], undesired effects [none]. Sand along the route: cost 1, effects [traction], undesired effects [friction increased].

Question. Find the minimum intervention: first minimize total cost, then, when costs are tied, minimize the number of actions. Prove minimality, not just feasibility.
