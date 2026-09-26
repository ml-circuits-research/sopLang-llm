# Ce fac acum — 2026-09-26, 16:40

## Ce ruleaza in acest moment
Antrenez modelul Qwen3-1.7B (1,7 miliarde de parametri) pe setul nostru de 9.935 de exemple.
Fiecare antrenament dureaza ~3 ore, apoi modelul e evaluat pe un "holdout" de 705 probleme pe care
nu le-a vazut niciodata la antrenare. Verdictul celui care antreneaza ACUM vine ~17:45.

## Ce testez acum (ipoteza)
Ultimele doua carti de probleme au scor ZERO la orice am incercat: "descompune si rezolva"
(decompose-to-solve, 0 din 100) si "bun-simt" (common-sense, 0 din 50). Am verificat ca nici
modelul de 10 ori mai mare (17 miliarde) nu le poate rezolva — deci problema e in TEXTELE
problemei, nu in marimea modelului. Acum am simplificat enunturile (un numar pe propozitie,
fara propozitii-distractor). Verdictul vine ~17:45.

## Ce a mers (confirmat, masurat)
1. ABSTRACTEREA "CONTAINER" (lucrul pe etape cu un magazin de date) a functionat. Prima data
   cand o carte intreaga de probleme a fost rezolvata complet: "world-as-a-system" 20 din 20.
   Cu aceasta schimbare setul a atins maximul seriei: 460 din 705 corecte (65,2%).
2. Documentatia firelor (wire-types) + regula din AGENTS.md ca orice modificare de fire
   actualizeaza documentatia: facuta si mentinuta la zi.
3. Bucla de invatare a abstractiilor: masoara -> semnaleaza -> propune -> valideaza -> masoara;
   instrumentele (static-check, discover-wires) ruleaza dupa fiecare experiment.

## Ce a esuat (confirmat, masurat)
1. Spargerea calculelor in multe fire mici (structura "modulara"): 448 corecte, mai rau decat
   forma compacta (460), cu erori de executie DUBLATE. Concluzie: planuri compacte, nu sparte.
2. Rescrierea celor doua carti blocate in stilul containerelor: 428 corecte; cartile au ramas 0.
3. Scurtarea raspunsurilor la valoarea bruta (fara proza): 439 corecte; cartile au ramas 0.
4. Marimea modelului: 17 miliarde = tot 0 la cele doua carti. Nu asta e problema.

## Ce am observat in plus
- Proceduralul (aritmetica simpla) fluctueaza 410-438 pe aceleasi exemple intre experimente
  identice ca date: e zgomot de masurare, nu semnal.
- Noaptea a avut doua incidente de infrastructura, ambele reparate si comise:
  (a) cache-ul de pagini al sistemului (99 GB) bloca memoria GPU-ului si oprea antrenamentele
  la pasul 0/7 — acum un script din skills detecteaza si rezolva automat inainte de lansare;
  (b) doi antrenori rulau simultan dupa o reinviere accidentala — l-am oprit pe cel vechi.
- Fiecare schimbare de date trece prin poarta de validare (fiecare circuit trebuie sa
  reproduca raspunsul tiparit) — a prins un raspuns "copt" (nerulat) inainte de antrenare.

## Ce urmeaza
- ~17:45: verdictul enunturilor simplificate. Daca misca cele doua carti, continuam pe firul
  asta. Daca nu, concluzia sesiunii: 90% pe benchmark nu vine din designul setului de date;
  trebuie alta abordare de predare (demonstratii in context, alta impartire a pasilor).
- Obiectivul ramane 90% pe benchmark (acum 65,2% maxim).
