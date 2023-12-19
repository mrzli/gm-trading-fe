import React, { useMemo, useState } from 'react';
import { TabLayout, TabLayoutEntry } from '../../shared';
import { TradeTabValue } from './types';
import { TradeInputsContent } from './tabs/trading-inputs/TradingInputsContent';
import { TradingDisplayContent } from './tabs/trading-display/TradingDisplayContent';
import { TradingResultsContent } from './tabs/trading-results/TradingResultsContent';
import { TickerDataRows } from '../../../types';

export interface TradeContainerProps {
  readonly barData: TickerDataRows;
  readonly barIndex: number;
}

export function TradeContainer({
  barData,
  barIndex,
}: TradeContainerProps): React.ReactElement {
  const tabEntries = useMemo(() => getTabEntries(), []);

  const [activeTab, setActiveTab] = useState<TradeTabValue>('trade-inputs');

  return (
    <TabLayout
      entries={tabEntries}
      value={activeTab}
      onValueChange={setActiveTab}
    />
  );
}

function getTabEntries(): readonly TabLayoutEntry<TradeTabValue>[] {
  return [
    {
      value: 'trade-inputs',
      tab: 'Inputs',
      content: <TradeInputsContent />,
    },
    {
      value: 'trading-display',
      tab: 'Trading',
      content: <TradingDisplayContent />,
    },
    {
      value: 'results',
      tab: 'Results',
      content: <TradingResultsContent />,
    },
  ];
}
