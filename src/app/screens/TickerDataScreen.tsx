import React, { useCallback, useEffect } from 'react';
import { TickerDataContainer } from '../components/domain/components/ticker-data-container/TickerDataContainer';
import {
  useStoreInstrument,
  useStoreTickerData,
  useStoreTrade,
} from '../../store';
import { LoadingDisplay } from '../components/shared';
import { TickerDataResolution, TradeState } from '@gmjs/gm-trading-shared';
import { TICKER_DATA_SOURCE } from '../util';

export function TickerDataScreen(): React.ReactElement {
  const { isLoadingAllInstruments, allInstruments, getAllInstruments } =
    useStoreInstrument();

  const { isLoadingTickerData, tickerData, getTickerData } =
    useStoreTickerData();

  const {
    // isLoadingTradeStates,
    tradeStates,
    // isSavingTradeState,
    getTradeStates,
    saveTradeState,
  } = useStoreTrade();

  useEffect(
    () => {
      getAllInstruments();
      getTradeStates();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleRequestData = useCallback(
    (name: string, resolution: TickerDataResolution) => {
      getTickerData({
        source: TICKER_DATA_SOURCE,
        name,
        resolution,
      });
    },
    [getTickerData],
  );

  const handleSaveTradeState = useCallback(
    (tradeState: TradeState) => {
      saveTradeState(tradeState);
    },
    [saveTradeState],
  );

  if (isLoadingAllInstruments || !allInstruments || !tradeStates) {
    return <LoadingDisplay />;
  }

  if (allInstruments.length === 0) {
    return <div>No instruments found.</div>;
  }

  return (
    <TickerDataContainer
      instruments={allInstruments}
      isLoadingData={isLoadingTickerData}
      rawData={tickerData?.data}
      onRequestData={handleRequestData}
      tradeStates={tradeStates}
      onSaveTradeState={handleSaveTradeState}
    />
  );
}
