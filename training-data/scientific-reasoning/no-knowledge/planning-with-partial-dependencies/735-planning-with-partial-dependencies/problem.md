# 735 — Planning with partial dependencies

Given knowledge. In the hiking model, the map shows distances and elevation changes, weather can change speed, and the team has a limited reserve of water and energy. Layered clothing reduces heat loss under the stated cold conditions. Map scale allows map distance to be converted into real distance. Climbing uses more energy in the model than walking on level ground.

Problem data. The dependencies are: “the map is read” without prerequisites; “distance is estimated” without prerequisites; “the weather is checked” after “the map is read” and “distance is estimated”; “the resources have been calculated” after “the weather is checked”; “the route is chosen” after “distance is estimated”.

Question. Build a level-by-level plan: which tasks can be done in parallel, and which task must wait for several prerequisites? Also give one valid total ordering.
