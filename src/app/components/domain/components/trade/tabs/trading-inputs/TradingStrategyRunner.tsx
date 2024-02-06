import React from 'react';
import { Button } from '../../../../../shared';

export interface TradingStrategyRunnerProps {
  readonly onRunStrategyClick: () => void;
}

export function TradingStrategyRunner({
  onRunStrategyClick,
}: TradingStrategyRunnerProps): React.ReactElement {
  return (
    <div className='flex flex-row'>
      <Button width={'100%'} content={'Run Strategy'} onClick={onRunStrategyClick} />
    </div>
  );
}
