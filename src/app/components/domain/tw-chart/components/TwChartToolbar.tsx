import React, { useCallback, useMemo } from 'react';
import {
  TYPES_OF_TW_CHART_RESOLUTION,
  TwChartResolution,
  TwChartSettings,
} from '../types';
import {
  TwSelectButton,
  TwSelectItemRenderer,
  TwSelectOption,
  TwSelectionRenderer,
} from './TwSelectButton';

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
    return instrumentNames.map((instrumentName) => ({
      label: instrumentName,
      value: instrumentName,
    }));
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

  const selectionRenderer = useMemo<TwSelectionRenderer<TwChartResolution>>(
    // eslint-disable-next-line react/display-name
    () => (option) => (
      <div className='px-1 w-8 inline-flex justify-center'>
        {option?.label ?? '-'}
      </div>
    ),
    [],
  );

  const selectItemRenderer = useMemo<TwSelectItemRenderer<TwChartResolution>>(
    // eslint-disable-next-line react/display-name
    () => (option) => (
      <div className='px-1 w-8 inline-flex justify-center'>{option.label}</div>
    ),
    [],
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
      <TwSelectButton<TwChartResolution, false>
        options={RESOLUTION_OPTIONS}
        value={resolution}
        onValueChange={handleResolutionChange}
        selectionRenderer={selectionRenderer}
        selectItemRenderer={selectItemRenderer}
      />
    </div>
  );
}

const RESOLUTION_OPTIONS: readonly TwSelectOption<TwChartResolution>[] =
  TYPES_OF_TW_CHART_RESOLUTION.map((resolution) => ({
    label: resolution,
    value: resolution,
  }));
