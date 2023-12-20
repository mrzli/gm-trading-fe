import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TabLayout, TabLayoutEntry } from '../../shared';
import {
  OrderInputs,
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
      console.log('order', order);
    },
    [],
  );

  const tabEntries = useMemo(
    () =>
      getTabEntries(
        tradingDataAndInputs,
        handleTradingInputsChange,
        handleCreateOrder,
      ),
    [handleCreateOrder, handleTradingInputsChange, tradingDataAndInputs],
  );

  return (
    <TabLayout
      entries={tabEntries}
      value={activeTab}
      onValueChange={setActiveTab}
    />
  );
}

function getInitialTradingDataAndInputs(
  chartData: TradingChartData,
): TradingDataAndInputs {
  return {
    chartData,
    inputs: {
      params: {
        initialBalance: 10_000,
        priceDecimals: 0,
        spread: 0.5,
        marginPercent: 0.5,
        avgSlippage: 0,
        pipDigit: 0,
        minStopLossDistance: 6,
      },
      manualTradeActions: [],
    },
  };
}

function getTabEntries(
  tradingDataAndInputs: TradingDataAndInputs,
  handleTradingInputsChange: (value: TradingInputs) => void,
  handleCreateOrder: (order: OrderInputs) => void,
): readonly TabLayoutEntry<TradeTabValue>[] {
  return [
    {
      value: 'trading-inputs',
      tab: 'Inputs',
      content: (
        <TradingInputsContent
          timezone={tradingDataAndInputs.chartData.timezone}
          value={tradingDataAndInputs.inputs}
          onValueChange={handleTradingInputsChange}
        />
      ),
    },
    {
      value: 'trading-operations',
      tab: 'Trading',
      content: <TradingOperationsContent onCreateOrder={handleCreateOrder} />,
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
      content: <TradingDebugDisplay value={tradingDataAndInputs} />,
    },
  ];
}
