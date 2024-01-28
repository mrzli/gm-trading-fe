import React, { useCallback, useState } from 'react';
import {
  mdiChevronDoubleLeft,
  mdiChevronDoubleRight,
  mdiChevronLeft,
  mdiChevronRight,
} from '@mdi/js';
import {
  ChartNavigatePayloadAny,
  ChartNavigatePayloadMoveBy,
} from '../../../types';
import { twTimeStepSelectionToTimeStep } from '../util';
import { TimeStepSelection, TYPES_OF_TIME_STEP_SELECTIONS } from '../types';
import { SelectButtonCentered } from '../../../../shared';
import { IconButton } from '../../shared';
import { toSimpleSelectOption } from '../../../util';

export interface ChartToolbarNavigateProps {
  readonly onNavigate: (payload: ChartNavigatePayloadAny) => void;
}

export function ChartToolbarNavigate({
  onNavigate,
}: ChartToolbarNavigateProps): React.ReactElement {
  const [timeStepSelection, setTimeStepSelection] =
    useState<TimeStepSelection>('100B');

  const navigateToStart = useCallback(() => {
    onNavigate({
      type: 'start',
    });
  }, [onNavigate]);

  const navigateToEnd = useCallback(() => {
    onNavigate({
      type: 'end',
    });
  }, [onNavigate]);

  const navigateBackOrForward = useCallback(
    (isForward: boolean) => {
      const timeStep = twTimeStepSelectionToTimeStep(
        timeStepSelection,
        isForward,
      );

      const payload: ChartNavigatePayloadMoveBy = {
        type: 'move-by',
        timeStep,
      };
      onNavigate(payload);
    },
    [timeStepSelection, onNavigate],
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
