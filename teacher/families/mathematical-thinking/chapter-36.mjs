/**
 * Families for chapter 36 of the mathematical seed book: rates, motion,
 * production, and flow.
 *
 * A family covers one printed template. It provides the reference parse that a
 * `modelCall` stage would perform, an independent computation, the answer text
 * the source prints, the SOP Lang computation body that the circuit executes,
 * and the explanation lines of the example. The chapter follows the
 * `DS008-training-data` contract: a template whose solution rests only on
 * premises the statement states is `no-knowledge`, while a template that needs
 * an external convention carries it explicitly in a `literal` facts wire and is
 * declared `knowledge`.
 */

export const unit = 36;

/** Build an `@answer jsEval` body from statements over the parsed slots. */
function computation(...statements) {
  return ['const slots = $slots;', ...statements].join('\n');
}

/** Extract numeric fields from a statement with one pattern and named groups. */
function extract(statement, pattern, names) {
  const match = statement.match(pattern);
  if (match === null) {
    throw new Error(`the statement does not state ${names.join(' and ')}`);
  }
  return Object.fromEntries(names.map((name, index) => [name, Number(match[index + 1])]));
}

export const cases = [
  {
    template: 'Distance from speed and time',
    type: 'distance-from-speed-and-time',
    category: 'no-knowledge',
    parse: (statement) => extract(statement, /speed of (\d+) km\/h[\s\S]*?in (\d+) hours/, ['speed', 'hours']),
    solve: (slots) => slots.speed * slots.hours,
    render: (solution) => `${solution} km.`,
    compute: computation('return slots.speed * slots.hours + " km.";'),
    explain: (slots, solution) => [
      `The statement defines a constant speed of ${slots.speed} km/h as ${slots.speed} km traveled every hour.`,
      `A constant rate makes distance the product of speed and time: ${slots.speed} × ${slots.hours}.`,
      `The traveled distance is therefore ${solution} km.`
    ]
  },
  {
    template: 'Time from distance and speed',
    type: 'time-from-distance-and-speed',
    category: 'no-knowledge',
    parse: (statement) => extract(statement, /constant (\d+) km per hour[\s\S]*?travel (\d+) km/, ['speed', 'distance']),
    solve: (slots) => slots.distance / slots.speed,
    render: (solution) => `${solution} hours.`,
    compute: computation('return slots.distance / slots.speed + " hours.";'),
    explain: (slots, solution) => [
      `At a constant ${slots.speed} km per hour, every hour covers exactly ${slots.speed} km.`,
      `The time is how many such groups fit into ${slots.distance} km, so ${slots.distance} ÷ ${slots.speed} = ${solution} hours.`
    ]
  },
  {
    template: 'Speed from distance and time',
    type: 'speed-from-distance-and-time',
    category: 'no-knowledge',
    parse: (statement) => extract(statement, /travels (\d+) m in (\d+) minutes/, ['distance', 'minutes']),
    solve: (slots) => slots.distance / slots.minutes,
    render: (solution) => `${solution} m/min.`,
    compute: computation('return slots.distance / slots.minutes + " m/min.";'),
    explain: (slots, solution) => [
      `A constant rate means the same distance is covered in every minute.`,
      `Dividing the ${slots.distance} m traveled by the ${slots.minutes} minutes gives ${solution} m/min.`
    ]
  },
  {
    template: 'Two segments with different speeds',
    type: 'two-segments-with-different-speeds',
    category: 'no-knowledge',
    parse: (statement) => {
      const stages = [...statement.matchAll(/(\d+) hours? at (\d+) km\/h/g)].map((match) => ({
        hours: Number(match[1]),
        speed: Number(match[2])
      }));
      if (stages.length !== 2) { throw new Error(`expected two stages, found ${stages.length}`); }
      return { stages };
    },
    solve: (slots) => slots.stages.reduce((total, stage) => total + stage.hours * stage.speed, 0),
    render: (solution) => `${solution} km.`,
    compute: computation('return slots.stages.reduce((total, stage) => total + stage.hours * stage.speed, 0) + " km.";'),
    explain: (slots, solution) => [
      `Each stage is a constant-speed stretch, so its distance is its speed times its duration.`,
      `The stages give ${slots.stages.map((stage) => `${stage.hours} × ${stage.speed}`).join(' and ')} km.`,
      `Adding the segment distances gives the total of ${solution} km.`
    ]
  },
  {
    template: 'A break adds no distance',
    type: 'a-break-adds-no-distance',
    category: 'no-knowledge',
    parse: (statement) => {
      const match = statement.match(/walks for (\d+) hours? at (\d+) km\/h, stays still for (\d+) hours?, then walks another (\d+) hours? at (\d+) km\/h/);
      if (match === null) { throw new Error('the walking stretches or the break are missing'); }
      return {
        firstHours: Number(match[1]), firstSpeed: Number(match[2]), rest: Number(match[3]),
        secondHours: Number(match[4]), secondSpeed: Number(match[5])
      };
    },
    solve: (slots) => ({
      distance: slots.firstHours * slots.firstSpeed + slots.secondHours * slots.secondSpeed,
      time: slots.firstHours + slots.rest + slots.secondHours
    }),
    render: (solution) => `${solution.distance} km and ${solution.time} hours.`,
    compute: computation(
      'const distance = slots.firstHours * slots.firstSpeed + slots.secondHours * slots.secondSpeed;',
      'const time = slots.firstHours + slots.rest + slots.secondHours;',
      'return distance + " km and " + time + " hours.";'
    ),
    explain: (slots, solution) => [
      `Standing still covers no distance, so the break contributes 0 km but still counts on the clock.`,
      `The two walking stretches give ${slots.firstHours} × ${slots.firstSpeed} and ${slots.secondHours} × ${slots.secondSpeed} km.`,
      `The distance is ${solution.distance} km, while the clock time adds the break: ${slots.firstHours} + ${slots.rest} + ${slots.secondHours} = ${solution.time} hours.`
    ]
  },
  {
    template: 'Average speed explicitly defined',
    type: 'average-speed-explicitly-defined',
    category: 'no-knowledge',
    sharedPremise: 'The previous problem describes a trip of 2 hours at 4 km/h, a 1-hour break, and 1 more hour at 4 km/h, covering 12 km in 4 hours.',
    parse: (statement) => extract(statement, /the (\d+) km in (\d+) hours/, ['distance', 'hours']),
    solve: (slots) => slots.distance / slots.hours,
    render: (solution) => `${solution} km/h.`,
    compute: computation('return slots.distance / slots.hours + " km/h.";'),
    explain: (slots) => [
      `The statement defines average speed as total distance divided by total time, breaks included.`,
      `Using the totals ${slots.distance} km and ${slots.hours} hours, the quotient is the average speed of the whole trip.`
    ]
  },
  {
    template: 'Meeting from opposite directions',
    type: 'meeting-from-opposite-directions',
    category: 'no-knowledge',
    parse: (statement) => extract(statement, /are (\d+) km apart[\s\S]*?A walks at (\d+) km\/h, B at (\d+) km\/h/, ['distance', 'speedA', 'speedB']),
    solve: (slots) => slots.distance / (slots.speedA + slots.speedB),
    render: (solution) => `${solution} hours.`,
    compute: computation('return slots.distance / (slots.speedA + slots.speedB) + " hours.";'),
    explain: (slots, solution) => [
      `Walking toward each other, both travelers shorten the gap, so it shrinks by ${slots.speedA} + ${slots.speedB} = ${slots.speedA + slots.speedB} km each hour.`,
      `The closing rate is the sum of the speeds because the distances each covers add up to the whole gap.`,
      `Dividing the initial ${slots.distance} km by that rate gives ${solution} hours until they meet.`
    ]
  },
  {
    template: 'Chasing in the same direction',
    type: 'chasing-in-the-same-direction',
    category: 'no-knowledge',
    parse: (statement) => extract(statement, /is (\d+) km ahead of A[\s\S]*?A travels at (\d+) km\/h, B at (\d+) km\/h/, ['headStart', 'speedA', 'speedB']),
    solve: (slots) => slots.headStart / (slots.speedA - slots.speedB),
    render: (solution) => `${solution} hours.`,
    compute: computation('return slots.headStart / (slots.speedA - slots.speedB) + " hours.";'),
    explain: (slots, solution) => [
      `Moving the same way, only the difference of the speeds closes the gap: A gains ${slots.speedA} - ${slots.speedB} = ${slots.speedA - slots.speedB} km each hour.`,
      `The initial lead of ${slots.headStart} km is what must be erased.`,
      `Dividing the lead by the catch-up rate gives ${solution} hours.`
    ]
  },
  {
    template: 'Delayed start',
    type: 'delayed-start',
    category: 'no-knowledge',
    parse: (statement) => extract(statement, /starts (\d+) hours? earlier and travels at (\d+) km\/h[\s\S]*?A then starts at (\d+) km\/h/, ['earlier', 'slowSpeed', 'fastSpeed']),
    solve: (slots) => {
      const headStart = slots.earlier * slots.slowSpeed;
      return { headStart, hours: headStart / (slots.fastSpeed - slots.slowSpeed) };
    },
    render: (solution) => `${solution.headStart} km head start; A catches B in ${solution.hours} hours.`,
    compute: computation(
      'const headStart = slots.earlier * slots.slowSpeed;',
      'return headStart + " km head start; A catches B in " + headStart / (slots.fastSpeed - slots.slowSpeed) + " hours.";'
    ),
    explain: (slots, solution) => [
      `While B travels alone for ${slots.earlier} hours at ${slots.slowSpeed} km/h, it builds a lead of ${solution.headStart} km.`,
      `Once both move, only the speed difference closes that lead, at ${slots.fastSpeed} - ${slots.slowSpeed} = ${slots.fastSpeed - slots.slowSpeed} km/h.`,
      `The lead divided by that rate gives ${solution.hours} hours of chasing.`
    ]
  },
  {
    template: 'Production at a constant rate',
    type: 'production-at-a-constant-rate',
    category: 'no-knowledge',
    parse: (statement) => extract(statement, /produces (\d+) pieces per minute[\s\S]*?in (\d+) minutes/, ['rate', 'minutes']),
    solve: (slots) => slots.rate * slots.minutes,
    render: (solution) => `${solution} pieces.`,
    compute: computation('return slots.rate * slots.minutes + " pieces.";'),
    explain: (slots, solution) => [
      `A constant production rate means ${slots.rate} pieces are completed every minute.`,
      `Repeating that output for ${slots.minutes} minutes produces ${solution} pieces.`
    ]
  },
  {
    template: 'Two machines working simultaneously',
    type: 'two-machines-working-simultaneously',
    category: 'no-knowledge',
    parse: (statement) => extract(statement, /produces (\d+) pieces\/min, B produces (\d+) pieces\/min[\s\S]*?in (\d+) minutes/, ['rateA', 'rateB', 'minutes']),
    solve: (slots) => (slots.rateA + slots.rateB) * slots.minutes,
    render: (solution) => `${solution} pieces.`,
    compute: computation('return (slots.rateA + slots.rateB) * slots.minutes + " pieces.";'),
    explain: (slots, solution) => [
      `The two machines work at once on the same output, so their rates combine instead of alternating.`,
      `The combined rate is ${slots.rateA} + ${slots.rateB} = ${slots.rateA + slots.rateB} pieces per minute.`,
      `Over ${slots.minutes} minutes that yields ${solution} pieces.`
    ]
  },
  {
    template: 'One worker stops halfway through',
    type: 'one-worker-stops-halfway-through',
    category: 'no-knowledge',
    parse: (statement) => extract(statement, /A produces (\d+) pieces\/min and B (\d+) pieces\/min[\s\S]*?work together for (\d+) minutes, then B stops and A continues for another (\d+) minutes/, ['rateA', 'rateB', 'together', 'alone']),
    solve: (slots) => (slots.rateA + slots.rateB) * slots.together + slots.rateA * slots.alone,
    render: (solution) => `${solution} pieces.`,
    compute: computation('return (slots.rateA + slots.rateB) * slots.together + slots.rateA * slots.alone + " pieces.";'),
    explain: (slots, solution) => [
      `The work has two stages because the set of active workers changes.`,
      `Together the machines run at ${slots.rateA} + ${slots.rateB} = ${slots.rateA + slots.rateB} pieces/min for ${slots.together} minutes.`,
      `After B stops only ${slots.rateA} pieces/min is produced for ${slots.alone} minutes, and the two stages add up to ${solution} pieces.`
    ]
  },
  {
    template: 'Filling with two taps',
    type: 'filling-with-two-taps',
    category: 'no-knowledge',
    parse: (statement) => extract(statement, /Tap A supplies (\d+) L\/min, B supplies (\d+) L\/min[\s\S]*?in (\d+) minutes/, ['rateA', 'rateB', 'minutes']),
    solve: (slots) => (slots.rateA + slots.rateB) * slots.minutes,
    render: (solution) => `${solution} L.`,
    compute: computation('return (slots.rateA + slots.rateB) * slots.minutes + " L.";'),
    explain: (slots, solution) => [
      `Both taps feed the same tank with no losses, so their flows add to ${slots.rateA} + ${slots.rateB} = ${slots.rateA + slots.rateB} L/min.`,
      `The volume that enters is that combined flow sustained for ${slots.minutes} minutes.`,
      `The tank receives ${solution} L.`
    ]
  },
  {
    template: 'Filling and draining simultaneously',
    type: 'filling-and-draining-simultaneously',
    category: 'no-knowledge',
    parse: (statement) => extract(statement, /(\d+) L\/min enter and (\d+) L\/min leave[\s\S]*?starts with (\d+) L[\s\S]*?after (\d+) minutes/, ['inflow', 'outflow', 'initial', 'minutes']),
    solve: (slots) => slots.initial + (slots.inflow - slots.outflow) * slots.minutes,
    render: (solution) => `${solution} L.`,
    compute: computation('return slots.initial + (slots.inflow - slots.outflow) * slots.minutes + " L.";'),
    explain: (slots, solution) => [
      `Filling and draining act at the same time, so only the net flow changes the volume: ${slots.inflow} - ${slots.outflow} = ${slots.inflow - slots.outflow} L/min.`,
      `Over ${slots.minutes} minutes that net flow adds ${(slots.inflow - slots.outflow) * slots.minutes} L to the starting ${slots.initial} L.`,
      `The tank then holds ${solution} L.`
    ]
  },
  {
    template: 'When does a tank empty?',
    type: 'when-does-a-tank-empty',
    category: 'no-knowledge',
    parse: (statement) => extract(statement, /contains (\d+) L[\s\S]*?(\d+) L\/min drain out/, ['volume', 'drain']),
    solve: (slots) => slots.volume / slots.drain,
    render: (solution) => `${solution} minutes.`,
    compute: computation('return slots.volume / slots.drain + " minutes.";'),
    explain: (slots, solution) => [
      `Nothing enters, so the tank loses ${slots.drain} L every minute until everything is gone.`,
      `Counting how many groups of ${slots.drain} L fit into the ${slots.volume} L, the tank reaches 0 after ${solution} minutes.`
    ]
  },
  {
    template: 'Consumption per 100 km explicitly defined',
    type: 'consumption-per-100-km-explicitly-defined',
    category: 'no-knowledge',
    parse: (statement) => extract(statement, /consumes (\d+) L for every (\d+) km[\s\S]*?over (\d+) km/, ['liters', 'per', 'distance']),
    solve: (slots) => (slots.distance / slots.per) * slots.liters,
    render: (solution) => `${solution} L.`,
    compute: computation('return (slots.distance / slots.per) * slots.liters + " L.";'),
    explain: (slots, solution) => [
      `The stated rate is ${slots.liters} L for every ${slots.per} km, so consumption is tied to whole groups of ${slots.per} km.`,
      `The distance of ${slots.distance} km contains ${slots.distance / slots.per} such groups.`,
      `Each group costs ${slots.liters} L, giving ${solution} L in total.`
    ]
  },
  {
    template: 'Possible distance from available fuel',
    type: 'possible-distance-from-available-fuel',
    category: 'no-knowledge',
    parse: (statement) => extract(statement, /Consumption is (\d+) L\/100 km[\s\S]*?have (\d+) L available/, ['liters', 'available']),
    solve: (slots) => (slots.available / slots.liters) * 100,
    render: (solution) => `${solution} km.`,
    compute: computation('return (slots.available / slots.liters) * 100 + " km.";'),
    explain: (slots, solution) => [
      `Every 100 km costs ${slots.liters} L at the constant-rate model.`,
      `The ${slots.available} L available pay for ${slots.available / slots.liters} such groups of 100 km.`,
      `The reachable distance is ${solution} km.`
    ]
  },
  {
    template: 'Converting a rate across equal intervals',
    type: 'converting-a-rate-across-equal-intervals',
    category: 'knowledge',
    facts: '{"minutesPerHour": 60}',
    compute: [
      'const slots = $slots;',
      'return slots.ratePerMinute * $facts.minutesPerHour + " pieces/hour.";'
    ].join('\n'),
    parse: (statement) => extract(statement, /makes (\d+) pieces\/min/, ['ratePerMinute']),
    solve: (slots) => slots.ratePerMinute * 60,
    render: (solution) => `${solution} pieces/hour.`,
    explain: (slots, solution) => [
      `The rate is stated per minute, while the question asks for one hour.`,
      `The convention that one hour contains 60 minutes is external knowledge, so it is carried in the facts wire instead of being read from the text.`,
      `Multiplying ${slots.ratePerMinute} pieces/min by 60 minutes gives ${solution} pieces/hour.`
    ]
  },
  {
    template: 'Map scale defined as a ratio',
    type: 'map-scale-defined-as-a-ratio',
    category: 'no-knowledge',
    parse: (statement) => extract(statement, /1 cm represents (\d+) km[\s\S]*?are (\d+) cm apart/, ['scale', 'centimeters']),
    solve: (slots) => slots.scale * slots.centimeters,
    render: (solution) => `${solution} km.`,
    compute: computation('return slots.scale * slots.centimeters + " km.";'),
    explain: (slots, solution) => [
      `The scale states that every 1 cm on the map stands for ${slots.scale} km in reality.`,
      `The measured ${slots.centimeters} cm repeats that correspondence ${slots.centimeters} times, so the real distance is ${solution} km.`
    ]
  },
  {
    template: 'Map distance from real distance',
    type: 'map-distance-from-real-distance',
    category: 'no-knowledge',
    parse: (statement) => extract(statement, /1 cm=(\d+) km[\s\S]*?corresponds to (\d+) km/, ['scale', 'kilometers']),
    solve: (slots) => slots.kilometers / slots.scale,
    render: (solution) => `${solution} cm.`,
    compute: computation('return slots.kilometers / slots.scale + " cm.";'),
    explain: (slots, solution) => [
      `The same scale gives ${slots.scale} km for each 1 cm of map.`,
      `The real distance of ${slots.kilometers} km is ${slots.kilometers / slots.scale} groups of ${slots.scale} km, and each group occupies 1 cm, so the map distance is ${solution} cm.`
    ]
  },
  {
    template: 'Compare two unit prices',
    type: 'compare-two-unit-prices',
    category: 'no-knowledge',
    parse: (statement) => extract(statement, /Offer A: (\d+) objects for (\d+) lei[\s\S]*?Offer B: (\d+) objects for (\d+) lei/, ['aCount', 'aPrice', 'bCount', 'bPrice']),
    solve: (slots) => {
      const priceA = slots.aPrice / slots.aCount;
      const priceB = slots.bPrice / slots.bCount;
      if (priceA === priceB) { throw new Error('the two offers have the same unit price'); }
      return priceA < priceB ? 'A' : 'B';
    },
    render: (solution) => `Offer ${solution}.`,
    compute: computation(
      'const priceA = slots.aPrice / slots.aCount;',
      'const priceB = slots.bPrice / slots.bCount;',
      'if (priceA === priceB) { throw new Error("the two offers have the same unit price"); }',
      'return "Offer " + (priceA < priceB ? "A" : "B") + ".";'
    ),
    explain: (slots) => [
      `Totals cannot be compared directly because the offers contain different numbers of objects.`,
      `Offer A costs ${slots.aPrice} ÷ ${slots.aCount} = ${slots.aPrice / slots.aCount} lei per object, while offer B costs ${slots.bPrice} ÷ ${slots.bCount} = ${slots.bPrice / slots.bCount} lei per object.`,
      `The lower unit price decides the better offer, so the smaller quotient wins.`
    ]
  },
  {
    template: 'Rate on a segment from a table',
    type: 'rate-on-a-segment-from-a-table',
    category: 'no-knowledge',
    parse: (statement) => {
      const positions = [...statement.matchAll(/minute (\d+)→(\d+) m/g)].map((match) => ({
        minute: Number(match[1]),
        meters: Number(match[2])
      }));
      const between = statement.match(/Between minutes (\d+) and (\d+)/);
      if (positions.length < 2 || between === null) { throw new Error('the position table or the segment bounds are missing'); }
      return { positions, from: Number(between[1]), to: Number(between[2]) };
    },
    solve: (slots) => {
      const start = slots.positions.find((position) => position.minute === slots.from);
      const end = slots.positions.find((position) => position.minute === slots.to);
      if (start === undefined || end === undefined) { throw new Error('the segment bounds are not in the table'); }
      return (end.meters - start.meters) / (end.minute - start.minute);
    },
    render: (solution) => `${solution} m/min.`,
    compute: computation(
      'const start = slots.positions.find((position) => position.minute === slots.from);',
      'const end = slots.positions.find((position) => position.minute === slots.to);',
      'if (start === undefined || end === undefined) { throw new Error("the segment bounds are not in the table"); }',
      'return (end.meters - start.meters) / (end.minute - start.minute) + " m/min.";'
    ),
    explain: (slots, solution) => [
      `A constant speed on a segment equals the change of position divided by the change of time.`,
      `Between minutes ${slots.from} and ${slots.to} only those two rows of the table matter.`,
      `The speed on the segment is ${solution} m/min.`
    ]
  },
  {
    template: 'Detect that the rate is not constant',
    type: 'detect-that-the-rate-is-not-constant',
    category: 'no-knowledge',
    parse: (statement) => {
      const positions = [...statement.matchAll(/minute (\d+)→(\d+) m/g)].map((match) => ({
        minute: Number(match[1]),
        meters: Number(match[2])
      }));
      if (positions.length < 3) { throw new Error('the position table is too short'); }
      return { positions };
    },
    solve: (slots) => {
      const speeds = [];
      for (let index = 1; index < slots.positions.length; index += 1) {
        const previous = slots.positions[index - 1];
        const current = slots.positions[index];
        speeds.push((current.meters - previous.meters) / (current.minute - previous.minute));
      }
      return speeds.every((speed) => speed === speeds[0]);
    },
    render: (solution) => (solution ? 'Yes.' : 'No.'),
    compute: computation(
      'const speeds = [];',
      'for (let index = 1; index < slots.positions.length; index += 1) {',
      '  const previous = slots.positions[index - 1];',
      '  const current = slots.positions[index];',
      '  speeds.push((current.meters - previous.meters) / (current.minute - previous.minute));',
      '}',
      'return speeds.every((speed) => speed === speeds[0]) ? "Yes." : "No.";'
    ),
    explain: (slots, solution) => [
      `A constant speed requires the same quotient of position change over time change on every interval.`,
      `Computing that quotient interval by interval shows the values differ, so the motion is not uniform.`,
      `The speed is therefore not constant, and the answer is ${solution ? 'Yes' : 'No'}.`
    ]
  },
  {
    template: 'Choose the fastest route, not the shortest',
    type: 'choose-the-fastest-route-not-the-shortest',
    category: 'no-knowledge',
    parse: (statement) => extract(statement, /Route A is (\d+) km long and is traveled at (\d+) km\/h[\s\S]*?Route B is (\d+) km long and is traveled at (\d+) km\/h/, ['aLength', 'aSpeed', 'bLength', 'bSpeed']),
    solve: (slots) => {
      const timeA = slots.aLength / slots.aSpeed;
      const timeB = slots.bLength / slots.bSpeed;
      if (timeA === timeB) { throw new Error('the two routes take the same time'); }
      return timeA < timeB ? 'A' : 'B';
    },
    render: (solution) => `Route ${solution}.`,
    compute: computation(
      'const timeA = slots.aLength / slots.aSpeed;',
      'const timeB = slots.bLength / slots.bSpeed;',
      'if (timeA === timeB) { throw new Error("the two routes take the same time"); }',
      'return "Route " + (timeA < timeB ? "A" : "B") + ".";'
    ),
    explain: (slots) => [
      `The shorter route is not automatically the faster one, because the routes are traveled at different speeds.`,
      `Route A takes ${slots.aLength} ÷ ${slots.aSpeed} = ${slots.aLength / slots.aSpeed} h, route B takes ${slots.bLength} ÷ ${slots.bSpeed} = ${slots.bLength / slots.bSpeed} h.`,
      `Comparing the travel times rather than the lengths identifies the faster route.`
    ]
  },
  {
    template: 'Intuitive dimensional check',
    type: 'intuitive-dimensional-check',
    category: 'no-knowledge',
    parse: (statement) => extract(statement, /speed of (\d+) km\/h and a time of (\d+) h/, ['speed', 'hours']),
    solve: (slots) => ({ speed: slots.speed, hours: slots.hours, distance: slots.speed * slots.hours }),
    render: (solution) => `${solution.speed}×${solution.hours}=${solution.distance} km.`,
    compute: computation('return slots.speed + "×" + slots.hours + "=" + slots.speed * slots.hours + " km.";'),
    explain: (slots, solution) => [
      `The wanted unit is kilometers, and the given units are km/h and h.`,
      `Multiplying (km/h) × h lets the hours cancel and leaves km, while adding km/h + h would combine different units.`,
      `So the correct operation is ${slots.speed} × ${slots.hours}, giving ${solution.distance} km.`
    ]
  }
];
