/**
 * Section 54 of the adult-reasoning course: sound, distance, and obstacles.
 *
 * Every variant posts the same sheet about the bell in the jar: sound needs a
 * medium, so with the air removed the bell is seen to move but not heard, while
 * a little lamp is still seen in the vacuum. The episode watches the recording
 * and reports motion, sound, and lamp. The verdict reads the sheet literally:
 * the missing sound isolates the need for air, light did not need it, and the
 * moving clapper shows the bell is not broken. The cases change the observer, so
 * the family derives each clause from the parsed recording and sheet flags.
 */

import { slugify } from '../../naming.mjs';

const SHEET_MEDIUM_PATTERN = /Sound needs a medium\./;
const SHEET_JAR_PATTERN =
  /In a jar with the air removed, the bell is seen to move but not heard\./;
const SHEET_LAMP_PATTERN = /A little lamp’s light is still seen in the vacuum\./;
const RECORDING_PATTERN =
  /([A-Z][a-z]+) watches the recording: motion (yes|no), sound (yes|no), lamp (yes|no)\./;

function parse(statement) {
  const recording = RECORDING_PATTERN.exec(statement);
  if (recording === null) {
    throw new Error('the statement does not describe the recording of motion, sound, and lamp');
  }
  if (!SHEET_MEDIUM_PATTERN.test(statement) || !SHEET_LAMP_PATTERN.test(statement)) {
    throw new Error('the statement does not state that sound needs a medium and that light crosses the vacuum');
  }
  return {
    observer: recording[1],
    soundNeedsMedium: true,
    airRemoved: SHEET_JAR_PATTERN.test(statement),
    motionSeen: recording[2] === 'yes',
    soundHeard: recording[3] === 'yes',
    lampSeen: recording[4] === 'yes'
  };
}

function solve(slots) {
  let mediumClause;
  if (slots.soundNeedsMedium && !slots.soundHeard && slots.lampSeen) {
    mediumClause = 'Sound needed air; light did not.';
  } else if (slots.soundHeard) {
    mediumClause = 'Sound was carried by the air that was still in the jar.';
  } else {
    mediumClause = 'Neither sound nor light crossed the jar.';
  }
  let bellClause;
  if (slots.motionSeen && !slots.soundHeard) {
    bellClause = 'The bell is not “broken”: the motion is seen.';
  } else if (slots.motionSeen && slots.soundHeard) {
    bellClause = 'The bell works: it moves and it is heard.';
  } else {
    bellClause = 'The bell does not move, so the recording does not show it working.';
  }
  return { mediumClause, bellClause };
}

function render(solution) {
  return `${solution.mediumClause} ${solution.bellClause}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.observer === "string" && slots.observer.length > 0, "the case must name the observer");',
  'probe(/^[A-Z][a-z]+$/.test(slots.observer), "the observer must be a plain capitalised name");',
  'probe(slots.soundNeedsMedium === true, "the sheet must state that sound needs a medium");',
  'probe(slots.airRemoved === true, "the sheet must describe the jar with the air removed");',
  'probe(typeof slots.motionSeen === "boolean" && typeof slots.soundHeard === "boolean" && typeof slots.lampSeen === "boolean", "the recording must report motion, sound, and lamp");',
  'let mediumClause;',
  'if (slots.soundNeedsMedium && !slots.soundHeard && slots.lampSeen) {',
  '  mediumClause = "Sound needed air; light did not.";',
  '} else if (slots.soundHeard) {',
  '  mediumClause = "Sound was carried by the air that was still in the jar.";',
  '} else {',
  '  mediumClause = "Neither sound nor light crossed the jar.";',
  '}',
  'let bellClause;',
  'if (slots.motionSeen && !slots.soundHeard) {',
  '  bellClause = "The bell is not \u201cbroken\u201d: the motion is seen.";',
  '} else if (slots.motionSeen && slots.soundHeard) {',
  '  bellClause = "The bell works: it moves and it is heard.";',
  '} else {',
  '  bellClause = "The bell does not move, so the recording does not show it working.";',
  '}',
  'return mediumClause + " " + bellClause;'
].join('\n');

function explain(slots, solution) {
  return [
    `The jar loses its air, so the medium sound needs is gone, while the lamp keeps shining: ${slots.observer} sees the motion of the bell but hears nothing.`,
    'The bell itself is not broken, because the recording shows the clapper moving; only the sound that should have followed is missing.',
    'Light did not need the air that was removed, so the lamp is still seen in the vacuum and the two observations separate sound from light.'
  ];
}

export const unit = 54;

export const cases = [
  {
    template: 'Sound, distance, and obstacles',
    type: slugify('Sound, distance, and obstacles'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
