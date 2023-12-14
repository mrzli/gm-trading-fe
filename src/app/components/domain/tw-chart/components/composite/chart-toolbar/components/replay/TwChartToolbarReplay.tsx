import React, { useCallback } from 'react';
import { TwBarReplaySettings } from '../../../../../types';
import { GroupedTickerDataRows } from '../../../../../../../../types';
import { TwChartToolbarReplaySetBarIndex } from './TwChartToolbarReplaySetBarIndex';
import { TwChartToolbarReplayNavigateBar } from './TwChartToolbarReplayNavigateBar';
import { TwChartToolbarReplayNavigateSubBar } from './TwChartToolbarReplayNavigateSubBar';

export interface TwChartToolbarReplayProps {
  readonly subRows: GroupedTickerDataRows;
  readonly replaySettings: TwBarReplaySettings;
  readonly onReplaySettingsChange: (settings: TwBarReplaySettings) => void;
}

export function TwChartToolbarReplay({
  subRows,
  replaySettings,
  onReplaySettingsChange,
}: TwChartToolbarReplayProps): React.ReactElement {
  const handleBarIndexChange = useCallback(
    (barIndex: number | undefined, subBarIndex: number = 0) => {
      onReplaySettingsChange({
        ...replaySettings,
        barIndex,
        subBarIndex,
      });
    },
    [onReplaySettingsChange, replaySettings],
  );

  return (
    <div className='inline-flex flex-row gap-0.5'>
      <TwChartToolbarReplaySetBarIndex
        dataLength={subRows.length}
        barIndex={replaySettings.barIndex}
        onBarIndexChange={handleBarIndexChange}
      />
      <TwChartToolbarReplayNavigateBar
        dataLength={subRows.length}
        barIndex={replaySettings.barIndex}
        onBarIndexChange={handleBarIndexChange}
      />
      <TwChartToolbarReplayNavigateSubBar
        subRows={subRows}
        barIndex={replaySettings.barIndex}
        subBarIndex={replaySettings.subBarIndex}
        onBarIndexChange={handleBarIndexChange}
      />
    </div>
  );
}
