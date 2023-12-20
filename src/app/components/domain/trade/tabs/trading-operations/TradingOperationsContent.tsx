import React, { useCallback } from 'react';
import { CreateOrderForm } from './CreateOrderForm';
import { OrderInputs } from '../../types/trade/trade/order-inputs';

export interface TradingOperationsContentProps {
  readonly onCreateOrder: (order: OrderInputs) => void;
}

export function TradingOperationsContent({
  onCreateOrder,
}: TradingOperationsContentProps): React.ReactElement {
  const handleSubmit = useCallback(
    (order: OrderInputs) => {
      onCreateOrder(order);
    },
    [onCreateOrder],
  );

  return (
    <div className='mt-1'>
      <CreateOrderForm onSubmit={handleSubmit} />
    </div>
  );
}
