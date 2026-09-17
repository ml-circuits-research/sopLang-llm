/**
 * Families for chapter 39 of the mathematical seed book: proof, counterexamples,
 * and witnesses. Every premise a solution needs is stated in the problem text,
 * so every case is `no-knowledge`; each computation decides the claim from the
 * parsed slots and prints the sentence the source prints.
 */

export const chapter = 39;

const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const NUMBER_WORDS_JS = '["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"]';

function capture(statement, pattern, what) {
  const match = statement.match(pattern);
  if (match === null) {
    throw new Error(`the statement does not state ${what}`);
  }
  return match;
}

function domainFrom(statement) {
  return capture(statement, /\{([^}]*)\}/, 'the domain')[1].split(',').map((part) => Number(part.trim()));
}

function coefficientsOf(formula) {
  const product = formula.match(/^(\d*)\((.*)\)$/);
  const factor = product === null || product[1] === '' ? 1 : Number(product[1]);
  const counts = {};
  for (const term of (product === null ? formula : product[2]).split('+')) {
    counts[term] = (counts[term] ?? 0) + factor;
  }
  return counts;
}

function closureOf(start, rules) {
  const reached = new Set([start]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const [from, to] of rules) {
      if (reached.has(from) && !reached.has(to)) {
        reached.add(to);
        changed = true;
      }
    }
  }
  return [...reached];
}

