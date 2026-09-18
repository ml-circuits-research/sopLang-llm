# 275 — Reading a layered map legend (A1)

Knowledge context. A map legend translates symbols into properties. One location may have several properties at the same time.

Given facts. Legend: tree=forest, wavy line=river, double line=road, arch=bridge, square=village, triangle=hill. Cells: A1 has forest, road; A2 has bridge, river; B1 has bridge, forest, river, road; B2 has road, village. Cross-domain check: researchers collected 11 reports, but 4 are exact duplicate copies that add no new independent information.

Rules. A cell satisfies the task only if it has every required attribute. Extra attributes do not disqualify it unless the task says so. For the cross-domain check, independent reports = total reports − duplicate copies.

Task. Which cell or cells satisfy all of these conditions: river, road? Explain by intersecting the clues. Cross-domain check: how many non-duplicate reports remain?
