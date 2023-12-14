import React, { useCallback, useMemo, useState } from 'react';
import { TwBarReplaySettings } from '../../../../types';
import { TwTextInput } from '../../../form/TwITextnput';
import { TickerDataRows } from '../../../../../../../types';
import {
  SCHEMA_REPLAY_NAVIGATION_STEP_SIZE_INPUT,
  TOOLBAR_ICON_SIZE,
  createSchemaIntegerInRange,
  createSchemaReplayInput,
} from '../util';
import { TwToggleButton } from '../../../form/TwToggleButton';
import { clampNumber, parseIntegerOrThrow } from '@gmjs/number-util';
import Icon from '@mdi/react';
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';
import { TwButton } from '../../../form/TwButton';
import { timeToLogical } from '../../../../util';

export interface TwChartToolbarReplayProps {
  readonly nonAggregatedData: TickerDataRows;
  readonly data: TickerDataRows;
  readonly replaySettings: TwBarReplaySettings;
  readonly onReplaySettingsChange: (settings: TwBarReplaySettings) => void;
}

export function TwChartToolbarReplay({
  nonAggregatedData,
  data,
  replaySettings,
  onReplaySettingsChange,
}: TwChartToolbarReplayProps): React.ReactElement {
  const [replayInput, setReplayInput] = useState<string>('');
  const [replayNavigationStepSize, setReplayNavigationStepSize] =
    useState<string>('1');

  const replayDataLength = useMemo(() => {
    return replaySettings.replaySubBars
      ? nonAggregatedData.length
      : data.length;
  }, [data.length, nonAggregatedData.length, replaySettings.replaySubBars]);

  const isReplayInputValid = useMemo(() => {
    return createSchemaReplayInput(0, replayDataLength - 1).safeParse(
      replayInput,
    ).success;
  }, [replayDataLength, replayInput]);

  const isReplayValueValid = useMemo(() => {
    return createSchemaIntegerInRange(0, replayDataLength - 1).safeParse(
      replayInput,
    ).success;
  }, [replayDataLength, replayInput]);

  const isReplayNavigationStepSizeInputValid = useMemo(() => {
    return SCHEMA_REPLAY_NAVIGATION_STEP_SIZE_INPUT.safeParse(
      replayNavigationStepSize,
    ).success;
  }, [replayNavigationStepSize]);

  const isReplayNavigationEnabled = useMemo(() => {
    return (
      replaySettings.lastBar !== undefined &&
      isReplayNavigationStepSizeInputValid
    );
  }, [isReplayNavigationStepSizeInputValid, replaySettings.lastBar]);

  const handleReplaySet = useCallback(() => {
    if (replayInput === '') {
      onReplaySettingsChange({
        ...replaySettings,
        lastBar: undefined,
      });
      return;
    }

    if (!isReplayValueValid) {
      return;
    }

    const lastBar = parseIntegerOrThrow(replayInput);

    onReplaySettingsChange({
      ...replaySettings,
      lastBar,
    });
  }, [isReplayValueValid, replayInput, onReplaySettingsChange, replaySettings]);

  const handleReplayInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        handleReplaySet();
      }
    },
    [handleReplaySet],
  );

  const navigate = useCallback(
    (isForward: boolean) => {
      if (!isReplayNavigationEnabled) {
        return;
      }

      const stepSize = parseIntegerOrThrow(replayNavigationStepSize);
      const amount = isForward ? stepSize : -stepSize;

      const newBar = clampNumber(
        replaySettings.lastBar! + amount,
        0,
        replayDataLength - 1,
      );

      setReplayInput(newBar.toString());

      onReplaySettingsChange({
        ...replaySettings,
        lastBar: newBar,
      });
    },
    [
      isReplayNavigationEnabled,
      replayNavigationStepSize,
      replaySettings,
      replayDataLength,
      onReplaySettingsChange,
    ],
  );

  const navigateBack = useCallback(() => {
    navigate(false);
  }, [navigate]);

  const navigateForward = useCallback(() => {
    navigate(true);
  }, [navigate]);

  const handleSubBarToggleClick = useCallback(
    (value: boolean) => {
      const sourceIndex = replaySettings.lastBar;
      const sourceData = replaySettings.replaySubBars
        ? nonAggregatedData
        : data;
      const targetData = value ? nonAggregatedData : data;
      const targetIndex = toSimilarTimeTargetIndexOrUndefined(
        sourceIndex,
        sourceData,
        targetData,
      );

      setReplayInput(targetIndex === undefined ? '' : targetIndex.toString());

      onReplaySettingsChange({
        ...replaySettings,
        lastBar: targetIndex,
        replaySubBars: value,
      });
    },
    [data, nonAggregatedData, onReplaySettingsChange, replaySettings],
  );

  return (
    <div className='inline-flex flex-row gap-0.5'>
      <TwTextInput
        placeholder={`Replay 0-${replayDataLength - 1}`}
        value={replayInput}
        onValueChange={setReplayInput}
        onKeyDown={handleReplayInputKeyDown}
        error={!isReplayInputValid}
        width={140}
      />
      <TwButton
        content={<Icon path={mdiChevronLeft} size={TOOLBAR_ICON_SIZE} />}
        onClick={navigateBack}
        disabled={!isReplayNavigationEnabled}
      />
      <TwTextInput
        placeholder={''}
        value={replayNavigationStepSize}
        onValueChange={setReplayNavigationStepSize}
        error={!isReplayNavigationStepSizeInputValid}
        width={48}
      />
      <TwButton
        content={<Icon path={mdiChevronRight} size={TOOLBAR_ICON_SIZE} />}
        onClick={navigateForward}
        disabled={!isReplayNavigationEnabled}
      />
      <TwToggleButton
        label={'Sub'}
        value={replaySettings.replaySubBars}
        onValueChange={handleSubBarToggleClick}
      />
    </div>
  );
}

function toSimilarTimeTargetIndexOrUndefined(
  sourceIndex: number | undefined,
  sourceData: TickerDataRows,
  targetData: TickerDataRows,
): number | undefined {
  return sourceIndex === undefined
    ? undefined
    : toSimilarTimeTargetIndex(sourceIndex, sourceData, targetData);
}

function toSimilarTimeTargetIndex(
  sourceIndex: number,
  sourceData: TickerDataRows,
  targetData: TickerDataRows,
): number {
  const sourceTime = sourceData[sourceIndex].time;
  return timeToLogical(sourceTime, targetData);
}
