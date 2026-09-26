# Raspunsuri

Fisierul acesta este locul unde se scriu raspunsurile pentru proprietar. Contine doar ULTIMUL status:
fiecare raport nou il inlocuieste pe cel vechi.

---

## Status — 2026-09-24, 10:30Z: modelele si rezultatele lor la eval

### Modelele fine-tunate (cu rezultat la holdout)

| model | baza | versiune date | antrenat | holdout | procedural (480) |
| --- | --- | --- | --- | --- | --- |
| exp-016-wires | Qwen2.5-Coder-1.5B | dv3 — fire declarative | 2026-09-24 08:14Z | **440/705 (62.4%)** | **440 (91.7%)** |
| exp-014-deep-chains | Qwen2.5-Coder-1.5B | dv2 — transa adanca | ≈2026-09-23 17:10Z | 379/705 (53.8%) | 377 (78.5%) |
| exp-015-deep-chains-05 | Qwen2.5-Coder-0.5B | dv2 — transa adanca | ≈2026-09-23 19:53Z | 362/705 (51.3%) | 361 (75.2%) |
| exp-013-1.5b | Qwen2.5-Coder-1.5B | dv1 — inventar | ≈2026-09-23 07:59Z | 322/585 (55.0%)* | — |
| exp-012-census | Qwen2.5-Coder-0.5B | dv1 — inventar | ≈2026-09-22 22:50Z | 258/585 (44.1%)* | — |
| exp-017-qwen3-17b | Qwen3-1.7B | dv3 — fire declarative | in antrenare | — | — |

* setul de eval era de 585 de itemi; de la dv2 e de 705 (120 de compozitii noi rezervate).

Concluzia masurata: aceeasi baza 1.5B, aceleasi date — firele declarative au ridicat holdout-ul de la
379 la 440 (+61 corecte, +8.6 puncte) si au prabusit erorile de executie pe procedural de la 63 la 13.
Cartile raman la 0/225: firele ajuta unde modelul compileaza formele respective; cartile au nevoie de
familii proprii (urmatoarea transa).

### Bazele neantrenate (raspund in proza, acelasi eval)

| baza | corecte |
| --- | --- |
| Qwen2.5-Coder-0.5B | 63/585 (10.8%) |
| Qwen2.5-Coder-1.5B | 30/585 (5.1%) |
| Qwen2.5-1.5B (general) | 80/705 (11.3%) |
| Qwen3-1.7B | 357/705 (50.6%) — castigatoarea shootout-ului |

### Ce ruleaza acum

- exp-017-qwen3-17b antreneaza (Qwen3-1.7B pe fire, dv3); cand se inchide lantzul, castigatorul intra
  automat in chat cu identitatea completa (1.7B · Qwen3-1.7B · dv3 · data antrenarii).
- Sentinela de sesiune verifica la 30 de minute; disc 451 GiB; infrastructura portabila in
  skills/night-orchestration, testata 353/353.

## Status — 2026-09-25, 16:30Z: containerele au miscat cartile

### exp-021 (Qwen3-1.7B, dv7 containere): 460/705 (65.2%) — cel mai bun holdout al seriei

| carte | corecte | erori de executie |
| --- | --- | --- |
| **world-as-a-system** | **20/20 (100%)** | 0 |
| procedural | 438/480 (91.3%) | 12 |
| mathematical-thinking | 2/10 | 1 |
| decompose-to-solve | 0/100 | 8 |
| common-sense | 0/50 | 19 |
| celelalte | 0 | — |

Ipoteza containerelor e validata masurabil: prima familie de carti (world-as-a-system) a trecut de la
0 la 100%, iar runtime completion a sarit la 91.9%. Celelalte carti raman la 0 - formele lor (scheduling,
ratiune de bun-simt) nu sunt inca in vocabular. Urmeaza dv8 (refactorizarea modulara a corpurilor
monstruoase) si exp-022 - experimentul de structura pentru articol.

## Status — 2026-09-25, 21:55Z: verdictul experimentului de structura

dv7 monolitic: 460/705 (65.2%) | dv8 modular: 448/705 (63.5%) — acelasi model de baza, aceeasi reteta.
Structura modulara a mutat indicatorul de bloat (2.81 fire/plan vs 2.19) dar a costat 12 raspunsuri
si a dublat erorile de executie (135 vs 57). Punctul bun masurat: planul compact (2-3 fire, putine
linii) — exact stilul familiilor de containere care au dus world-as-a-system la 20/20. Urmatoarele
familii se scriu compact, niciodata supra-sparte. Verdictul e in articol (04/05) si in registry.

## Status — 2026-09-26, 03:30Z: dv9 masurat, setul revenit la dv7

dv9 (containerele pe cele doua carti inca la 0): 428/705 (60.7%) — common-sense 0/50 si
decompose-to-solve 0/100 raman la 0, iar perturbarea a costat 28 de raspunsuri procedurale si 4 world.
Ordinea masurata: dv7 460 (65.2%) > dv8 448 (63.5%) > dv9 428 (60.7%). Generatorul e REVENIT la
corpurile dv7 (VERSION 10, rebuild + verify OK + export 9935 + suita 382/382). Concluzia: restructurarea
corpurilor existente nu misca cele doua carti; urmatorul brat are nevoie de o alta ipoteza (comanda
dedicata de lant/rata, sau simplificarea enunturilor).

## Status — 2026-09-26, 09:00Z: exp-024 (dv11) antreneaza dupa o noapte grea

Problema de noapte: cache-ul de pagini (99 GiB) bloca pool-ul unificat al GB10, asa ca
guard-ul de memorie oprea exp-024 la pasul 0 si 7 desi host-ul avea 80-111 GiB disponibili.
Am reparat in trei locuri si totul e comis:
1. cache-squeeze.sh in skills/night-orchestration: detecteaza semnatura (driver free < 48 GiB
   cu host disponibil >= 48) si stoarce cache-ul atingand pagini anonime la pas de 4K; ruleaza
   automat in preflight si apare in health-check.
2. Guard-ul de memorie (training/python/sft_train.py): pragul se judeca acum pe MemAvailable
   (care numara cache-ul recuperabil), nu pe citirea soferului care exclude cache-ul; DS009
   actualizat. A doua problema a noptii: doua antrenori rulau simultan (linia veche reinviata
   prin resume + lansarea noua) - am ucis linia veche; una singura ruleaza acum.
3. Setul de date e dv11 (compresia formularii celor doua carti la zero) - verify OK, export
   9935, suita 382/382. exp-024 (Qwen3-1.7B) antreneaza pe el; holdout-ul vine ~13:45Z.

Seriile masurate pana acum: dv7 460/705 (65.2%) > dv8 448 (63.5%) > dv9 428 (60.7%).

## Status — 2026-09-26, 13:00Z: dv11 masurat, verdictul: enunturile sunt problema

exp-024 (dv11, formulari compacte): 439/705 (62.3%). Cele doua carti raman la 0/0. Dovada decisiva:
qwen3-17b (exp-017) a luat TOT 0/100 si 0/50 pe ele - marimea modelului nu ajuta, setul de date e.
Urmatorul brat (dv12): simplificarea ENUNTURILOR celor doua carti (propozitii scurte, fara distractori,
numerele simple) cu parse-ul actualizat in acelasi pas; calculul si raspunsurile compacte raman.
