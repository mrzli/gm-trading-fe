import React, { useCallback, useState } from 'react';
import {
  mdiChevronDoubleLeft,
  mdiChevronDoubleRight,
  mdiChevronLeft,
  mdiChevronRight,
} from '@mdi/js';
import { ChartRange, Bars, ChartSettings } from '../../../types';
import {
  logicalToLogicalRange,
  moveLogicalRange,
  twTimeStepSelectionToTimeStep,
} from '../util';
import { TimeStepSelection, TYPES_OF_TIME_STEP_SELECTIONS } from '../types';
import { SelectButtonCentered } from '../../../../shared';
import { IconButton } from '../../shared';
import { toSimpleSelectOption } from '../../../util';

export interface ChartToolbarNavigateProps {
  readonly settings: ChartSettings;
  readonly data: Bars;
  readonly logicalRange: ChartRange | undefined;
  readonly onNavigate: (logicalRange: ChartRange) => void;
}

export function ChartToolbarNavigate({
  settings,
  data,
  logicalRange,
  onNavigate,
}: ChartToolbarNavigateProps): React.ReactElement {
  const { timezone } = settings;

  const [timeStepSelection, setTimeStepSelection] =
    useState<TimeStepSelection>('100B');

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

      const newLogicalRange = moveLogicalRange(
        logicalRange,
        timeStep,
        data,
        timezone,
      );
      onNavigate(newLogicalRange);
    },
    [logicalRange, timeStepSelection, data, timezone, onNavigate],
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
      <SelectButtonCentered<TimeStepSelection, false>
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
