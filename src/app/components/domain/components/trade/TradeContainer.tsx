import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TabLayout, TabLayoutEntry } from '../../../shared';
import {
  AmendOrderData,
  AmendTradeData,
  ManualTradeActionAny,
  OrderInputs,
  TradeProcessState,
  TradeTabValue,
  TradingDataAndInputs,
  TradingInputs,
  TradingParameters,
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
} from './util';
import { BarReplayPosition, Bars, ChartSettings } from '../../types';
import { FullBarData } from '../ticker-data-container/types';
import { Instrument } from '@gmjs/gm-trading-shared';

export interface TradeContainerProps {
  readonly settings: ChartSettings;
  readonly instrument: Instrument;
  readonly fullData: FullBarData;
  readonly replayPosition: BarReplayPosition;
  readonly onReplayPositionChange: (value: BarReplayPosition) => void;
}

export function TradeContainer({
  settings,
  instrument,
  fullData,
  replayPosition,
  onReplayPositionChange,
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
    setTradingDataAndInputs((prev) => ({
      ...prev,
      inputs: {
        ...prev.inputs,
        params: getInitialTradingParameters(instrument),
      },
    }))}, [instrument]);

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

  const [tradeState, setTradeState] = useState<TradeProcessState>(
    getInitialTradeProcessState(tradingDataAndInputs),
  );

  useEffect(() => {
    const state = processTradeSequence(tradingDataAndInputs);
    setTradeState(state);
  }, [tradingDataAndInputs]);

  const tabEntries = useMemo(
    () =>
      getTabEntries(
        tradingDataAndInputs,
        handleTradingInputsChange,
        tradeState,
        onReplayPositionChange,
        handleCreateOrder,
        handleCancelOrder,
        handleAmendOrder,
        handleCloseTrade,
        handleAmendTrade,
      ),
    [
      handleAmendOrder,
      handleAmendTrade,
      handleCancelOrder,
      handleCloseTrade,
      handleCreateOrder,
      handleTradingInputsChange,
      onReplayPositionChange,
      tradeState,
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
  tradingDataAndInputs: TradingDataAndInputs,
  handleTradingInputsChange: (value: TradingInputs) => void,
  tradingState: TradeProcessState,
  handleReplayPositionChange: (value: BarReplayPosition) => void,
  handleCreateOrder: (order: OrderInputs) => void,
  handleCancelOrder: (id: number) => void,
  handleAmendOrder: (data: AmendOrderData) => void,
  handleCloseTrade: (id: number) => void,
  handleAmendTrade: (data: AmendTradeData) => void,
): readonly TabLayoutEntry<TradeTabValue>[] {
  const timezone = tradingDataAndInputs.settings.timezone;

  return [
    {
      value: 'trading-inputs',
      tab: 'Inputs',
      content: (
        <TradingInputsContent
          timezone={timezone}
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
        />
      ),
    },
    {
      value: 'trading-log',
      tab: 'Log',
      content: <TradingLog />,
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
