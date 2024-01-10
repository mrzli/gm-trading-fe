import { invariant } from '@gmjs/assert';
import { clamp } from '@gmjs/number-util';
import { ChartRange, Bars, ChartTimezone } from '../../../types';
import { binarySearch } from '../../../util';
import { ChartTimeStep } from '../types';
import { Duration, unixSecondsAdd } from '@gmjs/date-util';

const DEFAULT_SPAN = 60;

export function moveLogicalRange(
  currLogicalRange: ChartRange,
  timeStep: ChartTimeStep,
  data: Bars,
  timezone: ChartTimezone,
): ChartRange {
  const currLogical = logicalRangeToLogical(currLogicalRange);
  const newLogical = moveLogical(currLogical, timeStep, data, timezone);
  return logicalToLogicalRange(newLogical, currLogicalRange, data.length);
}

export function timeToLogical(time: number, data: Bars): number {
  return binarySearch(data, time, (item) => item.time);
}

export function logicalToTime(logical: number, data: Bars): number {
  if (logical < 0) {
    return data[0].time;
  } else if (logical >= data.length) {
    return data.at(-1)!.time;
  }

  return data[Math.floor(logical)].time;
}

function moveLogical(
  currLogical: number,
  timeStep: ChartTimeStep,
  data: Bars,
  timezone: ChartTimezone,
): number {
  const currBar = getCurrentBar(currLogical, data.length);
  const newLogical = moveLogicalInternal(currBar, timeStep, data, timezone);
  const newBar = getCurrentBar(newLogical, data.length);
  // make sure you move at least one bar
  const adjustedNewBar =
    newBar === currBar ? newBar + Math.sign(timeStep.value) : newBar;
  return clamp(adjustedNewBar, 0, data.length - 1);
}

function getCurrentBar(logical: number, length: number): number {
  return Math.floor(clamp(logical, 0, length - 1));
}

function moveLogicalInternal(
  currBar: number,
  timeStep: ChartTimeStep,
  data: Bars,
  timezone: ChartTimezone,
): number {
  const { unit, value } = timeStep;

  if (unit === 'B') {
    return currBar + value;
  } else {
    const currTime = data[currBar].time;
    const targetTime = moveTime(currTime, timezone, timeStep);
    return timeToLogical(targetTime, data);
  }
}

function moveTime(
  currTime: number,
  timezone: ChartTimezone,
  timeStep: ChartTimeStep,
): number {
  const amount = timeStepToDuration(timeStep);
  return unixSecondsAdd(currTime, timezone, amount);
}

function timeStepToDuration(timeStep: ChartTimeStep): Duration {
  const { unit, value } = timeStep;

  switch (unit) {
    case 'h': {
      return {
        hours: value,
      };
    }
    case 'D': {
      return {
        days: value,
      };
    }
    case 'W': {
      return {
        weeks: value,
      };
    }
    case 'M': {
      return {
        months: value,
      };
    }
    default: {
      invariant(
        false,
        `Unexpected time unit when converting time step to duration: '${unit}'.`,
      );
    }
  }
}

function logicalRangeToLogical(logicalRange: ChartRange): number {
  return (logicalRange.from + logicalRange.to) / 2;
}

export function logicalToLogicalRange(
  logical: number,
  currLogicalRange: ChartRange | undefined,
  dataLength: number,
): ChartRange {
  const finalLogical = clamp(logical, 0, dataLength - 1);

  const span = currLogicalRange
    ? currLogicalRange.to - currLogicalRange.from
    : DEFAULT_SPAN;

  const from = finalLogical - span / 2;
  const to = finalLogical + span / 2;

  return { from, to };
}
