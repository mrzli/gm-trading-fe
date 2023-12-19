import React, { useCallback, useMemo, useState } from 'react';
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';
import { clampNumber, parseIntegerOrThrow } from '@gmjs/number-util';
import { SCHEMA_REPLAY_NAVIGATION_STEP_SIZE_INPUT } from '../../util';
import { TextInput } from '../../../../../../../shared';
import { IconButton } from '../../../../../../shared/IconButton';

export interface TwChartToolbarReplayNavigateBarProps {
  readonly dataLength: number;
  readonly barIndex: number | undefined;
  readonly onBarIndexChange: (barIndex: number | undefined) => void;
}

export function TwChartToolbarReplayNavigateBar({
  dataLength,
  barIndex,
  onBarIndexChange,
}: TwChartToolbarReplayNavigateBarProps): React.ReactElement {
  const [replayNavigationStepSizeInput, setReplayNavigationStepSizeInput] =
    useState<string>('1');

  const isNavigationStepSizeInputValid = useMemo(() => {
    return SCHEMA_REPLAY_NAVIGATION_STEP_SIZE_INPUT.safeParse(
      replayNavigationStepSizeInput,
    ).success;
  }, [replayNavigationStepSizeInput]);

  const isNavigateEnabled = useMemo(() => {
    return barIndex !== undefined && isNavigationStepSizeInputValid;
  }, [isNavigationStepSizeInputValid, barIndex]);

  const isNavigateBackEnabled = useMemo(() => {
    return isNavigateEnabled && barIndex! > 1;
  }, [barIndex, isNavigateEnabled]);

  const isNavigateForwardEnabled = useMemo(() => {
    return isNavigateEnabled && barIndex! < dataLength;
  }, [barIndex, dataLength, isNavigateEnabled]);

  const navigate = useCallback(
    (amount: number) => {
      if (!isNavigateEnabled) {
        return;
      }

      const currBarIndex = barIndex!;

      const newBarIndex = clampNumber(currBarIndex + amount, 1, dataLength);

      onBarIndexChange(newBarIndex);
    },
    [isNavigateEnabled, barIndex, dataLength, onBarIndexChange],
  );

  const navigateBack = useCallback(() => {
    if (!isNavigateBackEnabled) {
      return;
    }

    const amount = -parseIntegerOrThrow(replayNavigationStepSizeInput);

    navigate(amount);
  }, [isNavigateBackEnabled, navigate, replayNavigationStepSizeInput]);

  const navigateForward = useCallback(() => {
    if (!isNavigateForwardEnabled) {
      return;
    }

    const amount = parseIntegerOrThrow(replayNavigationStepSizeInput);

    navigate(amount);
  }, [isNavigateForwardEnabled, navigate, replayNavigationStepSizeInput]);

  return (
    <div className='inline-flex flex-row gap-0.5'>
      <IconButton
        icon={mdiChevronLeft}
        onClick={navigateBack}
        disabled={!isNavigateBackEnabled}
      />
      <TextInput
        value={replayNavigationStepSizeInput}
        onValueChange={setReplayNavigationStepSizeInput}
        error={!isNavigationStepSizeInputValid}
        width={48}
      />
      <IconButton
        icon={mdiChevronRight}
        onClick={navigateForward}
        disabled={!isNavigateForwardEnabled}
      />
    </div>
  );
}
