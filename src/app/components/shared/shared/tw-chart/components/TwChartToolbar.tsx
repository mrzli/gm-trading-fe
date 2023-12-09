import React, { useCallback } from 'react';
import { TwToggleButton } from './TwToggleButton';
import { TwChartSettings } from '../types';

export interface TwChartToolbarProps {
  readonly settings: TwChartSettings;
  readonly onSettingsChange: (settings: TwChartSettings) => void;
}

export function TwChartToolbar({
  settings,
  onSettingsChange,
}: TwChartToolbarProps): React.ReactElement {
  const { autoscale } = settings;

  const handleAutoscaleChange = useCallback(
    (autoscale: boolean) => {
      onSettingsChange({
        ...settings,
        autoscale,
      });
    },
    [settings, onSettingsChange],
  );

  return (
    <div>
      <TwToggleButton
        label={'A'}
        value={autoscale}
        onValueChange={handleAutoscaleChange}
      />
    </div>
  );
}
