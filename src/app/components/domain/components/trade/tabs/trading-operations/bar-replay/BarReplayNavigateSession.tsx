import React, { useCallback, useMemo } from 'react';
import { BarReplayPosition, Bars } from '../../../../../types';
import { Instrument } from '@gmjs/gm-trading-shared';
import { Button } from '../../../../../../shared';
import {
  getNextOpenTime,
  getPrevOpenTime,
  getSessionOpenBarIndex,
} from './util';

export interface BarReplayNavigateSessionProps {
  readonly instrument: Instrument;
  readonly bars: Bars;
  readonly replayPosition: BarReplayPosition;
  readonly onReplayPositionChange: (position: BarReplayPosition) => void;
}

export function BarReplayNavigateSession({
  instrument,
  bars,
  replayPosition,
  onReplayPositionChange,
}: BarReplayNavigateSessionProps): React.ReactElement {
  const { barIndex } = replayPosition;

  const prevSessionOpenBarIndex = useMemo(() => {
    const prevSessionOpenTime =
      barIndex === undefined
        ? undefined
        : getPrevOpenTime(bars[barIndex].time, instrument);
    return getSessionOpenBarIndex(bars, prevSessionOpenTime);
  }, [barIndex, bars, instrument]);

  const nextSessionOpenBarIndex = useMemo(() => {
    const nextSessionOpenTime =
      barIndex === undefined
        ? undefined
        : getNextOpenTime(bars[barIndex].time, instrument);
    return getSessionOpenBarIndex(bars, nextSessionOpenTime);
  }, [barIndex, bars, instrument]);

  const handlePreviousOpenClick = useCallback(() => {
    if (prevSessionOpenBarIndex === undefined) {
      return;
    }

    onReplayPositionChange({
      barIndex: prevSessionOpenBarIndex,
      subBarIndex: 0,
    });
  }, [onReplayPositionChange, prevSessionOpenBarIndex]);

  const handleNextOpenClick = useCallback(() => {
    if (nextSessionOpenBarIndex === undefined) {
      return;
    }

    onReplayPositionChange({
      barIndex: nextSessionOpenBarIndex,
      subBarIndex: 0,
    });
  }, [nextSessionOpenBarIndex, onReplayPositionChange]);

  return (
    <div className='grid grid-cols-2 gap-0.5'>
      <Button
        content={'<PO'}
        onClick={handlePreviousOpenClick}
        disabled={prevSessionOpenBarIndex === undefined}
      />
      <Button
        content={'NO>'}
        onClick={handleNextOpenClick}
        disabled={nextSessionOpenBarIndex === undefined}
      />
    </div>
  );
}
