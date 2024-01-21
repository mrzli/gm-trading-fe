import { invariant } from '@gmjs/assert';
import { applyFn } from '@gmjs/apply-function';
import {
  filterWithGuard,
  groupBy,
  map,
  sort,
  toArray,
  toMap,
} from '@gmjs/value-transformers';
import { ManualTradeActionsByType } from '../../types';
import { Bars } from '../../../../types';
import { binarySearch } from '../../../../util';
import {
  ManualTradeActionAmendOrder,
  ManualTradeActionAmendTrade,
  ManualTradeActionAny,
  ManualTradeActionCancelOrder,
  ManualTradeActionCloseTrade,
  ManualTradeActionKind,
  ManualTradeActionOpen,
} from '@gmjs/gm-trading-shared';

export function groupManualTradeActionsByBar(
  actions: readonly ManualTradeActionAny[],
  bars: Bars,
): ReadonlyMap<number, readonly ManualTradeActionAny[]> {
  return applyFn(
    actions,
    groupBy((action) => getBarIndex(action, bars)),
    map(([key, value]) => [key, normalizeManualTradeActions(value)] as const),
    toMap(),
  );
}

export function getManualTradeActionsByType(
  actions: readonly ManualTradeActionAny[],
): ManualTradeActionsByType {
  const open = applyFn(
    actions,
    filterWithGuard(
      (action): action is ManualTradeActionOpen => action.kind === 'open',
    ),
    toArray(),
  );

  const amendOrder = applyFn(
    actions,
    filterWithGuard(
      (action): action is ManualTradeActionAmendOrder =>
        action.kind === 'amend-order',
    ),
    toArray(),
  );

  const amendTrade = applyFn(
    actions,
    filterWithGuard(
      (action): action is ManualTradeActionAmendTrade =>
        action.kind === 'amend-trade',
    ),
    toArray(),
  );

  const cancelOrder = applyFn(
    actions,
    filterWithGuard(
      (action): action is ManualTradeActionCancelOrder =>
        action.kind === 'cancel-order',
    ),
    toArray(),
  );

  const closeTrade = applyFn(
    actions,
    filterWithGuard(
      (action): action is ManualTradeActionCloseTrade =>
        action.kind === 'close-trade',
    ),
    toArray(),
  );

  return { open, amendOrder, cancelOrder, amendTrade, closeTrade };
}

function getBarIndex(action: ManualTradeActionAny, bars: Bars): number {
  return binarySearch(bars, action.time, (bar) => bar.time);
}

function normalizeManualTradeActions(
  actions: readonly ManualTradeActionAny[],
): readonly ManualTradeActionAny[] {
  return applyFn(
    actions,
    // (actions) => processCloseOrderActions(actions),
    // (actions) => processAmendOrders(actions),
    sort((a, b) => manualActionComparer(a, b)),
    toArray(),
  );
}

function manualActionComparer(
  a: ManualTradeActionAny,
  b: ManualTradeActionAny,
): number {
  const timeDiff = a.time - b.time;
  if (timeDiff !== 0) {
    return Math.sign(timeDiff);
  }

  const kindDiff =
    getManualActionKindOrder(a.kind) - getManualActionKindOrder(b.kind);
  return Math.sign(kindDiff);
}

function getManualActionKindOrder(kind: ManualTradeActionKind): number {
  switch (kind) {
    case 'open': {
      return 0;
    }
    case 'amend-order': {
      return 1;
    }
    case 'cancel-order': {
      return 2;
    }
    case 'amend-trade': {
      return 3;
    }
    case 'close-trade': {
      return 4;
    }
    default: {
      invariant(false, `Unknown ManualTradeActionKind: '${kind}'.`);
    }
  }
}
