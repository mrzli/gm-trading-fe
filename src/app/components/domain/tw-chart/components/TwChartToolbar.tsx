import React, { useCallback, useMemo } from 'react';
import {
  TYPES_OF_TW_CHART_RESOLUTION,
  TwChartResolution,
  TwChartSettings,
} from '../types';
import { TwSelectButton } from './select-button/TwSelectButton';
import { toSimpleTwSelectOption } from '../util';
import { TwSelectOption } from './select-button/types';
import { TwSelectButtonCentered } from './select-button/TwSelectButtonCentered';

export interface TwChartToolbarProps {
  readonly instrumentNames: readonly string[];
  readonly settings: TwChartSettings;
  readonly onSettingsChange: (settings: TwChartSettings) => void;
}

export function TwChartToolbar({
  instrumentNames,
  settings,
  onSettingsChange,
}: TwChartToolbarProps): React.ReactElement {
  const { instrumentName, resolution } = settings;

  const instrumentOptions = useMemo<readonly TwSelectOption<string>[]>(() => {
    return instrumentNames.map((instrumentName) =>
      toSimpleTwSelectOption(instrumentName),
    );
  }, [instrumentNames]);

  const handleInstrumentChange = useCallback(
    (instrumentName: string) => {
      onSettingsChange({
        ...settings,
        instrumentName,
      });
    },
    [settings, onSettingsChange],
  );

  const handleResolutionChange = useCallback(
    (resolution: TwChartResolution) => {
      onSettingsChange({
        ...settings,
        resolution,
      });
    },
    [settings, onSettingsChange],
  );

  return (
    <div className='inline-flex flex-row gap-0.5'>
      <TwSelectButton<string, false>
        options={instrumentOptions}
        value={instrumentName}
        onValueChange={handleInstrumentChange}
        selectionWidth={80}
        selectItemWidth={80}
      />
      <TwSelectButtonCentered<TwChartResolution, false>
        options={RESOLUTION_OPTIONS}
        value={resolution}
        onValueChange={handleResolutionChange}
        width={32}
      />
    </div>
  );
}

const RESOLUTION_OPTIONS: readonly TwSelectOption<TwChartResolution>[] =
  TYPES_OF_TW_CHART_RESOLUTION.map((resolution) =>
    toSimpleTwSelectOption(resolution),
  );
