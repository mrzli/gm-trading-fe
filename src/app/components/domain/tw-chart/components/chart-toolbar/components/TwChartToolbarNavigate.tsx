import React, { useCallback, useState } from 'react';
import {
  mdiChevronDoubleLeft,
  mdiChevronDoubleRight,
  mdiChevronLeft,
  mdiChevronRight,
} from '@mdi/js';
import { TwRange } from '../../../types';
import {
  logicalToLogicalRange,
  moveLogicalRange,
  toSimpleSelectOption,
} from '../../../util';
import { TickerDataRows } from '../../../../types';
import { twTimeStepSelectionToTimeStep } from '../util';
import { TwTimeStepSelection, TYPES_OF_TIME_STEP_SELECTIONS } from '../types';
import { SelectButtonCentered } from '../../../../../shared';
import { IconButton } from '../../../../components/shared';

export interface TwChartToolbarNavigateProps {
  readonly data: TickerDataRows;
  readonly logicalRange: TwRange | undefined;
  readonly onNavigate: (logicalRange: TwRange) => void;
}

export function TwChartToolbarNavigate({
  data,
  logicalRange,
  onNavigate,
}: TwChartToolbarNavigateProps): React.ReactElement {
  const [timeStepSelection, setTimeStepSelection] =
    useState<TwTimeStepSelection>('100B');

  const navigateToStart = useCallback(() => {
    const newRange = logicalToLogicalRange(0, logicalRange, data.length);
    onNavigate(newRange);
  }, [data, logicalRange, onNavigate]);

  const navigateToEnd = useCallback(() => {
    const newRange = logicalToLogicalRange(
      data.length - 1,
      logicalRange,
      data.length,
    );
    onNavigate(newRange);
  }, [data, logicalRange, onNavigate]);

  const navigateBackOrForward = useCallback(
    (isForward: boolean) => {
      if (!logicalRange) {
        return;
      }

      const timeStep = twTimeStepSelectionToTimeStep(
        timeStepSelection,
        isForward,
      );

      const newLogicalRange = moveLogicalRange(logicalRange, timeStep, data);
      onNavigate(newLogicalRange);
    },
    [logicalRange, timeStepSelection, data, onNavigate],
  );

  const navigateBack = useCallback(
    () => navigateBackOrForward(false),
    [navigateBackOrForward],
  );
  const navigateForward = useCallback(
    () => navigateBackOrForward(true),
    [navigateBackOrForward],
  );

  return (
    <div className='inline-flex flex-row gap-0.5'>
      <IconButton icon={mdiChevronDoubleLeft} onClick={navigateToStart} />
      <IconButton icon={mdiChevronLeft} onClick={navigateBack} />
      <SelectButtonCentered<TwTimeStepSelection, false>
        options={TIME_STEP_OPTIONS}
        value={timeStepSelection}
        onValueChange={setTimeStepSelection}
        width={48}
      />
      <IconButton icon={mdiChevronRight} onClick={navigateForward} />
      <IconButton icon={mdiChevronDoubleRight} onClick={navigateToEnd} />
    </div>
  );
}

const TIME_STEP_OPTIONS = TYPES_OF_TIME_STEP_SELECTIONS.map((timeStep) =>
  toSimpleSelectOption(timeStep),
);
