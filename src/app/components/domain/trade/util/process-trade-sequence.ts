import { applyFn } from '@gmjs/apply-function';
import { compose } from '@gmjs/compose-function';
import { TickerDataRows } from '../../../../types';
import {
  ManualTradeActionAny,
  ManualTradeActionKind,
  TradeResult,
  TradingDataAndInputs,
} from '../types';
import { sort, toArray } from '@gmjs/value-transformers';
import { invariant } from '@gmjs/assert';

export function processTradeSequence(input: TradingDataAndInputs): TradeResult {
  const { chartData, inputs } = input;
  const { barData, barIndex } = chartData;
  const { params, manualTradeActions } = inputs;
  const {
    initialBalance,
    spread,
    marginPercent,
    avgSlippage,
    pipDigit,
    minStopLossDistance,
  } = params;

  // const actionsMap = applyFn(value, compose(transformer))

  return {};
}

function sortManualTradeActions(
  actions: readonly ManualTradeActionAny[],
): readonly ManualTradeActionAny[] {
  return applyFn(
    actions,
    compose(
      sort((a, b) => manualActionComparer(a, b)),
      toArray(),
    ),
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

// function processBar(index: number, remainingActions: readonly ManualTradeActionAny[]
