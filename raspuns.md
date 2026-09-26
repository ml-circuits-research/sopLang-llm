# Status — 2026-09-26, 16:50 — raspunsuri pe scurt

## Da, am testat modelul de 17 miliarde
- Model: Qwen3-17B (17 miliarde de parametri), antrenat de noi saptamana aceasta (fisierul de
  evaluare: evaluation/registry/exp-017-qwen3-17b/metrics.json).
- Rezultat: 442 din 705 corecte pe holdout.
- Pe cele doua carti blocate: decompose-to-solve 0/100, common-sense 0/50 — TOT ZERO, ca la
  modelul mic de 1,7 miliarde.
- ATENTIE, onest: testul de 17 miliarde a fost pe setul de date de ATUNCI (inainte de containere);
  enunturile celor doua carti erau practic identice cu cele de acum. Concluzia: nu marimea
  modelului e problema, ci cele doua carti in sine.

## Sunt gresite seturile de date la cele doua carti?
Nu sunt gresite tehnic: fiecare circuit din set trece poarta de validare (reproduce raspunsul
tiparit, verifica reactivitatea). Gresite sunt ca PREDARE: niciun model nu invata maparea
enunt -> circuit pe ele. Acum testez daca enunturile simplificate rezolva asta (verdict ~17:45).

## Succes si esec pe carti (cu cel mai bun set de pana acum, cel cu containere, 460/705 = 65,2%)
- SUCCES: world-as-a-system 20/20 (100%, prima carte rezolvata complet), procedural-arithmetic
  438/480 (91%).
- ESEC: decompose-to-solve 0/100, common-sense 0/50, scientific-reasoning 0/25,
  adult-reasoning 0/10, logical-reasoning 0/10, mathematical-thinking 2/10.

## Ce am incercat si ce a dat (toate masurate)
- Containere (magazin construit in etape): SUCCES, a rezolvat cartea world 0 -> 20/20, 65,2% total.
- Spargerea calculelor in fire mici: ESEC (63,5%, erori de executie dublate).
- Container-stil aplicat pe cartile blocate: ESEC (60,7%, cartile tot 0).
- Raspunsuri scurte, fara proza: NUL (62,3%, cartile tot 0).
- Modelul de 10 ori mai mare: NUL pe cartile blocate.
- Enunturi simplificate: IN TEST ACUM, verdict ~17:45.

## Ce urmeaza
Daca enunturile simplificate nu misca cele doua carti, concluzia sesiunii: designul setului nu
mai e parghia; urmatoarea ipoteza e predarea cu demonstratii in context. Obiectivul ramane 90%
pe benchmark (maxim actual 65,2%).
