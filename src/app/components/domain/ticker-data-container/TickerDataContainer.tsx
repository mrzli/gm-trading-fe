import React, { useEffect, useMemo, useState } from 'react';
import { UTCTimestamp } from 'lightweight-charts';
import { TickerDataRow } from '../../../types';
import { LoadingDisplay } from '../../shared/display/LoadingDisplay';
import { TwChart } from '../tw-chart/TwChart';
import { parseFloatOrThrow, parseIntegerOrThrow } from '@gmjs/number-util';
import { TwChartResolution, TwChartSettings } from '../tw-chart/types';
import { TwChartToolbar } from '../tw-chart/components/TwChartToolbar';
import { Instrument } from '@gmjs/gm-trading-shared';

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
  });

  const { instrumentName, resolution } = settings;

  useEffect(() => {
    onRequestData(instrumentName, resolution);
  }, [onRequestData, instrumentName, resolution]);

  const instrument = useMemo(() => {
    return allInstruments.find(
      (instrument) => instrument.name === instrumentName,
    );
  }, [allInstruments, instrumentName]);

  const finalData = useMemo(() => toTickerDataRows(rawData ?? []), [rawData]);

  if (!instrument) {
    return <div>Instrument not found.</div>;
  }

  const dataChartElement =
    !isLoadingData && finalData.length > 0 ? (
      <TwChart precision={instrument.precision} data={finalData} />
    ) : isLoadingData ? (
      <LoadingDisplay />
    ) : (
      <div>Please load data...</div>
    );

  return (
    <div className='h-screen flex flex-col gap-4 p-4'>
        <TwChartToolbar
          instrumentNames={instrumentNames}
          settings={settings}
          onSettingsChange={setSettings}
        />
        <div className='flex-1 overflow-hidden'>{dataChartElement}</div>
    </div>
  );
}

function toTickerDataRows(lines: readonly string[]): TickerDataRow[] {
  return lines.map((element) => toTickerDataRow(element));
}

function toTickerDataRow(line: string): TickerDataRow {
  const [timestamp, _date, open, high, low, close] = line.split(',');

  return {
    time: parseIntegerOrThrow(timestamp) as UTCTimestamp,
    open: parseFloatOrThrow(open),
    high: parseFloatOrThrow(high),
    low: parseFloatOrThrow(low),
    close: parseFloatOrThrow(close),
  };
}
