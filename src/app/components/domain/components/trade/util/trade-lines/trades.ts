import { invariant } from '@gmjs/assert';
import { applyFn } from '@gmjs/apply-function';
import {
  filterWithGuard,
  groupBy,
  map,
  sort,
  toArray,
  values,
} from '@gmjs/value-transformers';
import {
  TradeLogEntryFillOrder,
  TradeLogEntryAmendTrade,
  TradeLogEntryCloseTrade,
  TradeLogEntryStopLoss,
  TradeLogEntryLimit,
  TradeLogEntryKind,
  TradeLogEntryAny,
} from '../../types';
import { TradeLine } from '../../../../types';
import { pipAdjust } from '@gmjs/gm-trading-shared';

type TradeLogEntryForTrade =
  | TradeLogEntryFillOrder
  | TradeLogEntryAmendTrade
  | TradeLogEntryCloseTrade
  | TradeLogEntryStopLoss
  | TradeLogEntryLimit;

const TRADE_ENTRIES: ReadonlySet<TradeLogEntryKind> = new Set<
  TradeLogEntryForTrade['kind']
>(['fill-order', 'amend-trade', 'close-trade', 'stop-loss', 'limit']);

interface TradeLineTradeData {
  readonly create: TradeLogEntryFillOrder;
  readonly amend: readonly TradeLogEntryAmendTrade[];
  readonly finalization:
    | TradeLogEntryCloseTrade
    | TradeLogEntryStopLoss
    | TradeLogEntryLimit
    | undefined;
}

export function getTradeTradeLines(
  tradeLog: readonly TradeLogEntryAny[],
  barIndex: number,
  pipDigit: number,
  pointSpread: number,
): readonly TradeLine[] {
  const spread = pipAdjust(pointSpread, pipDigit);

  const trades = getTradeLineTradeData(tradeLog);
  const halfSpread = spread / 2;
  return trades.flatMap((trade) =>
    tradeToTradeLines(trade, barIndex, halfSpread),
  );
}

function getTradeLineTradeData(
  tradeLog: readonly TradeLogEntryAny[],
): readonly TradeLineTradeData[] {
  const result = applyFn(
    tradeLog,
    filterWithGuard((entry): entry is TradeLogEntryForTrade =>
      TRADE_ENTRIES.has(entry.kind),
    ),
    groupBy((entry) => entry.tradeId),
    values(),
    map((entries) => createTradeLineTradeDataItem(entries)),
    toArray(),
  );

  return result;
}

function createTradeLineTradeDataItem(
  entries: readonly TradeLogEntryForTrade[],
): TradeLineTradeData {
  invariant(entries.length > 0, 'No entries for trade.');
  const tradeId = entries[0].tradeId;

  const create = entries.filter(
    (entry): entry is TradeLogEntryFillOrder => entry.kind === 'fill-order',
  );
  invariant(
    create.length === 1,
    create.length === 0
      ? `Missing 'fill-order' entry for trade: ${tradeId}.`
      : `Multiple 'fill-order' entries for trade: ${tradeId}.`,
  );

  const amend = applyFn(
    entries,
    filterWithGuard(
      (entry): entry is TradeLogEntryAmendTrade => entry.kind === 'amend-trade',
    ),
    sort((a, b) => a.time - b.time),
    toArray(),
  );
  if (amend.length > 0) {
    invariant(
      amend[0].time >= create[0].time,
      `First 'amend-trade' entry must be after 'fill-order' entry for trade: ${tradeId}.`,
    );
  }

  const finalization = entries.filter(
    (
      entry,
    ): entry is
      | TradeLogEntryCloseTrade
      | TradeLogEntryStopLoss
      | TradeLogEntryLimit =>
      entry.kind === 'close-trade' ||
      entry.kind === 'stop-loss' ||
      entry.kind === 'limit',
  );
  invariant(
    finalization.length <= 1,
    `Expected at most one of 'close-trade'/'stop-loss'/'limit' entry for trade: ${tradeId}.`,
  );
  if (finalization.length > 0) {
    invariant(
      finalization[0].time >=
        (amend.length > 0 ? amend.at(-1)!.time : create[0].time),
      `'close-trade'/'stop-loss'/'limit' entry must be after 'fill-order' entry and any 'amend-trade' entries for trade: ${tradeId}.`,
    );
  }

  return {
    create: create[0],
    amend,
    finalization: finalization.length > 0 ? finalization[0] : undefined,
  };
}

