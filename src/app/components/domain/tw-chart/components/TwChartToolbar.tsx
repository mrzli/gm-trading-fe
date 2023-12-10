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
} from './TwSelectButton';

export interface TwChartToolbarProps {
  readonly settings: TwChartSettings;
  readonly onSettingsChange: (settings: TwChartSettings) => void;
}

export function TwChartToolbar({
  settings,
  onSettingsChange,
}: TwChartToolbarProps): React.ReactElement {
  const { resolution } = settings;

  const handleResolutionChange = useCallback(
    (resolution: TwChartResolution) => {
      onSettingsChange({
        ...settings,
        resolution,
      });
    },
    [settings, onSettingsChange],
  );

  const selectItemRenderer = useMemo<TwSelectItemRenderer<TwChartResolution>>(
    () => (option) => option.label,
    [],
  );

  return (
    <div>
      <TwSelectButton<TwChartResolution, false>
        options={RESOLUTION_OPTIONS}
        value={resolution}
        onValueChange={handleResolutionChange}
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
