import React, { useEffect, useState } from 'react';
import { Position, Rect, TickerDataRow } from '../../../../types';
import {
  useCandlestickChartData,
  useCandlestickChartXScale,
  useCandlestickChartYScale,
} from '../util';
import { CandlestickItem } from './CandlestickItem';
import { TickerDataResolution } from '@gmjs/gm-trading-shared';
import { useDragOffset } from '../util/hooks/drag-offset';
import { CandlestickChartPosition } from '../types';

export interface CandlestickChartAreaProps {
  readonly chartRect: Rect;
  readonly resolution: TickerDataResolution;
  readonly precision: number;
  readonly data: readonly TickerDataRow[];
  readonly position: CandlestickChartPosition;
}

export function CandlestickChartArea({
  chartRect,
  resolution,
  precision,
  data,
  position,
}: CandlestickChartAreaProps): React.ReactElement {
  const { x, y, width, height } = chartRect;

  const [offset, setOffset] = useState<Position>({ x: 0, y: 0 });

  const xScale = useCandlestickChartXScale(data, resolution, position, width);
  const yScale = useCandlestickChartYScale(position, height);

  const chartData = useCandlestickChartData(data, xScale, yScale);

  const [selectedItem, setSelectedItem] = useState<number | undefined>(
    undefined,
  );

  const [chartAreaRef, dragX, dragY] = useDragOffset<SVGSVGElement>();

  useEffect(() => {
    setOffset({ x: -dragX, y: -dragY });
  }, [dragX, dragY]);

  // console.log(dragX, dragY);

  return (
    <svg
      ref={chartAreaRef}
      viewBox={`0 0 ${width} ${height}`}
      x={x}
      y={y}
      width={width}
      height={height}
    >
      {/* for mouse events */}
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill='transparent'
        stroke='orange'
      />

      <svg
        viewBox={`${offset.x} ${offset.y} ${width} ${height}`}
        width={width}
        height={height}
      >
        <defs>
          <clipPath id={'chartArea'}>
            <rect x={0} y={0} width={width} height={height} />
          </clipPath>
        </defs>

        <g clipPath={'url(#chartArea)'}>
          {chartData.map(({ x, w, o, h, l, c, tooltip }, i) => (
            <CandlestickItem
              key={i}
              x={x}
              w={w}
              o={o}
              h={h}
              l={l}
              c={c}
              i={i}
              onMouseOver={setSelectedItem}
              isSelected={selectedItem === i}
              precision={precision}
              tooltipData={tooltip}
            />
          ))}
        </g>
      </svg>
    </svg>
  );
}