function tradeToTradeLines(
  trade: TradeLineTradeData,
  barIndex: number,
  halfSpread: number,
): readonly TradeLine[] {
  const { create, amend, finalization } = trade;

  const nonTerminalEntries: readonly (
    | TradeLogEntryFillOrder
    | TradeLogEntryAmendTrade
  )[] = [create, ...amend];

  const lines: TradeLine[] = [];

  const price = create.price;
  const isBuy = create.amount > 0;

  for (let i = 1; i < nonTerminalEntries.length; i++) {
    const lineStartEntry = nonTerminalEntries[i - 1];
    const lineEndEntry = nonTerminalEntries[i];

    const linesForSection = getTradeSectionTradeLines(
      lineStartEntry,
      price,
      isBuy,
      lineEndEntry.barIndex,
      halfSpread,
    );

    lines.push(...linesForSection);
  }

  const lastNontTerminalEntry = nonTerminalEntries.at(-1)!;
  const linesForLastSection = getTradeSectionTradeLines(
    lastNontTerminalEntry,
    price,
    isBuy,
    finalization === undefined ? barIndex : finalization.barIndex,
    halfSpread,
  );
  lines.push(...linesForLastSection);

  return lines;
}

function getTradeSectionTradeLines(
  lineStartEntry: TradeLogEntryFillOrder | TradeLogEntryAmendTrade,
  price: number,
  isBuy: boolean,
  endBarIndex: number,
  halfSpread: number,
): readonly TradeLine[] {
  const { barIndex: startBarIndex, limit, stopLoss } = lineStartEntry;

  const lines: TradeLine[] = [];

  const priceExecutionLine: TradeLine = {
    startIndex: startBarIndex,
    endIndex: endBarIndex,
    price,
    source: 'trade',
    direction: isBuy ? 'buy' : 'sell',
    representation: 'price',
    offset: 'execution',
  };
  lines.push(priceExecutionLine);

  const priceMidLine: TradeLine = {
    startIndex: startBarIndex,
    endIndex: endBarIndex,
    price: price - (isBuy ? halfSpread : -halfSpread),
    source: 'trade',
    direction: isBuy ? 'buy' : 'sell',
    representation: 'price',
    offset: 'mid',
  };
  lines.push(priceMidLine);

  if (limit !== undefined) {
    const limitExecutionLine: TradeLine = {
      startIndex: startBarIndex,
      endIndex: endBarIndex,
      price: limit,
      source: 'trade',
      direction: isBuy ? 'buy' : 'sell',
      representation: 'limit',
      offset: 'execution',
    };
    lines.push(limitExecutionLine);

    const limitMidLine: TradeLine = {
      startIndex: startBarIndex,
      endIndex: endBarIndex,
      price: limit + (isBuy ? halfSpread : -halfSpread),
      source: 'trade',
      direction: isBuy ? 'buy' : 'sell',
      representation: 'limit',
      offset: 'mid',
    };
    lines.push(limitMidLine);
  }

  if (stopLoss !== undefined) {
    const stopLossExecutionLine: TradeLine = {
      startIndex: startBarIndex,
      endIndex: endBarIndex,
      price: stopLoss,
      source: 'trade',
      direction: isBuy ? 'buy' : 'sell',
      representation: 'stop-loss',
      offset: 'execution',
    };
    lines.push(stopLossExecutionLine);

    const stopLossMidLine: TradeLine = {
      startIndex: startBarIndex,
      endIndex: endBarIndex,
      price: stopLoss + (isBuy ? halfSpread : -halfSpread),
      source: 'trade',
      direction: isBuy ? 'buy' : 'sell',
      representation: 'stop-loss',
      offset: 'mid',
    };
    lines.push(stopLossMidLine);
  }

  return lines;
}
