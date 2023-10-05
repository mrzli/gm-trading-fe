import React from 'react';
import { CandlestickChartItem } from '../../types';

export interface CandlestickChartAreaProps {
  readonly x: number;
  readonly y: number;
  readonly items: readonly CandlestickChartItem[];
}

export function CandlestickChartArea({
  x,
  y,
}: CandlestickChartAreaProps): React.ReactElement {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x={0} y={0} width={40} height={40} fill='red' />
    </g>
  );
}
