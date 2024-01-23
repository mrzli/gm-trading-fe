import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Instrument,
  TickerDataResolution,
  TradeState,
} from '@gmjs/gm-trading-shared';
import { ChartTimeRangeChangeFn } from '../tw-chart/types';
import { ChartToolbar } from '../chart-toolbar/ChartToolbar';
import { rawDataToFullBarData } from './util';
import {
  LoadingDisplay,
  PrettyDisplay,
  SideToolbar,
  SideToolbarEntry,
} from '../../../shared';
import { FullBarData } from './types';
import { TickerDataLayout } from '../layout';
import { TradeContainer } from '../trade/TradeContainer';
import {
  ChartSettings,
  ChartTimezone,
  ChartRange,
  BarReplayPosition,
  RightToolbarState,
  ChartAdditionalSettings,
  TradeLine,
} from '../../types';
import { ChartContainer } from './ChartContainer';
import { isBarReplayPositionEqual } from '../../util';

export interface TickerDataContainerProps {
  readonly instruments: readonly Instrument[];
  readonly isLoadingData: boolean;
  readonly rawData: readonly string[] | undefined;
  readonly onRequestData: (
    name: string,
    resolution: TickerDataResolution,
  ) => void;
  readonly tradeStates: readonly TradeState[];
  readonly onSaveTradeState: (tradeState: TradeState) => void;
}

export function TickerDataContainer({
  instruments,
  isLoadingData,
  rawData,
  onRequestData,
  tradeStates,
  onSaveTradeState,
}: TickerDataContainerProps): React.ReactElement {
  const [rightToolbarState, setRightToolbarState] = useState<
    RightToolbarState | undefined
  >(undefined);

  const [settings, setSettings] = useState<ChartSettings>(
    getInitialChartSettings(instruments[0].name),
  );

  const { instrumentName, resolution } = settings;

  const [logicalRange, setLogicalRange] = useState<ChartRange | undefined>(
    undefined,
  );

  const [replayPosition, setReplayPosition] = useState<BarReplayPosition>({
    barIndex: undefined,
    subBarIndex: 0,
  });

  const [tradeLines, setTradeLines] = useState<readonly TradeLine[]>([]);

  // useEffect(() => {
  //   setTradeLines(EXAMPLE_TRADE_LINES);
  // }, []);

  useEffect(
    () => {
      onRequestData(instrumentName, resolution);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onRequestData],
  );

  const instrument = useMemo(() => {
    return instruments.find((instrument) => instrument.name === instrumentName);
  }, [instruments, instrumentName]);

  const fullData = useMemo(
    () => rawDataToFullBarData(rawData ?? [], resolution),
    [rawData, resolution],
  );

  const handleSettingsChange = useCallback(
    (newSettings: ChartSettings) => {
      const { instrumentName, resolution } = settings;
      const { instrumentName: newInstrumentName, resolution: newResolution } =
        newSettings;

      setSettings(newSettings);

      if (
        newInstrumentName !== instrumentName ||
        newResolution !== resolution
      ) {
        onRequestData(newInstrumentName, newResolution);
      }
    },
    [onRequestData, settings],
  );

  const handleLogicalRangeChange = useCallback<ChartTimeRangeChangeFn>(
    (range) => {
      setLogicalRange(range);
    },
    [],
  );

  const handleRightToolbarStateChange = useCallback(
    (value: RightToolbarState | undefined) => {
      const { barIndex } = replayPosition;
      if (value === 'trade' && barIndex === undefined) {
        setReplayPosition({ barIndex: 1, subBarIndex: 0 });
      } else if (value !== 'trade') {
        setReplayPosition({ barIndex: undefined, subBarIndex: 0 });
      }

      setRightToolbarState(value);
    },
    [replayPosition],
  );

  const handleReplayPositionChange = useCallback(
    (newReplayPosition: BarReplayPosition) => {
      if (isBarReplayPositionEqual(replayPosition, newReplayPosition)) {
        return;
      }

      setReplayPosition(newReplayPosition);
    },
    [replayPosition],
  );

  const handleLoadTradeState = useCallback(
    (name: string) => {
      const tradeState = tradeStates.find((ts) => ts.saveName === name);
      if (!tradeState) {
        return;
      }

      const { tickerName, tickerResolution, timezone, barIndex } = tradeState;

      handleSettingsChange({
        ...settings,
        instrumentName: tickerName,
        resolution: tickerResolution,
        timezone: timezone as ChartTimezone,
      });

      setReplayPosition({ barIndex, subBarIndex: 0 });
    },
    [handleSettingsChange, settings, tradeStates],
  );

  const handleTradeLinesChange = useCallback(
    (tradeLines: readonly TradeLine[]) => {
      setTradeLines(tradeLines);
    },
    [],
  );

  if (!instrument) {
    return <div>Instrument not found.</div>;
  }

  const top = (
    <>
      <ChartToolbar
        instruments={instruments}
        bars={fullData.bars}
        settings={settings}
        onSettingsChange={handleSettingsChange}
        logicalRange={logicalRange}
        onLogicalRangeChange={handleLogicalRangeChange}
      />
      {false && <PrettyDisplay content={settings} />}
    </>
  );

  const dataChartElement =
    !isLoadingData && rawData && rawData.length > 0 ? (
      <ChartContainer
        instrument={instrument}
        settings={settings}
        fullData={fullData}
        isTrading={rightToolbarState === 'trade'}
        logicalRange={logicalRange}
        onLogicalRangeChange={handleLogicalRangeChange}
        replayPosition={replayPosition}
        onReplayPositionChange={handleReplayPositionChange}
        tradeLines={tradeLines}
      />
    ) : isLoadingData ? (
      <LoadingDisplay />
    ) : (
      <div>Please load data...</div>
    );

  const right =
    !isLoadingData && rawData && rawData.length > 0 ? (
      <SideToolbar
        position={'right'}
        entries={getToolbarEntries(
          tradeStates,
          onSaveTradeState,
          handleLoadTradeState,
          settings,
          instrument,
          fullData,
          replayPosition,
          handleReplayPositionChange,
          handleTradeLinesChange,
        )}
        value={rightToolbarState}
        onValueChange={handleRightToolbarStateChange}
      />
    ) : undefined;

  return <TickerDataLayout main={dataChartElement} top={top} right={right} />;
}

