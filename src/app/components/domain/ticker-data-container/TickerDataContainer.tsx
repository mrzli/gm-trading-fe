import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { LoadingDisplay } from '../../shared/display/LoadingDisplay';
import { TwChart } from '../tw-chart/TwChart';
import {
  ChartTimeRangeChangeFn,
  TwChartResolution,
  TwChartSettings,
} from '../tw-chart/types';
import { TwChartToolbar } from '../tw-chart/components/composite/chart-toolbar/TwChartToolbar';
import { Instrument } from '@gmjs/gm-trading-shared';
import { toTickerDataRows } from './process-chart-data';
import { PrettyDisplay } from '../../shared/display/PrettyDisplay';

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
    timeRange: undefined,
  });

  const { instrumentName, resolution, timeRange } = settings;

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
        timeRange: range,
      }));
    },
    [],
  );

  if (!instrument) {
    return <div>Instrument not found.</div>;
  }

  const dataChartElement =
    !isLoadingData && finalData.length > 0 ? (
      <TwChart
        precision={instrument.precision}
        data={finalData}
        timeRange={timeRange}
        onChartTimeRangeChange={handleChartTimeRangeChange}
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
