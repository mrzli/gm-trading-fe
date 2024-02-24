import React from 'react';
import { SideToolbar, SideToolbarEntry } from '../../../shared';
import { Instrument } from '@gmjs/gm-trading-shared';
import {
  ChartSettings,
  BarReplayPosition,
  TradeLine,
  RightToolbarState,
} from '../../types';
import { CreateOrderStateFinish, FullBarData } from './types';
import { TradeContainer } from '../trade/TradeContainer';

export interface TickerDataRightToolbarProps {
  readonly settings: ChartSettings;
  readonly onSettingsChange: (value: ChartSettings) => void;
  readonly instrument: Instrument;
  readonly fullData: FullBarData;
  readonly onNavigateToTime: (time: number) => void;
  readonly replayPosition: BarReplayPosition;
  readonly onReplayPositionChange: (value: BarReplayPosition) => void;
  readonly onTradeLinesChange: (tradeLines: readonly TradeLine[]) => void;
  readonly createOrderData: CreateOrderStateFinish | undefined;
  readonly rightToolbarState: RightToolbarState | undefined;
  readonly onRightToolbarStateChange: (
    value: RightToolbarState | undefined,
  ) => void;
}

export function TickerDataRightToolbar({
  settings,
  onSettingsChange,
  instrument,
  fullData,
  onNavigateToTime,
  replayPosition,
  onReplayPositionChange,
  onTradeLinesChange,
  createOrderData,
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
            onSettingsChange={onSettingsChange}
            settings={settings}
            instrument={instrument}
            fullData={fullData}
            onNavigateToTime={onNavigateToTime}
            replayPosition={replayPosition}
            onReplayPositionChange={onReplayPositionChange}
            onTradeLinesChange={onTradeLinesChange}
            createOrderData={createOrderData}
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
