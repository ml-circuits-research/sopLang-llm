## What is running right now
1. The newly trained model (Qwen3-1.7B on the simplified statements) finished training.
   Its evaluation chain is scoring checkpoints now; the holdout verdict is expected around
   18:30 UTC. No number yet - nothing is invented before it is measured.
2. In parallel, a new benchmark sanity experiment (agent-eval) is running. Design: one agent
   receives the statements of 20 holdout problems from the two stuck books (without the
   answers) and writes the circuits by hand, using the wire language and the documentation.
   A second, independent agent will execute those circuits and score them against the
   recorded answers. RESULT (measured): 2 of 20 pass. The writer computed about 18 of 20
   correctly, but the answer comparison of the two books is exact-phrase based: the recorded
   answers carry unit words and prose wrappers that no solver can derive from the statement.
   Conclusion: for the two stuck books the benchmark measures phrase reproduction, not
   computation. Per the stop rule, the dataset-design line stops here; proposal.md records
   the fix (value-based comparison, or canonical answers) and the re-test criterion
   (a competent writer must reach 20 of 20) before any further training.

## Which model is which — stated plainly
- The working model is Qwen3-1.7B. It is small on purpose: the whole research goal is to make
  a small model compile problems into circuits.
- We also trained Qwen3-17B once, as a control experiment, to check whether the failures came
  from the model being too small. The 17B model scored 442 of 705 on the holdout, and it also
  scored zero on the two stuck books (decompose-to-solve 0 of 100, common-sense 0 of 50).
  Therefore model size is not the problem. We continue with the 1.7B model.

## The benchmark, category by category (best measured run: 460 of 705 correct, 65.2%)
The benchmark has 705 problems: 480 procedural arithmetic problems plus 225 problems from
7 reasoning books.
- Success: procedural-arithmetic 438 of 480 correct (91%); world-as-a-system 20 of 20 (100%,
  the first book solved completely, achieved by the container abstraction).
- Failure: the other five books are at zero — decompose-to-solve 0/100, common-sense 0/50,
  scientific-reasoning 0/25, adult-reasoning 0/10, logical-reasoning 0/10.
- Almost zero: mathematical-thinking 2 of 10 correct (20%). This is still a failure; "2 of 10"
  means two correct answers out of ten problems.

## What succeeded and what failed (all measured)
1. Containers (building a data store in stages) — SUCCESS. This abstraction moved
   world-as-a-system from 0 to 20 of 20 and produced the best run of the series (65.2%).
2. Splitting computations into many small wires — FAILURE. 63.5%, with execution errors
   doubled. Compact plans are better than over-split plans.
3. Rewriting the two stuck books in the container style — FAILURE. 60.7%, the books stayed at zero.
4. Shortening the printed answers to bare values — NO EFFECT on the stuck books. 62.3%.
5. Training a 10x larger model (Qwen3-17B) — NO EFFECT on the stuck books.
6. Simplifying the problem statements (one number per sentence, no distractor sentences) —
   CURRENTLY BEING MEASURED, verdict expected around 17:45 UTC.

## Are the two stuck books' datasets wrong?
Technically they are not wrong: every circuit in the dataset passes the validation gate (each
circuit reproduces its printed answer and reacts to its inputs). The problem is pedagogical:
no model has learned the mapping from those statements to circuits. The simplified statements
are the current attempt to fix that.

## Infrastructure repairs from tonight (committed)
- The system page cache (99 GB) was blocking the GPU's shared memory pool and stopping
  training runs at step 0. A new skill script (cache-squeeze) now detects and fixes this
  automatically before every launch.
- The memory guard now judges the floor by the kernel-visible available pool (MemAvailable)
  instead of the driver's cache-excluding view; DS009 documents the change.
- Two training processes were running at once after an accidental revival; the stale one
  was killed.

## Session close (both experiments measured)
1. The simplified-statements run finished: 432 of 705 correct (61.3%). The two stuck books
   remain at zero (common-sense 0/50, decompose-to-solve 0/100). That is the fifth dataset
   arm to fail on them.
2. The stop rule applies: the dataset-design line is closed. No further training arms.
3. Next session, per proposal.md: make the books' answer comparison value-based (numbers plus
   verdict) or canonicalize the recorded answers to statement-derivable forms, then re-run
   the writer experiment until a competent writer reaches 20 of 20. Only then reconsider
   training.
4. The session's measured results stand: the container abstraction solved world-as-a-system
   (20/20) and the best holdout is 460 of 705 (65.2%). The goal of 90% remains open.
