# E3 paired items with the statement's trailing newline restored

The same 30 problems as `../paired/` (15 scheduling and 15 coalition problems, each in the book wording and in the procedural wording), with one change: every statement ends with the newline that the held-out evaluation sends (`statementBodyOf(problem.md)` keeps it; `../paired/` had it removed by `trimEnd()`). Built on 2026-09-29 to test whether that one byte explains why re-generated book-wording programs differed from those of the original held-out evaluations of the same checkpoints.
