import React, { useCallback } from 'react';
import { BarReplayPosition, GroupedTickerDataRows } from '../../../../../types';
import { BarReplaySetBarIndex } from './BarReplaySetBarIndex';
import { BarReplayNavigateBar } from './BarReplayNavigateBar';
import { BarReplayNavigateSubBar } from './BarReplayNavigateSubBar';

export interface BarReplayProps {
  readonly subRows: GroupedTickerDataRows;
  readonly replayPosition: BarReplayPosition;
  readonly onReplayPositionChange: (position: BarReplayPosition) => void;
}

export function BarReplay({
  subRows,
  replayPosition,
  onReplayPositionChange,
}: BarReplayProps): React.ReactElement {
  const handleBarIndexChange = useCallback(
    (barIndex: number | undefined, subBarIndex: number = 0) => {
      onReplayPositionChange({
        ...replayPosition,
        barIndex,
        subBarIndex,
      });
    },
    [onReplayPositionChange, replayPosition],
  );

  return (
    <div className='inline-flex flex-row gap-0.5'>
      <BarReplaySetBarIndex
        dataLength={subRows.length}
        barIndex={replayPosition.barIndex}
        onBarIndexChange={handleBarIndexChange}
      />
      <BarReplayNavigateBar
        dataLength={subRows.length}
        barIndex={replayPosition.barIndex}
        onBarIndexChange={handleBarIndexChange}
      />
      <BarReplayNavigateSubBar
        subRows={subRows}
        barIndex={replayPosition.barIndex}
        subBarIndex={replayPosition.subBarIndex}
        onBarIndexChange={handleBarIndexChange}
      />
    </div>
  );
}
