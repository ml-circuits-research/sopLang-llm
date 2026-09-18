# 756 — Exhaustive case analysis

Given knowledge. Seeds can be dispersed by wind, water, or animals. In the model, a seed reaches a new place only if it leaves the parent plant and remains capable of germinating after transport. Light seeds or seeds with wings can be carried more easily by wind. Some fruits have hooks that attach to fur.

Problem data. A=the seed leaves the parent plant; B=the agent can transport it; C=the seed remains viable. The target result is “the seed reaches a new place while still viable”. In this submodel, target appears exactly in cases in which exactly one condition is YES. Each letter can be YES or NO.

Question. Systematically enumerate all 8 A/B/C combinations and identify exactly the favorable cases. Explain why the enumeration is complete.
