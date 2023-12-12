import React, { useCallback, useMemo, useState } from 'react';
import Icon from '@mdi/react';
import { mdiChevronDoubleLeft, mdiChevronDoubleRight } from '@mdi/js';
import { TwChartResolution, TwChartSettings } from '../../../types';
import { TwSelectButton } from '../../form/select-button/TwSelectButton';
import { toSimpleTwSelectOption } from '../../../util';
import { TwSelectOption } from '../../form/select-button/types';
import { TwSelectButtonCentered } from '../../form/select-button/TwSelectButtonCentered';
import { TwTextInput } from '../../form/TwITextnput';
import { TwButton } from '../../form/TwButton';
import { dateIsoUtcToUnixSeconds } from '../../../../../../util';
import { TickerDataRow } from '../../../../../../types';
import { binarySearch } from '../../../util/binary-search';
import { SCHEME_GO_TO_INPUT, DEFAULT_SPAN, dateInputToIso, RESOLUTION_OPTIONS, SCHEME_DATE } from './util';

export interface TwChartToolbarProps {
  readonly instrumentNames: readonly string[];
  readonly data: readonly TickerDataRow[];
  readonly settings: TwChartSettings;
  readonly onSettingsChange: (settings: TwChartSettings) => void;
}

export function TwChartToolbar({
  instrumentNames,
  data,
  settings,
  onSettingsChange,
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

  const navigateTo = useCallback(
    (logical: number) => {
      const { timeRange } = settings;
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
    },
    [settings, onSettingsChange],
  );

  const navigateToStart = useCallback(() => {
    const logical = 0;
    navigateTo(logical);
  }, [navigateTo]);

  const navigateToEnd = useCallback(() => {
    const logical = data.length - 1;
    navigateTo(logical);
  }, [data, navigateTo]);

  const handleGoToClick = useCallback(() => {
    if (!isGoToEnabled) {
      return;
    }

    const time = dateIsoUtcToUnixSeconds(dateInputToIso(goToInput));
    const logical = binarySearch(data, time, (row) => row.time);

    navigateTo(logical);
  }, [isGoToEnabled, data, goToInput, navigateTo]);

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
      <TwButton
        content={<Icon path={mdiChevronDoubleLeft} size={0.875 / 1.5} />}
        onClick={navigateToStart}
      />
      <TwButton
        content={<Icon path={mdiChevronDoubleRight} size={0.875 / 1.5} />}
        onClick={navigateToEnd}
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
            content={'Go to'}
            onClick={handleGoToClick}
            disabled={!isGoToEnabled}
          />
        </>
      )}
    </div>
  );
}
