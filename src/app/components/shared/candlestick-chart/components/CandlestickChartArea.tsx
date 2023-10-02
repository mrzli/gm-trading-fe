import React, { useState } from 'react';
import { NumericRange, Rect, TickerDataRow } from '../../../../types';
import {
  useCandlestickChartData,
  useCandlestickChartXScale,
  useCandlestickChartYScale,
} from '../util';
import { CandlestickItem } from './CandlestickItem';
import { TickerDataResolution } from '@gmjs/gm-trading-shared';

export interface CandlestickChartAreaProps {
  readonly chartRect: Rect;
  readonly resolution: TickerDataResolution;
  readonly precision: number;
  readonly valueRange: NumericRange;
  readonly data: readonly TickerDataRow[];
}

export function CandlestickChartArea({
  chartRect,
  resolution,
  precision,
  valueRange,
  data,
}: CandlestickChartAreaProps): React.ReactElement {
  const { x, y, width, height } = chartRect;

  const xScale = useCandlestickChartXScale(data, resolution, width);
  const yScale = useCandlestickChartYScale(valueRange, height);

  const chartData = useCandlestickChartData(data, xScale, yScale);

  const [selectedItem, setSelectedItem] = useState<number | undefined>(
    undefined,
  );

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      x={x}
      y={y}
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
  );
}
