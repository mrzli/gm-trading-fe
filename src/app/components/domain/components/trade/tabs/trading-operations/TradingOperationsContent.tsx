import React, { useCallback } from 'react';
import { CreateOrderForm } from './CreateOrderForm';
import { OrderInputs } from '../../types/trade/trade/order-inputs';
import { TradeProcessState } from '../../types';
import { ItemList } from '../../shared';
import { ActiveOrderItem } from './lists/ActiveOrderItem';
import { ActiveTradeItem } from './lists/ActiveTradeItem';
import { CompletedTradeItem } from './lists/CompletedTradeItem';
import { ComponentStack } from '../../shared/ComponentStack';
import { ChartTimezone } from '../../../../types';

export interface TradingOperationsContentProps {
  readonly timezone: ChartTimezone;
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
    <ComponentStack className='mt-1'>
      <CreateOrderForm onSubmit={handleSubmit} />
      <ItemList
        title={'Active Orders'}
        items={activeOrders}
        itemRenderer={(item, index) => {
          return (
            <ActiveOrderItem
              key={index}
              timezone={timezone}
              tradingParams={tradingParams}
              item={item}
              onCancel={onCancelOrder}
            />
          );
        }}
      />
      <ItemList
        title={'Active Trades'}
        items={activeTrades}
        itemRenderer={(item, index) => {
          return (
            <ActiveTradeItem
              key={index}
              timezone={timezone}
              tradingParams={tradingParams}
              item={item}
              onClose={onCloseTrade}
            />
          );
        }}
      />
      <ItemList
        title={'Completed Trades'}
        items={completedTrades}
        itemRenderer={(item, index) => {
          return (
            <CompletedTradeItem
              key={index}
              timezone={timezone}
              tradingParams={tradingParams}
              item={item}
            />
          );
        }}
      />
    </ComponentStack>
  );
}
