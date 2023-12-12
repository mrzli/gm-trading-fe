import React, { useCallback, useMemo, useState } from 'react';
import { z } from 'zod';
import validator from 'validator';
import {
  TYPES_OF_TW_CHART_RESOLUTION,
  TwChartApi,
  TwChartResolution,
  TwChartSettings,
} from '../../types';
import { TwSelectButton } from '../form/select-button/TwSelectButton';
import { toSimpleTwSelectOption } from '../../util';
import { TwSelectOption } from '../form/select-button/types';
import { TwSelectButtonCentered } from '../form/select-button/TwSelectButtonCentered';
import { applyFn } from '@gmjs/apply-function';
import { compose } from '@gmjs/compose-function';
import { filter, map, toArray } from '@gmjs/value-transformers';
import { TwTextInput } from '../form/TwITextnput';
import { TwButton } from '../form/TwButton';
import { dateIsoUtcToUnixSeconds } from '../../../../../util';
import { TickerDataRow } from '../../../../../types';
import { binarySearch } from '../../util/binary-search';

export interface TwChartToolbarProps {
  readonly instrumentNames: readonly string[];
  readonly data: readonly TickerDataRow[];
  readonly settings: TwChartSettings;
  readonly onSettingsChange: (settings: TwChartSettings) => void;
  readonly chartApi: TwChartApi | undefined;
}

export function TwChartToolbar({
  instrumentNames,
  data,
  settings,
  onSettingsChange,
  chartApi,
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
  const isGoToEnabled = useMemo(
    () => SCHEME_DATE.safeParse(goToInput).success && data.length > 0,
    [goToInput, data],
  );

  const handleInstrumentChange = useCallback(
    (instrumentName: string) => {
      onSettingsChange({
        ...settings,
        instrumentName,
        timeRange: undefined,
      });
    },
    [settings, onSettingsChange],
  );

  const handleResolutionChange = useCallback(
    (resolution: TwChartResolution) => {
      onSettingsChange({
        ...settings,
        resolution,
        timeRange: undefined,
      });
    },
    [settings, onSettingsChange],
  );

  const handleGoToClick = useCallback(() => {
    if (!isGoToEnabled) {
      return;
    }

    const { timeRange } = settings;

    const time = dateIsoUtcToUnixSeconds(goToInput);
    const logical = binarySearch(data, time, (row) => row.time);

    const span = timeRange ? timeRange.to - timeRange.from : DEFAULT_SPAN;

    const from = logical - span / 2;
    const to = logical + span / 2;

    onSettingsChange({
      ...settings,
      timeRange: {
        from,
        to,
      },
    });
  }, [data, settings, onSettingsChange, goToInput, isGoToEnabled]);

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
          <TwTextInput
            placeholder='YYYY-MM-DD [HH:mm]'
            value={goToInput}
            onValueChange={setGoToInput}
            error={!isGoToInputValid}
            width={160}
          />
          <TwButton
            label={'Go to'}
            onClick={handleGoToClick}
            disabled={!isGoToEnabled}
          />
        </>
      )}
    </div>
  );
}

const DEFAULT_SPAN = 60;

const RESOLUTION_OPTIONS: readonly TwSelectOption<TwChartResolution>[] =
  TYPES_OF_TW_CHART_RESOLUTION.map((resolution) =>
    toSimpleTwSelectOption(resolution),
  );

const SCHEME_DATE = z.string().refine((value) => {
  const parts = applyFn(
    value.split(' '),
    compose(
      map((p) => p.trim()),
      filter((p) => p.length > 0),
      toArray(),
    ),
  );

  if (parts.length === 1) {
    return validateDate(parts[0]);
  } else if (parts.length === 2) {
    return validateDate(parts[0]) && validateTime(parts[1]);
  } else {
    return false;
  }
});

const SCHEME_GO_TO_INPUT = z.union([z.literal(''), SCHEME_DATE]);

function validateDate(value: string): boolean {
  return validator.isDate(value, {
    format: 'YYYY-MM-DD',
    strictMode: true,
    delimiters: ['-'],
  });
}

function validateTime(value: string): boolean {
  return validator.isTime(value);
}
