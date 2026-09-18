# 330 — Optimization under constraints

Problem world. In our model, a push or pull can change an object’s motion. Friction opposes sliding and is greater on some surfaces than on others. If the applied force is the same, greater friction tends to make the object travel a shorter distance in our test. For a fair comparison, we keep the same object and the same push.

Case data. The target is to obtain all of the following conditions: comparison fair, friction reduced. The forbidden effects are: friction increased. The options are: surface more smooth: cost 2, effects [friction reduced], undesired effects [none]. The same push: cost 1, effects [comparison fair], undesired effects [none]. Gears: cost 2, effects [movement more light], undesired effects [none]. Sand along the route: cost 1, effects [traction], undesired effects [friction increased].

Question. Choose the combination with the minimum total cost that reaches the target without a forbidden effect. Show why a cheaper solution does not work.
