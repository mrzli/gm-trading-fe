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
import {
  ManualTradeActionAmendOrder,
  ManualTradeActionAmendTrade,
  ManualTradeActionAny,
  ManualTradeActionCancelOrder,
  ManualTradeActionCloseTrade,
  ManualTradeActionKind,
  ManualTradeActionOpen,
  ManualTradeActionsByType,
} from '../../types';
import { Bars } from '../../../../types';
import { binarySearch } from '../../../../util';

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

// // if order is closed in the same bar it was opened, remove everything related to that order
// function processCloseOrderActions(
//   actions: readonly ManualTradeActionAny[],
// ): readonly ManualTradeActionAny[] {
//   const openActionIds = applyFn(
//     actions,
//     filterWithGuard(
//       (action): action is ManualTradeActionOpen => action.kind === 'open',
//     ),
//     map((action) => action.id),
//     toSet(),
//   );

//   new Set(actions.map((action) => action.id));

//   // find all close actions which have a corresponding open action in this set
//   const isCloseActionWithOpenInSet = (
//     action: ManualTradeActionAny,
//   ): action is ManualTradeActionClose => {
//     return action.kind === 'close' && openActionIds.has(action.targetId);
//   };

//   const actionsToRemove = applyFn(
//     actions,
//     filterWithGuard(isCloseActionWithOpenInSet),
//     map((action) => action.targetId),
//     toSet(),
//   );

//   // if an open and close action are in the same bar
//   // - remove the open action
//   // - remove any amend order action that targets the open action
//   // - remove the close action that targets the open action
//   const isActionToRemove = (action: ManualTradeActionAny): boolean => {
//     if (action.kind === 'open') {
//       return actionsToRemove.has(action.id);
//     }

//     if (action.kind === 'amend-order') {
//       return actionsToRemove.has(action.targetId);
//     }

//     if (action.kind === 'close') {
//       return actionsToRemove.has(action.targetId);
//     }

//     return false;
//   };

//   return actions.filter((action) => !isActionToRemove(action));
// }

// // reduce amend order actions to the last one
// // if the open action is in the same bar, merge the amend order action into the open action
// function processAmendOrders(
//   actions: readonly ManualTradeActionAny[],
// ): readonly ManualTradeActionAny[] {
//   const openActions = applyFn(
//     actions,
//     filterWithGuard(
//       (action): action is ManualTradeActionOpen => action.kind === 'open',
//     ),
//     toArray(),
//   );

//   const closeActions = applyFn(
//     actions,
//     filterWithGuard(
//       (action): action is ManualTradeActionClose => action.kind === 'close',
//     ),
//     toArray(),
//   );

//   const amendOrderActions = applyFn(
//     actions,
//     filterWithGuard(
//       (action): action is ManualTradeActionAmendOrder =>
//         action.kind === 'amend-order',
//     ),
//     toArray(),
//   );

//   const amendTradeActions = applyFn(
//     actions,
//     filterWithGuard(
//       (action): action is ManualTradeActionAmendTrade =>
//         action.kind === 'amend-trade',
//     ),
//     toArray(),
//   );

//   const groupedAmendOrderActions = applyFn(
//     amendOrderActions,
//     groupBy((action) => action.targetId),
//     map(([key, value]) => [key, value.at(-1)!] as const),
//     toMap(),
//   );

//   const updatedOpenActions = applyFn(
//     openActions,
//     map((action) => {
//       const amendOrderAction = groupedAmendOrderActions.get(action.id);
//       if (!amendOrderAction) {
//         return action;
//       }

//       const { price, amount, stopLossDistance, limitDistance } =
//         amendOrderAction;

//       return {
//         ...action,
//         price,
//         amount,
//         stopLossDistance,
//         limitDistance,
//       };
//     }),
//   );

//   const openActionIds = applyFn(
//     openActions,
//     map((action) => action.id),
//     toSet(),
//   );

//   const updatedAmendOrderActions = applyFn(
//     groupedAmendOrderActions,
//     values(),
//     // if open action is here, amend order is merged into open actions, so not needed here
//     filter((action) => !openActionIds.has(action.targetId)),
//     toArray(),
//   );

//   return [
//     ...updatedOpenActions,
//     ...updatedAmendOrderActions,
//     ...amendTradeActions,
//     ...closeActions,
//   ];
// }
