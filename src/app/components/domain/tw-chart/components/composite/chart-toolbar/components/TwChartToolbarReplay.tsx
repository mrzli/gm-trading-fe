import React, { useCallback, useMemo, useState } from 'react';
import { TwBarReplaySettings } from '../../../../types';
import { TwTextInput } from '../../../form/TwITextnput';
import { TickerDataRow } from '../../../../../../../types';
import { createSchemaIntegerInRange, createSchemaReplayInput } from '../util';
import { TwToggleButton } from '../../../form/TwToggleButton';
import { clampNumber, parseIntegerOrThrow } from '@gmjs/number-util';

export interface TwChartToolbarReplayProps {
  readonly nonAggregatedDataLength: number;
  readonly data: readonly TickerDataRow[];
  readonly replaySettings: TwBarReplaySettings;
  readonly onReplaySettingsChange: (settings: TwBarReplaySettings) => void;
}

export function TwChartToolbarReplay({
  nonAggregatedDataLength,
  data,
  replaySettings,
  onReplaySettingsChange,
}: TwChartToolbarReplayProps): React.ReactElement {
  const [replayInput, setReplayInput] = useState<string>('');

  const isReplayInputValid = useMemo(() => {
    const maxBar = replaySettings.replaySubBars
      ? nonAggregatedDataLength - 1
      : data.length - 1;
    return createSchemaReplayInput(0, maxBar).safeParse(replayInput).success;
  }, [data, nonAggregatedDataLength, replayInput, replaySettings]);

  const isReplayValueValid = useMemo(() => {
    const maxBar = replaySettings.replaySubBars
      ? nonAggregatedDataLength - 1
      : data.length - 1;
    return createSchemaIntegerInRange(0, maxBar).safeParse(replayInput).success;
  }, [data, nonAggregatedDataLength, replayInput, replaySettings]);

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

  const handleSubBarToggleClick = useCallback(
    (value: boolean) => {
      const sourceIndex = replaySettings.lastBar;
      const sourceLength = replaySettings.replaySubBars
        ? data.length
        : nonAggregatedDataLength;
      const targetLength = value ? data.length : nonAggregatedDataLength;
      const targetIndex = toRelativeTargetIndexOrUndefined(
        sourceIndex,
        sourceLength,
        targetLength,
      );

      setReplayInput(targetIndex === undefined ? '' : targetIndex.toString());

      onReplaySettingsChange({
        ...replaySettings,
        lastBar: targetIndex,
        replaySubBars: value,
      });
    },
    [data, nonAggregatedDataLength, onReplaySettingsChange, replaySettings],
  );

  return (
    <div className='inline-flex flex-row gap-0.5'>
      <TwTextInput
        placeholder={getReplayBarInputPlaceholder(
          nonAggregatedDataLength,
          data.length,
          replaySettings.replaySubBars,
        )}
        value={replayInput}
        onValueChange={setReplayInput}
        onKeyDown={handleReplayInputKeyDown}
        error={!isReplayInputValid}
        width={140}
      />
      <TwToggleButton
        label={'Sub'}
        value={replaySettings.replaySubBars}
        onValueChange={handleSubBarToggleClick}
      />
    </div>
  );
}

function getReplayBarInputPlaceholder(
  nonAggregatedDataLength: number,
  dataLength: number,
  replaySubBars: boolean,
): string {
  const lastBar = replaySubBars ? nonAggregatedDataLength - 1 : dataLength - 1;
  return `Replay 0-${lastBar}`;
}

function toRelativeTargetIndexOrUndefined(
  sourceIndex: number | undefined,
  sourceLength: number,
  targetLength: number,
): number | undefined {
  return sourceIndex === undefined
    ? undefined
    : toRelativeTargetIndex(sourceIndex, sourceLength, targetLength);
}

function toRelativeTargetIndex(
  sourceIndex: number,
  sourceLength: number,
  targetLength: number,
): number {
  return clampNumber(
    Math.round((sourceIndex / sourceLength) * targetLength),
    0,
    targetLength - 1,
  );
}
