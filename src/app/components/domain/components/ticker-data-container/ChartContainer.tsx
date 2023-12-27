import React, { useCallback, useMemo } from 'react';
import { Instrument } from '@gmjs/gm-trading-shared';
import { TwChart } from '../tw-chart/TwChart';
import { BarReplayPosition, ChartRange, ChartSettings } from '../../types';
import { FullBarData } from './types';
import { Key } from 'ts-key-enum';
import { ChartTimeStep } from '../chart-toolbar/types';
import { moveLogicalRange } from '../chart-toolbar/util';
import { getChartData, toLogicalOffset } from './util';
import { isChartRangeEqual } from '../../util';

export interface ChartContainerProps {
  readonly instrument: Instrument;
  readonly settings: ChartSettings;
  readonly fullData: FullBarData;
  readonly logicalRange: ChartRange | undefined;
  readonly onLogicalRangeChange: (logicalRange: ChartRange | undefined) => void;
  readonly replayPosition: BarReplayPosition;
}

export function ChartContainer({
  instrument,
  settings,
  fullData,
  logicalRange,
  onLogicalRangeChange,
  replayPosition,
}: ChartContainerProps): React.ReactElement {
  const chartData = useMemo(() => {
    return getChartData(fullData, replayPosition);
  }, [fullData, replayPosition]);

  const handleChartKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      switch (event.key) {
        case Key.ArrowLeft:
        case Key.ArrowRight: {
          const offset = toLogicalOffset(event);
          const timeStep: ChartTimeStep = {
            unit: 'B',
            value: offset,
          };
          const newLogicalRange = logicalRange
            ? moveLogicalRange(logicalRange, timeStep, fullData.rows)
            : undefined;
          if (isChartRangeEqual(logicalRange, newLogicalRange)) {
            return;
          }

          onLogicalRangeChange(newLogicalRange);
          break;
        }
      }
    },
    [fullData.rows, logicalRange, onLogicalRangeChange],
  );

  return (
    <TwChart
      precision={instrument.precision}
      data={chartData}
      timezone={settings.timezone}
      logicalRange={logicalRange}
      onLogicalRangeChange={onLogicalRangeChange}
      onChartKeyDown={handleChartKeyDown}
    />
  );
}
