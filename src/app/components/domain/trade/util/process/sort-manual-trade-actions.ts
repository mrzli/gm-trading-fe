import { invariant } from '@gmjs/assert';
import { applyFn } from '@gmjs/apply-function';
import { sort, toArray } from '@gmjs/value-transformers';
import { ManualTradeActionAny, ManualTradeActionKind } from '../../types';

export function sortManualTradeActions(
  actions: readonly ManualTradeActionAny[],
): readonly ManualTradeActionAny[] {
  return applyFn(
    actions,
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
    case 'close': {
      return 3;
    }
    case 'amend-order': {
      return 1;
    }
    case 'amend-trade': {
      return 2;
    }
    default: {
      invariant(false, `Unknown ManualTradeActionKind: '${kind}'.`);
    }
  }
}
