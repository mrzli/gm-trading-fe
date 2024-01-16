import { applyFn } from '@gmjs/apply-function';
import { invariant } from '@gmjs/assert';
import {
  filterWithGuard,
  groupBy,
  values,
  toArray,
  sort,
  map,
} from '@gmjs/value-transformers';
import {
  TradeLogEntryCreateOrder,
  TradeLogEntryAmendOrder,
  TradeLogEntryCancelOrder,
  TradeLogEntryFillOrder,
  TradeLogEntryKind,
  TradeLogEntryAny,
} from '../../types';
import { TradeLine } from '../../../../types';

type TradeLogEntryForOrder =
  | TradeLogEntryCreateOrder
  | TradeLogEntryAmendOrder
  | TradeLogEntryCancelOrder
  | TradeLogEntryFillOrder;

const ORDER_ENTRIES: ReadonlySet<TradeLogEntryKind> = new Set<
  TradeLogEntryForOrder['kind']
>(['create-order', 'amend-order', 'cancel-order', 'fill-order']);

interface TradeLineOrderData {
  readonly create: TradeLogEntryCreateOrder;
  readonly amend: readonly TradeLogEntryAmendOrder[];
  readonly finalization:
    | TradeLogEntryCancelOrder
    | TradeLogEntryFillOrder
    | undefined;
}

export function getOrderTradeLines(
  tradeLog: readonly TradeLogEntryAny[],
  barIndex: number,
  spread: number,
): readonly TradeLine[] {
  const orders = getTradeLineOrderData(tradeLog);
  const halfSpread = spread / 2;
  return orders.flatMap((order) =>
    orderToTradeLines(order, barIndex, halfSpread),
  );
}

function getTradeLineOrderData(
  tradeLog: readonly TradeLogEntryAny[],
): readonly TradeLineOrderData[] {
  const result = applyFn(
    tradeLog,
    filterWithGuard((entry): entry is TradeLogEntryForOrder =>
      ORDER_ENTRIES.has(entry.kind),
    ),
    groupBy((entry) => entry.orderId),
    values(),
    map((entries) => createTradeLineOrderDataItem(entries)),
    toArray(),
  );

  return result;
}

function createTradeLineOrderDataItem(
  entries: readonly TradeLogEntryForOrder[],
): TradeLineOrderData {
  invariant(entries.length > 0, 'No entries for order.');
  const orderId = entries[0].orderId;

  const create = entries.filter(
    (entry): entry is TradeLogEntryCreateOrder => entry.kind === 'create-order',
  );
  invariant(
    create.length === 1,
    create.length === 0
      ? `Missing 'create-order' entry for order: ${orderId}.`
      : `Multiple 'create-order' entries for order: ${orderId}.`,
  );

  const amend = applyFn(
    entries,
    filterWithGuard(
      (entry): entry is TradeLogEntryAmendOrder => entry.kind === 'amend-order',
    ),
    sort((a, b) => a.time - b.time),
    toArray(),
  );
  if (amend.length > 0) {
    invariant(
      amend[0].time >= create[0].time,
      `First 'amend-order' entry must be after 'create-order' entry for order: ${orderId}.`,
    );
  }

  const finalization = entries.filter(
    (entry): entry is TradeLogEntryCancelOrder | TradeLogEntryFillOrder =>
      entry.kind === 'cancel-order' || entry.kind === 'fill-order',
  );
  invariant(
    finalization.length <= 1,
    `Expected at most one of 'cancel-order'/'fill-order' entry for order: ${orderId}.`,
  );
  if (finalization.length > 0) {
    invariant(
      finalization[0].time >=
        (amend.length > 0 ? amend.at(-1)!.time : create[0].time),
      `'cancel-order'/'fill-order' entry must be after 'create-order' entry and any 'amend-order' entries for order: ${orderId}.`,
    );
  }

  return {
    create: create[0],
    amend,
    finalization: finalization.length > 0 ? finalization[0] : undefined,
  };
}

function orderToTradeLines(
  order: TradeLineOrderData,
  barIndex: number,
  halfSpread: number,
): readonly TradeLine[] {
  const { create, amend, finalization } = order;

  const nonTerminalEntries: readonly (
    | TradeLogEntryCreateOrder
    | TradeLogEntryAmendOrder
  )[] = [create, ...amend];

  const lines: TradeLine[] = [];
  for (let i = 1; i < nonTerminalEntries.length; i++) {
    const lineStartEntry = nonTerminalEntries[i - 1];
    const lineEndEntry = nonTerminalEntries[i];

    const linesForSection = getOrderSectionTradeLines(
      lineStartEntry,
      lineEndEntry.barIndex,
      halfSpread,
    );

    lines.push(...linesForSection);
  }

  const lastNontTerminalEntry = nonTerminalEntries.at(-1)!;
  const linesForLastSection = getOrderSectionTradeLines(
    lastNontTerminalEntry,
    finalization === undefined ? barIndex : finalization.barIndex,
    halfSpread,
  );
  lines.push(...linesForLastSection);

  return lines;
}

function getOrderSectionTradeLines(
  lineStartEntry: TradeLogEntryCreateOrder | TradeLogEntryAmendOrder,
  endBarIndex: number,
  halfSpread: number,
): readonly TradeLine[] {
  const {
    barIndex: startBarIndex,
    amount,
    limitDistance,
    stopLossDistance,
  } = lineStartEntry;

  const lines: TradeLine[] = [];

  const isBuy = amount > 0;
  const executionPrice = getPriceForLine(lineStartEntry, isBuy, halfSpread);

  const priceExecutionLine: TradeLine = {
    startIndex: startBarIndex,
    endIndex: endBarIndex,
    price: executionPrice,
    source: 'order',
    direction: isBuy ? 'buy' : 'sell',
    representation: 'price',
    offset: 'execution',
  };
  lines.push(priceExecutionLine);

  const priceMidLine: TradeLine = {
    startIndex: startBarIndex,
    endIndex: endBarIndex,
    price: executionPrice - (isBuy ? halfSpread : -halfSpread),
    source: 'order',
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
      source: 'order',
      direction: isBuy ? 'buy' : 'sell',
      representation: 'limit',
      offset: 'execution',
    };
    lines.push(limitExecutionLine);

    const limitMidLine: TradeLine = {
      startIndex: startBarIndex,
      endIndex: endBarIndex,
      price: limitExecutionPrice + (isBuy ? halfSpread : -halfSpread),
      source: 'order',
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
      source: 'order',
      direction: isBuy ? 'buy' : 'sell',
      representation: 'stop-loss',
      offset: 'execution',
    };
    lines.push(stopLossExecutionLine);

    const stopLossMidLine: TradeLine = {
      startIndex: startBarIndex,
      endIndex: endBarIndex,
      price: stopLossPrice + (isBuy ? halfSpread : -halfSpread),
      source: 'order',
      direction: isBuy ? 'buy' : 'sell',
      representation: 'stop-loss',
      offset: 'mid',
    };
    lines.push(stopLossMidLine);
  }

  return lines;
}

function getPriceForLine(
  entry: TradeLogEntryCreateOrder | TradeLogEntryAmendOrder,
  isBuy: boolean,
  halfSpread: number,
): number {
  return entry.price === undefined
    ? entry.marketPrice + (isBuy ? halfSpread : -halfSpread)
    : entry.price;
}
