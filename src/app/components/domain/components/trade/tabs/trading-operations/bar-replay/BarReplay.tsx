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

export interface BarReplayProps {
  readonly timezone: ChartTimezone;
  readonly subBars: GroupedBars;
  readonly replayPosition: BarReplayPosition;
  readonly onReplayPositionChange: (position: BarReplayPosition) => void;
}

export function BarReplay({
  timezone,
  subBars,
  replayPosition,
  onReplayPositionChange,
}: BarReplayProps): React.ReactElement {
  return (
    <div className='inline-flex flex-row gap-0.5'>
      <BarReplaySetBarIndex
        dataLength={subBars.length}
        barIndex={replayPosition.barIndex}
        onReplayPositionChange={onReplayPositionChange}
      />
      <BarReplayNavigateBar
        dataLength={subBars.length}
        barIndex={replayPosition.barIndex}
        onReplayPositionChange={onReplayPositionChange}
      />
      <BarReplayNavigateSubBar
        subBars={subBars}
        barIndex={replayPosition.barIndex}
        subBarIndex={replayPosition.subBarIndex}
        onReplayPositionChange={onReplayPositionChange}
      />
      <BarReplayGoTo
        timezone={timezone}
        subBars={subBars}
        replayPosition={replayPosition}
        onReplayPositionChange={onReplayPositionChange}
      />
    </div>
  );
}
