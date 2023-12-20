import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { mdiCurrencyUsd } from '@mdi/js';
import { Key } from 'ts-key-enum';
import { Instrument } from '@gmjs/gm-trading-shared';
import { TwChart } from '../tw-chart/TwChart';
import {
  ChartTimeRangeChangeFn,
  TwChartResolution,
  TwChartSettings,
} from '../tw-chart/types';
import { TwChartToolbar } from '../tw-chart/components/composite/chart-toolbar/TwChartToolbar';
import { moveLogicalRange } from '../tw-chart/util';
import { TwTimeStep } from '../tw-chart/types/tw-time-step';
import {
  getChartData,
  getTradeData,
  getTradeDataBarIndex,
  rawDataToFullTickerData,
  toLogicalOffset,
} from './util';
import { LoadingDisplay, PrettyDisplay } from '../../shared';
import { RightToolbarState } from './types';
import { TickerDataRightToolbar } from './TickerDataRightToolbar';
import { IconButton } from '../shared/IconButton';

export interface TickerDataContainerProps {
  readonly allInstruments: readonly Instrument[];
  readonly isLoadingData: boolean;
  readonly rawData: readonly string[] | undefined;
  readonly onRequestData: (name: string, resolution: TwChartResolution) => void;
}

export function TickerDataContainer({
  allInstruments,
  isLoadingData,
  rawData,
  onRequestData,
}: TickerDataContainerProps): React.ReactElement {
  const [rightToolbarState, setRightToolbarState] =
    useState<RightToolbarState>('none');

  const instrumentNames = useMemo(() => {
    return allInstruments?.map((instrument) => instrument.name) ?? [];
  }, [allInstruments]);

  const [settings, setSettings] = useState<TwChartSettings>({
    instrumentName: allInstruments[0].name,
    resolution: '5m',
    timezone: 'UTC',
    logicalRange: undefined,
    replaySettings: {
      barIndex: undefined,
      subBarIndex: 0,
    },
  });

  const { instrumentName, resolution, timezone, logicalRange, replaySettings } =
    settings;

  useEffect(() => {
    setSettings((s) => ({
      ...s,
      replaySettings: {
        barIndex: undefined,
        subBarIndex: 0,
      },
    }));
    onRequestData(instrumentName, resolution);
  }, [onRequestData, instrumentName, resolution]);

  const instrument = useMemo(() => {
    return allInstruments.find(
      (instrument) => instrument.name === instrumentName,
    );
  }, [allInstruments, instrumentName]);

  const fullData = useMemo(
    () => rawDataToFullTickerData(rawData ?? [], resolution),
    [rawData, resolution],
  );

  const chartData = useMemo(() => {
    return getChartData(fullData, replaySettings);
  }, [fullData, replaySettings]);

  const handleChartTimeRangeChange = useCallback<ChartTimeRangeChangeFn>(
    (range) => {
      setSettings((s) => ({
        ...s,
        logicalRange: range,
      }));
    },
    [],
  );

  const handleChartKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      switch (event.key) {
        case Key.ArrowLeft:
        case Key.ArrowRight: {
          const offset = toLogicalOffset(event);
          const timeStep: TwTimeStep = {
            unit: 'B',
            value: offset,
          };
          setSettings((s) => ({
            ...s,
            logicalRange: s.logicalRange
              ? moveLogicalRange(s.logicalRange, timeStep, fullData.rows)
              : undefined,
          }));
          break;
        }
      }
    },
    [fullData],
  );

  const handleToggleRightToolbarStateTrade = useCallback(() => {
    setRightToolbarState((s) => (s === 'trade' ? 'none' : 'trade'));
  }, []);

  const tradeData = useMemo(() => getTradeData(fullData), [fullData]);
  const tradeDataBarIndex = useMemo(
    () => getTradeDataBarIndex(fullData, replaySettings),
    [fullData, replaySettings],
  );

  if (!instrument) {
    return <div>Instrument not found.</div>;
  }

  const dataChartElement =
    !isLoadingData && chartData.length > 0 ? (
      <TwChart
        precision={instrument.precision}
        data={chartData}
        timezone={timezone}
        logicalRange={logicalRange}
        onChartTimeRangeChange={handleChartTimeRangeChange}
        onChartKeyDown={handleChartKeyDown}
      />
    ) : isLoadingData ? (
      <LoadingDisplay />
    ) : (
      <div>Please load data...</div>
    );

  return (
    <div className='h-screen flex flex-col gap-4 p-4 overflow-hidden'>
      <TwChartToolbar
        instrumentNames={instrumentNames}
        subRows={fullData.subRows}
        rows={fullData.rows}
        settings={settings}
        onSettingsChange={setSettings}
      />
      {false && <PrettyDisplay content={settings} />}
      <div className='flex-1 overflow-hidden flex flex-row gap-2'>
        <div className='h-full flex-1 overflow-hidden'>{dataChartElement}</div>
        <div className='flex flex-row gap-2'>
          <div>
            <IconButton
              icon={mdiCurrencyUsd}
              onClick={handleToggleRightToolbarStateTrade}
            />
          </div>
          {rightToolbarState !== 'none' && (
            <TickerDataRightToolbar
              state={rightToolbarState}
              barData={tradeData}
              barIndex={tradeDataBarIndex}
            />
          )}
        </div>
      </div>
    </div>
  );
}
