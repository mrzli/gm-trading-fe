import React, { useCallback, useEffect } from 'react';
import { TickerDataContainer } from '../components/domain/ticker-data-container/TickerDataContainer';
import { useStoreInstrument, useStoreTickerData } from '../../store';
import { LoadingDisplay } from '../components/shared/display/LoadingDisplay';
import { TwChartResolution } from '../components/domain/tw-chart/types';

export function TickerDataScreen(): React.ReactElement {
  const { isLoadingAllInstruments, allInstruments, getAllInstruments } =
    useStoreInstrument();

  const { isLoadingTickerData, tickerData, getTickerData } =
    useStoreTickerData();

  useEffect(() => {
    getAllInstruments();
  }, [getAllInstruments]);

  const handleRequestData = useCallback(
    (name: string, _resolution: TwChartResolution) => {
      getTickerData({
        name,
        resolution: 'minute',
        date: undefined,
      });
    },
    [getTickerData],
  );

  if (isLoadingAllInstruments || !allInstruments) {
    return <LoadingDisplay />;
  } else if (allInstruments.length === 0) {
    return <div>No instruments found.</div>;
  }

  return (
    <TickerDataContainer
      allInstruments={allInstruments}
      isLoadingData={isLoadingTickerData}
      rawData={tickerData?.data}
      onRequestData={handleRequestData}
    />
  );
}
