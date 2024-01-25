import React from 'react';
import {
  CreateOrderLimitOrMarket,
  CreateOrderStateAny,
} from '../../ticker-data-container/types';
import { TradeDirection } from '../../trade/types';
import { PRECISION_POINT } from '../../../util';

export interface TwCreateOrderStateDisplayProps {
  readonly state: CreateOrderStateAny;
  readonly precision: number;
}

export function TwCreateOrderStateDisplay({
  state,
  precision,
}: TwCreateOrderStateDisplayProps): React.ReactElement {
  const content = getContent(state, precision);

  return (
    <div className='inline-flex flex-row gap-1 px-1 bg-slate-100/40 border border-slate-300 rounded'>
      {content}
    </div>
  );
}

function getContent(
  state: CreateOrderStateAny,
  precision: number,
): React.ReactNode {
  switch (state.type) {
    case 'start': {
      return <div>Start</div>;
    }
    case 'direction': {
      return getElements(
        precision,
        state.limitOrMarket,
        UNSPECIFIED,
        UNSPECIFIED,
        UNSPECIFIED,
        UNSPECIFIED,
      );
    }
    case 'price': {
      return getElements(
        precision,
        state.limitOrMarket,
        state.direction,
        UNSPECIFIED,
        UNSPECIFIED,
        UNSPECIFIED,
      );
    }
    case 'stop-loss': {
      return getElements(
        precision,
        state.limitOrMarket,
        state.direction,
        state.price,
        UNSPECIFIED,
        UNSPECIFIED,
      );
    }
    case 'limit': {
      return getElements(
        precision,
        state.limitOrMarket,
        state.direction,
        state.price,
        state.stopLossDistance,
        UNSPECIFIED,
      );
    }
    case 'finish': {
      return getElements(
        precision,
        state.limitOrMarket,
        state.direction,
        state.price,
        state.stopLossDistance,
        state.limitDistance,
      );
    }
  }
}

type Unspecified = '<unspecified>';

const UNSPECIFIED: Unspecified = '<unspecified>';

function getElements(
  precision: number,
  limitOrMarket: CreateOrderLimitOrMarket,
  direction: TradeDirection | Unspecified,
  price: number | undefined | Unspecified,
  stopLossDistance: number | undefined | Unspecified,
  limitDistance: number | undefined | Unspecified,
): React.ReactNode {
  return (
    <div className='inline-flex flex-row gap-1'>
      <div>{display(limitOrMarket, (v) => (v === 'limit' ? 'L' : 'M'))}</div>
      <div>{display(direction, (v) => (v === 'buy' ? 'B' : 'S'))}</div>
      <div>{display(price, (v) => v.toFixed(precision))}</div>
      <div>{display(stopLossDistance, (v) => v.toFixed(PRECISION_POINT))}</div>
      <div>{display(limitDistance, (v) => v.toFixed(PRECISION_POINT))}</div>
    </div>
  );
}

function display<T>(
  value: T | Unspecified,
  stringMapper: (value: NonNullable<T>) => string,
): string {
  return value === UNSPECIFIED
    ? '?'
    : value === undefined || value === null
      ? '-'
      : stringMapper(value);
}
