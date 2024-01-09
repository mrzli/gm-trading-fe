import React, { useCallback, useMemo } from 'react';
import { Instrument } from '@gmjs/gm-trading-shared';
import { TwChart } from '../tw-chart/TwChart';
import {
  BarReplayPosition,
  Bars,
  ChartRange,
  ChartSettings,
  ChartTimezone,
  GroupedBars,
} from '../../types';
import { FullBarData } from './types';
import { Key } from 'ts-key-enum';
import { ChartTimeStep } from '../chart-toolbar/types';
import { moveLogicalRange } from '../chart-toolbar/util';
import { getChartData, toLogicalOffset } from './util';
import { barReplayMoveSubBar, isChartRangeEqual } from '../../util';

export interface ChartContainerProps {
  readonly instrument: Instrument;
  readonly settings: ChartSettings;
  readonly fullData: FullBarData;
  readonly isTrading: boolean;
  readonly logicalRange: ChartRange | undefined;
  readonly onLogicalRangeChange: (logicalRange: ChartRange | undefined) => void;
  readonly replayPosition: BarReplayPosition;
  readonly onReplayPositionChange: (position: BarReplayPosition) => void;
}

export function ChartContainer({
  instrument,
  settings,
  fullData,
  isTrading,
  logicalRange,
  onLogicalRangeChange,
  replayPosition,
  onReplayPositionChange,
}: ChartContainerProps): React.ReactElement {
  const { resolution, timezone } = settings;
  const { subBars, bars } = fullData;

  const chartData = useMemo(() => {
    return getChartData(fullData, replayPosition, resolution);
  }, [fullData, replayPosition, resolution]);

  const handleChartKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      switch (event.key) {
        case Key.ArrowLeft:
        case Key.ArrowRight: {
          if (isTrading) {
            keyboardNavigateReplay(
              event,
              subBars,
              replayPosition,
              onReplayPositionChange,
            );
          } else {
            keyboardNavigateChart(
              event,
              bars,
              timezone,
              logicalRange,
              onLogicalRangeChange,
            );
          }
          break;
        }
      }
    },
    [
      bars,
      isTrading,
      logicalRange,
      onLogicalRangeChange,
      onReplayPositionChange,
      replayPosition,
      subBars,
      timezone,
    ],
  );

  return (
    <TwChart
      settings={settings}
      precision={instrument.precision}
      data={chartData}
      logicalRange={logicalRange}
      onLogicalRangeChange={onLogicalRangeChange}
      onChartKeyDown={handleChartKeyDown}
    />
  );
}

function keyboardNavigateChart(
  event: React.KeyboardEvent<HTMLDivElement>,
  bars: Bars,
  timezone: ChartTimezone,
  logicalRange: ChartRange | undefined,
  handleLogicalRangeChange: (logicalRange: ChartRange | undefined) => void,
): void {
  const offset = toLogicalOffset(event);
  const timeStep: ChartTimeStep = {
    unit: 'B',
    value: offset,
  };
  const newLogicalRange = logicalRange
    ? moveLogicalRange(logicalRange, timeStep, bars, timezone)
    : undefined;
  if (isChartRangeEqual(logicalRange, newLogicalRange)) {
    return;
  }

  handleLogicalRangeChange(newLogicalRange);
}

function keyboardNavigateReplay(
  event: React.KeyboardEvent<HTMLDivElement>,
  subBars: GroupedBars,
  replayPosition: BarReplayPosition,
  handleReplayPositionChange: (replayPosition: BarReplayPosition) => void,
): void {
  const { barIndex, subBarIndex } = replayPosition;
  if (barIndex === undefined) {
    return;
  }

  const amount = event.key === Key.ArrowLeft ? -1 : 1;
  const newBarReplayIndexes = barReplayMoveSubBar(
    subBars,
    barIndex,
    subBarIndex,
    amount,
  );

  const { barIndex: newBarIndex, subBarIndex: newSubBarIndex } =
    newBarReplayIndexes;

  const newBarReplayPosition: BarReplayPosition = {
    barIndex: newBarIndex,
    subBarIndex: newSubBarIndex,
  };

  handleReplayPositionChange(newBarReplayPosition);
}
