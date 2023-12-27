import React from 'react';
import { ComponentStack } from '../../shared/ComponentStack';

export interface TradingLogProps {}

export function TradingLog({}: TradingLogProps): React.ReactElement {
  return <ComponentStack className='mt-1'>{'TradingLog'}</ComponentStack>;
}
