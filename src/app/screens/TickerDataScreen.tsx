import React, { useCallback, useEffect } from 'react';
import { TickerDataContainer } from '../components/domain/components/ticker-data-container/TickerDataContainer';
import { useStoreInstrument, useStoreTickerData } from '../../store';
import { LoadingDisplay } from '../components/shared';
import { TickerDataResolution } from '@gmjs/gm-trading-shared';
import { ChartResolution } from '../components/domain/types';
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
    (name: string, resolution: ChartResolution) => {
      getTickerData({
        source: TICKER_DATA_SOURCE,
        name,
        resolution: toTickerDataResolution(resolution),
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

function toTickerDataResolution(
  resolution: ChartResolution,
): TickerDataResolution {
  switch (resolution) {
    case '1m':
    case '2m':
    case '5m':
    case '10m': {
      return 'minute';
    }
    case '15m':
    case '30m':
    case '1h':
    case '2h':
    case '4h': {
      return 'quarter';
    }
    case 'D':
    case 'W':
    case 'M': {
      return 'day';
    }
  }
}
