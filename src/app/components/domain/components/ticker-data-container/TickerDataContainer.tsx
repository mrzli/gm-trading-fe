import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Key } from 'ts-key-enum';
import { Instrument } from '@gmjs/gm-trading-shared';
import { TwChart } from '../tw-chart/TwChart';
import { ChartTimeRangeChangeFn } from '../tw-chart/types';
import { ChartToolbar } from '../chart-toolbar/ChartToolbar';
import { moveLogicalRange } from '../chart-toolbar/util';
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
} from '../../../shared';
import { RightToolbarState } from './types';
import { TradingChartData } from '../trade/types';
import { TickerDataLayout } from '../layout';
import { TradeContainer } from '../trade/TradeContainer';
import {
  ChartSettings,
  ChartResolution,
  ChartTimezone,
  ChartRange,
} from '../../types';
import { ChartTimeStep } from '../chart-toolbar/types';

export interface TickerDataContainerProps {
  readonly allInstruments: readonly Instrument[];
  readonly isLoadingData: boolean;
  readonly rawData: readonly string[] | undefined;
  readonly onRequestData: (name: string, resolution: ChartResolution) => void;
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

  const [settings, setSettings] = useState<ChartSettings>({
    instrumentName: allInstruments[0].name,
    resolution: '5m',
    timezone: 'UTC',
    replayPosition: {
      barIndex: undefined,
      subBarIndex: 0,
    },
  });

  const [logicalRange, setLogicalRange] = useState<ChartRange | undefined>(
    undefined,
  );

  const { instrumentName, resolution, timezone, replayPosition } = settings;

  useEffect(
    () => {
      onRequestData(instrumentName, resolution);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onRequestData],
  );

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
    return getChartData(fullData, replayPosition);
  }, [fullData, replayPosition]);

  const handleInstrumentChange = useCallback(
    (instrumentName: string) => {
      setSettings((s) => ({
        ...s,
        instrumentName,
        logicalRange: undefined,
        replayPosition: {
          barIndex: undefined,
          subBarIndex: 0,
        },
      }));
      onRequestData(instrumentName, resolution);
    },
    [onRequestData, resolution],
  );

  const handleResolutionChange = useCallback(
    (resolution: ChartResolution) => {
      setSettings((s) => ({
        ...s,
        resolution,
        logicalRange: undefined,
        replayPosition: {
          barIndex: undefined,
          subBarIndex: 0,
        },
      }));
      onRequestData(instrumentName, resolution);
    },
    [instrumentName, onRequestData],
  );

  const handleTimezoneChange = useCallback((timezone: ChartTimezone) => {
    setSettings((s) => ({
      ...s,
      timezone,
    }));
  }, []);

  const handleChartTimeRangeChange = useCallback<ChartTimeRangeChangeFn>(
    (range) => {
      setLogicalRange(range);
    },
    [],
  );

  const handleChartKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      switch (event.key) {
        case Key.ArrowLeft:
        case Key.ArrowRight: {
          const offset = toLogicalOffset(event);
          const timeStep: ChartTimeStep = {
            unit: 'B',
            value: offset,
          };
          const newLogicalRange = logicalRange ?
            moveLogicalRange(logicalRange, timeStep, fullData.rows) :
            undefined;
          setLogicalRange(newLogicalRange);
          break;
        }
      }
    },
    [fullData.rows, logicalRange],
  );

  const tradingChartData = useMemo<TradingChartData>(() => {
    return {
      timezone,
      barData: getTradeData(fullData),
      barIndex: getTradeDataBarIndex(fullData, replayPosition),
    };
  }, [timezone, fullData, replayPosition]);

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
      <ChartToolbar
        instrumentNames={instrumentNames}
        subRows={fullData.subRows}
        rows={fullData.rows}
        settings={settings}
        onInstrumentChange={handleInstrumentChange}
        onResolutionChange={handleResolutionChange}
        onTimezoneChange={handleTimezoneChange}
        onSettingsChange={setSettings}
        logicalRange={logicalRange}
        onLogicalRangeChange={handleChartTimeRangeChange}
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
