import React, { useCallback, useMemo } from 'react';
import {
  TwBarReplaySettings,
  TwChartResolution,
  TwChartSettings,
  TwRange,
} from '../../../types';
import { TwSelectButton } from '../../form/select-button/TwSelectButton';
import { toSimpleTwSelectOption } from '../../../util';
import { TwSelectOption } from '../../form/select-button/types';
import { TwSelectButtonCentered } from '../../form/select-button/TwSelectButtonCentered';
import { TickerDataRow } from '../../../../../../types';
import { RESOLUTION_OPTIONS } from './util';
import { TwChartToolbarGoTo } from './components/TwChartToolbarGoTo';
import { TwChartToolbarNavigate } from './components/TwChartToolbarNavigate';
import { TwChartToolbarReplay } from './components/TwChartToolbarReplay';

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

  const handleReplaySettingsChange = useCallback(
    (replaySettings: TwBarReplaySettings) => {
      onSettingsChange({
        ...settings,
        replaySettings,
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
          <TwChartToolbarReplay
            nonAggregatedDataLength={nonAggregatedDataLength}
            data={data}
            replaySettings={settings.replaySettings}
            onReplaySettingsChange={handleReplaySettingsChange}
          />
        </>
      )}
    </div>
  );
}
