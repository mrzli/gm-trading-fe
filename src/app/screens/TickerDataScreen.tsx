import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useStoreInstrument, useStoreTickerData } from '../../store';
import { TickerFilterData } from '../types';
import { LoadingDisplay } from '../components/shared/display/LoadingDisplay';
import { TickerDataFilter } from '../components/ticker-data/TickerDataFilter';
import { Button } from '../components/shared/buttons/Button';
import { DEFAULT_TICKER_DATA_FILTER_DATA } from '../util';
import { TwChart } from '../components/shared/shared/tw-chart/TwChart';

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

  if (isLoadingAllInstruments || !allInstruments) {
    return <LoadingDisplay />;
  }

  const dataChartElement =
    !isLoadingTickerData && tickerData ? (
      <TwChart data={[]} />
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
