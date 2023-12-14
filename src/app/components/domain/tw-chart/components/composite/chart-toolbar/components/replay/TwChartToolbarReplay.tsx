import React, { useCallback, useMemo, useState } from 'react';
import { TwBarReplaySettings } from '../../../../../types';
import { TwTextInput } from '../../../../form/TwITextnput';
import {
  GroupedTickerDataRows,
  TickerDataRows,
} from '../../../../../../../../types';
import {
  SCHEMA_REPLAY_NAVIGATION_STEP_SIZE_INPUT,
  TOOLBAR_ICON_SIZE,
} from '../../util';
import { clampNumber, parseIntegerOrThrow } from '@gmjs/number-util';
import Icon from '@mdi/react';
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';
import { TwButton } from '../../../../form/TwButton';
import { TwChartToolbarReplaySetBarIndex } from './TwChartToolbarReplaySetBarIndex';

export interface TwChartToolbarReplayProps {
  readonly subRows: GroupedTickerDataRows;
  readonly rows: TickerDataRows;
  readonly replaySettings: TwBarReplaySettings;
  readonly onReplaySettingsChange: (settings: TwBarReplaySettings) => void;
}

export function TwChartToolbarReplay({
  subRows,
  rows,
  replaySettings,
  onReplaySettingsChange,
}: TwChartToolbarReplayProps): React.ReactElement {
  const [replayNavigationStepSizeInput, setReplayNavigationStepSizeInput] =
    useState<string>('1');

  const handleBarIndexChange = useCallback(
    (barIndex: number | undefined) => {
      onReplaySettingsChange({
        ...replaySettings,
        barIndex,
        subBarIndex: 0,
      });
    },
    [onReplaySettingsChange, replaySettings],
  );

  const isReplayNavigationStepSizeInputValid = useMemo(() => {
    return SCHEMA_REPLAY_NAVIGATION_STEP_SIZE_INPUT.safeParse(
      replayNavigationStepSizeInput,
    ).success;
  }, [replayNavigationStepSizeInput]);

  const isReplayNavigateEnabled = useMemo(() => {
    return (
      replaySettings.barIndex !== undefined &&
      isReplayNavigationStepSizeInputValid
    );
  }, [isReplayNavigationStepSizeInputValid, replaySettings]);

  const isReplayNavigateBackEnabled = useMemo(() => {
    return isReplayNavigateEnabled && replaySettings.barIndex! > 1;
  }, [isReplayNavigateEnabled, replaySettings]);

  const isReplayNavigateForwardEnabled = useMemo(() => {
    return isReplayNavigateEnabled && replaySettings.barIndex! < rows.length;
  }, [isReplayNavigateEnabled, replaySettings, rows.length]);

  const navigateBar = useCallback(
    (amount: number) => {
      if (!isReplayNavigateEnabled) {
        return;
      }

      const newBar = clampNumber(
        replaySettings.barIndex! + amount,
        1,
        rows.length,
      );

      onReplaySettingsChange({
        ...replaySettings,
        barIndex: newBar,
        subBarIndex: 0,
      });
    },
    [
      isReplayNavigateEnabled,
      replaySettings,
      rows.length,
      onReplaySettingsChange,
    ],
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

  const navigateSubBar = useCallback(
    (amount: number) => {
      if (!isReplayNavigateEnabled) {
        return;
      }

      const barIndex = replaySettings.barIndex!;

      const numSubBars =
        barIndex < 0 || barIndex >= subRows.length
          ? 0
          : subRows[barIndex].length;

      const newSubBar = clampNumber(
        replaySettings.subBarIndex + amount,
        0,
        subRows[replaySettings.barIndex! - 1].length - 1,
      );

      onReplaySettingsChange({
        ...replaySettings,
        subBarIndex: newSubBar,
      });
    },
    [isReplayNavigateEnabled, replaySettings, subRows, onReplaySettingsChange],
  );

  return (
    <div className='inline-flex flex-row gap-0.5'>
      <TwChartToolbarReplaySetBarIndex
        dataLength={rows.length}
        barIndex={replaySettings.barIndex}
        onBarIndexChange={handleBarIndexChange}
      />
      <TwButton
        content={<Icon path={mdiChevronLeft} size={TOOLBAR_ICON_SIZE} />}
        onClick={navigateBarBack}
        disabled={!isReplayNavigateBackEnabled}
      />
      <TwTextInput
        placeholder={''}
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
