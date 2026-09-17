/**
 * Families for chapter 12 of the mathematical seed book: fractions built from
 * definitions.
 *
 * Each statement defines the meaning of the fraction it uses: dividing the
 * whole into equal parts and taking some of them. Every premise is therefore
 * given in the text and every case is `no-knowledge`.
 */

export const chapter = 12;

export const cases = [
  {
    template: 'Fraction of a Set',
    type: 'fraction-of-a-set',
    category: 'no-knowledge',
    parse(statement) {
      const totalMatch = statement.match(/We have (\d+) objects/);
      const fractionMatch = statement.match(/fraction (\d+)\/(\d+) means/);
      if (totalMatch === null || fractionMatch === null) {
        throw new Error('the total or the fraction is missing');
      }
      return {
        total: Number(totalMatch[1]),
        numerator: Number(fractionMatch[1]),
        denominator: Number(fractionMatch[2])
      };
    },
    solve(slots) {
      if (slots.total % slots.denominator !== 0) {
        throw new Error('the total does not divide into equal parts');
      }
      const part = slots.total / slots.denominator;
      return { part, value: part * slots.numerator };
    },
    render(solution) {
      return String(solution.value);
    },
    compute: [
      'const slots = $slots;',
      'if (slots.total % slots.denominator !== 0) {',
      '  throw new Error("the total does not divide into equal parts");',
      '}',
      'const part = slots.total / slots.denominator;',
      'return String(part * slots.numerator);'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The definition turns the fraction ${slots.numerator}/${slots.denominator} into two steps: divide the whole into ${slots.denominator} equal parts, then take ${slots.numerator} of them.`,
        `Dividing the ${slots.total} objects into ${slots.denominator} equal parts gives ${solution.part} objects per part.`,
        `Taking ${slots.numerator} part${slots.numerator === 1 ? '' : 's'} gives ${solution.part} · ${slots.numerator} = ${solution.value} objects.`
      ];
    }
  },
  {
    template: 'Compare Fractions with the Same Denominator',
    type: 'compare-fractions-with-the-same-denominator',
    category: 'no-knowledge',
    parse(statement) {
      const denominatorMatch = statement.match(/same denominator (\d+)/);
      const compareMatch = statement.match(/Compare (\d+)\/(\d+) and (\d+)\/(\d+)/);
      if (denominatorMatch === null || compareMatch === null) {
        throw new Error('the denominator or the two fractions are missing');
      }
      return {
        denominator: Number(denominatorMatch[1]),
        left: { numerator: Number(compareMatch[1]), denominator: Number(compareMatch[2]) },
        right: { numerator: Number(compareMatch[3]), denominator: Number(compareMatch[4]) }
      };
    },
    solve(slots) {
      if (slots.left.denominator !== slots.denominator || slots.right.denominator !== slots.denominator) {
        throw new Error('the fractions do not share the stated denominator');
      }
      if (slots.left.numerator === slots.right.numerator) {
        throw new Error('the two fractions are equal, so neither is larger');
      }
      const larger = slots.left.numerator > slots.right.numerator ? slots.left : slots.right;
      return { numerator: larger.numerator, denominator: larger.denominator };
    },
    render(solution) {
      return `${solution.numerator}/${solution.denominator} is larger.`;
    },
    compute: [
      'const slots = $slots;',
      'if (slots.left.denominator !== slots.denominator || slots.right.denominator !== slots.denominator) {',
      '  throw new Error("the fractions do not share the stated denominator");',
      '}',
      'if (slots.left.numerator === slots.right.numerator) {',
      '  throw new Error("the two fractions are equal, so neither is larger");',
      '}',
      'const larger = slots.left.numerator > slots.right.numerator ? slots.left : slots.right;',
      'return larger.numerator + "/" + larger.denominator + " is larger.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Both fractions are cut into ${slots.denominator} equal parts, so the whole is split the same way in each.`,
        `With parts of equal size, the fraction that takes more parts is larger, so the comparison reduces to the numerators ${slots.left.numerator} and ${slots.right.numerator}.`,
        `The larger numerator is ${solution.numerator}, so ${solution.numerator}/${solution.denominator} is larger.`
      ];
    }
  },
  {
    template: 'Complete to One Whole',
    type: 'complete-to-one-whole',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/divided into (\d+) equal parts\. (\d+)\/(\d+) are colored/);
      if (match === null) {
        throw new Error('the number of parts or the colored fraction is missing');
      }
      if (match[1] !== match[3]) {
        throw new Error('the colored fraction does not use the stated number of parts');
      }
      return { denominator: Number(match[1]), colored: Number(match[2]) };
    },
    solve(slots) {
      return { missing: slots.denominator - slots.colored, denominator: slots.denominator };
    },
    render(solution) {
      return `${solution.missing}/${solution.denominator}`;
    },
    compute: [
      'const slots = $slots;',
      'const missing = slots.denominator - slots.colored;',
      'return missing + "/" + slots.denominator;'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `One whole is divided into ${slots.denominator} equal parts, so the complete whole is ${slots.denominator}/${slots.denominator}.`,
        `The parts already colored are ${slots.colored} out of ${slots.denominator}.`,
        `The parts still needed are the rest of the whole: ${slots.denominator} − ${slots.colored} = ${solution.missing} parts, that is ${solution.missing}/${solution.denominator}.`
      ];
    }
  },
  {
    template: 'Same Portion, More Pieces',
    type: 'same-portion-more-pieces',
    category: 'no-knowledge',
    parse(statement) {
      const fractionMatch = statement.match(/fraction (\d+)\/(\d+) colored/);
      const piecesMatch = statement.match(/divide each of the \d+ parts into (\d+) equal pieces/);
      if (fractionMatch === null || piecesMatch === null) {
        throw new Error('the colored fraction or the piece count is missing');
      }
      return {
        numerator: Number(fractionMatch[1]),
        denominator: Number(fractionMatch[2]),
        pieces: Number(piecesMatch[1])
      };
    },
    solve(slots) {
      return {
        numerator: slots.numerator * slots.pieces,
        denominator: slots.denominator * slots.pieces
      };
    },
    render(solution) {
      return `${solution.numerator}/${solution.denominator}`;
    },
    compute: [
      'const slots = $slots;',
      'const numerator = slots.numerator * slots.pieces;',
      'const denominator = slots.denominator * slots.pieces;',
      'return numerator + "/" + denominator;'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The figure starts with ${slots.numerator}/${slots.denominator} colored, so the whole has ${slots.denominator} parts and ${slots.numerator} of them are colored.`,
        `Dividing every part into ${slots.pieces} equal pieces multiplies the number of parts by ${slots.pieces} without changing which region is colored.`,
        `Both counts are multiplied by the same number, so the fraction becomes (${slots.numerator}·${slots.pieces})/(${slots.denominator}·${slots.pieces}) = ${solution.numerator}/${solution.denominator}.`
      ];
    }
  },
  {
    template: 'Two Fractions of the Same Total',
    type: 'two-fractions-of-the-same-total',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/From (\d+) objects, group A receives (\d+)\/(\d+), and group B receives (\d+)\/(\d+)/);
      if (match === null) {
        throw new Error('the total or the two fractions are missing');
      }
      return {
        total: Number(match[1]),
        a: { numerator: Number(match[2]), denominator: Number(match[3]) },
        b: { numerator: Number(match[4]), denominator: Number(match[5]) }
      };
    },
    solve(slots) {
      if (slots.a.denominator !== slots.b.denominator) {
        throw new Error('the two fractions do not share a denominator');
      }
      if (slots.total % slots.a.denominator !== 0) {
        throw new Error('the total does not divide into equal parts');
      }
      const part = slots.total / slots.a.denominator;
      return { part, a: part * slots.a.numerator, b: part * slots.b.numerator, total: part * (slots.a.numerator + slots.b.numerator) };
    },
    render(solution) {
      return String(solution.total);
    },
    compute: [
      'const slots = $slots;',
      'if (slots.a.denominator !== slots.b.denominator) {',
      '  throw new Error("the two fractions do not share a denominator");',
      '}',
      'if (slots.total % slots.a.denominator !== 0) {',
      '  throw new Error("the total does not divide into equal parts");',
      '}',
      'const part = slots.total / slots.a.denominator;',
      'return String(part * (slots.a.numerator + slots.b.numerator));'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Both fractions cut the same total of ${slots.total} objects into ${slots.a.denominator} equal parts.`,
        `One part holds ${slots.total} ÷ ${slots.a.denominator} = ${solution.part} objects.`,
        `Group A takes ${slots.a.numerator} parts and group B takes ${slots.b.numerator} parts, ${slots.a.numerator} + ${slots.b.numerator} = ${slots.a.numerator + slots.b.numerator} parts together.`,
        `That is ${solution.part} · ${slots.a.numerator + slots.b.numerator} = ${solution.total} objects.`
      ];
    }
  }
];
