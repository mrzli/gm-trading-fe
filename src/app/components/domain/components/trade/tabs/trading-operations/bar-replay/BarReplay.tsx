import React from 'react';
import {
  BarReplayPosition,
  ChartTimezone,
  GroupedBars,
} from '../../../../../types';
import { BarReplaySetBarIndex } from './BarReplaySetBarIndex';
import { BarReplayNavigateBar } from './BarReplayNavigateBar';
import { BarReplayNavigateSubBar } from './BarReplayNavigateSubBar';
import { BarReplayGoTo } from './BarReplayGoTo';
import { Instrument } from '@gmjs/gm-trading-shared';
import { BarReplayNavigateSession } from './BarReplayNavigateSession';
import { FullBarData } from '../../../../ticker-data-container/types';

export interface BarReplayProps {
  readonly timezone: ChartTimezone;
  readonly instrument: Instrument;
  readonly fullData: FullBarData;
  readonly replayPosition: BarReplayPosition;
  readonly onReplayPositionChange: (position: BarReplayPosition) => void;
}

export function BarReplay({
  timezone,
  instrument,
  fullData,
  replayPosition,
  onReplayPositionChange,
}: BarReplayProps): React.ReactElement {
  const { subBars, bars } = fullData;

  return (
    <div className='inline-flex flex-row gap-0.5'>
      <BarReplaySetBarIndex
        dataLength={subBars.length}
        replayPosition={replayPosition}
        onReplayPositionChange={onReplayPositionChange}
      />
      <BarReplayNavigateBar
        dataLength={subBars.length}
        replayPosition={replayPosition}
        onReplayPositionChange={onReplayPositionChange}
      />
      <BarReplayNavigateSubBar
        subBars={subBars}
        replayPosition={replayPosition}
        onReplayPositionChange={onReplayPositionChange}
      />
      <BarReplayGoTo
        timezone={timezone}
        subBars={subBars}
        replayPosition={replayPosition}
        onReplayPositionChange={onReplayPositionChange}
      />
      <BarReplayNavigateSession
        instrument={instrument}
        bars={bars}
        replayPosition={replayPosition}
        onReplayPositionChange={onReplayPositionChange}
      />
    </div>
  );
}
