import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TabLayout, TabLayoutEntry } from '../../shared';
import {
  OrderInputs,
  TradeProcessState,
  TradeResult,
  TradeTabValue,
  TradingChartData,
  TradingDataAndInputs,
  TradingInputs,
  TradingParameters,
} from './types';
import { TradingOperationsContent } from './tabs/trading-operations/TradingOperationsContent';
import { TradingInputsContent } from './tabs/trading-inputs/TradingInputsContent';
import { TradingResultsContent } from './tabs/trading-results/TradingResultsContent';
import { TradingLog } from './tabs/trading-log/TradingLog';
import { TradingDebugDisplay } from './tabs/trading-debug/TradingDebugDisplay';
import {
  EMPTY_TRADE_RESULTS,
  getNextManualActionId,
  orderInputsToManualTradeActionOpen,
  processTradeSequence,
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

  const handleCreateOrder = useCallback(
    (order: OrderInputs) => {
      const { manualTradeActions } = tradingDataAndInputs.inputs;

      const id = getNextManualActionId(manualTradeActions);

      const newAction = orderInputsToManualTradeActionOpen(
        order,
        id,
        chartData,
      );

      setTradingDataAndInputs({
        ...tradingDataAndInputs,
        inputs: {
          ...tradingDataAndInputs.inputs,
          manualTradeActions: [...manualTradeActions, newAction],
        },
      });
    },
    [chartData, tradingDataAndInputs],
  );

  const [tradeState, setTradeState] = useState<TradeProcessState>(
    getInitialTradeProcessState(tradingDataAndInputs),
  );

  useEffect(() => {
    const state = processTradeSequence(tradingDataAndInputs);
    setTradeState(state);
  }, [tradingDataAndInputs]);

  // TODO: calculate based on trade state
  const tradeResult = useMemo(() => {
    return EMPTY_TRADE_RESULTS;
  }, []);

  const tabEntries = useMemo(
    () =>
      getTabEntries(
        tradingDataAndInputs,
        handleTradingInputsChange,
        tradeState,
        handleCreateOrder,
        tradeResult,
      ),
    [
      handleCreateOrder,
      handleTradingInputsChange,
      tradeResult,
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
  tradeResult: TradeResult,
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
      content: <TradingResultsContent />,
    },
    {
      value: 'trading-debug',
      tab: 'Debug',
      content: (
        <TradingDebugDisplay
          inputs={tradingDataAndInputs}
          result={tradeResult}
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

const DEFAULT_TRADING_PARAMS: TradingParameters = {
  initialBalance: 10_000,
  priceDecimals: 0,
  spread: 0.5,
  marginPercent: 0.5,
  avgSlippage: 0,
  pipDigit: 0,
  minStopLossDistance: 6,
};
