import React, { useCallback, useMemo } from 'react';
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';
import { clamp } from '@gmjs/number-util';
import { GroupedBars } from '../../../../../types';
import { IconButton } from '../../../../shared';

export interface BarReplayNavigateSubBarProps {
  readonly subBars: GroupedBars;
  readonly barIndex: number | undefined;
  readonly subBarIndex: number;
  readonly onBarIndexChange: (
    barIndex: number | undefined,
    subBarIndex: number,
  ) => void;
}

export function BarReplayNavigateSubBar({
  subBars,
  barIndex,
  subBarIndex,
  onBarIndexChange,
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

      const newBarAndSubBarIndexes = getBarAndSubBarIndex(
        subBars,
        barIndex!,
        subBarIndex,
        amount,
      );

      const { barIndex: newBarIndex, subBarIndex: newSubBarIndex } =
        newBarAndSubBarIndexes;

      onBarIndexChange(newBarIndex, newSubBarIndex);
    },
    [isNavigateEnabled, subBars, barIndex, subBarIndex, onBarIndexChange],
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

interface BarAndSubBarIndex {
  readonly barIndex: number;
  readonly subBarIndex: number;
}

function getBarAndSubBarIndex(
  subBars: GroupedBars,
  barIndex: number,
  subBarIndex: number,
  subBarMoveAmount: number,
): BarAndSubBarIndex {
  let newBarIndex = barIndex;
  let newSubBarIndex = subBarIndex + subBarMoveAmount;

  while (newBarIndex > 1 && newSubBarIndex < 0) {
    newBarIndex--;
    newSubBarIndex += subBars[newBarIndex].length;
  }

  while (
    newBarIndex < subBars.length &&
    newSubBarIndex >= subBars[newBarIndex].length
  ) {
    newSubBarIndex -= subBars[newBarIndex].length;
    newBarIndex++;
  }

  newBarIndex = clamp(newBarIndex, 1, subBars.length);
  newSubBarIndex =
    newBarIndex === subBars.length
      ? 0
      : clamp(newSubBarIndex, 0, subBars[newBarIndex].length - 1);

  return { barIndex: newBarIndex, subBarIndex: newSubBarIndex };
}
