import React from 'react';
import { BarReplayPosition } from '../../../../types';
import { TradingDataAndInputs } from '../../types';
import { BarReplay } from './bar-replay/BarReplay';

export interface BarStatusProps {
  readonly dataAndInputs: TradingDataAndInputs;
  readonly onReplayPositionChange: (position: BarReplayPosition) => void;
}

export function BarStatus({
  dataAndInputs,
  onReplayPositionChange,
}: BarStatusProps): React.ReactElement {
  const { fullData, replayPosition } = dataAndInputs;
  const { subBars } = fullData;

  return (
    <div className='flex flex-col'>
      <BarReplay
        subBars={subBars}
        replayPosition={replayPosition}
        onReplayPositionChange={onReplayPositionChange}
      />
    </div>
  );
}