function getToolbarEntries(
  tradeStates: readonly TradeState[],
  handleSaveTradeState: (tradeState: TradeState) => void,
  handleLoadTradeState: (name: string) => void,
  settings: ChartSettings,
  instrument: Instrument,
  fullData: FullBarData,
  replayPosition: BarReplayPosition,
  handleReplayPositionChange: (value: BarReplayPosition) => void,
  handleTradeLinesChange: (tradeLines: readonly TradeLine[]) => void,
): readonly SideToolbarEntry<RightToolbarState>[] {
  return [
    {
      value: 'trade',
      tab: 'Trade',
      content: (
        <div className='w-[680px] h-full'>
          <TradeContainer
            tradeStates={tradeStates}
            onSaveTradeState={handleSaveTradeState}
            onLoadTradeState={handleLoadTradeState}
            settings={settings}
            instrument={instrument}
            fullData={fullData}
            replayPosition={replayPosition}
            onReplayPositionChange={handleReplayPositionChange}
            onTradeLinesChange={handleTradeLinesChange}
          />
        </div>
      ),
    },
  ];
}

function getInitialChartSettings(firstInstrumentName: string): ChartSettings {
  return {
    instrumentName: firstInstrumentName,
    resolution: '5m',
    timezone: 'UTC',
    additional: INITIAL_CHART_ADDITIONAL_SETTINGS,
  };
}

const INITIAL_CHART_ADDITIONAL_SETTINGS: ChartAdditionalSettings = {
  highlightSession: true,
};
