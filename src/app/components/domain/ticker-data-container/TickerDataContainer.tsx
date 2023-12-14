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
import { PrettyDisplay } from '../../shared/display/PrettyDisplay';
import { moveLogicalRange } from '../tw-chart/util';
import { TwTimeStep } from '../tw-chart/types/tw-time-step';
import { getChartData, rawDataToFullTickerData, toLogicalOffset } from './util';

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
    replaySettings: {
      barIndex: undefined,
      subBarIndex: 0,
    },
  });

  const { instrumentName, resolution, logicalRange, replaySettings } = settings;

  useEffect(() => {
    setSettings((s) => ({
      ...s,
      replaySettings: {
        barIndex: undefined,
        subBarIndex: 0,
      },
    }));
    onRequestData(instrumentName, resolution);
  }, [onRequestData, instrumentName, resolution]);

  const instrument = useMemo(() => {
    return allInstruments.find(
      (instrument) => instrument.name === instrumentName,
    );
  }, [allInstruments, instrumentName]);

  const fullData = useMemo(
    () => rawDataToFullTickerData(rawData ?? [], resolution),
    [rawData, resolution],
  );

  const chartData = useMemo(() => {
    return getChartData(fullData, replaySettings);
  }, [fullData, replaySettings]);

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
              ? moveLogicalRange(s.logicalRange, timeStep, fullData.rows)
              : undefined,
          }));
          break;
        }
      }
    },
    [fullData],
  );

  if (!instrument) {
    return <div>Instrument not found.</div>;
  }

  const dataChartElement =
    !isLoadingData && chartData.length > 0 ? (
      <TwChart
        precision={instrument.precision}
        data={chartData}
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
        subRows={fullData.subRows}
        rows={fullData.rows}
        settings={settings}
        onSettingsChange={setSettings}
      />
      <PrettyDisplay content={settings} />
      <div className='flex-1 overflow-hidden'>{dataChartElement}</div>
    </div>
  );
}
