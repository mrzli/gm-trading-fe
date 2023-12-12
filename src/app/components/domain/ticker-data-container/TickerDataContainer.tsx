import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Key } from 'ts-key-enum';
import { Instrument } from '@gmjs/gm-trading-shared';
import { LoadingDisplay } from '../../shared/display/LoadingDisplay';
import { TwChart } from '../tw-chart/TwChart';
import {
  ChartTimeRangeChangeFn,
  TwChartResolution,
  TwChartSettings,
} from '../tw-chart/types';
import { TwChartToolbar } from '../tw-chart/components/composite/chart-toolbar/TwChartToolbar';
import { toTickerDataRows } from './process-chart-data';
import { PrettyDisplay } from '../../shared/display/PrettyDisplay';
import { invariant } from '@gmjs/assert';
import { moveLogicalRange } from '../tw-chart/util';
import { TwTimeStep } from '../tw-chart/types/tw-time-step';

export interface TickerDataContainerProps {
  readonly allInstruments: readonly Instrument[];
  readonly isLoadingData: boolean;
  readonly rawData: readonly string[] | undefined;
  readonly onRequestData: (name: string, resolution: TwChartResolution) => void;
}

export function TickerDataContainer({
  allInstruments,
  isLoadingData,
  rawData,
  onRequestData,
}: TickerDataContainerProps): React.ReactElement {
  const instrumentNames = useMemo(() => {
    return allInstruments?.map((instrument) => instrument.name) ?? [];
  }, [allInstruments]);

  const [settings, setSettings] = useState<TwChartSettings>({
    instrumentName: allInstruments[0].name,
    resolution: '5m',
    logicalRange: undefined,
  });

  const { instrumentName, resolution, logicalRange } = settings;

  useEffect(() => {
    onRequestData(instrumentName, resolution);
  }, [onRequestData, instrumentName, resolution]);

  const instrument = useMemo(() => {
    return allInstruments.find(
      (instrument) => instrument.name === instrumentName,
    );
  }, [allInstruments, instrumentName]);

  const finalData = useMemo(
    () => toTickerDataRows(rawData ?? [], resolution),
    [rawData, resolution],
  );

  const handleChartTimeRangeChange = useCallback<ChartTimeRangeChangeFn>(
    (range) => {
      setSettings((s) => ({
        ...s,
        logicalRange: range,
      }));
    },
    [],
  );

  const handleChartKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      switch (event.key) {
        case Key.ArrowLeft:
        case Key.ArrowRight: {
          const offset = toLogicalOffset(event);
          const timeStep: TwTimeStep = {
            unit: 'B',
            value: offset,
          };
          setSettings((s) => ({
            ...s,
            logicalRange: s.logicalRange
              ? moveLogicalRange(s.logicalRange, timeStep, finalData)
              : undefined,
          }));
          break;
        }
      }
    },
    [finalData],
  );

  if (!instrument) {
    return <div>Instrument not found.</div>;
  }

  const dataChartElement =
    !isLoadingData && finalData.length > 0 ? (
      <TwChart
        precision={instrument.precision}
        data={finalData}
        logicalRange={logicalRange}
        onChartTimeRangeChange={handleChartTimeRangeChange}
        onChartKeyDown={handleChartKeyDown}
      />
    ) : isLoadingData ? (
      <LoadingDisplay />
    ) : (
      <div>Please load data...</div>
    );

  return (
    <div className='h-screen flex flex-col gap-4 p-4'>
      <TwChartToolbar
        instrumentNames={instrumentNames}
        data={finalData}
        settings={settings}
        onSettingsChange={setSettings}
      />
      <PrettyDisplay content={settings} />
      <div className='flex-1 overflow-hidden'>{dataChartElement}</div>
    </div>
  );
}

function toLogicalOffset(event: React.KeyboardEvent<HTMLDivElement>): number {
  const base = toBaseLogicalOffset(event);
  const multiplier = toLogicalOffsetMultiplier(event);
  return base * multiplier;
}

function toBaseLogicalOffset(
  event: React.KeyboardEvent<HTMLDivElement>,
): number {
  switch (event.key) {
    case Key.ArrowLeft: {
      return -1;
    }
    case Key.ArrowRight: {
      return 1;
    }
  }

  invariant(false, `Unexpected key: ${event.key}`);
}

function toLogicalOffsetMultiplier(
  event: React.KeyboardEvent<HTMLDivElement>,
): number {
  return event.shiftKey ? 10 : 1;
}