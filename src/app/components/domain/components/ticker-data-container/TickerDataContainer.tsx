import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Instrument } from '@gmjs/gm-trading-shared';
import { ChartTimeRangeChangeFn } from '../tw-chart/types';
import { ChartToolbar } from '../chart-toolbar/ChartToolbar';
import {
  getTradeData,
  getTradeDataBarIndex,
  rawDataToFullTickerData,
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
  BarReplayPosition,
} from '../../types';
import { ChartContainer } from './ChartContainer';

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
  });

  const { instrumentName, resolution, timezone } = settings;

  const [logicalRange, setLogicalRange] = useState<ChartRange | undefined>(
    undefined,
  );

  const [replayPosition, setReplayPosition] = useState<BarReplayPosition>({
    barIndex: undefined,
    subBarIndex: 0,
  });

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

  const handleInstrumentChange = useCallback(
    (instrumentName: string) => {
      setSettings((s) => ({
        ...s,
        instrumentName,
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

  const handleReplayPositionChange = useCallback(
    (replayPosition: BarReplayPosition) => {
      setReplayPosition(replayPosition);
    },
    [],
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
    !isLoadingData && rawData && rawData.length > 0 ? (
      <ChartContainer
        instrument={instrument}
        settings={settings}
        fullData={fullData}
        logicalRange={logicalRange}
        onLogicalRangeChange={handleChartTimeRangeChange}
        replayPosition={replayPosition}
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
        logicalRange={logicalRange}
        onLogicalRangeChange={handleChartTimeRangeChange}
        replayPosition={replayPosition}
        onReplayPositionChange={handleReplayPositionChange}
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
