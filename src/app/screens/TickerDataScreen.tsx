import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useStoreInstrument, useStoreTickerData } from '../../store';
import { TickerFilterData } from '../types';
import { LoadingDisplay } from '../components/shared/display/LoadingDisplay';
import { TickerDataFilter } from '../components/ticker-data/TickerDataFilter';
import { Button } from '../components/shared/buttons/Button';
import { TickerDataChart } from '../components/ticker-data/TickerDataChart';
import { DEFAULT_TICKER_DATA_FILTER_DATA } from '../util';

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
    name: 'DAX',
    resolution: 'minute',
    fromDate: '2023-02-01T07:30:00Z',
    toDate: '2023-02-01T08:30:00Z',
  });

  const handleApplyFilterClick = useCallback(() => {
    const { name, resolution, fromDate, toDate } = filterData;
    if (resolution === '') {
      return;
    }

    getTickerData({
      name,
      resolution,
      from: fromDate,
      to: toDate,
    });
  }, [getTickerData, filterData]);

  if (isLoadingAllInstruments || !allInstruments) {
    return <LoadingDisplay />;
  }

  const dataChartElement =
    !isLoadingTickerData && tickerData ? (
      <TickerDataChart
        resolution={tickerData.resolution}
        rawData={tickerData.data}
      />
    ) : undefined;

  return (
    <div className='h-screen flex flex-col'>
      <div className='flex flex-col gap-2 p-4'>
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
