import React, { useCallback, useState } from 'react';
import cls from 'classnames';
import { CreateOrderForm } from './CreateOrderForm';
import { OrderInputs } from '../../types/trade/trade/order-inputs';
import {
  AmendOrderData,
  AmendTradeData,
  TradingDataAndInputs,
} from '../../types';
import { ItemList } from '../../shared';
import { ActiveOrderItem } from './lists/ActiveOrderItem';
import { ActiveTradeItem } from './lists/ActiveTradeItem';
import { CompletedTradeItem } from './lists/CompletedTradeItem';
import { ComponentStack } from '../../shared/ComponentStack';
import { BarReplayPosition } from '../../../../types';
import { TradeStatusDisplay } from './TradeStatusDisplay';
import { ScrollYContainer } from '../../shared/ScrollYContainer';
import { CreateOrderStateFinish } from '../../../ticker-data-container/types';
import { TradesCollection } from '@gmjs/gm-trading-shared';
import { unixSecondsToIsoDate } from '@gmjs/date-util';

export interface TradingOperationsContentProps {
  readonly dataAndInputs: TradingDataAndInputs;
  readonly tradesCollection: TradesCollection;
  readonly onNavigateToTime: (time: number) => void;
  readonly onReplayPositionChange: (position: BarReplayPosition) => void;
  readonly onCreateOrder: (order: OrderInputs) => void;
  readonly onCancelOrder: (id: number) => void;
  readonly onAmendOrder: (data: AmendOrderData) => void;
  readonly onCloseTrade: (id: number) => void;
  readonly onAmendTrade: (data: AmendTradeData) => void;
  readonly onProposedOrderChange: (order: OrderInputs | undefined) => void;
  readonly createOrderData: CreateOrderStateFinish | undefined;
}

export function TradingOperationsContent({
  dataAndInputs,
  tradesCollection,
  onNavigateToTime,
  onReplayPositionChange,
  onCreateOrder,
  onCancelOrder,
  onAmendOrder,
  onCloseTrade,
  onAmendTrade,
  onProposedOrderChange,
  createOrderData,
}: TradingOperationsContentProps): React.ReactElement {
  const { settings, replayPosition, barData, barIndex, inputs } = dataAndInputs;
  const { timezone } = settings;
  const { params } = inputs;
  const { activeOrders, activeTrades, completedTrades } = tradesCollection;

  const isTradingActivated = replayPosition.barIndex !== undefined;

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
    <ComponentStack className='mt-1 overflow-hidden'>
      <TradeStatusDisplay
        dataAndInputs={dataAndInputs}
        tradesCollection={tradesCollection}
        onReplayPositionChange={onReplayPositionChange}
      />
      {isTradingActivated && (
        <>
          <CreateOrderForm
            tradingParams={params}
            createOrderData={createOrderData}
            onCreateOrder={handleCreateOrder}
            onProposedOrderChange={onProposedOrderChange}
          />
          <ScrollYContainer>
            <ComponentStack>
              <ItemList
                title={'Active Orders'}
                items={activeOrders}
                itemRenderer={(item, index) => {
                  return (
                    <ActiveOrderItem
                      key={index}
                      timezone={timezone}
                      tradingParams={params}
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
                      tradingParams={params}
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
                      tradingParams={params}
                      item={item}
                      onOpenTimeClick={onNavigateToTime}
                      onCloseTimeClick={onNavigateToTime}
                    />
                  );
                }}
                itemSeparator={(item, _index, nextItem) => {
                  const currentDateObject = unixSecondsToIsoDate(
                    item.closeTime,
                    { timezone },
                  );
                  const nextDateObject = nextItem
                    ? unixSecondsToIsoDate(nextItem.closeTime, { timezone })
                    : undefined;
                  const isDayChange =
                    nextDateObject !== undefined &&
                    currentDateObject !== nextDateObject;
                  const classes = cls('border-t', {
                    'border-gray-200': !isDayChange,
                    'border-gray-800': isDayChange,
                  });
                  return <div className={classes} />;
                }}
              />
            </ComponentStack>
          </ScrollYContainer>
        </>
      )}
    </ComponentStack>
  );
}
