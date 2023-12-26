import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Key } from 'ts-key-enum';
import { Instrument } from '@gmjs/gm-trading-shared';
import { TwChart } from '../tw-chart/TwChart';
import {
  ChartTimeRangeChangeFn,
  TwChartResolution,
  TwChartSettings,
} from '../tw-chart/types';
import { TwChartToolbar } from '../tw-chart/components/chart-toolbar/TwChartToolbar';
import { moveLogicalRange } from '../tw-chart/util';
import { TwTimeStep } from '../tw-chart/types/tw-time-step';
import {
  getChartData,
  getTradeData,
  getTradeDataBarIndex,
  rawDataToFullTickerData,
  toLogicalOffset,
} from './util';
import {
  LoadingDisplay,
  PrettyDisplay,
  SideToolbar,
  SideToolbarEntry,
} from '../../shared';
import { RightToolbarState } from './types';
import { TradingChartData } from '../trade/types';
import { TickerDataLayout } from '../components/layout';
import { TradeContainer } from '../trade/TradeContainer';

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
  const [rightToolbarState, setRightToolbarState] = useState<
    RightToolbarState | undefined
  >(undefined);

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

  const tradingChartData = useMemo<TradingChartData>(() => {
    return {
      timezone,
      barData: getTradeData(fullData),
      barIndex: getTradeDataBarIndex(fullData, replaySettings),
    };
  }, [timezone, fullData, replaySettings]);

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

  const top = (
    <>
      <TwChartToolbar
        instrumentNames={instrumentNames}
        subRows={fullData.subRows}
        rows={fullData.rows}
        settings={settings}
        onSettingsChange={setSettings}
      />
      {false && <PrettyDisplay content={settings} />}
    </>
  );

  const right = (
    <SideToolbar
      position={'right'}
      entries={getToolbarEntries(tradingChartData)}
      value={rightToolbarState}
      onValueChange={setRightToolbarState}
    />
  );

  return <TickerDataLayout main={dataChartElement} top={top} right={right} />;
}

function getToolbarEntries(
  chartData: TradingChartData,
): readonly SideToolbarEntry<RightToolbarState>[] {
  return [
    {
      value: 'trade',
      tab: 'Trade',
      content: (
        <div className='min-w-[600px] h-full'>
          <TradeContainer chartData={chartData} />
        </div>
      ),
    },
  ];
}
