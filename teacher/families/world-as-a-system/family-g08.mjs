/**
 * Family G8 of the world seed book: climate classification from data.
 *
 * Every problem states a threshold classification (cool/mild/warm by mean
 * temperature and dry/wet by annual precipitation) plus the temperature and
 * precipitation of three stations. The task classifies one named station on the
 * two independent dimensions and asks whether any other station receives the
 * same pair of labels. The four grades share one computation; they differ only
 * in the stated numbers, so their cases share the parse, solve, render,
 * compute, and explain functions and declare only their own printed template.
 */

import { blocksOf, stripCrossDomain, parseCrossDomain, renderCrossDomain, CROSS_DOMAIN_SOURCE } from './shared.mjs';
import { slugify } from '../../naming.mjs';

const STATION_PATTERN = /Station ([A-Z][a-z]?): T=(-?\d+(?:\.\d+)?)°C, P=(-?\d+(?:\.\d+)?) mm/g;

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const cool = /cool if mean temperature <(\d+(?:\.\d+)?)/.exec(facts);
  const warm = /warm if >(\d+(?:\.\d+)?)/.exec(facts);
  const dry = /Dry if annual precipitation <(\d+(?:\.\d+)?)/.exec(facts);
  if (cool === null || warm === null || dry === null) {
    throw new Error('the facts state no complete threshold classification');
  }
  const stations = [...facts.matchAll(STATION_PATTERN)].map((match) => ({
    id: `Station ${match[1]}`,
    temperature: Number(match[2]),
    precipitation: Number(match[3])
  }));
  if (stations.length === 0) {
    throw new Error('the facts state no station');
  }
  const target = /Classify (Station [A-Z][a-z]?)\./.exec(blocks.Task);
  if (target === null) {
    throw new Error('the task does not name the station to classify');
  }
  if (!/same two-label class/.test(blocks.Task)) {
    throw new Error('the task does not ask whether another station shares the class');
  }
  return {
    target: target[1],
    thresholds: { coolBelow: Number(cool[1]), warmAbove: Number(warm[1]), dryBelow: Number(dry[1]) },
    stations,
    crossDomain: parseCrossDomain(blocks['Given facts'])
  };
}

// The temperature thresholds partition the line: below the mild range is cool,
// above it is warm, and everything in between is mild. Precipitation is a
// separate dimension with its own single threshold.
function temperatureLabel(value, thresholds) {
  if (value < thresholds.coolBelow) {
    return 'cool';
  }
  return value > thresholds.warmAbove ? 'warm' : 'mild';
}

function precipitationLabel(value, thresholds) {
  return value < thresholds.dryBelow ? 'dry' : 'wet';
}

function solve(slots) {
  if (slots.thresholds.warmAbove <= slots.thresholds.coolBelow) {
    throw new Error('the temperature thresholds are not ordered cool < warm');
  }
  const target = slots.stations.find((station) => station.id === slots.target);
  if (target === undefined) {
    throw new Error('the station named by the task is not among the stated stations');
  }
  const temperature = temperatureLabel(target.temperature, slots.thresholds);
  const precipitation = precipitationLabel(target.precipitation, slots.thresholds);
  const matches = slots.stations
    .filter(
      (station) =>
        station.id !== target.id &&
        temperatureLabel(station.temperature, slots.thresholds) === temperature &&
        precipitationLabel(station.precipitation, slots.thresholds) === precipitation
    )
    .map((station) => station.id);
  return {
    target: target.id,
    temperature,
    precipitation,
    temperatureValue: target.temperature,
    precipitationValue: target.precipitation,
    matches,
    thresholds: slots.thresholds,
    crossDomain: slots.crossDomain
  };
}

function render(solution) {
  const shared =
    solution.matches.length === 0
      ? 'no other station has the same class.'
      : `same class: ${solution.matches.join(', ')}.`;
  const main = `${solution.target} is ${solution.temperature} and ${solution.precipitation}; ${shared}`;
  const suffix = renderCrossDomain(solution.crossDomain);
  return suffix === '' ? main : `${main} ${suffix}`;
}

const COMPUTE = [
  CROSS_DOMAIN_SOURCE,
  'const slots = $slots;',
  'probe(Array.isArray(slots.stations) && slots.stations.length > 1, "the task must state the classified station and at least one other station");',
  'probe(typeof slots.target === "string" && slots.target.length > 0, "the task must name the station to classify");',
  'probe(slots.thresholds !== null && typeof slots.thresholds === "object", "the statement must state the classification thresholds");',
  'probe(slots.thresholds.warmAbove > slots.thresholds.coolBelow, "the temperature thresholds must be ordered cool < warm");',
  'probe(slots.thresholds.dryBelow > 0, "the precipitation threshold must be a positive amount");',
  'const temperatureLabel = (value) => value < slots.thresholds.coolBelow ? "cool" : value > slots.thresholds.warmAbove ? "warm" : "mild";',
  'const precipitationLabel = (value) => value < slots.thresholds.dryBelow ? "dry" : "wet";',
  'const target = slots.stations.find((station) => station.id === slots.target);',
  'probe(target !== undefined, "the station named by the task must be one of the stated stations");',
  'const temperature = temperatureLabel(target.temperature);',
  'const precipitation = precipitationLabel(target.precipitation);',
  'probe(["cool", "mild", "warm"].indexOf(temperature) >= 0 && ["dry", "wet"].indexOf(precipitation) >= 0, "every station must receive one stated temperature label and one stated precipitation label");',
  'const matches = slots.stations.filter((station) => station.id !== slots.target && temperatureLabel(station.temperature) === temperature && precipitationLabel(station.precipitation) === precipitation).map((station) => station.id);',
  'probe(matches.length < slots.stations.length, "the shared-class list must exclude the classified station itself");',
  'const main = slots.target + " is " + temperature + " and " + precipitation + "; " + (matches.length === 0 ? "no other station has the same class." : "same class: " + matches.join(", ") + ".");',
  'const suffix = renderCrossDomain(slots.crossDomain);',
  'return suffix === "" ? main : main + " " + suffix;'
].join('\n');

function explain(slots, solution) {
  const shared =
    solution.matches.length === 0
      ? `No other station carries both ${solution.temperature} and ${solution.precipitation}, so no station shares the class.`
      : `${solution.matches.join(', ')} carry the same pair of labels ${solution.temperature} and ${solution.precipitation}.`;
  return [
    `Read the two dimensions separately: a temperature threshold at ${solution.thresholds.coolBelow} and ${solution.thresholds.warmAbove} degrees, and a precipitation threshold at ${solution.thresholds.dryBelow} mm.`,
    `Compare T=${solution.temperatureValue} with those thresholds: ${solution.target} is ${solution.temperature}.`,
    `Compare P=${solution.precipitationValue} with ${solution.thresholds.dryBelow} mm: ${solution.target} is ${solution.precipitation}.`,
    shared
  ];
}

function caseFor(grade) {
  const template = `Climate from data (grade ${grade})`;
  return {
    template,
    type: slugify(template),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  };
}

export const unit = 'G8';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
