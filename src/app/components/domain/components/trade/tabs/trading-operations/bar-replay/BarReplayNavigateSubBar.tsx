import React, { useCallback, useMemo } from 'react';
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';
import { BarReplayPosition, GroupedBars } from '../../../../../types';
import { IconButton } from '../../../../shared';
import { barReplayMoveSubBar } from '../../../../../util';

export interface BarReplayNavigateSubBarProps {
  readonly subBars: GroupedBars;
  readonly barIndex: number | undefined;
  readonly subBarIndex: number;
  readonly onReplayPositionChange: (position: BarReplayPosition) => void;
}

export function BarReplayNavigateSubBar({
  subBars,
  barIndex,
  subBarIndex,
  onReplayPositionChange,
}: BarReplayNavigateSubBarProps): React.ReactElement {
  const isNavigateBackEnabled = useMemo(() => {
    return (
      barIndex !== undefined &&
      (barIndex > 1 || (barIndex === 1 && subBarIndex > 0))
    );
  }, [barIndex, subBarIndex]);

  const isNavigateForwardEnabled = useMemo(() => {
    return barIndex !== undefined && barIndex < subBars.length;
  }, [barIndex, subBars.length]);

  const isNavigateEnabled = useMemo(() => {
    return isNavigateBackEnabled || isNavigateForwardEnabled;
  }, [isNavigateBackEnabled, isNavigateForwardEnabled]);

  const navigate = useCallback(
    (amount: number) => {
      if (!isNavigateEnabled) {
        return;
      }

      const newBarReplayIndexes = barReplayMoveSubBar(
        subBars,
        barIndex!,
        subBarIndex,
        amount,
      );

      const { barIndex: newBarIndex, subBarIndex: newSubBarIndex } =
        newBarReplayIndexes;

      onReplayPositionChange({
        barIndex: newBarIndex,
        subBarIndex: newSubBarIndex,
      });
    },
    [isNavigateEnabled, subBars, barIndex, subBarIndex, onReplayPositionChange],
  );

  const navigateBack = useCallback(() => {
    if (!isNavigateBackEnabled) {
      return;
    }

    navigate(-1);
  }, [isNavigateBackEnabled, navigate]);

  const navigateForward = useCallback(() => {
    if (!isNavigateForwardEnabled) {
      return;
    }

    navigate(1);
  }, [isNavigateForwardEnabled, navigate]);

  return (
    <div className='inline-flex flex-row gap-0.5'>
      <IconButton
        icon={mdiChevronLeft}
        onClick={navigateBack}
        disabled={!isNavigateBackEnabled}
      />
      <IconButton
        icon={mdiChevronRight}
        onClick={navigateForward}
        disabled={!isNavigateForwardEnabled}
      />
    </div>
  );
}
