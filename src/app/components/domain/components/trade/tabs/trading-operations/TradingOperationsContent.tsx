import React, { useCallback, useState } from 'react';
import { CreateOrderForm } from './CreateOrderForm';
import { OrderInputs } from '../../types/trade/trade/order-inputs';
import {
  AmendOrderData,
  AmendTradeData,
  TradeProcessState,
  TradingDataAndInputs,
} from '../../types';
import { ItemList } from '../../shared';
import { ActiveOrderItem } from './lists/ActiveOrderItem';
import { ActiveTradeItem } from './lists/ActiveTradeItem';
import { CompletedTradeItem } from './lists/CompletedTradeItem';
import { ComponentStack } from '../../shared/ComponentStack';
import { BarReplayPosition } from '../../../../types';
import { TradeStatusDisplay } from './TradeStatusDisplay';

export interface TradingOperationsContentProps {
  readonly dataAndInputs: TradingDataAndInputs;
  readonly state: TradeProcessState;
  readonly onReplayPositionChange: (position: BarReplayPosition) => void;
  readonly onCreateOrder: (order: OrderInputs) => void;
  readonly onCancelOrder: (id: number) => void;
  readonly onAmendOrder: (data: AmendOrderData) => void;
  readonly onCloseTrade: (id: number) => void;
  readonly onAmendTrade: (data: AmendTradeData) => void;
}

export function TradingOperationsContent({
  dataAndInputs,
  state,
  onReplayPositionChange,
  onCreateOrder,
  onCancelOrder,
  onAmendOrder,
  onCloseTrade,
  onAmendTrade,
}: TradingOperationsContentProps): React.ReactElement {
  const { settings, barData, barIndex } = dataAndInputs;
  const { timezone } = settings;
  const { tradingParams, activeOrders, activeTrades, completedTrades } = state;

  const bar = barData[barIndex];

  const handleCreateOrder = useCallback(
    (order: OrderInputs) => {
      onCreateOrder(order);
    },
    [onCreateOrder],
  );

  const [editOrderId, setEditOrderId] = useState<number | undefined>(undefined);

  const handleOrderEdit = useCallback(
    (id: number) => {
      setEditOrderId(editOrderId === id ? undefined : id);
    },
    [editOrderId],
  );

  const handleOrderEditOk = useCallback(
    (data: AmendOrderData) => {
      setEditOrderId(undefined);
      onAmendOrder(data);
    },
    [onAmendOrder],
  );

  const handleOrderEditCancel = useCallback(
    (_id: number) => {
      setEditOrderId(undefined);
    },
    [setEditOrderId],
  );

  const [editTradeId, setEditTradeId] = useState<number | undefined>(undefined);

  const handleTradeEdit = useCallback(
    (id: number) => {
      setEditTradeId(editTradeId === id ? undefined : id);
    },
    [editTradeId],
  );

  const handleTradeEditOk = useCallback(
    (data: AmendTradeData) => {
      setEditTradeId(undefined);
      onAmendTrade(data);
    },
    [onAmendTrade],
  );

  const handleTradeEditCancel = useCallback(
    (_id: number) => {
      setEditTradeId(undefined);
    },
    [setEditTradeId],
  );

  return (
    <ComponentStack className='mt-1'>
      <TradeStatusDisplay
        dataAndInputs={dataAndInputs}
        state={state}
        onReplayPositionChange={onReplayPositionChange}
      />
      <CreateOrderForm onCreateOrder={handleCreateOrder} />
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
              isEditing={editOrderId === item.id}
              onEdit={handleOrderEdit}
              onCancel={onCancelOrder}
              onEditOk={handleOrderEditOk}
              onEditCancel={handleOrderEditCancel}
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
              isEditing={editTradeId === item.id}
              onEdit={handleTradeEdit}
              onClose={onCloseTrade}
              onEditOk={handleTradeEditOk}
              onEditCancel={handleTradeEditCancel}
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
