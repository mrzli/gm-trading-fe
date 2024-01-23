import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Instrument,
  ManualTradeActionAny,
  TradeState,
  TradingParameters,
} from '@gmjs/gm-trading-shared';
import { TabLayout, TabLayoutEntry } from '../../../shared';
import {
  AmendOrderData,
  AmendTradeData,
  OrderInputs,
  TradeProcessState,
  TradeTabValue,
  TradingDataAndInputs,
  TradingInputs,
} from './types';
import { TradingOperationsContent } from './tabs/trading-operations/TradingOperationsContent';
import { TradingInputsContent } from './tabs/trading-inputs/TradingInputsContent';
import { TradingResultsContent } from './tabs/trading-results/TradingResultsContent';
import { TradingLog } from './tabs/trading-log/TradingLog';
import { TradingDebugDisplay } from './tabs/trading-debug/TradingDebugDisplay';
import {
  DEFAULT_TRADING_PARAMS,
  getNextManualActionId,
  createManualTradeActionOpen,
  processTradeSequence,
  flattenGroupedBars,
  getTradeDataBarIndex,
  createManualTradeActionAmendOrder,
  createManualTradeActionAmendTrade,
  createManualTradeActionCancelOrder,
  createManualTradeActionCloseTrade,
  calculateTradeLines,
  proposedOrderToTradeLines,
} from './util';
import {
  BarReplayPosition,
  Bars,
  ChartSettings,
  ChartTimezone,
  TradeLine,
} from '../../types';
import { FullBarData } from '../ticker-data-container/types';
import { useStoreTrade } from '../../../../../store';
import { TICKER_DATA_SOURCE } from '../../../../util';

export interface TradeContainerProps {
  readonly settings: ChartSettings;
  readonly onSettingsChange: (settings: ChartSettings) => void;
  readonly instrument: Instrument;
  readonly fullData: FullBarData;
  readonly replayPosition: BarReplayPosition;
  readonly onReplayPositionChange: (value: BarReplayPosition) => void;
  readonly onTradeLinesChange: (tradeLines: readonly TradeLine[]) => void;
}

