import React, { useEffect, useMemo, useState } from 'react';
import { UTCTimestamp } from 'lightweight-charts';
import { useStoreInstrument, useStoreTickerData } from '../../../store';
import { TickerDataRow } from '../../types';
import { LoadingDisplay } from '../shared/display/LoadingDisplay';
import { TwChart } from '../domain/tw-chart/TwChart';
import { parseFloatOrThrow, parseIntegerOrThrow } from '@gmjs/number-util';
import { TwChartSettings } from '../domain/tw-chart/types';
import { TwChartToolbar } from '../domain/tw-chart/components/TwChartToolbar';

export function TickerDataContainer(): React.ReactElement {
  const { isLoadingAllInstruments, allInstruments, getAllInstruments } =
    useStoreInstrument();

  const { isLoadingTickerData, tickerData, getTickerData } =
    useStoreTickerData();

  useEffect(() => {
    getAllInstruments();
  }, [getAllInstruments]);

  const instrumentNames = useMemo(() => {
    return allInstruments?.map((instrument) => instrument.name) ?? [];
  }, [allInstruments]);

  const [settings, setSettings] = useState<TwChartSettings>({
    instrumentName: '',
    resolution: '5m',
  });

  const [instrumentNameInitialized, setInstrumentNameInitialized] =
    useState(false);

  useEffect(
    () => {
      if (instrumentNames.length === 0 || instrumentNameInitialized) {
        return;
      }

      setInstrumentNameInitialized(true);

      setSettings((s) => ({
        ...s,
        instrumentName: instrumentNames[0],
      }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [instrumentNames],
  );

  const { instrumentName, resolution } = settings;

  useEffect(() => {
    getTickerData({
      name: instrumentName,
      resolution: 'minute',
      date: undefined,
    });
  }, [instrumentName, resolution, getTickerData]);

  const instrument = useMemo(() => {
    return allInstruments?.find(
      (instrument) => instrument.name === instrumentName,
    );
  }, [allInstruments, instrumentName]);

  const finalData = useMemo(
    () => toTickerDataRows(tickerData?.data ?? []),
    [tickerData],
  );

  if (isLoadingAllInstruments || !allInstruments || !instrument) {
    return <LoadingDisplay />;
  }

  const dataChartElement =
    !isLoadingTickerData && finalData.length > 0 ? (
      <TwChart precision={instrument.precision} data={finalData} />
    ) : isLoadingTickerData ? (
      <LoadingDisplay />
    ) : (
      'None'
    );

  return (
    <div className='h-screen flex flex-col gap-4 p-4'>
      <TwChartToolbar
        instrumentNames={instrumentNames}
        settings={settings}
        onSettingsChange={setSettings}
      />
      <div className='flex-1'>{dataChartElement}</div>
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
