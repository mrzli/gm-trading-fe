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
import {
  logicalToLogicalRange,
  moveLogicalRange,
  toSimpleTwSelectOption,
} from '../../../util';
import { TwSelectOption } from '../../form/select-button/types';
import { TwSelectButtonCentered } from '../../form/select-button/TwSelectButtonCentered';
import { TwTextInput } from '../../form/TwITextnput';
import { TwButton } from '../../form/TwButton';
import { TickerDataRow } from '../../../../../../types';
import {
  SCHEME_GO_TO_INPUT,
  RESOLUTION_OPTIONS,
  twTimeStepSelectionToTimeStep,
} from './util';
import { TwTimeStepSelection, TYPES_OF_TIME_STEP_SELECTIONS } from './types';
import { TwToggleButton } from '../../form/TwToggleButton';
import { TwChartToolbarGoTo } from './components/TwChartToolbarGoTo';

export interface TwChartToolbarProps {
  readonly instrumentNames: readonly string[];
  readonly nonAggregatedDataLength: number;
  readonly data: readonly TickerDataRow[];
  readonly settings: TwChartSettings;
  readonly onSettingsChange: (settings: TwChartSettings) => void;
}

export function TwChartToolbar({
  instrumentNames,
  nonAggregatedDataLength,
  data,
  settings,
  onSettingsChange,
}: TwChartToolbarProps): React.ReactElement {
  const instrumentOptions = useMemo<readonly TwSelectOption<string>[]>(() => {
    return instrumentNames.map((instrumentName) =>
      toSimpleTwSelectOption(instrumentName),
    );
  }, [instrumentNames]);

  const [timeStepSelection, setTimeStepSelection] =
    useState<TwTimeStepSelection>('100B');

  const [goToInput, setGoToInput] = useState('');
  const isGoToInputValid = useMemo(
    () => SCHEME_GO_TO_INPUT.safeParse(goToInput).success,
    [goToInput],
  );

  const handleInstrumentChange = useCallback(
    (instrumentName: string) => {
      onSettingsChange({
        ...settings,
        instrumentName,
        logicalRange: undefined,
      });
    },
    [settings, onSettingsChange],
  );

  const handleResolutionChange = useCallback(
    (resolution: TwChartResolution) => {
      onSettingsChange({
        ...settings,
        resolution,
        logicalRange: undefined,
      });
    },
    [settings, onSettingsChange],
  );

  const updateLogicalRange = useCallback(
    (logicalRange: TwRange | undefined) => {
      onSettingsChange({
        ...settings,
        logicalRange,
      });
    },
    [settings, onSettingsChange],
  );

  const navigateTo = useCallback(
    (logical: number) => {
      onSettingsChange({
        ...settings,
        logicalRange: logicalToLogicalRange(
          logical,
          settings.logicalRange,
          data.length,
        ),
      });
    },
    [settings, onSettingsChange, data],
  );

  const navigateToStart = useCallback(() => {
    navigateTo(0);
  }, [navigateTo]);

  const navigateToEnd = useCallback(() => {
    navigateTo(data.length - 1);
  }, [data, navigateTo]);

  const navigateBackOrForward = useCallback(
    (isForward: boolean) => {
      const { logicalRange } = settings;

      if (!logicalRange) {
        return;
      }

      const timeStep = twTimeStepSelectionToTimeStep(
        timeStepSelection,
        isForward,
      );

      const newLogicalRange = moveLogicalRange(logicalRange, timeStep, data);

      onSettingsChange({
        ...settings,
        logicalRange: newLogicalRange,
      });
    },
    [settings, onSettingsChange, timeStepSelection, data],
  );

  const navigateBack = useCallback(
    () => navigateBackOrForward(false),
    [navigateBackOrForward],
  );
  const navigateForward = useCallback(
    () => navigateBackOrForward(true),
    [navigateBackOrForward],
  );

  const handleGoTo = useCallback(
    (logicalRange: TwRange) => {
      updateLogicalRange(logicalRange);
    },
    [updateLogicalRange],
  );

  const handleSubBarToggleClick = useCallback(
    (value: boolean) => {
      onSettingsChange({
        ...settings,
        replaySettings: {
          ...settings.replaySettings,
          replaySubBars: value,
        },
      });
    },
    [settings, onSettingsChange],
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
      {data.length > 0 && (
        <>
          <TwButton
            content={<Icon path={mdiChevronDoubleLeft} size={ICON_SIZE} />}
            onClick={navigateToStart}
          />
          <TwButton
            content={<Icon path={mdiChevronLeft} size={ICON_SIZE} />}
            onClick={navigateBack}
          />
          <TwSelectButtonCentered<TwTimeStepSelection, false>
            options={TIME_STEP_OPTIONS}
            value={timeStepSelection}
            onValueChange={setTimeStepSelection}
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
          <TwChartToolbarGoTo
            data={data}
            logicalRange={settings.logicalRange}
            onGoTo={handleGoTo}
          />
          <TwTextInput
            placeholder={getReplayBarInputPlaceholder(
              nonAggregatedDataLength,
              data.length,
              settings.replaySettings.replaySubBars,
            )}
            value={goToInput}
            onValueChange={setGoToInput}
            onKeyDown={() => {}}
            error={!isGoToInputValid}
            width={160}
          />
          <TwToggleButton
            label={'Sub'}
            value={settings.replaySettings.replaySubBars}
            onValueChange={handleSubBarToggleClick}
          />
        </>
      )}
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

const ICON_SIZE = 0.875 / 1.5;

const TIME_STEP_OPTIONS = TYPES_OF_TIME_STEP_SELECTIONS.map((timeStep) =>
  toSimpleTwSelectOption(timeStep),
);