export const cases = [
  {
    template: 'Prove “all” by exhaustive cases',
    type: 'prove-all-by-exhaustive-cases',
    category: 'no-knowledge',
    parse(statement) { return { domain: domainFrom(statement) }; },
    solve(slots) { return { count: slots.domain.length, holds: slots.domain.every((value) => value % 2 === 0) }; },
    render(solution) { return solution.holds ? `The statement is true for all ${NUMBER_WORDS[solution.count]} cases.` : 'The statement is false.'; },
    compute: [
      'const slots = $slots;',
      `const words = ${NUMBER_WORDS_JS};`,
      'const holds = slots.domain.every((value) => value % 2 === 0);',
      'return holds ? "The statement is true for all " + words[slots.domain.length] + " cases." : "The statement is false.";'
    ].join('\n'),
    explain(slots) { return ['The domain is finite and the text defines "even" as having no remainder in pairs.', 'Checking every listed element against that definition covers the whole domain, so the universal claim is proved without extra assumptions.']; }
  },
  {
    template: 'One counterexample is enough to refute “all”',
    type: 'one-counterexample-is-enough-to-refute-all',
    category: 'no-knowledge',
    parse(statement) { return { threshold: Number(capture(statement, /greater than (\d+)/, 'the threshold')[1]), list: capture(statement, /\{([^}]*)\}/, 'the list')[1].split(',').map((part) => Number(part.trim())) }; },
    solve(slots) { return { witness: slots.list.find((value) => value > slots.threshold && value % 2 !== 0) }; },
    render(solution) { return solution.witness === undefined ? 'There is no counterexample.' : `${solution.witness} is a counterexample.`; },
    compute: [
      'const slots = $slots;',
      'const witness = slots.list.find((value) => value > slots.threshold && value % 2 !== 0);',
      'return witness === undefined ? "There is no counterexample." : witness + " is a counterexample.";'
    ].join('\n'),
    explain(slots) { return ['A universal claim is refuted by one element of the domain that satisfies the premise but not the conclusion.', 'Scanning the list for a number above the threshold that is not even finds such an element, so no further cases are needed.']; }
  },
  {
    template: '“There exists” is proved by a witness',
    type: 'there-exists-is-proved-by-a-witness',
    category: 'no-knowledge',
    parse(statement) { return { domain: domainFrom(statement), divisor: Number(capture(statement, /divisible by (\d+)/, 'the divisor')[1]) }; },
    solve(slots) { return { witness: slots.domain.find((value) => value % slots.divisor === 0) }; },
    render(solution) { return solution.witness === undefined ? 'There is no witness.' : `${solution.witness}.`; },
    compute: [
      'const slots = $slots;',
      'const witness = slots.domain.find((value) => value % slots.divisor === 0);',
      'return witness === undefined ? "There is no witness." : witness + ".";'
    ].join('\n'),
    explain(slots) { return ['An existence claim is proved by exhibiting one element of the domain that satisfies the condition.', 'Testing the elements for division with no remainder by the stated divisor names that witness, which is enough by itself.']; }
  },
  {
    template: 'To refute “there exists,” all cases must be eliminated',
    type: 'to-refute-there-exists-all-cases-must-be-eliminated',
    category: 'no-knowledge',
    parse(statement) { return { domain: domainFrom(statement) }; },
    solve(slots) { return { holds: slots.domain.some((value) => value % 2 !== 0), size: slots.domain.length }; },
    render(solution) { return solution.holds ? 'The statement is true.' : 'The statement is false.'; },
    compute: [
      'const slots = $slots;',
      'const holds = slots.domain.some((value) => value % 2 !== 0);',
      'return holds ? "The statement is true." : "The statement is false.";'
    ].join('\n'),
    explain(slots) { return ['A failed existence claim is refuted only by showing that every element of the domain misses the condition.', `All ${slots.domain.length} listed elements are even, so no odd element exists and the claim is false.`]; }
  },
  {
    template: 'Proof by two cases: even or odd',
    type: 'proof-by-two-cases-even-or-odd',
    category: 'no-knowledge',
    parse(statement) { return { offset: Number(capture(statement, /n and n\+(\d+)/, 'the step from n to its successor')[1]) }; },
    solve(slots) { return { flip: slots.offset % 2 === 1 }; },
    render(solution) { return solution.flip ? 'Yes, two consecutive integers have different parity.' : 'No, they have the same parity.'; },
    compute: [
      'const slots = $slots;',
      'const flip = slots.offset % 2 === 1;',
      'return flip ? "Yes, two consecutive integers have different parity." : "No, they have the same parity.";'
    ].join('\n'),
    explain(slots) { return ['The given rule says every integer is even or odd and never both, so parity gives a complete two-case split.', 'Advancing by an odd number of steps swaps the case, so the two compared integers can never share a parity.']; }
  },
  {
    template: 'Sum of an even and an odd number',
    type: 'sum-of-an-even-and-an-odd-number',
    category: 'no-knowledge',
    parse(statement) { return { oddConstant: Number(capture(statement, /2\w+\+(\d+)/, 'the odd form 2k+1')[1]) }; },
    solve(slots) { return { parity: slots.oddConstant % 2 === 1 ? 'odd' : 'even' }; },
    render(solution) { return solution.parity === 'odd' ? 'Odd.' : 'Even.'; },
    compute: [
      'const slots = $slots;',
      'return slots.oddConstant % 2 === 1 ? "Odd." : "Even.";'
    ].join('\n'),
    explain(slots) { return ['Writing the even number as 2m and the odd number as 2n+1 and adding them gives 2(m+n)+1.', 'The sum is therefore of the odd form 2k+1, so its parity is odd.']; }
  },
  {
    template: 'A product with an even factor',
    type: 'a-product-with-an-even-factor',
    category: 'no-knowledge',
    parse(statement) { return { even: capture(statement, /(\w)=2\w+ is even/, 'the even factor')[1], other: capture(statement, /(\w) is any integer/, 'the free factor')[1] }; },
    solve(slots) { return { product: `${slots.even}${slots.other}` }; },
    render(solution) { return `${solution.product} is even.`; },
    compute: [
      'const slots = $slots;',
      'return slots.even + slots.other + " is even.";'
    ].join('\n'),
    explain(slots) { return [`The even factor is 2m, so the product is (2m)${slots.other} = 2(m${slots.other}).`, 'The product is twice an integer, which is the definition of even, whatever value the free factor takes.']; }
  },
  {
    template: 'Impossibility by parity',
    type: 'impossibility-by-parity',
    category: 'no-knowledge',
    parse(statement) { return { start: Number(capture(statement, /Start at (\d+)/, 'the start')[1]), step: Number(capture(statement, /add or subtract (\d+)/, 'the step')[1]), target: Number(capture(statement, /reach (\d+)/, 'the target')[1]) }; },
    solve(slots) { return { reachable: (((slots.target - slots.start) % slots.step) + slots.step) % slots.step === 0 }; },
    render(solution) { return solution.reachable ? 'Yes.' : 'No.'; },
    compute: [
      'const slots = $slots;',
      'const gap = (((slots.target - slots.start) % slots.step) + slots.step) % slots.step;',
      'return gap === 0 ? "Yes." : "No.";'
    ].join('\n'),
    explain(slots) { return ['Every step changes the value by a multiple of the step size, so all reached values keep the same remainder modulo that step.', 'The target does not differ from the start by a multiple of the step, so parity rules it out and the answer is no.']; }
  },
  {
    template: 'Proof by preserving a remainder',
    type: 'proof-by-preserving-a-remainder',
    category: 'no-knowledge',
    parse(statement) { return { start: Number(capture(statement, /Start at (\d+)/, 'the start')[1]), step: Number(capture(statement, /multiples of (\d+)/, 'the modulus')[1]), target: Number(capture(statement, /reach (\d+)/, 'the target')[1]) }; },
    solve(slots) { return { reachable: (slots.start % slots.step) === (slots.target % slots.step) }; },
    render(solution) { return solution.reachable ? 'Yes.' : 'No.'; },
    compute: [
      'const slots = $slots;',
      'const reachable = (slots.start % slots.step) === (slots.target % slots.step);',
      'return reachable ? "Yes." : "No.";'
    ].join('\n'),
    explain(slots) { return ['Adding a multiple of the modulus never changes the remainder, and the text states this invariant explicitly.', 'The start and the target leave different remainders, so the invariant is broken and the target can never be reached.']; }
  },
  {
    template: 'Proof using an upper bound',
    type: 'proof-using-an-upper-bound',
    category: 'no-knowledge',
    parse(statement) { return { boxes: Number(capture(statement, /(\d+) boxes/, 'the number of boxes')[1]), capacity: Number(capture(statement, /capacity (\d+)/, 'the per-box capacity')[1]), objects: Number(capture(statement, /store (\d+) objects/, 'the number of objects')[1]) }; },
    solve(slots) { return { maximum: slots.boxes * slots.capacity, objects: slots.objects }; },
    render(solution) { return solution.maximum >= solution.objects ? 'Yes.' : 'No.'; },
    compute: [
      'const slots = $slots;',
      'const maximum = slots.boxes * slots.capacity;',
      'return maximum >= slots.objects ? "Yes." : "No.";'
    ].join('\n'),
    explain(slots) { return ['The total capacity is the number of boxes times the capacity of one box, which is an upper bound on what can be stored.', 'The requested number of objects exceeds that bound, so no placement can satisfy it.']; }
  },
  {
    template: 'Proof using a lower bound',
    type: 'proof-using-a-lower-bound',
    category: 'no-knowledge',
    parse(statement) { return { tickets: Number(capture(statement, /At least (\d+) tickets/, 'the least number of tickets')[1]), price: Number(capture(statement, /at least (\d+) lei/, 'the least price')[1]), budget: Number(capture(statement, /You have (\d+) lei/, 'the budget')[1]) }; },
    solve(slots) { return { minimum: slots.tickets * slots.price, budget: slots.budget }; },
    render(solution) { return solution.minimum <= solution.budget ? 'Yes.' : 'No.'; },
    compute: [
      'const slots = $slots;',
      'const minimum = slots.tickets * slots.price;',
      'return minimum <= slots.budget ? "Yes." : "No.";'
    ].join('\n'),
    explain(slots) { return ['Multiplying the least number of tickets by the least price gives a lower bound on the total cost.', 'That lower bound is already above the available money, so no purchase can meet the requirements.']; }
  },
  {
    template: 'Uniqueness from two bounds that meet',
    type: 'uniqueness-from-two-bounds-that-meet',
    category: 'no-knowledge',
    parse(statement) { return { lower: Number(capture(statement, /at least (\d+)/, 'the lower bound')[1]), upper: Number(capture(statement, /at most (\d+)/, 'the upper bound')[1]) }; },
    solve(slots) { return { lower: slots.lower, upper: slots.upper }; },
    render(solution) { return solution.lower === solution.upper ? `x=${solution.lower}.` : 'x is not determined.'; },
    compute: [
      'const slots = $slots;',
      'return slots.lower === slots.upper ? "x=" + slots.lower + "." : "x is not determined.";'
    ].join('\n'),
    explain(slots) { return ['The two constraints squeeze x from below and from above at the same value.', 'Any other value would violate one of the bounds, so the value is forced and therefore unique.']; }
  },
  {
    template: 'Proof of uniqueness by comparison',
    type: 'proof-of-uniqueness-by-comparison',
    category: 'no-knowledge',
    parse(statement) { return { term: Number(capture(statement, /x\+(\d+)/, 'the added term')[1]), rhs: Number(capture(statement, /=(\d+)/, 'the right-hand side')[1]) }; },
    solve(slots) { return { value: slots.rhs - slots.term }; },
    render(solution) { return `The unique solution is ${solution.value}.`; },
    compute: [
      'const slots = $slots;',
      'return "The unique solution is " + (slots.rhs - slots.term) + ".";'
    ].join('\n'),
    explain(slots) { return ['If two values both satisfy the equation, subtracting the same term from both equalities gives the same value for each.', 'That single value satisfies the equation, so the solution exists and is unique.']; }
  },
  {
    template: 'Equivalence proved in both directions',
    type: 'equivalence-proved-in-both-directions',
    category: 'no-knowledge',
    parse(statement) {
      const groups = [...statement.matchAll(/\{([^}]*)\}/g)].map((match) => match[1].split(',').map((part) => Number(part.trim())));
      if (groups.length < 2) throw new Error('the statement does not state both sets');
      return { domain: groups[0], set: groups[1] };
    },
    solve(slots) { return { holds: slots.domain.every((value) => (value % 2 === 0) === slots.set.includes(value)) }; },
    render(solution) { return solution.holds ? 'Both directions must be checked; both are true.' : 'The directions do not both hold.'; },
    compute: [
      'const slots = $slots;',
      'const holds = slots.domain.every((value) => (value % 2 === 0) === slots.set.includes(value));',
      'return holds ? "Both directions must be checked; both are true." : "The directions do not both hold.";'
    ].join('\n'),
    explain(slots) { return ['An "if and only if" needs both implications: even implies membership, and membership implies even.', 'Testing those implications on every element of the domain confirms that both hold throughout the domain.']; }
  },
  {
    template: 'Proof by contradiction in an interval',
    type: 'proof-by-contradiction-in-an-interval',
    category: 'no-knowledge',
    parse(statement) { return { lower: Number(capture(statement, /x>(\d+)/, 'the lower bound')[1]), upper: Number(capture(statement, /x<(\d+)/, 'the upper bound')[1]) }; },
    solve(slots) { return { between: Array.from({ length: Math.max(0, slots.upper - slots.lower - 1) }, (_, index) => slots.lower + 1 + index) }; },
    render(solution) { return solution.between.length === 1 ? `x=${solution.between[0]}.` : 'x is not determined.'; },
    compute: [
      'const slots = $slots;',
      'const between = [];',
      'for (let value = slots.lower + 1; value < slots.upper; value += 1) { between.push(value); }',
      'return between.length === 1 ? "x=" + between[0] + "." : "x is not determined.";'
    ].join('\n'),
    explain(slots) { return ['Assuming x differs from the single value strictly between the bounds leaves no integer satisfying both inequalities.', 'That contradiction forces x to be the only integer in the interval.']; }
  },
  {
    template: 'The pigeonhole principle as a proof',
    type: 'the-pigeonhole-principle-as-a-proof',
    category: 'no-knowledge',
    parse(statement) { return { objects: Number(capture(statement, /(\d+) objects/, 'the number of objects')[1]), colors: Number(capture(statement, /(\d+) colors/, 'the number of colors')[1]) }; },
    solve(slots) { return { collides: slots.objects > slots.colors }; },
    render(solution) { return solution.collides ? 'Yes, at least two have the same color.' : 'No, they can all differ.'; },
    compute: [
      'const slots = $slots;',
      'return slots.objects > slots.colors ? "Yes, at least two have the same color." : "No, they can all differ.";'
    ].join('\n'),
    explain(slots) { return ['If each color were used at most once, at most as many objects as colors could be colored.', 'There are more objects than colors, so that assumption fails and two objects must share a color.']; }
  },
  {
    template: 'Proof by decomposing area',
    type: 'proof-by-decomposing-area',
    category: 'no-knowledge',
    parse(statement) { const sides = capture(statement, /side lengths (\w+) and (\w+)/, 'the two side lengths'); return { a: sides[1], b: sides[2] }; },
    solve(slots) { return { a: slots.a, b: slots.b }; },
    render(solution) { return `The area is ${solution.a}×${solution.b} unit squares.`; },
    compute: [
      'const slots = $slots;',
      'return "The area is " + slots.a + "×" + slots.b + " unit squares.";'
    ].join('\n'),
    explain(slots) { return [`The rectangle is cut into ${slots.a} rows with ${slots.b} unit squares in each row.`, 'Counting the rows times the squares per row gives the total number of unit squares, which is the area.']; }
  },
  {
    template: 'Proving that two formulas give the same result',
    type: 'proving-that-two-formulas-give-the-same-result',
    category: 'no-knowledge',
    parse(statement) { const match = capture(statement, /formulas ([^ ]+) and ([^ ]+) appear/, 'the two formulas'); return { formulas: [match[1], match[2]] }; },
    solve(slots) { const left = coefficientsOf(slots.formulas[0]); const right = coefficientsOf(slots.formulas[1]); return { equal: [...new Set([...Object.keys(left), ...Object.keys(right)])].every((term) => (left[term] ?? 0) === (right[term] ?? 0)) }; },
    render(solution) { return solution.equal ? 'The formulas are equivalent.' : 'The formulas are not equivalent.'; },
    compute: [
      'const slots = $slots;',
      'const coefficients = (formula) => {',
      '  const product = formula.match(/^(\\d*)\\((.*)\\)$/);',
      '  const factor = product === null || product[1] === "" ? 1 : Number(product[1]);',
      '  const counts = {};',
      '  for (const term of (product === null ? formula : product[2]).split("+")) { counts[term] = (counts[term] || 0) + factor; }',
      '  return counts;',
      '};',
      'const left = coefficients(slots.formulas[0]);',
      'const right = coefficients(slots.formulas[1]);',
      'const terms = [...new Set([...Object.keys(left), ...Object.keys(right)])];',
      'return terms.every((term) => (left[term] || 0) === (right[term] || 0)) ? "The formulas are equivalent." : "The formulas are not equivalent.";'
    ].join('\n'),
    explain(slots) { return ['Grouping equal terms turns the first sum into twice the first length plus twice the second length.', 'Factoring out the common 2 gives exactly the second formula, so the two formulas agree for all side lengths.']; }
  },
  {
    template: 'Proof by intuitive monotonicity',
    type: 'proof-by-intuitive-monotonicity',
    category: 'no-knowledge',
    parse(statement) { return { offset: Number(capture(statement, /a\+(\d+)</, 'the distance added to both sides')[1]) }; },
    solve(slots) { return { offset: slots.offset }; },
    render(solution) { return `a+${solution.offset}<b+${solution.offset}.`; },
    compute: [
      'const slots = $slots;',
      'return "a+" + slots.offset + "<b+" + slots.offset + ".";'
    ].join('\n'),
    explain(slots) { return ['On the number line, adding the same distance to both sides slides both points the same amount to the right.', 'A translation preserves the gap and the left-to-right order, so the inequality keeps its direction.']; }
  },
  {
    template: 'Proof by enumerating all remainders',
    type: 'proof-by-enumerating-all-remainders',
    category: 'no-knowledge',
    parse(statement) {
      const terms = capture(statement, /among (n(?:, n\+\d+)+)/, 'the consecutive integers')[1].split(',');
      return { modulus: Number(capture(statement, /divided by (\d+)/, 'the divisor')[1]), count: terms.length };
    },
    solve(slots) {
      const hits = Array.from({ length: slots.modulus }, (_, remainder) => Array.from({ length: slots.count }, (_, step) => (remainder + step) % slots.modulus === 0).filter(Boolean).length);
      return { everyCase: hits.every((count) => count === 1), modulus: slots.modulus, count: slots.count };
    },
    render(solution) { return solution.everyCase ? `Exactly one of ${NUMBER_WORDS[solution.count]} consecutive integers is divisible by ${solution.modulus}.` : 'The statement is false.'; },
    compute: [
      'const slots = $slots;',
      `const words = ${NUMBER_WORDS_JS};`,
      'let everyCase = true;',
      'for (let remainder = 0; remainder < slots.modulus; remainder += 1) {',
      '  const hits = [...Array(slots.count).keys()].filter((step) => (remainder + step) % slots.modulus === 0).length;',
      '  everyCase = everyCase && hits === 1;',
      '}',
      'return everyCase ? "Exactly one of " + words[slots.count] + " consecutive integers is divisible by " + slots.modulus + "." : "The statement is false.";'
    ].join('\n'),
    explain(slots) { return ['Every integer leaves one of the listed remainders on division, so splitting into those cases covers all integers.', 'In each remainders case exactly one of the consecutive integers is divisible, so the claim holds for all of them.']; }
  },
  {
    template: 'A true statement is not the same as a valid proof',
    type: 'a-true-statement-is-not-the-same-as-a-valid-proof',
    category: 'no-knowledge',
    parse(statement) { return { claim: capture(statement, /“([^”]+)” is true/, 'the claim')[1], justification: capture(statement, /“because ([^”]+)”/, 'the justification')[1] }; },
    solve(slots) {
      const stop = ['because', 'the', 'a', 'an', 'is', 'are', 'it', 'that', 'this', 'of', 'and', 'by'];
      const terms = slots.justification.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word !== '' && !stop.includes(word));
      return { relevant: terms.some((word) => slots.claim.toLowerCase().includes(word)) };
    },
    render(solution) { return solution.relevant ? 'Yes.' : 'No.'; },
    compute: [
      'const slots = $slots;',
      'const stop = ["because", "the", "a", "an", "is", "are", "it", "that", "this", "of", "and", "by"];',
      'const terms = slots.justification.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word !== "" && stop.indexOf(word) === -1);',
      'const relevant = terms.some((word) => slots.claim.toLowerCase().indexOf(word) !== -1);',
      'return relevant ? "Yes." : "No.";'
    ].join('\n'),
    explain(slots) { return ['A proof must connect its premises to the conclusion; the offered justification shares nothing with the claim.', 'Since the justification is irrelevant to the arithmetic statement, it is not a valid mathematical proof even though the claim is true.']; }
  },
  {
    template: 'Hypothesis, conclusion, and domain',
    type: 'hypothesis-conclusion-and-domain',
    category: 'no-knowledge',
    parse(statement) {
      const bounds = capture(statement, /from (\d+) to (\d+)/, 'the domain');
      return { lower: Number(bounds[1]), upper: Number(bounds[2]), hypothesis: capture(statement, /if x is ([^,]+), then/, 'the hypothesis')[1].replace(/^(?:an?|the)\s+/i, '').trim(), conclusion: capture(statement, /then x is ([^.”]+)/, 'the conclusion')[1].trim() };
    },
    solve(slots) { return { lower: slots.lower, upper: slots.upper, hypothesis: slots.hypothesis, conclusion: slots.conclusion }; },
    render(solution) { return `Domain ${solution.lower}–${solution.upper}; hypothesis “${solution.hypothesis}”; conclusion “${solution.conclusion}.”`; },
    compute: [
      'const slots = $slots;',
      'return "Domain " + slots.lower + "–" + slots.upper + "; hypothesis “" + slots.hypothesis + "”; conclusion “" + slots.conclusion + ".”";'
    ].join('\n'),
    explain(slots) { return ['The domain collects the values the variable ranges over, and the conditional splits into the condition and its consequence.', 'The hypothesis names the property that triggers the statement, and the conclusion names what it guarantees whenever that property holds.']; }
  },
  {
    template: 'Checking a conditional statement on a finite domain',
    type: 'checking-a-conditional-statement-on-a-finite-domain',
    category: 'no-knowledge',
    sharedPremise: 'The previous statement claims that for every integer x from 1 to 10, if x is a multiple of 4, then x is even.',
    parse(statement) {
      const bounds = capture(statement, /from (\d+)[–-](\d+)/, 'the domain');
      return { lower: Number(bounds[1]), upper: Number(bounds[2]), divisor: Number(capture(statement, /multiples? of (\d+)/, 'the divisor')[1]) };
    },
    solve(slots) { return { values: Array.from({ length: slots.upper - slots.lower + 1 }, (_, index) => slots.lower + index).filter((value) => value % slots.divisor === 0) }; },
    render(solution) {
      if (solution.values.length === 0) return 'None.';
      return solution.values.length === 1 ? `${solution.values[0]}.` : `${solution.values.slice(0, -1).join(', ')} and ${solution.values[solution.values.length - 1]}.`;
    },
    compute: [
      'const slots = $slots;',
      'const values = [];',
      'for (let value = slots.lower; value <= slots.upper; value += 1) { if (value % slots.divisor === 0) { values.push(value); } }',
      'if (values.length < 2) { return values.length === 0 ? "None." : values[0] + "."; }',
      'return values.slice(0, -1).join(", ") + " and " + values[values.length - 1] + ".";'
    ].join('\n'),
    explain(slots) { return ['A conditional statement is only at risk when its hypothesis is satisfied, so the values that are multiples of the divisor are the ones to check.', 'Filtering the domain by that condition leaves only the values that could possibly falsify the statement.']; }
  },
  {
    template: 'Conclusion through a chain of implications',
    type: 'conclusion-through-a-chain-of-implications',
    category: 'no-knowledge',
    parse(statement) { return { rules: [...statement.matchAll(/every (\w) is (\w)/g)].map((match) => [match[1], match[2]]), start: capture(statement, /If an object is (\w)/, 'the starting property')[1] }; },
    solve(slots) { return { conclusion: closureOf(slots.start, slots.rules).at(-1) }; },
    render(solution) { return `The object is ${solution.conclusion}.`; },
    compute: [
      'const slots = $slots;',
      'const reached = new Set([slots.start]);',
      'let changed = true;',
      'while (changed) { changed = false; for (const [from, to] of slots.rules) { if (reached.has(from) && !reached.has(to)) { reached.add(to); changed = true; } } }',
      'const chain = [...reached];',
      'return "The object is " + chain[chain.length - 1] + ".";'
    ].join('\n'),
    explain(slots) { return ['Chaining the rules carries the starting property forward: being A forces B, and being B in turn forces C.', 'The object is therefore C, which is the furthest conclusion the given implications support.']; }
  },
  {
    template: 'A chain of implications does not work backward',
    type: 'a-chain-of-implications-does-not-work-backward',
    category: 'no-knowledge',
    parse(statement) { return { rules: [...statement.matchAll(/(\w)⇒(\w)/g)].map((match) => [match[1], match[2]]), known: capture(statement, /only that an object is (\w)/, 'the known property')[1], target: capture(statement, /conclude that it is (\w)/, 'the target property')[1] }; },
    solve(slots) { return { reaches: closureOf(slots.known, slots.rules).includes(slots.target) }; },
    render(solution) { return solution.reaches ? 'Yes.' : 'No.'; },
    compute: [
      'const slots = $slots;',
      'const reached = new Set([slots.known]);',
      'let changed = true;',
      'while (changed) { changed = false; for (const [from, to] of slots.rules) { if (reached.has(from) && !reached.has(to)) { reached.add(to); changed = true; } } }',
      'return reached.has(slots.target) ? "Yes." : "No.";'
    ].join('\n'),
    explain(slots) { return ['The given rules point only forward, so knowing a conclusion does not license the property that would imply it.', 'Since C could arise from other sources, the chain cannot be run backward and we cannot conclude the target.']; }
  }
];
