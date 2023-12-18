import React, { useMemo, useState } from 'react';
import { TabLayout, TabLayoutEntry } from '../../shared';
import { TradeTabValue } from './types';
import { TradeInputsTab } from './tabs/TradingInputsTab';
import { TradingDisplayTab } from './tabs/TradingDisplayTab';
import { TradingResultsTab } from './tabs/TradingResultsTab';
import { TickerDataRows } from '../../../types';

export interface TradeContainerProps {
  readonly data: TickerDataRows;
  readonly barIndex: number;
}

export function TradeContainer({
  data,
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
      content: <TradeInputsTab />,
    },
    {
      value: 'trading-display',
      tab: 'Trading',
      content: <TradingDisplayTab />,
    },
    {
      value: 'results',
      tab: 'Results',
      content: <TradingResultsTab />,
    },
  ];
}
