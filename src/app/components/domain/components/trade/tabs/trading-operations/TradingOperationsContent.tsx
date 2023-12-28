import React, { useCallback } from 'react';
import { CreateOrderForm } from './CreateOrderForm';
import { OrderInputs } from '../../types/trade/trade/order-inputs';
import { TradeProcessState, TradingDataAndInputs } from '../../types';
import { ItemList } from '../../shared';
import { ActiveOrderItem } from './lists/ActiveOrderItem';
import { ActiveTradeItem } from './lists/ActiveTradeItem';
import { CompletedTradeItem } from './lists/CompletedTradeItem';
import { ComponentStack } from '../../shared/ComponentStack';
import { BarReplayPosition } from '../../../../types';
import { BarStatus } from './BarStatus';

export interface TradingOperationsContentProps {
  readonly dataAndInputs: TradingDataAndInputs;
  readonly state: TradeProcessState;
  readonly onReplayPositionChange: (position: BarReplayPosition) => void;
  readonly onCreateOrder: (order: OrderInputs) => void;
  readonly onCancelOrder: (id: number) => void;
  readonly onCloseTrade: (id: number) => void;
}

export function TradingOperationsContent({
  dataAndInputs,
  state,
  onReplayPositionChange,
  onCreateOrder,
  onCancelOrder,
  onCloseTrade,
}: TradingOperationsContentProps): React.ReactElement {
  const { settings, barData, barIndex } = dataAndInputs;
  const { timezone } = settings;
  const { tradingParams, activeOrders, activeTrades, completedTrades } = state;

  const bar = barData[barIndex];

  const handleSubmit = useCallback(
    (order: OrderInputs) => {
      onCreateOrder(order);
    },
    [onCreateOrder],
  );

  return (
    <ComponentStack className='mt-1'>
      <BarStatus
        dataAndInputs={dataAndInputs}
        onReplayPositionChange={onReplayPositionChange}
      />
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
              bar={bar}
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
