# Explanation 4.6.10 — Sampling

## Explanation

1. The three stated methods are M1 (voluntary, 1200), M2 (stratified, 120 per area), M3 (venue, 2000); only M2 selects people randomly inside every area, so only it gives each area a deliberate path into the sample.
2. An open link is filled by self-selection: whether someone sees it and chooses to answer is exactly what separates the sample from the population, so the larger voluntary group is still a group of volunteers.
3. A single shopping center on a single Saturday draws from whoever visits that place at that time, so people who never go there cannot enter the sample no matter how many interviews are conducted.
4. M2 randomly selects 120 people in each of the 4 areas, a planned 480 of 6000 people, and tracks nonresponse separately, so nonresponse can be measured instead of hidden; a larger sample would mostly shrink random error and would not repair systematic selection bias.

Reference solution as printed in the source (template 11, 4 steps):

1. M1 suffers from self-selection: inclusion depends on seeing the link and choosing to respond.
2. M3 is selected by place and time: people who do not visit that center on that Saturday cannot enter the sample.
3. M2 gives every area an explicit path to representation and uses random selection within each area. Nonresponse can still bias results, but it can at least be measured and analyzed.
4. A larger sample mainly reduces random sampling error; it does not automatically repair systematic selection bias.

## Result

**Answer.** M2, because it begins with random selection stratified by area and makes nonresponse observable.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
