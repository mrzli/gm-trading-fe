import React, { useCallback, useMemo, useState } from 'react';
import { TwChartResolution, TwChartSettings, TwRange } from '../../../types';
import { TwSelectButton } from '../../form/select-button/TwSelectButton';
import { toSimpleTwSelectOption } from '../../../util';
import { TwSelectOption } from '../../form/select-button/types';
import { TwSelectButtonCentered } from '../../form/select-button/TwSelectButtonCentered';
import { TwTextInput } from '../../form/TwITextnput';
import { TickerDataRow } from '../../../../../../types';
import { SCHEME_GO_TO_INPUT, RESOLUTION_OPTIONS } from './util';
import { TwToggleButton } from '../../form/TwToggleButton';
import { TwChartToolbarGoTo } from './components/TwChartToolbarGoTo';
import { TwChartToolbarNavigate } from './components/TwChartToolbarNavigate';

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
          <TwChartToolbarNavigate
            data={data}
            logicalRange={settings.logicalRange}
            onNavigate={updateLogicalRange}
          />
          <TwChartToolbarGoTo
            data={data}
            logicalRange={settings.logicalRange}
            onGoTo={updateLogicalRange}
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
