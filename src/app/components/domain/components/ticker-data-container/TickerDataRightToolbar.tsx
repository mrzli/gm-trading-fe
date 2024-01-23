import React from 'react';
import { SideToolbar, SideToolbarEntry } from '../../../shared';
import { TradeState, Instrument } from '@gmjs/gm-trading-shared';
import {
  ChartSettings,
  BarReplayPosition,
  TradeLine,
  RightToolbarState,
} from '../../types';
import { FullBarData } from './types';
import { TradeContainer } from '../trade/TradeContainer';

export interface TickerDataRightToolbarProps {
  readonly tradeStates: readonly TradeState[];
  readonly onSaveTradeState: (tradeState: TradeState) => void;
  readonly onLoadTradeState: (name: string) => void;
  readonly settings: ChartSettings;
  readonly instrument: Instrument;
  readonly fullData: FullBarData;
  readonly replayPosition: BarReplayPosition;
  readonly onReplayPositionChange: (value: BarReplayPosition) => void;
  readonly onTradeLinesChange: (tradeLines: readonly TradeLine[]) => void;
  readonly rightToolbarState: RightToolbarState | undefined;
  readonly onRightToolbarStateChange: (
    value: RightToolbarState | undefined,
  ) => void;
}

export function TickerDataRightToolbar({
  tradeStates,
  onSaveTradeState,
  onLoadTradeState,
  settings,
  instrument,
  fullData,
  replayPosition,
  onReplayPositionChange,
  onTradeLinesChange,
  rightToolbarState,
  onRightToolbarStateChange,
}: TickerDataRightToolbarProps): React.ReactElement {
  const entries: readonly SideToolbarEntry<RightToolbarState>[] = [
    {
      value: 'trade',
      tab: 'Trade',
      content: (
        <div className='w-[680px] h-full'>
          <TradeContainer
            tradeStates={tradeStates}
            onSaveTradeState={onSaveTradeState}
            onLoadTradeState={onLoadTradeState}
            settings={settings}
            instrument={instrument}
            fullData={fullData}
            replayPosition={replayPosition}
            onReplayPositionChange={onReplayPositionChange}
            onTradeLinesChange={onTradeLinesChange}
          />
        </div>
      ),
    },
  ];

  return (
    <SideToolbar
      position={'right'}
      entries={entries}
      value={rightToolbarState}
      onValueChange={onRightToolbarStateChange}
    />
  );
}
