import React, { useCallback, useMemo, useState } from 'react';
import { TwTextInput } from '../../../../form/TwITextnput';
import {
  SCHEMA_REPLAY_NAVIGATION_STEP_SIZE_INPUT,
  TOOLBAR_ICON_SIZE,
} from '../../util';
import { clampNumber, parseIntegerOrThrow } from '@gmjs/number-util';
import Icon from '@mdi/react';
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';
import { TwButton } from '../../../../form/TwButton';

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

  const isReplayNavigationStepSizeInputValid = useMemo(() => {
    return SCHEMA_REPLAY_NAVIGATION_STEP_SIZE_INPUT.safeParse(
      replayNavigationStepSizeInput,
    ).success;
  }, [replayNavigationStepSizeInput]);

  const isReplayNavigateEnabled = useMemo(() => {
    return barIndex !== undefined && isReplayNavigationStepSizeInputValid;
  }, [isReplayNavigationStepSizeInputValid, barIndex]);

  const isReplayNavigateBackEnabled = useMemo(() => {
    return isReplayNavigateEnabled && barIndex! > 1;
  }, [barIndex, isReplayNavigateEnabled]);

  const isReplayNavigateForwardEnabled = useMemo(() => {
    return isReplayNavigateEnabled && barIndex! < dataLength;
  }, [barIndex, dataLength, isReplayNavigateEnabled]);

  const navigateBar = useCallback(
    (amount: number) => {
      if (!isReplayNavigateEnabled) {
        return;
      }

      const currBarIndex = barIndex!;

      const newBarIndex = clampNumber(currBarIndex + amount, 1, dataLength);

      onBarIndexChange(newBarIndex);
    },
    [isReplayNavigateEnabled, barIndex, dataLength, onBarIndexChange],
  );

  const navigateBarBack = useCallback(() => {
    if (!isReplayNavigateBackEnabled) {
      return;
    }

    const amount = -parseIntegerOrThrow(replayNavigationStepSizeInput);

    navigateBar(amount);
  }, [isReplayNavigateBackEnabled, navigateBar, replayNavigationStepSizeInput]);

  const navigateBarForward = useCallback(() => {
    if (!isReplayNavigateForwardEnabled) {
      return;
    }

    const amount = parseIntegerOrThrow(replayNavigationStepSizeInput);

    navigateBar(amount);
  }, [
    isReplayNavigateForwardEnabled,
    navigateBar,
    replayNavigationStepSizeInput,
  ]);

  return (
    <div className='inline-flex flex-row gap-0.5'>
      <TwButton
        content={<Icon path={mdiChevronLeft} size={TOOLBAR_ICON_SIZE} />}
        onClick={navigateBarBack}
        disabled={!isReplayNavigateBackEnabled}
      />
      <TwTextInput
        value={replayNavigationStepSizeInput}
        onValueChange={setReplayNavigationStepSizeInput}
        error={!isReplayNavigationStepSizeInputValid}
        width={48}
      />
      <TwButton
        content={<Icon path={mdiChevronRight} size={TOOLBAR_ICON_SIZE} />}
        onClick={navigateBarForward}
        disabled={!isReplayNavigateForwardEnabled}
      />
    </div>
  );
}
