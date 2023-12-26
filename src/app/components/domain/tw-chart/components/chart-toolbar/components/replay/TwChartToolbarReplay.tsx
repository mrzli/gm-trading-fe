import React, { useCallback } from 'react';
import { BarReplayPosition, GroupedTickerDataRows } from '../../../../../types';
import { TwChartToolbarReplaySetBarIndex } from './TwChartToolbarReplaySetBarIndex';
import { TwChartToolbarReplayNavigateBar } from './TwChartToolbarReplayNavigateBar';
import { TwChartToolbarReplayNavigateSubBar } from './TwChartToolbarReplayNavigateSubBar';

export interface TwChartToolbarReplayProps {
  readonly subRows: GroupedTickerDataRows;
  readonly replayPosition: BarReplayPosition;
  readonly onReplayPositionChange: (position: BarReplayPosition) => void;
}

export function TwChartToolbarReplay({
  subRows,
  replayPosition,
  onReplayPositionChange,
}: TwChartToolbarReplayProps): React.ReactElement {
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
      <TwChartToolbarReplaySetBarIndex
        dataLength={subRows.length}
        barIndex={replayPosition.barIndex}
        onBarIndexChange={handleBarIndexChange}
      />
      <TwChartToolbarReplayNavigateBar
        dataLength={subRows.length}
        barIndex={replayPosition.barIndex}
        onBarIndexChange={handleBarIndexChange}
      />
      <TwChartToolbarReplayNavigateSubBar
        subRows={subRows}
        barIndex={replayPosition.barIndex}
        subBarIndex={replayPosition.subBarIndex}
        onBarIndexChange={handleBarIndexChange}
      />
    </div>
  );
}
