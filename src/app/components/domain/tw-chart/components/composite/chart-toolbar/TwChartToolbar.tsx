import React, { useCallback, useMemo, useState } from 'react';
import Icon from '@mdi/react';
import {
  mdiChevronDoubleLeft,
  mdiChevronDoubleRight,
  mdiChevronLeft,
  mdiChevronRight,
} from '@mdi/js';
import { TwChartResolution, TwChartSettings, TwRange } from '../../../types';
import { TwSelectButton } from '../../form/select-button/TwSelectButton';
import { toSimpleTwSelectOption } from '../../../util';
import { TwSelectOption } from '../../form/select-button/types';
import { TwSelectButtonCentered } from '../../form/select-button/TwSelectButtonCentered';
import { TwTextInput } from '../../form/TwITextnput';
import { TwButton } from '../../form/TwButton';
import { dateIsoUtcToUnixSeconds } from '../../../../../../util';
import { TickerDataRow } from '../../../../../../types';
import {
  SCHEME_GO_TO_INPUT,
  DEFAULT_SPAN,
  dateInputToIso,
  RESOLUTION_OPTIONS,
  SCHEME_DATE,
  timeToLogical,
  moveLogical,
} from './util';
import { TwTimeStep, TYPES_OF_TIME_STEPS } from './types';

export interface TwChartToolbarProps {
  readonly instrumentNames: readonly string[];
  readonly data: readonly TickerDataRow[];
  readonly settings: TwChartSettings;
  readonly onSettingsChange: (settings: TwChartSettings) => void;
}

export function TwChartToolbar({
  instrumentNames,
  data,
  settings,
  onSettingsChange,
}: TwChartToolbarProps): React.ReactElement {
  const instrumentOptions = useMemo<readonly TwSelectOption<string>[]>(() => {
    return instrumentNames.map((instrumentName) =>
      toSimpleTwSelectOption(instrumentName),
    );
  }, [instrumentNames]);

  const [timeStep, setTimeStep] = useState<TwTimeStep>('100B');

  const [goToInput, setGoToInput] = useState('');
  const isGoToInputValid = useMemo(
    () => SCHEME_GO_TO_INPUT.safeParse(goToInput).success,
    [goToInput],
  );
  const isGoToEnabled = useMemo(
    () => SCHEME_DATE.safeParse(goToInput).success && data.length > 0,
    [goToInput, data],
  );

  const handleInstrumentChange = useCallback(
    (instrumentName: string) => {
      onSettingsChange({
        ...settings,
        instrumentName,
        timeRange: undefined,
      });
    },
    [settings, onSettingsChange],
  );

  const handleResolutionChange = useCallback(
    (resolution: TwChartResolution) => {
      onSettingsChange({
        ...settings,
        resolution,
        timeRange: undefined,
      });
    },
    [settings, onSettingsChange],
  );

  const navigateTo = useCallback(
    (logical: number) => {
      const { timeRange } = settings;
      const span = timeRange ? timeRange.to - timeRange.from : DEFAULT_SPAN;

      const from = logical - span / 2;
      const to = logical + span / 2;

      onSettingsChange({
        ...settings,
        timeRange: {
          from,
          to,
        },
      });
    },
    [settings, onSettingsChange],
  );

  const navigateToStart = useCallback(() => {
    navigateTo(0);
  }, [navigateTo]);

  const navigateToEnd = useCallback(() => {
    navigateTo(data.length - 1);
  }, [data, navigateTo]);

  const navigate = useCallback(
    (isForward: boolean) => {
      const { timeRange } = settings;

      if (!timeRange) {
        return;
      }

      const currLogical = timeRangeToLogical(timeRange);

      const logical = moveLogical(currLogical, timeStep, data, isForward);
      navigateTo(logical);
    },
    [settings, timeStep, data, navigateTo],
  );

  const navigateBack = useCallback(() => navigate(false), [navigate]);
  const navigateForward = useCallback(() => navigate(true), [navigate]);

  const handleGoToClick = useCallback(() => {
    if (!isGoToEnabled) {
      return;
    }

    const time = dateIsoUtcToUnixSeconds(dateInputToIso(goToInput));
    const logical = timeToLogical(time, data);

    navigateTo(logical);
  }, [isGoToEnabled, data, goToInput, navigateTo]);

  const handleGoToKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        handleGoToClick();
      }
    },
    [handleGoToClick],
  );

  return (
    <div className='inline-flex flex-row gap-0.5'>
      <TwSelectButton<string, false>
        options={instrumentOptions}
        value={settings.instrumentName}
        onValueChange={handleInstrumentChange}
        selectionWidth={80}
        selectItemWidth={80}
      />
      <TwSelectButtonCentered<TwChartResolution, false>
        options={RESOLUTION_OPTIONS}
        value={settings.resolution}
        onValueChange={handleResolutionChange}
        width={32}
      />
      <TwButton
        content={<Icon path={mdiChevronDoubleLeft} size={ICON_SIZE} />}
        onClick={navigateToStart}
      />
      <TwButton
        content={<Icon path={mdiChevronLeft} size={ICON_SIZE} />}
        onClick={navigateBack}
      />
      <TwSelectButtonCentered<TwTimeStep, false>
        options={TIME_STEP_OPTIONS}
        value={timeStep}
        onValueChange={setTimeStep}
        width={48}
      />
      <TwButton
        content={<Icon path={mdiChevronRight} size={ICON_SIZE} />}
        onClick={navigateForward}
      />
      <TwButton
        content={<Icon path={mdiChevronDoubleRight} size={ICON_SIZE} />}
        onClick={navigateToEnd}
      />
      {data.length > 0 && (
        <>
          <TwTextInput
            placeholder='YYYY-MM-DD [HH:mm]'
            value={goToInput}
            onValueChange={setGoToInput}
            onKeyDown={handleGoToKeyDown}
            error={!isGoToInputValid}
            width={160}
          />
          <TwButton
            content={'Go to'}
            onClick={handleGoToClick}
            disabled={!isGoToEnabled}
          />
        </>
      )}
    </div>
  );
}

function timeRangeToLogical(timeRange: TwRange): number {
  return (timeRange.from + timeRange.to) / 2;
}

const ICON_SIZE = 0.875 / 1.5;

const TIME_STEP_OPTIONS = TYPES_OF_TIME_STEPS.map((timeStep) =>
  toSimpleTwSelectOption(timeStep),
);
