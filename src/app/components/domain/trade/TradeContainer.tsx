import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TabLayout, TabLayoutEntry } from '../../shared';
import {
  ManualTradeActionAny,
  OrderInputs,
  TradeProcessState,
  TradeTabValue,
  TradingChartData,
  TradingDataAndInputs,
  TradingInputs,
} from './types';
import { TradingOperationsContent } from './tabs/trading-operations/TradingOperationsContent';
import { TradingInputsContent } from './tabs/trading-inputs/TradingInputsContent';
import { TradingResultsContent } from './tabs/trading-results/TradingResultsContent';
import { TradingLog } from './tabs/trading-log/TradingLog';
import { TradingDebugDisplay } from './tabs/trading-debug/TradingDebugDisplay';
import {
  DEFAULT_TRADING_PARAMS,
  getNextManualActionId,
  createManualTradeActionOpen,
  processTradeSequence,
  createManualTradeActionClose,
} from './util';

export interface TradeContainerProps {
  readonly chartData: TradingChartData;
}

export function TradeContainer({
  chartData,
}: TradeContainerProps): React.ReactElement {
  const [activeTab, setActiveTab] = useState<TradeTabValue>('trading-inputs');

  const [tradingDataAndInputs, setTradingDataAndInputs] =
    useState<TradingDataAndInputs>(getInitialTradingDataAndInputs(chartData));

  useEffect(() => {
    setTradingDataAndInputs((prev) => ({
      ...prev,
      chartData,
    }));
  }, [chartData]);

  const handleTradingInputsChange = useCallback(
    (inputs: TradingInputs) => {
      setTradingDataAndInputs((prev) => ({ ...prev, inputs }));
    },
    [setTradingDataAndInputs],
  );

  const appendManualTradeAction = useCallback(
    (action: ManualTradeActionAny) => {
      const { manualTradeActions } = tradingDataAndInputs.inputs;

      setTradingDataAndInputs({
        ...tradingDataAndInputs,
        inputs: {
          ...tradingDataAndInputs.inputs,
          manualTradeActions: [...manualTradeActions, action],
        },
      });
    },
    [tradingDataAndInputs],
  );

  const handleCreateOrder = useCallback(
    (order: OrderInputs) => {
      const { manualTradeActions } = tradingDataAndInputs.inputs;

      const id = getNextManualActionId(manualTradeActions);
      const newAction = createManualTradeActionOpen(order, id, chartData);
      appendManualTradeAction(newAction);
    },
    [appendManualTradeAction, chartData, tradingDataAndInputs.inputs],
  );

  const handleCancelOrderOrCloseTrade = useCallback(
    (targetId: number) => {
      const { manualTradeActions } = tradingDataAndInputs.inputs;

      const id = getNextManualActionId(manualTradeActions);
      const newAction = createManualTradeActionClose(id, targetId, chartData);
      appendManualTradeAction(newAction);
    },
    [appendManualTradeAction, chartData, tradingDataAndInputs.inputs],
  );

  const handleCancelOrder = useCallback(
    (id: number) => {
      handleCancelOrderOrCloseTrade(id);
    },
    [handleCancelOrderOrCloseTrade],
  );

  const handleCloseTrade = useCallback(
    (id: number) => {
      handleCancelOrderOrCloseTrade(id);
    },
    [handleCancelOrderOrCloseTrade],
  );

  const [tradeState, setTradeState] = useState<TradeProcessState>(
    getInitialTradeProcessState(tradingDataAndInputs),
  );

  useEffect(() => {
    const state = processTradeSequence(tradingDataAndInputs);
    setTradeState(state);
  }, [tradingDataAndInputs]);

  const tabEntries = useMemo(
    () =>
      getTabEntries(
        tradingDataAndInputs,
        handleTradingInputsChange,
        tradeState,
        handleCreateOrder,
        handleCancelOrder,
        handleCloseTrade,
      ),
    [
      handleCancelOrder,
      handleCloseTrade,
      handleCreateOrder,
      handleTradingInputsChange,
      tradeState,
      tradingDataAndInputs,
    ],
  );

  return (
    <TabLayout
      entries={tabEntries}
      value={activeTab}
      onValueChange={setActiveTab}
    />
  );
}

function getTabEntries(
  tradingDataAndInputs: TradingDataAndInputs,
  handleTradingInputsChange: (value: TradingInputs) => void,
  tradingState: TradeProcessState,
  handleCreateOrder: (order: OrderInputs) => void,
  handleCancelOrder: (id: number) => void,
  handleCloseTrade: (id: number) => void,
): readonly TabLayoutEntry<TradeTabValue>[] {
  const timezone = tradingDataAndInputs.chartData.timezone;

  return [
    {
      value: 'trading-inputs',
      tab: 'Inputs',
      content: (
        <TradingInputsContent
          timezone={timezone}
          value={tradingDataAndInputs.inputs}
          onValueChange={handleTradingInputsChange}
        />
      ),
    },
    {
      value: 'trading-operations',
      tab: 'Trading',
      content: (
        <TradingOperationsContent
          timezone={timezone}
          state={tradingState}
          onCreateOrder={handleCreateOrder}
          onCancelOrder={handleCancelOrder}
          onCloseTrade={handleCloseTrade}
        />
      ),
    },
    {
      value: 'trading-log',
      tab: 'Log',
      content: <TradingLog />,
    },
    {
      value: 'trading-results',
      tab: 'Results',
      content: <TradingResultsContent state={tradingState} />,
    },
    {
      value: 'trading-debug',
      tab: 'Debug',
      content: (
        <TradingDebugDisplay
          dataAndInputs={tradingDataAndInputs}
          state={tradingState}
        />
      ),
    },
  ];
}

function getInitialTradeProcessState(
  dataAndInputs: TradingDataAndInputs,
): TradeProcessState {
  const { chartData, inputs } = dataAndInputs;
  const { barData, barIndex } = chartData;
  const { params } = inputs;

  return {
    barData,
    barIndex,
    tradingParams: params,
    remainingManualActions: [],
    activeOrders: [],
    activeTrades: [],
    completedTrades: [],
    tradeLog: [],
  };
}

function getInitialTradingDataAndInputs(
  chartData: TradingChartData,
): TradingDataAndInputs {
  return {
    chartData,
    inputs: {
      params: DEFAULT_TRADING_PARAMS,
      manualTradeActions: [],
    },
  };
}