export function TradeContainer({
  settings,
  onSettingsChange,
  instrument,
  fullData,
  replayPosition,
  onReplayPositionChange,
  onTradeLinesChange,
}: TradeContainerProps): React.ReactElement {
  const [activeTab, setActiveTab] = useState<TradeTabValue>('trading-inputs');

  const {
    // isLoadingTradeStates,
    tradeStates,
    // isSavingTradeState,
    getTradeStates,
    saveTradeState,
  } = useStoreTrade();

  useEffect(
    () => {
      getTradeStates();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const barData = useMemo<Bars>(
    () => flattenGroupedBars(fullData.subBars),
    [fullData],
  );

  const barIndex = useMemo<number>(
    () => getTradeDataBarIndex(fullData, replayPosition),
    [fullData, replayPosition],
  );

  const [tradingParameters, setTradingParameters] = useState<TradingParameters>(
    getInitialTradingParameters(instrument),
  );

  const [manualTradeActions, setManualTradeActions] = useState<
    readonly ManualTradeActionAny[]
  >([]);

  // // reset data when instrument changes
  // useEffect(
  //   () => {
  //     setTradingParameters(getInitialTradingParameters(instrument));
  //     setManualTradeActions([]);
  //   },
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [instrument],
  // );

  const tradingDataAndInputs = useMemo<TradingDataAndInputs>(() => {
    return {
      settings,
      instrument,
      fullData,
      replayPosition,
      barData,
      barIndex,
      inputs: {
        params: tradingParameters,
        manualTradeActions,
      },
    };
  }, [
    settings,
    instrument,
    fullData,
    replayPosition,
    barData,
    barIndex,
    tradingParameters,
    manualTradeActions,
  ]);

  const [tradeLines, setTradeLines] = useState<readonly TradeLine[]>([]);
  const [proposedOrderTradeLines, setProposedOrderTradeLines] = useState<
    readonly TradeLine[]
  >([]);

  const [tradeState, setTradeState] = useState<TradeProcessState>(
    getInitialTradeProcessState(tradingDataAndInputs),
  );

  useEffect(() => {
    const state = processTradeSequence(tradingDataAndInputs);
    setTradeState(state);
  }, [onTradeLinesChange, tradingDataAndInputs]);

  useEffect(() => {
    const tradeLines = calculateTradeLines(tradeState);
    setTradeLines(tradeLines);
  }, [tradeState]);

  useEffect(() => {
    const allTradeLines: readonly TradeLine[] = [
      ...tradeLines,
      ...proposedOrderTradeLines,
    ];
    onTradeLinesChange(allTradeLines);
  }, [onTradeLinesChange, proposedOrderTradeLines, tradeLines]);

  const handleLoadTradeState = useCallback(
    (name: string) => {
      const tradeState = tradeStates?.find((state) => state.saveName === name);
      if (tradeState === undefined) {
        return;
      }

      const {
        tickerName,
        tickerResolution,
        timezone,
        barIndex,
        tradingParameters,
        manualTradeActions,
      } = tradeState;

      const newSettings: ChartSettings = {
        ...settings,
        instrumentName: tickerName,
        resolution: tickerResolution,
        timezone: timezone as ChartTimezone,
      };
      onSettingsChange(newSettings);

      const newReplayPosition: BarReplayPosition = {
        barIndex,
        subBarIndex: 0,
      };
      onReplayPositionChange(newReplayPosition);

      setTradingParameters(tradingParameters);
      setManualTradeActions(manualTradeActions);
    },
    [onReplayPositionChange, onSettingsChange, settings, tradeStates],
  );

  const handleSaveTradeState = useCallback(
    (name: string) => {
      const { instrumentName, resolution, timezone } = settings;
      const { barIndex } = replayPosition;

      if (barIndex === undefined) {
        return;
      }

      const tradeState: TradeState = {
        userId: '1',
        saveName: name,
        tickerDataSource: TICKER_DATA_SOURCE,
        tickerName: instrumentName,
        tickerResolution: resolution,
        timezone,
        barIndex,
        tradingParameters,
        manualTradeActions,
      };
      saveTradeState(tradeState);
    },
    [
      manualTradeActions,
      replayPosition,
      saveTradeState,
      settings,
      tradingParameters,
    ],
  );

  const handleTradingInputsChange = useCallback((inputs: TradingInputs) => {
    setTradingParameters(inputs.params);
    setManualTradeActions(inputs.manualTradeActions);
  }, []);

  const appendManualTradeAction = useCallback(
    (action: ManualTradeActionAny) => {
      const { manualTradeActions } = tradingDataAndInputs.inputs;

      setManualTradeActions([...manualTradeActions, action]);
    },
    [tradingDataAndInputs],
  );

  const handleCreateOrder = useCallback(
    (order: OrderInputs) => {
      const { manualTradeActions } = tradingDataAndInputs.inputs;

      const id = getNextManualActionId(manualTradeActions);
      const newAction = createManualTradeActionOpen(
        order,
        id,
        barData,
        barIndex,
      );
      appendManualTradeAction(newAction);
    },
    [appendManualTradeAction, barData, barIndex, tradingDataAndInputs.inputs],
  );

  const handleCancelOrder = useCallback(
    (targetId: number) => {
      const { manualTradeActions } = tradingDataAndInputs.inputs;

      const id = getNextManualActionId(manualTradeActions);
      const newAction = createManualTradeActionCancelOrder(
        targetId,
        id,
        barData,
        barIndex,
      );
      appendManualTradeAction(newAction);
    },
    [appendManualTradeAction, barData, barIndex, tradingDataAndInputs.inputs],
  );

  const handleAmendOrder = useCallback(
    (data: AmendOrderData) => {
      const { manualTradeActions } = tradingDataAndInputs.inputs;

      const id = getNextManualActionId(manualTradeActions);
      const newAction = createManualTradeActionAmendOrder(
        data,
        id,
        barData,
        barIndex,
      );
      appendManualTradeAction(newAction);
    },
    [appendManualTradeAction, barData, barIndex, tradingDataAndInputs.inputs],
  );

  const handleAmendTrade = useCallback(
    (data: AmendTradeData) => {
      const { manualTradeActions } = tradingDataAndInputs.inputs;

      const id = getNextManualActionId(manualTradeActions);
      const newAction = createManualTradeActionAmendTrade(
        data,
        id,
        barData,
        barIndex,
      );
      appendManualTradeAction(newAction);
    },
    [appendManualTradeAction, barData, barIndex, tradingDataAndInputs.inputs],
  );

  const handleCloseTrade = useCallback(
    (targetId: number) => {
      const { manualTradeActions } = tradingDataAndInputs.inputs;

      const id = getNextManualActionId(manualTradeActions);
      const newAction = createManualTradeActionCloseTrade(
        targetId,
        id,
        barData,
        barIndex,
      );
      appendManualTradeAction(newAction);
    },
    [appendManualTradeAction, barData, barIndex, tradingDataAndInputs.inputs],
  );

  const handleProposedOrderChange = useCallback(
    (order: OrderInputs | undefined) => {
      if (order === undefined) {
        setProposedOrderTradeLines([]);
        return;
      }

      const newProposedOrderTradeLines = proposedOrderToTradeLines(
        tradingDataAndInputs,
        tradeState,
        order,
      );

      setProposedOrderTradeLines(newProposedOrderTradeLines);
    },
    [tradingDataAndInputs, tradeState],
  );

  const tabEntries = getTabEntries(
    tradeStates ?? [],
    handleSaveTradeState,
    handleLoadTradeState,
    tradingDataAndInputs,
    handleTradingInputsChange,
    tradeState,
    onReplayPositionChange,
    handleCreateOrder,
    handleCancelOrder,
    handleAmendOrder,
    handleCloseTrade,
    handleAmendTrade,
    handleProposedOrderChange,
  );

  return (
    <TabLayout
      entries={tabEntries}
      value={activeTab}
      onValueChange={setActiveTab}
    />
  );
}

function getTabEntries(
  tradeStates: readonly TradeState[],
  handleSaveTradeState: (name: string) => void,
  handleLoadTradeState: (name: string) => void,
  tradingDataAndInputs: TradingDataAndInputs,
  handleTradingInputsChange: (value: TradingInputs) => void,
  tradingState: TradeProcessState,
  handleReplayPositionChange: (value: BarReplayPosition) => void,
  handleCreateOrder: (order: OrderInputs) => void,
  handleCancelOrder: (id: number) => void,
  handleAmendOrder: (data: AmendOrderData) => void,
  handleCloseTrade: (id: number) => void,
  handleAmendTrade: (data: AmendTradeData) => void,
  handleProposedOrderChange: (order: OrderInputs | undefined) => void,
): readonly TabLayoutEntry<TradeTabValue>[] {
  return [
    {
      value: 'trading-inputs',
      tab: 'Inputs',
      content: (
        <TradingInputsContent
          tradeStates={tradeStates}
          onSaveTradeState={handleSaveTradeState}
          onLoadTradeState={handleLoadTradeState}
          dataAndInputs={tradingDataAndInputs}
          value={tradingDataAndInputs.inputs}
          onValueChange={handleTradingInputsChange}
        />
      ),
    },
    {
      value: 'trading-operations',
      tab: 'Trading',
      content: (
        <TradingOperationsContent
          dataAndInputs={tradingDataAndInputs}
          state={tradingState}
          onReplayPositionChange={handleReplayPositionChange}
          onCreateOrder={handleCreateOrder}
          onCancelOrder={handleCancelOrder}
          onAmendOrder={handleAmendOrder}
          onCloseTrade={handleCloseTrade}
          onAmendTrade={handleAmendTrade}
          onProposedOrderChange={handleProposedOrderChange}
        />
      ),
    },
    {
      value: 'trading-log',
      tab: 'Log',
      content: (
        <TradingLog dataAndInputs={tradingDataAndInputs} state={tradingState} />
      ),
    },
    {
      value: 'trading-results',
      tab: 'Results',
      content: (
        <TradingResultsContent
          tradingParams={tradingDataAndInputs.inputs.params}
          state={tradingState}
        />
      ),
    },
    {
      value: 'trading-debug',
      tab: 'Debug',
      content: (
        <TradingDebugDisplay
          dataAndInputs={tradingDataAndInputs}
          state={tradingState}
        />
      ),
    },
  ];
}

function getInitialTradeProcessState(
  dataAndInputs: TradingDataAndInputs,
): TradeProcessState {
  const { barData, barIndex, inputs } = dataAndInputs;
  const { params } = inputs;

  return {
    barData,
    barIndex,
    tradingParams: params,
    manualTradeActionsByBar: new Map(),
    activeOrders: [],
    activeTrades: [],
    completedTrades: [],
    tradeLog: [],
  };
}

function getInitialTradingParameters(
  instrument: Instrument,
): TradingParameters {
  const { precision, pipDigit, spread, minStopLoss } = instrument;

  return {
    ...DEFAULT_TRADING_PARAMS,
    priceDecimals: precision,
    pipDigit,
    spread,
    minStopLossDistance: minStopLoss,
  };
}
