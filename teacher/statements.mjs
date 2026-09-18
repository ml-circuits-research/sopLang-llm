/**
 * The solver-visible projection of a problem statement.
 *
 * The dataset writer and the pilot share one notion of what a solver receives:
 * the printed statement, plus a labelled referenced-context line when the
 * family materializes a premise the statement hands to an earlier problem.
 */

/**
 * Some printed statements hand their premise to the previous problem ("Using
 * the same dictionary", "From the previous problem"). A solver that receives
 * the statement alone cannot recover that data, so the family must declare it:
 * `sharedPremise` states the referenced fact in one sentence, and the artifact
 * writer prints it as a labelled referenced-context line in `problem.md`. A
 * statement that still references outside data without a declared premise is
 * rejected instead of being shipped as an unanswerable example.
 *
 * The scan names the reference shapes the seed books actually print and keeps
 * them narrow on purpose: a bare "previous" also appears in ordinary domain
 * prose ("connect the previous holder to the next"), which is not a reference
 * to another problem, so only a reference to a previous problem, model,
 * statement, or step, and the "same data/dictionary/code/table" family of
 * phrases, trigger the check.
 */
const REFERENCE_PATTERN =
  /\b(previous (problem|model|statement|step|part|diagram|table|list|item|case|question)|same (dictionary|code)|with the same data)\b/i;

export function referencesExternalContext(problem) {
  return REFERENCE_PATTERN.test(problem.statement);
}

/**
 * A family may declare `clarification`: the information a case needs that the
 * source's task statement leaves implicit, such as the selection rule a case
 * number follows when the statement asks for one of several valid answers. The
 * clarification belongs to the solver-visible projection — it is written into
 * `problem.md` and fed to the reference parse — so the compiled plan is
 * reproduced from the same text a solver receives, and a case that only the
 * answer key could settle is never shipped.
 *
 * The declaration is either a string or a function of the problem, because one
 * printed template covers many variants: the world book repeats one land-use
 * constraint statement across five cases of a grade, and the scientific book
 * repeats one refusal-and-labels template across twenty-five worlds, so the
 * sentence a solver needs differs per variant while the template does not.
 */
export function clarificationOf(entry, problem = undefined) {
  const value = typeof entry.clarification === 'function' ? entry.clarification(problem) : entry.clarification;
  const text = typeof value === 'string' ? value.trim() : '';
  return text === '' ? null : text;
}

export function hasDeclaredPremise(entry) {
  return typeof entry.sharedPremise === 'string' && entry.sharedPremise.trim() !== '';
}

/**
 * The exact text a solver receives and `problem.md` carries: the statement,
 * the declared referenced context when the family materializes one, and the
 * declared clarification when the case needs one.
 */
export function solverText(entry, problem) {
  const parts = [problem.statement];
  if (hasDeclaredPremise(entry)) {
    parts.push(`Referenced context: ${entry.sharedPremise}`);
  }
  const clarification = clarificationOf(entry, problem);
  if (clarification !== null) {
    parts.push(`Additional information. ${clarification}`);
  }
  return parts.join('\n\n');
}
