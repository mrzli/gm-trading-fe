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
import { BarReplayPosition, Bars, ChartSettings, TradeLine } from '../../types';
import { FullBarData } from '../ticker-data-container/types';

export interface TradeContainerProps {
  readonly tradeStates: readonly TradeState[];
  readonly onSaveTradeState: (tradeState: TradeState) => void;
  readonly settings: ChartSettings;
  readonly instrument: Instrument;
  readonly fullData: FullBarData;
  readonly replayPosition: BarReplayPosition;
  readonly onReplayPositionChange: (value: BarReplayPosition) => void;
  readonly onTradeLinesChange: (tradeLines: readonly TradeLine[]) => void;
}

export function TradeContainer({
  tradeStates,
  onSaveTradeState,
  settings,
  instrument,
  fullData,
  replayPosition,
  onReplayPositionChange,
  onTradeLinesChange,
}: TradeContainerProps): React.ReactElement {
  const [activeTab, setActiveTab] = useState<TradeTabValue>('trading-inputs');

  const barData = useMemo<Bars>(
    () => flattenGroupedBars(fullData.subBars),
    [fullData],
  );

  const barIndex = useMemo<number>(
    () => getTradeDataBarIndex(fullData, replayPosition),
    [fullData, replayPosition],
  );

  const [tradingDataAndInputs, setTradingDataAndInputs] =
    useState<TradingDataAndInputs>(
      getInitialTradingDataAndInputs(
        settings,
        instrument,
        fullData,
        replayPosition,
        barData,
        barIndex,
      ),
    );

  const [tradeLines, setTradeLines] = useState<readonly TradeLine[]>([]);
  const [proposedOrderTradeLines, setProposedOrderTradeLines] = useState<
    readonly TradeLine[]
  >([]);

  const [tradeState, setTradeState] = useState<TradeProcessState>(
    getInitialTradeProcessState(tradingDataAndInputs),
  );

  // reset data when instrument changes
  useEffect(
    () => {
      const dataAndInputs = getInitialTradingDataAndInputs(
        settings,
        instrument,
        fullData,
        replayPosition,
        barData,
        barIndex,
      );
      setTradingDataAndInputs(dataAndInputs);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [instrument],
  );

  useEffect(() => {
    setTradingDataAndInputs((prev) => ({
      ...prev,
      settings,
      fullData,
      replayPosition,
      barData,
      barIndex,
    }));
  }, [settings, fullData, replayPosition, barData, barIndex]);

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

  const handleTradingInputsChange = useCallback(
    (inputs: TradingInputs) => {
      setTradingDataAndInputs((prev) => ({ ...prev, inputs }));
    },
    [setTradingDataAndInputs],
  );

  const appendManualTradeAction = useCallback(
    (action: ManualTradeActionAny) => {
      const { manualTradeActions } = tradingDataAndInputs.inputs;

      setTradingDataAndInputs({
        ...tradingDataAndInputs,
        inputs: {
          ...tradingDataAndInputs.inputs,
          manualTradeActions: [...manualTradeActions, action],
        },
      });
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

  const tabEntries = useMemo(
    () =>
      getTabEntries(
        tradeStates,
        onSaveTradeState,
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
      ),
    [
      handleAmendOrder,
      handleAmendTrade,
      handleCancelOrder,
      handleCloseTrade,
      handleCreateOrder,
      handleProposedOrderChange,
      handleTradingInputsChange,
      onReplayPositionChange,
      onSaveTradeState,
      tradeState,
      tradeStates,
      tradingDataAndInputs,
    ],
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
  handleSaveTradeState: (tradeState: TradeState) => void,
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

function getInitialTradingDataAndInputs(
  settings: ChartSettings,
  instrument: Instrument,
  fullData: FullBarData,
  replayPosition: BarReplayPosition,
  barData: Bars,
  barIndex: number,
): TradingDataAndInputs {
  return {
    settings,
    instrument,
    fullData,
    replayPosition,
    barData,
    barIndex,
    inputs: {
      params: getInitialTradingParameters(instrument),
      manualTradeActions: [],
    },
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
