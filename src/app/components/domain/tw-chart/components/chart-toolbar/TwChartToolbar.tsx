import React, { useCallback, useMemo } from 'react';
import {
  TYPES_OF_TW_CHART_TIMEZONES,
  TwChartResolution,
  TwChartSettings,
  TwChartTimezone,
  TwRange,
} from '../../types';
import { toSimpleSelectOption } from '../../util';
import {
  BarReplayPosition,
  GroupedTickerDataRows,
  TickerDataRows,
} from '../../../types';
import { RESOLUTION_OPTIONS } from './util';
import { TwChartToolbarGoTo } from './components/TwChartToolbarGoTo';
import { TwChartToolbarNavigate } from './components/TwChartToolbarNavigate';
import {
  SelectOption,
  SelectButton,
  SelectButtonCentered,
} from '../../../../shared';
import { BarReplay } from '../../../trade/tabs/trading-operations/bar-replay/BarReplay';

export interface TwChartToolbarProps {
  readonly instrumentNames: readonly string[];
  readonly subRows: GroupedTickerDataRows;
  readonly rows: TickerDataRows;
  readonly settings: TwChartSettings;
  readonly onSettingsChange: (settings: TwChartSettings) => void;
}

export function TwChartToolbar({
  instrumentNames,
  subRows,
  rows,
  settings,
  onSettingsChange,
}: TwChartToolbarProps): React.ReactElement {
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
    (resolution: TwChartResolution) => {
      onSettingsChange({
        ...settings,
        resolution,
        logicalRange: undefined,
      });
    },
    [settings, onSettingsChange],
  );

  const handleTimezoneChange = useCallback(
    (timezone: TwChartTimezone) => {
      onSettingsChange({
        ...settings,
        timezone,
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
      <SelectButtonCentered<TwChartResolution, false>
        options={RESOLUTION_OPTIONS}
        value={settings.resolution}
        onValueChange={handleResolutionChange}
        width={32}
      />
      <SelectButton<TwChartTimezone, false>
        options={TIMEZONE_OPTIONS}
        value={settings.timezone}
        onValueChange={handleTimezoneChange}
        selectionWidth={128}
        selectItemWidth={128}
      />
      {rows.length > 0 && (
        <>
          <TwChartToolbarNavigate
            data={rows}
            logicalRange={settings.logicalRange}
            onNavigate={updateLogicalRange}
          />
          <TwChartToolbarGoTo
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

const TIMEZONE_OPTIONS: readonly SelectOption<TwChartTimezone>[] =
  TYPES_OF_TW_CHART_TIMEZONES.map((timezone) => toSimpleSelectOption(timezone));
