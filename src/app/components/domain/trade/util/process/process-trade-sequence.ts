import { TradeProcessState, TradingDataAndInputs } from '../../types';
import { sortManualTradeActions } from './sort-manual-trade-actions';
import { processManualTradeActions } from './process-manual-trade-actions';

export function processTradeSequence(
  input: TradingDataAndInputs,
): TradeProcessState {
  const barIndex = input.chartData.barIndex;

  // const actionsMap = applyFn(
  //   manualTradeActions,
  //   toMapBy((item) => item.id),
  // );

  let tradeProcessState = getInitialTradeProcessState(input);

  for (let i = 1; i < barIndex; i++) {
    tradeProcessState = processBar(tradeProcessState, i);
  }

  return tradeProcessState;
}

function getInitialTradeProcessState(
  input: TradingDataAndInputs,
): TradeProcessState {
  const { chartData, inputs } = input;
  const { barData, barIndex } = chartData;
  const { manualTradeActions } = inputs;

  const remainingTradeActions = sortManualTradeActions(manualTradeActions);

  return {
    barData,
    barIndex,
    remainingTradeActions,
    tradeResult: {},
  };
}

function processBar(
  state: TradeProcessState,
  index: number,
): TradeProcessState {
  let currentState = state;

  currentState = processManualTradeActions(currentState, index);

  return currentState;
}
