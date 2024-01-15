import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Instrument, TickerDataResolution } from '@gmjs/gm-trading-shared';
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
  TradingUiState,
  ChartAdditionalSettings,
  TradeLine,
} from '../../types';
import { ChartContainer } from './ChartContainer';
import { isBarReplayPositionEqual } from '../../util';
import { useLocalStorageTradingUiStateAccessor } from '../../hooks';

export interface TickerDataContainerProps {
  readonly allInstruments: readonly Instrument[];
  readonly isLoadingData: boolean;
  readonly rawData: readonly string[] | undefined;
  readonly onRequestData: (
    name: string,
    resolution: TickerDataResolution,
  ) => void;
}

export function TickerDataContainer({
  allInstruments,
  isLoadingData,
  rawData,
  onRequestData,
}: TickerDataContainerProps): React.ReactElement {
  const [getTradingUiState, setTradingUiState] =
    useLocalStorageTradingUiStateAccessor();

  const tradingUiState = useMemo(() => {
    return getTradingUiState();
  }, [getTradingUiState]);

  const [rightToolbarState, setRightToolbarState] = useState<
    RightToolbarState | undefined
  >(getInitialRightToolbarState(tradingUiState));

  const instrumentNames = useMemo(() => {
    return allInstruments?.map((instrument) => instrument.name) ?? [];
  }, [allInstruments]);

  const [settings, setSettings] = useState<ChartSettings>(
    getInitialChartSettings(tradingUiState, instrumentNames[0]),
  );

  const { instrumentName, resolution, timezone } = settings;

  useEffect(() => {
    setTradingUiState({
      instrumentName,
      resolution,
      timezone,
      rightToolbarState,
    });
  }, [
    instrumentName,
    resolution,
    rightToolbarState,
    setTradingUiState,
    timezone,
  ]);

  const [logicalRange, setLogicalRange] = useState<ChartRange | undefined>(
    undefined,
  );

  const [replayPosition, setReplayPosition] = useState<BarReplayPosition>({
    barIndex: undefined,
    subBarIndex: 0,
  });

  const [tradeLines, setTradeLines] = useState<readonly TradeLine[]>([]);

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
    () => rawDataToFullBarData(rawData ?? [], resolution),
    [rawData, resolution],
  );

  const handleInstrumentChange = useCallback(
    (instrumentName: string) => {
      setSettings((s) => ({
        ...s,
        instrumentName,
      }));
      setTradingUiState((prev) =>
        prev ? { ...prev, instrumentName } : undefined,
      );
      onRequestData(instrumentName, resolution);
    },
    [onRequestData, resolution, setTradingUiState],
  );

  const handleResolutionChange = useCallback(
    (resolution: TickerDataResolution) => {
      setSettings((s) => ({
        ...s,
        resolution,
      }));
      setTradingUiState((prev) => (prev ? { ...prev, resolution } : undefined));
      onRequestData(instrumentName, resolution);
    },
    [instrumentName, onRequestData, setTradingUiState],
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

  const handleAdditionalSettingsChange = useCallback(
    (additionalSettings: ChartAdditionalSettings) => {
      setSettings((s) => ({
        ...s,
        additional: additionalSettings,
      }));
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

      setTradingUiState((prev) =>
        prev ? { ...prev, rightToolbarState: value } : undefined,
      );
      setRightToolbarState(value);
    },
    [replayPosition, setTradingUiState],
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

  const handleTradeLinesChange = useCallback(
    (tradeLines: readonly TradeLine[]) => {
      setTradeLines(tradeLines);
    },
    [],
  );

  if (!instrument) {
    return <div>Instrument not found.</div>;
  }

  const dataChartElement =
    !isLoadingData && rawData && rawData.length > 0 ? (
      <ChartContainer
        instrument={instrument}
        settings={settings}
        fullData={fullData}
        isTrading={rightToolbarState === 'trade'}
        logicalRange={logicalRange}
        onLogicalRangeChange={handleChartTimeRangeChange}
        replayPosition={replayPosition}
        onReplayPositionChange={handleReplayPositionChange}
        tradeLines={tradeLines}
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
        bars={fullData.bars}
        settings={settings}
        onInstrumentChange={handleInstrumentChange}
        onResolutionChange={handleResolutionChange}
        onTimezoneChange={handleTimezoneChange}
        logicalRange={logicalRange}
        onLogicalRangeChange={handleChartTimeRangeChange}
        onAdditionalSettingsChange={handleAdditionalSettingsChange}
      />
      {false && <PrettyDisplay content={settings} />}
    </>
  );

  const right =
    !isLoadingData && rawData && rawData.length > 0 ? (
      <SideToolbar
        position={'right'}
        entries={getToolbarEntries(
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

function getInitialChartSettings(
  tradingUiState: TradingUiState | undefined,
  firstInstrumentName: string,
): ChartSettings {
  if (!tradingUiState) {
    return {
      instrumentName: firstInstrumentName,
      resolution: '5m',
      timezone: 'UTC',
      additional: INITIAL_CHART_ADDITIONAL_SETTINGS,
    };
  }

  const { instrumentName, resolution, timezone } = tradingUiState;

  return {
    instrumentName,
    resolution,
    timezone,
    additional: INITIAL_CHART_ADDITIONAL_SETTINGS,
  };
}

const INITIAL_CHART_ADDITIONAL_SETTINGS: ChartAdditionalSettings = {
  highlightSession: false,
};

function getInitialRightToolbarState(
  tradingUiState: TradingUiState | undefined,
): RightToolbarState | undefined {
  if (!tradingUiState) {
    return undefined;
  }

  return tradingUiState.rightToolbarState;
}
