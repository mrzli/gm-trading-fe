import { TradeLine } from '../../../../types';
import {
  OrderInputs,
  TradeProcessState,
  TradingDataAndInputs,
} from '../../types';
import { pipAdjust } from '../pip-adjust';

const PROPOSED_ORDER_TRAD_LINE_LENGTH = 5;

export function proposedOrderToTradeLines(
  tradingDataAndInputs: TradingDataAndInputs,
  state: TradeProcessState,
  order: OrderInputs,
): readonly TradeLine[] {
  const { replayPosition } = tradingDataAndInputs;
  const { barIndex: visualBarIndex } = replayPosition;
  if (visualBarIndex === undefined) {
    return [];
  }

  const { barData, barIndex, tradingParams } = state;
  const { pipDigit, spread: pointSpread } = tradingParams;
  const spread = pipAdjust(pointSpread, pipDigit);

  const halfSpread = spread / 2;

  const { price, direction, limitDistance, stopLossDistance } = order;

  const lines: TradeLine[] = [];

  const startBarIndex = visualBarIndex;
  const endBarIndex = startBarIndex + PROPOSED_ORDER_TRAD_LINE_LENGTH;

  const isBuy = direction === 'buy';
  const marketPrice = barData[barIndex].open;
  const executionPrice = getPriceForLine(price, marketPrice, isBuy, halfSpread);

  const priceExecutionLine: TradeLine = {
    startIndex: startBarIndex,
    endIndex: endBarIndex,
    price: executionPrice,
    source: 'proposed-order',
    direction: isBuy ? 'buy' : 'sell',
    representation: 'price',
    offset: 'execution',
  };
  lines.push(priceExecutionLine);

  const priceMidLine: TradeLine = {
    startIndex: startBarIndex,
    endIndex: endBarIndex,
    price: executionPrice - (isBuy ? halfSpread : -halfSpread),
    source: 'proposed-order',
    direction: isBuy ? 'buy' : 'sell',
    representation: 'price',
    offset: 'mid',
  };
  lines.push(priceMidLine);

  if (limitDistance !== undefined) {
    const limitExecutionPrice =
      executionPrice + (isBuy ? limitDistance : -limitDistance);

    const limitExecutionLine: TradeLine = {
      startIndex: startBarIndex,
      endIndex: endBarIndex,
      price: limitExecutionPrice,
      source: 'proposed-order',
      direction: isBuy ? 'buy' : 'sell',
      representation: 'limit',
      offset: 'execution',
    };
    lines.push(limitExecutionLine);

    const limitMidLine: TradeLine = {
      startIndex: startBarIndex,
      endIndex: endBarIndex,
      price: limitExecutionPrice + (isBuy ? halfSpread : -halfSpread),
      source: 'proposed-order',
      direction: isBuy ? 'buy' : 'sell',
      representation: 'limit',
      offset: 'mid',
    };
    lines.push(limitMidLine);
  }

  if (stopLossDistance !== undefined) {
    const stopLossPrice =
      executionPrice - (isBuy ? stopLossDistance : -stopLossDistance);

    const stopLossExecutionLine: TradeLine = {
      startIndex: startBarIndex,
      endIndex: endBarIndex,
      price: stopLossPrice,
      source: 'proposed-order',
      direction: isBuy ? 'buy' : 'sell',
      representation: 'stop-loss',
      offset: 'execution',
    };
    lines.push(stopLossExecutionLine);

    const stopLossMidLine: TradeLine = {
      startIndex: startBarIndex,
      endIndex: endBarIndex,
      price: stopLossPrice + (isBuy ? halfSpread : -halfSpread),
      source: 'proposed-order',
      direction: isBuy ? 'buy' : 'sell',
      representation: 'stop-loss',
      offset: 'mid',
    };
    lines.push(stopLossMidLine);
  }

  return lines;
}

function getPriceForLine(
  specifiedPrice: number | undefined,
  marketPrice: number,
  isBuy: boolean,
  halfSpread: number,
): number {
  return specifiedPrice === undefined
    ? marketPrice + (isBuy ? halfSpread : -halfSpread)
    : specifiedPrice;
}
