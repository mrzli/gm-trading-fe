import React, { useCallback } from 'react';
import { CreateOrderForm } from './CreateOrderForm';
import { OrderInputs } from '../../types/trade/trade/order-inputs';
import { ActiveOrderList } from './ActiveOrderList';
import { ActiveTradeList } from './ActiveTradeList';
import { CompletedTradeList } from './CompletedTradeList';
import { TradeProcessState } from '../../types';
import { TwChartTimezone } from '../../../tw-chart/types';

export interface TradingOperationsContentProps {
  readonly timezone: TwChartTimezone;
  readonly state: TradeProcessState;
  readonly onCreateOrder: (order: OrderInputs) => void;
  readonly onCancelOrder: (id: number) => void;
  readonly onCloseTrade: (id: number) => void;
}

export function TradingOperationsContent({
  timezone,
  state,
  onCreateOrder,
  onCancelOrder,
  onCloseTrade,
}: TradingOperationsContentProps): React.ReactElement {
  const { tradingParams, activeOrders, activeTrades, completedTrades } = state;

  const handleSubmit = useCallback(
    (order: OrderInputs) => {
      onCreateOrder(order);
    },
    [onCreateOrder],
  );

  return (
    <div className='mt-1 flex flex-col gap-2'>
      <CreateOrderForm onSubmit={handleSubmit} />
      <hr />
      <ActiveOrderList
        timezone={timezone}
        tradingParams={tradingParams}
        items={activeOrders}
        onCancel={onCancelOrder}
      />
      <hr />
      <ActiveTradeList
        timezone={timezone}
        tradingParams={tradingParams}
        items={activeTrades}
        onClose={onCloseTrade}
      />
      <hr />
      <CompletedTradeList
        timezone={timezone}
        tradingParams={tradingParams}
        items={completedTrades}
      />
    </div>
  );
}
