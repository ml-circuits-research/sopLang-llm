# Status — 2026-09-26, 16:35Z

## Acum
exp-025 (dv12, enunturi simplificate) antreneaza: ~pasul 625/660, loss 0.0016, terminat ~16:45Z.
Verdictul holdout-ului ~17:45Z: decide daca enunturile simplificate misca cele doua carti blocate
(decompose-to-solve 0/100 si common-sense 0/50 in TOATE bratele) sau daca e nevoie de alta abordare.

## Concluzii partiale masurate
- dv7 (containere): 460/705 (65.2%) — maximul seriei; world-as-a-system 0 -> 20/20.
- dv8 (structura modulara): 448 (63.5%) — mai rau; erorile de executie dublate. Planurile compacte castiga.
- dv9 (container idiom pe cartile zero): 428 (60.7%) — nu s-a transferat.
- dv11 (raspunsuri compacte): 439 (62.3%) — nul pe cartile zero.
- qwen3-17b: tot 0/100 si 0/50 pe cartile zero -> setul de date, nu marimea modelului.
- Proceduralul fluctueaza 410-438 pe randuri identice = zgomot de pipeline.

## Reparat in aceasta noapte
- cache-squeeze.sh in skills/night-orchestration: detecteaza si stoarce cache-ul de pagini care bloca pool-ul
  unificat al GB10; ruleaza in preflight si apare in health-check.
- Guard-ul de memorie (sft_train.py): pragul judecat pe MemAvailable, nu pe citirea soferului (DS009 actualizat).
- Doi antrenori simultani (linie veche reinviata): ucisi, unul singur ruleaza.
- Verdictele dv8/dv9/dv11 + articolul + registry-ul sunt la zi si comise.
