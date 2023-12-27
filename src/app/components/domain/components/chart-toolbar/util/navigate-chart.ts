import { DateTime } from 'luxon';
import { invariant } from '@gmjs/assert';
import { clamp } from '@gmjs/number-util';
import { ChartRange, Bars } from '../../../types';
import {
  HOUR_TO_SECONDS,
  DAY_TO_SECONDS,
  WEEK_TO_SECONDS,
} from '../../../../../util';
import { binarySearch } from './binary-search';
import { ChartTimeStep } from '../types';

const DEFAULT_SPAN = 60;

export function moveLogicalRange(
  currLogicalRange: ChartRange,
  timeStep: ChartTimeStep,
  data: Bars,
): ChartRange {
  const currLogical = logicalRangeToLogical(currLogicalRange);
  const newLogical = moveLogical(currLogical, timeStep, data);
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
): number {
  const currBar = getCurrentBar(currLogical, data.length);
  const newLogical = moveLogicalInternal(currBar, timeStep, data);
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
): number {
  const { unit, value } = timeStep;

  if (unit === 'B') {
    return currBar + value;
  } else {
    const currTime = data[currBar].time;
    const targetTime = moveTime(currTime, timeStep);
    return timeToLogical(targetTime, data);
  }
}

function moveTime(currTime: number, timeStep: ChartTimeStep): number {
  const { unit, value } = timeStep;

  switch (unit) {
    case 'h':
    case 'D':
    case 'W': {
      const timeDelta = getTimeDelta(timeStep);
      return currTime + timeDelta;
    }
    case 'M': {
      return addMonth(currTime, value);
    }
    default: {
      invariant(false, `Unexpected time unit when moving by time: '${unit}'.`);
    }
  }
}

function getTimeDelta(timeStep: ChartTimeStep): number {
  const { unit, value } = timeStep;

  switch (unit) {
    case 'h': {
      return value * HOUR_TO_SECONDS;
    }
    case 'D': {
      return value * DAY_TO_SECONDS;
    }
    case 'W': {
      return value * WEEK_TO_SECONDS;
    }
    default: {
      invariant(
        false,
        `Unexpected time unit when calculating time delta: '${unit}'.`,
      );
    }
  }
}

function addMonth(timestamp: number, months: number): number {
  return DateTime.fromSeconds(timestamp, { zone: 'UTC' })
    .plus({ months })
    .toSeconds();
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
