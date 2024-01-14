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

  const prevSessionClickEnabled = useMemo(() => {
    return barIndex !== undefined && barIndex > 0;
  }, [barIndex]);

  const prevSessionOpenBarIndex = useMemo(() => {
    const prevSessionOpenTime =
      barIndex === undefined
        ? undefined
        : getPrevOpenTime(bars[barIndex].time, instrument);
    return getSessionOpenBarIndex(bars, prevSessionOpenTime);
  }, [barIndex, bars, instrument]);

  const nextSessionClickEnabled = useMemo(() => {
    return barIndex !== undefined && barIndex < bars.length - 1;
  }, [barIndex, bars.length]);

  const nextSessionOpenBarIndex = useMemo(() => {
    const nextSessionOpenTime =
      barIndex === undefined
        ? undefined
        : getNextOpenTime(bars[barIndex].time, instrument);
    return getSessionOpenBarIndex(bars, nextSessionOpenTime);
  }, [barIndex, bars, instrument]);

  const handlePreviousOpenClick = useCallback(() => {
    if (!prevSessionClickEnabled) {
      return;
    }

    onReplayPositionChange({
      barIndex: prevSessionOpenBarIndex,
      subBarIndex: 0,
    });
  }, [onReplayPositionChange, prevSessionClickEnabled, prevSessionOpenBarIndex]);

  const handleNextOpenClick = useCallback(() => {
    if (!nextSessionClickEnabled) {
      return;
    }

    onReplayPositionChange({
      barIndex: nextSessionOpenBarIndex,
      subBarIndex: 0,
    });
  }, [nextSessionClickEnabled, nextSessionOpenBarIndex, onReplayPositionChange]);

  return (
    <div className='grid grid-cols-2 gap-0.5'>
      <Button
        content={'<PO'}
        onClick={handlePreviousOpenClick}
        disabled={!prevSessionClickEnabled}
      />
      <Button
        content={'NO>'}
        onClick={handleNextOpenClick}
        disabled={!nextSessionClickEnabled}
      />
    </div>
  );
}
