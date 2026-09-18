# 273 — Reading a layered map legend (B1)

Knowledge context. A map legend translates symbols into properties. One location may have several properties at the same time.

Given facts. Legend: tree=forest, wavy line=river, double line=road, arch=bridge, square=village, triangle=hill. Cells: A1 has forest, road; A2 has bridge, river; B1 has forest, river, road; B2 has forest, road, village. Cross-domain check: a survey team starts work at 8:00 and works for 2 hour(s) without a break.

Rules. A cell satisfies the task only if it has every required attribute. Extra attributes do not disqualify it unless the task says so. For the cross-domain check, finishing time = starting time + duration.

Task. Which cell or cells satisfy all of these conditions: forest, river? Explain by intersecting the clues. Cross-domain check: at what time does the team finish?
