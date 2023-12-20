import React, { useCallback, useMemo, useState } from 'react';
import { TabLayout, TabLayoutEntry } from '../../shared';
import { TradeTabValue, TradingDataAndInputs, TradingInputs } from './types';
import { TradingDisplayContent } from './tabs/trading-display/TradingDisplayContent';
import { TradingInputsContent } from './tabs/trading-inputs/TradingInputsContent';
import { TradingResultsContent } from './tabs/trading-results/TradingResultsContent';
import { TickerDataRows } from '../../../types';
import { TradingLog } from './tabs/trading-log/TradingLog';

export interface TradeContainerProps {
  readonly barData: TickerDataRows;
  readonly barIndex: number;
}

export function TradeContainer({
  barData,
  barIndex,
}: TradeContainerProps): React.ReactElement {
  const [activeTab, setActiveTab] = useState<TradeTabValue>('trading-inputs');

  const [tradingDataAndInputs, setTradingDataAndInputs] =
    useState<TradingDataAndInputs>(
      getInitialTradingDataAndInputs(barData, barIndex),
    );

  const handleTradingInputsChage = useCallback(
    (inputs: TradingInputs) => {
      setTradingDataAndInputs((prev) => ({ ...prev, inputs }));
    },
    [setTradingDataAndInputs],
  );

  const tabEntries = useMemo(
    () => getTabEntries(tradingDataAndInputs, handleTradingInputsChage),
    [handleTradingInputsChage, tradingDataAndInputs],
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
  barData: TickerDataRows,
  barIndex: number,
): TradingDataAndInputs {
  return {
    barData,
    barIndex,
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
): readonly TabLayoutEntry<TradeTabValue>[] {
  return [
    {
      value: 'trading-inputs',
      tab: 'Inputs',
      content: (
        <TradingInputsContent
          value={tradingDataAndInputs.inputs}
          onValueChange={handleTradingInputsChange}
        />
      ),
    },
    {
      value: 'trading-display',
      tab: 'Trading',
      content: <TradingDisplayContent />,
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
  ];
}
