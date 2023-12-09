import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useStoreInstrument, useStoreTickerData } from '../../store';
import { TickerFilterData, TickerDataRow } from '../types';
import { LoadingDisplay } from '../components/shared/display/LoadingDisplay';
import { TickerDataFilter } from '../components/ticker-data/TickerDataFilter';
import { Button } from '../components/shared/buttons/Button';
import { DEFAULT_TICKER_DATA_FILTER_DATA } from '../util';
import { TwChart } from '../components/domain/tw-chart/TwChart';
import { parseFloatOrThrow, parseIntegerOrThrow } from '@gmjs/number-util';
import { UTCTimestamp } from 'lightweight-charts';

export function TickerDataScreen(): React.ReactElement {
  const { isLoadingAllInstruments, allInstruments, getAllInstruments } =
    useStoreInstrument();

  const { isLoadingTickerData, tickerData, getTickerData } =
    useStoreTickerData();

  useEffect(() => {
    getAllInstruments();
  }, [getAllInstruments]);

  const tickerNames = useMemo(() => {
    return allInstruments?.map((instrument) => instrument.name) ?? [];
  }, [allInstruments]);

  const [filterData, setFilterData] = useState<TickerFilterData>({
    ...DEFAULT_TICKER_DATA_FILTER_DATA,
    name: 'EUR_USD',
    resolution: 'minute',
    date: '',
  });

  const instrument = useMemo(() => {
    return allInstruments?.find(
      (instrument) => instrument.name === filterData.name,
    );
  }, [allInstruments, filterData.name]);

  const handleApplyFilterClick = useCallback(() => {
    const { name, resolution, date } = filterData;
    if (resolution === '') {
      return;
    }

    getTickerData({
      name,
      resolution,
      date: date === '' ? undefined : date,
    });
  }, [getTickerData, filterData]);

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
      <div className='flex flex-col gap-2'>
        <TickerDataFilter
          tickerNames={tickerNames}
          data={filterData}
          onDataChange={setFilterData}
        />
        <Button label='Apply' onClick={handleApplyFilterClick} />
      </div>
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
