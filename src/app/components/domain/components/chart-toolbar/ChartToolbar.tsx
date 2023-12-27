import React, { useCallback, useMemo } from 'react';
import {
  BarReplayPosition,
  GroupedTickerDataRows,
  TickerDataRows,
  ChartSettings,
  ChartResolution,
  ChartTimezone,
  TYPES_OF_CHART_TIMEZONES,
  ChartRange,
} from '../../types';
import { RESOLUTION_OPTIONS } from './util';
import { ChartToolbarGoTo } from './components/ChartToolbarGoTo';
import { ChartToolbarNavigate } from './components/ChartToolbarNavigate';
import {
  SelectOption,
  SelectButton,
  SelectButtonCentered,
} from '../../../shared';
import { BarReplay } from '../trade/tabs/trading-operations/bar-replay/BarReplay';
import { toSimpleSelectOption } from '../../util';

export interface ChartToolbarProps {
  readonly instrumentNames: readonly string[];
  readonly subRows: GroupedTickerDataRows;
  readonly rows: TickerDataRows;
  readonly settings: ChartSettings;
  readonly onSettingsChange: (settings: ChartSettings) => void;
}

export function ChartToolbar({
  instrumentNames,
  subRows,
  rows,
  settings,
  onSettingsChange,
}: ChartToolbarProps): React.ReactElement {
  const instrumentOptions = useMemo<readonly SelectOption<string>[]>(() => {
    return instrumentNames.map((instrumentName) =>
      toSimpleSelectOption(instrumentName),
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
    (resolution: ChartResolution) => {
      onSettingsChange({
        ...settings,
        resolution,
        logicalRange: undefined,
      });
    },
    [settings, onSettingsChange],
  );

  const handleTimezoneChange = useCallback(
    (timezone: ChartTimezone) => {
      onSettingsChange({
        ...settings,
        timezone,
      });
    },
    [settings, onSettingsChange],
  );

  const updateLogicalRange = useCallback(
    (logicalRange: ChartRange | undefined) => {
      onSettingsChange({
        ...settings,
        logicalRange,
      });
    },
    [settings, onSettingsChange],
  );

  const handleReplayPositionChange = useCallback(
    (replayPosition: BarReplayPosition) => {
      onSettingsChange({
        ...settings,
        replayPosition,
      });
    },
    [settings, onSettingsChange],
  );

  return (
    <div className='inline-flex flex-row gap-0.5'>
      <SelectButton<string, false>
        options={instrumentOptions}
        value={settings.instrumentName}
        onValueChange={handleInstrumentChange}
        selectionWidth={80}
        selectItemWidth={80}
      />
      <SelectButtonCentered<ChartResolution, false>
        options={RESOLUTION_OPTIONS}
        value={settings.resolution}
        onValueChange={handleResolutionChange}
        width={32}
      />
      <SelectButton<ChartTimezone, false>
        options={TIMEZONE_OPTIONS}
        value={settings.timezone}
        onValueChange={handleTimezoneChange}
        selectionWidth={128}
        selectItemWidth={128}
      />
      {rows.length > 0 && (
        <>
          <ChartToolbarNavigate
            data={rows}
            logicalRange={settings.logicalRange}
            onNavigate={updateLogicalRange}
          />
          <ChartToolbarGoTo
            data={rows}
            logicalRange={settings.logicalRange}
            onGoTo={updateLogicalRange}
          />
          <BarReplay
            subRows={subRows}
            replayPosition={settings.replayPosition}
            onReplayPositionChange={handleReplayPositionChange}
          />
        </>
      )}
    </div>
  );
}

const TIMEZONE_OPTIONS: readonly SelectOption<ChartTimezone>[] =
  TYPES_OF_CHART_TIMEZONES.map((timezone) => toSimpleSelectOption(timezone));