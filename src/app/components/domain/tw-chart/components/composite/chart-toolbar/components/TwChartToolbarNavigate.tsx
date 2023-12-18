import React, { useCallback, useState } from 'react';
import Icon from '@mdi/react';
import {
  mdiChevronDoubleLeft,
  mdiChevronDoubleRight,
  mdiChevronLeft,
  mdiChevronRight,
} from '@mdi/js';
import { TwRange } from '../../../../types';
import {
  logicalToLogicalRange,
  moveLogicalRange,
  toSimpleSelectOption,
} from '../../../../util';
import { TickerDataRows } from '../../../../../../../types';
import { TOOLBAR_ICON_SIZE, twTimeStepSelectionToTimeStep } from '../util';
import { TwTimeStepSelection, TYPES_OF_TIME_STEP_SELECTIONS } from '../types';
import { Button, SelectButtonCentered } from '../../../../../../shared';

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
      <Button
        content={<Icon path={mdiChevronDoubleLeft} size={TOOLBAR_ICON_SIZE} />}
        onClick={navigateToStart}
      />
      <Button
        content={<Icon path={mdiChevronLeft} size={TOOLBAR_ICON_SIZE} />}
        onClick={navigateBack}
      />
      <SelectButtonCentered<TwTimeStepSelection, false>
        options={TIME_STEP_OPTIONS}
        value={timeStepSelection}
        onValueChange={setTimeStepSelection}
        width={48}
      />
      <Button
        content={<Icon path={mdiChevronRight} size={TOOLBAR_ICON_SIZE} />}
        onClick={navigateForward}
      />
      <Button
        content={<Icon path={mdiChevronDoubleRight} size={TOOLBAR_ICON_SIZE} />}
        onClick={navigateToEnd}
      />
    </div>
  );
}

const TIME_STEP_OPTIONS = TYPES_OF_TIME_STEP_SELECTIONS.map((timeStep) =>
  toSimpleSelectOption(timeStep),
);
