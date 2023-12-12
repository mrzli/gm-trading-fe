import { clampNumber, parseIntegerOrThrow } from '@gmjs/number-util';
import { TickerDataRow } from '../../../../../../../types';
import { binarySearch } from '../../../../util/binary-search';
import { TwTimeStep } from '../types';
import { invariant } from '@gmjs/assert';
import {
  DAY_TO_SECONDS,
  HOUR_TO_SECONDS,
  WEEK_TO_SECONDS,
} from '../../../../../../../util';
import { DateTime } from 'luxon';

export function timeToLogical(
  time: number,
  data: readonly TickerDataRow[],
): number {
  return binarySearch(data, time, (row) => row.time);
}

export function logicalToTime(
  logical: number,
  data: readonly TickerDataRow[],
): number {
  if (logical < 0) {
    return data[0].time;
  } else if (logical >= data.length) {
    return data.at(-1)!.time;
  }

  return data[Math.floor(logical)].time;
}

export function moveLogical(
  currLogical: number,
  timeStep: TwTimeStep,
  data: readonly TickerDataRow[],
  isForward: boolean,
): number {
  const currBar = getCurrentBar(currLogical, data.length);
  const newLogical = moveLogicalInternal(currBar, timeStep, data, isForward);
  const newBar = getCurrentBar(newLogical, data.length);
  // make sure you move at least one bar
  const adjustedNewBar = newBar === currBar ? newBar + (isForward ? 1 : -1) : newBar;
  return clampNumber(adjustedNewBar, 0, data.length - 1);
}

function getCurrentBar(logical: number, length: number): number {
  return Math.floor(clampNumber(logical, 0, length - 1));
}

function moveLogicalInternal(
  currBar: number,
  timeStep: TwTimeStep,
  data: readonly TickerDataRow[],
  isForward: boolean,
): number {
  if (timeStep.endsWith('B')) {
    const moveBars = parseIntegerOrThrow(timeStep.slice(0, -1));
    return isForward ? currBar + moveBars : currBar - moveBars;
  } else {
    const currTime = data[currBar].time;
    const targetTime = moveTime(currTime, timeStep, isForward);
    return timeToLogical(targetTime, data);
  }
}

function moveTime(
  currTime: number,
  timeStep: TwTimeStep,
  isForward: boolean,
): number {
  const value = parseIntegerOrThrow(timeStep.slice(0, -1));
  const unit = timeStep.slice(-1);

  switch (unit) {
    case 'h':
    case 'D':
    case 'W': {
      const timeDelta = getTimeDelta(timeStep);
      return isForward ? currTime + timeDelta : currTime - timeDelta;
    }
    case 'M': {
      const months = isForward ? value : -value;
      return addMonth(currTime, months);
    }
    default: {
      invariant(false, `Unexpected time unit when moving by time: '${unit}'.`);
    }
  }
}

function getTimeDelta(timeStep: TwTimeStep): number {
  const value = parseIntegerOrThrow(timeStep.slice(0, -1));
  const unit = timeStep.slice(-1);

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

export function addMonth(timestamp: number, months: number): number {
  return DateTime.fromSeconds(timestamp, { zone: 'UTC' })
    .plus({ months })
    .toSeconds();
}
