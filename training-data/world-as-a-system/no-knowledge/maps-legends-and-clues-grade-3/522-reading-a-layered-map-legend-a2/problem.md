# 522 — Reading a layered map legend (A2)

Knowledge context. A map legend translates symbols into properties. One location may have several properties at the same time.

Given facts. Legend: tree=forest, wavy line=river, double line=road, arch=bridge, square=village, triangle=hill. Cells: A1 has forest, road; A2 has bridge, river, village; B1 has forest, river, road; B2 has road, village. Cross-domain check: a local committee has 8 members, requires at least 5 present for quorum, and 8 are present.

Rules. A cell satisfies the task only if it has every required attribute. Extra attributes do not disqualify it unless the task says so. For the cross-domain check, quorum exists when present members ≥ the stated threshold.

Task. Which cell or cells satisfy all of these conditions: bridge, river? Explain by intersecting the clues. Cross-domain check: is quorum met?
