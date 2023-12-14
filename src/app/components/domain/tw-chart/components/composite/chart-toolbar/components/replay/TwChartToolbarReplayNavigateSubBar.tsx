import React, { useCallback, useMemo } from 'react';
import Icon from '@mdi/react';
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';
import { clampNumber } from '@gmjs/number-util';
import { TOOLBAR_ICON_SIZE } from '../../util';
import { TwButton } from '../../../../form/TwButton';
import { GroupedTickerDataRows } from '../../../../../../../../types';

export interface TwChartToolbarReplayNavigateSubBarProps {
  readonly subRows: GroupedTickerDataRows;
  readonly barIndex: number | undefined;
  readonly subBarIndex: number;
  readonly onBarIndexChange: (
    barIndex: number | undefined,
    subBarIndex: number,
  ) => void;
}

export function TwChartToolbarReplayNavigateSubBar({
  subRows,
  barIndex,
  subBarIndex,
  onBarIndexChange,
}: TwChartToolbarReplayNavigateSubBarProps): React.ReactElement {
  const isNavigateBackEnabled = useMemo(() => {
    return (
      barIndex !== undefined &&
      (barIndex > 1 || (barIndex === 1 && subBarIndex > 0))
    );
  }, [barIndex, subBarIndex]);

  const isNavigateForwardEnabled = useMemo(() => {
    return barIndex !== undefined && barIndex < subRows.length;
  }, [barIndex, subRows.length]);

  const isNavigateEnabled = useMemo(() => {
    return isNavigateBackEnabled || isNavigateForwardEnabled;
  }, [isNavigateBackEnabled, isNavigateForwardEnabled]);

  const navigate = useCallback(
    (amount: number) => {
      if (!isNavigateEnabled) {
        return;
      }

      const newBarAndSubBarIndexes = getBarAndSubBarIndex(
        subRows,
        barIndex!,
        subBarIndex,
        amount,
      );

      const { barIndex: newBarIndex, subBarIndex: newSubBarIndex } =
        newBarAndSubBarIndexes;

      onBarIndexChange(newBarIndex, newSubBarIndex);
    },
    [isNavigateEnabled, subRows, barIndex, subBarIndex, onBarIndexChange],
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
      <TwButton
        content={<Icon path={mdiChevronLeft} size={TOOLBAR_ICON_SIZE} />}
        onClick={navigateBack}
        disabled={!isNavigateBackEnabled}
      />
      <TwButton
        content={<Icon path={mdiChevronRight} size={TOOLBAR_ICON_SIZE} />}
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
  subRows: GroupedTickerDataRows,
  barIndex: number,
  subBarIndex: number,
  subBarMoveAmount: number,
): BarAndSubBarIndex {
  let newBarIndex = barIndex;
  let newSubBarIndex = subBarIndex + subBarMoveAmount;

  while (newBarIndex > 1 && newSubBarIndex < 0) {
    newBarIndex--;
    newSubBarIndex += subRows[newBarIndex].length;
  }

  while (
    newBarIndex < subRows.length &&
    newSubBarIndex >= subRows[newBarIndex].length
  ) {
    newSubBarIndex -= subRows[newBarIndex].length;
    newBarIndex++;
  }

  newBarIndex = clampNumber(newBarIndex, 1, subRows.length);
  newSubBarIndex =
    newBarIndex === subRows.length
      ? 0
      : clampNumber(newSubBarIndex, 0, subRows[newBarIndex].length - 1);

  return { barIndex: newBarIndex, subBarIndex: newSubBarIndex };
}
