import React from 'react';
import { CandleVisualData } from '../../types';
import { CandleElement } from './CandleElement';

export interface CandlestickChartAreaProps {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly candleOffset: number;
  readonly slotWidth: number;
  readonly items: readonly CandleVisualData[];
}

export function CandlestickChartArea({
  x,
  y,
  width,
  height,
  candleOffset,
  slotWidth,
  items,
}: CandlestickChartAreaProps): React.ReactElement {
  const xOffset = -candleOffset * slotWidth;

  return (
    <g transform={`translate(${x}, ${y})`}>
      <defs>
        <clipPath id={'chartArea'}>
          <rect x={0} y={0} width={width} height={height} />
        </clipPath>
      </defs>

      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        stroke='red'
        fill='transparent'
      />
      <g clipPath={'url(#chartArea)'}>
        {items.map((item, index) => (
          <CandleElement
            key={index}
            slotX={xOffset + index * slotWidth}
            slotWidth={slotWidth}
            {...item}
            i={index}
            onMouseOver={(): void => {}}
            isSelected={false}
            precision={0}
            tooltipData={{
              ts: 0,
              o: 0,
              h: 0,
              l: 0,
              c: 0,
            }}
          />
        ))}
      </g>
    </g>
  );
}
