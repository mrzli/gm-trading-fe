import React, { useCallback, useEffect } from 'react';
import { TickerDataContainer } from '../components/domain/components/ticker-data-container/TickerDataContainer';
import { useStoreInstrument, useStoreTickerData } from '../../store';
import { LoadingDisplay } from '../components/shared';
import { TickerDataResolution } from '@gmjs/gm-trading-shared';
import { TICKER_DATA_SOURCE } from '../util';

export function TickerDataScreen(): React.ReactElement {
  const { isLoadingAllInstruments, allInstruments, getAllInstruments } =
    useStoreInstrument();

  const { isLoadingTickerData, tickerData, getTickerData } =
    useStoreTickerData();

  useEffect(() => {
    getAllInstruments();
  }, [getAllInstruments]);

  const handleRequestData = useCallback(
    (name: string, resolution: TickerDataResolution) => {
      getTickerData({
        source: TICKER_DATA_SOURCE,
        name,
        resolution,
        from: undefined,
        to: undefined
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
