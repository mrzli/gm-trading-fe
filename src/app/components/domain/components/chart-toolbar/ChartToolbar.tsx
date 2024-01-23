import React, { useCallback, useMemo } from 'react';
import {
  Bars,
  ChartSettings,
  ChartTimezone,
  TYPES_OF_CHART_TIMEZONES,
  ChartRange,
  ChartAdditionalSettings,
} from '../../types';
import { RESOLUTION_OPTIONS } from './util';
import { ChartToolbarGoTo } from './components/ChartToolbarGoTo';
import { ChartToolbarNavigate } from './components/ChartToolbarNavigate';
import {
  SelectOption,
  SelectButton,
  SelectButtonCentered,
} from '../../../shared';
import { toSimpleSelectOption } from '../../util';
import { ChartToolbarAdditional } from './components/ChartToolbarAdditional';
import { Instrument, TickerDataResolution } from '@gmjs/gm-trading-shared';

export interface ChartToolbarProps {
  readonly instruments: readonly Instrument[];
  readonly bars: Bars;
  readonly settings: ChartSettings;
  readonly onSettingsChange: (settings: ChartSettings) => void;
  readonly logicalRange: ChartRange | undefined;
  readonly onLogicalRangeChange: (logicalRange: ChartRange | undefined) => void;
}

export function ChartToolbar({
  instruments,
  bars,
  settings,
  onSettingsChange,
  logicalRange,
  onLogicalRangeChange,
}: ChartToolbarProps): React.ReactElement {
  const { instrumentName, resolution, timezone, additional } = settings;

  const instrumentOptions = useMemo<readonly SelectOption<string>[]>(() => {
    return instruments.map((instrument) =>
      toSimpleSelectOption(instrument.name),
    );
  }, [instruments]);

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
    (resolution: TickerDataResolution) => {
      onSettingsChange({
        ...settings,
        resolution,
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

  const handleAdditionalSettingsChange = useCallback(
    (additional: ChartAdditionalSettings) => {
      onSettingsChange({
        ...settings,
        additional,
      });
    },
    [settings, onSettingsChange],
  );

  return (
    <div className='inline-flex flex-row gap-0.5'>
      <SelectButton<string, false>
        options={instrumentOptions}
        value={instrumentName}
        onValueChange={handleInstrumentChange}
        selectionWidth={80}
        selectItemWidth={80}
      />
      <SelectButtonCentered<TickerDataResolution, false>
        options={RESOLUTION_OPTIONS}
        value={resolution}
        onValueChange={handleResolutionChange}
        width={32}
      />
      <SelectButton<ChartTimezone, false>
        options={TIMEZONE_OPTIONS}
        value={timezone}
        onValueChange={handleTimezoneChange}
        selectionWidth={128}
        selectItemWidth={128}
      />
      {bars.length > 0 && (
        <>
          <ChartToolbarNavigate
            settings={settings}
            data={bars}
            logicalRange={logicalRange}
            onNavigate={onLogicalRangeChange}
          />
          <ChartToolbarGoTo
            timezone={timezone}
            data={bars}
            logicalRange={logicalRange}
            onGoTo={onLogicalRangeChange}
          />
        </>
      )}
      <ChartToolbarAdditional
        value={additional}
        onValueChange={handleAdditionalSettingsChange}
      />
    </div>
  );
}

const TIMEZONE_OPTIONS: readonly SelectOption<ChartTimezone>[] =
  TYPES_OF_CHART_TIMEZONES.map((timezone) => toSimpleSelectOption(timezone));
