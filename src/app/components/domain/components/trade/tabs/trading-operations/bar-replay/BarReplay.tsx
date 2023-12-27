import React, { useCallback } from 'react';
import { BarReplayPosition, GroupedBars } from '../../../../../types';
import { BarReplaySetBarIndex } from './BarReplaySetBarIndex';
import { BarReplayNavigateBar } from './BarReplayNavigateBar';
import { BarReplayNavigateSubBar } from './BarReplayNavigateSubBar';
import { isBarReplayPositionEqual } from '../../../../../util';

export interface BarReplayProps {
  readonly subBars: GroupedBars;
  readonly replayPosition: BarReplayPosition;
  readonly onReplayPositionChange: (position: BarReplayPosition) => void;
}

export function BarReplay({
  subBars,
  replayPosition,
  onReplayPositionChange,
}: BarReplayProps): React.ReactElement {
  const handleBarIndexChange = useCallback(
    (barIndex: number | undefined, subBarIndex: number = 0) => {
      const newBarReplayPosition: BarReplayPosition = {
        barIndex,
        subBarIndex,
      };

      if (isBarReplayPositionEqual(replayPosition, newBarReplayPosition)) {
        return;
      }

      onReplayPositionChange(newBarReplayPosition);
    },
    [onReplayPositionChange, replayPosition],
  );

  return (
    <div className='inline-flex flex-row gap-0.5'>
      <BarReplaySetBarIndex
        dataLength={subBars.length}
        barIndex={replayPosition.barIndex}
        onBarIndexChange={handleBarIndexChange}
      />
      <BarReplayNavigateBar
        dataLength={subBars.length}
        barIndex={replayPosition.barIndex}
        onBarIndexChange={handleBarIndexChange}
      />
      <BarReplayNavigateSubBar
        subBars={subBars}
        barIndex={replayPosition.barIndex}
        subBarIndex={replayPosition.subBarIndex}
        onBarIndexChange={handleBarIndexChange}
      />
    </div>
  );
}
