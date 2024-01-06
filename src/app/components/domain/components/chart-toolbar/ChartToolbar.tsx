import React, { useMemo } from 'react';
import {
  Bars,
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
import { toSimpleSelectOption } from '../../util';
import { ChartToolbarAdditional } from './components/ChartToolbarAdditional';

export interface ChartToolbarProps {
  readonly instrumentNames: readonly string[];
  readonly bars: Bars;
  readonly settings: ChartSettings;
  readonly onInstrumentChange: (instrumentName: string) => void;
  readonly onResolutionChange: (resolution: ChartResolution) => void;
  readonly onTimezoneChange: (timezone: ChartTimezone) => void;
  readonly logicalRange: ChartRange | undefined;
  readonly onLogicalRangeChange: (logicalRange: ChartRange | undefined) => void;
}

export function ChartToolbar({
  instrumentNames,
  bars,
  settings,
  onInstrumentChange,
  onResolutionChange,
  onTimezoneChange,
  logicalRange,
  onLogicalRangeChange,
}: ChartToolbarProps): React.ReactElement {
  const instrumentOptions = useMemo<readonly SelectOption<string>[]>(() => {
    return instrumentNames.map((instrumentName) =>
      toSimpleSelectOption(instrumentName),
    );
  }, [instrumentNames]);

  return (
    <div className='inline-flex flex-row gap-0.5'>
      <SelectButton<string, false>
        options={instrumentOptions}
        value={settings.instrumentName}
        onValueChange={onInstrumentChange}
        selectionWidth={80}
        selectItemWidth={80}
      />
      <SelectButtonCentered<ChartResolution, false>
        options={RESOLUTION_OPTIONS}
        value={settings.resolution}
        onValueChange={onResolutionChange}
        width={32}
      />
      <SelectButton<ChartTimezone, false>
        options={TIMEZONE_OPTIONS}
        value={settings.timezone}
        onValueChange={onTimezoneChange}
        selectionWidth={128}
        selectItemWidth={128}
      />
      {bars.length > 0 && (
        <>
          <ChartToolbarNavigate
            data={bars}
            logicalRange={logicalRange}
            onNavigate={onLogicalRangeChange}
          />
          <ChartToolbarGoTo
            timezone={settings.timezone}
            data={bars}
            logicalRange={logicalRange}
            onGoTo={onLogicalRangeChange}
          />
        </>
      )}
      <ChartToolbarAdditional />
    </div>
  );
}

const TIMEZONE_OPTIONS: readonly SelectOption<ChartTimezone>[] =
  TYPES_OF_CHART_TIMEZONES.map((timezone) => toSimpleSelectOption(timezone));
