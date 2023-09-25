import { useRef } from 'react';
import {
  TickerDataResolution,
  NumericRange,
  TickerDataRow,
} from '../../../types';
import { CandlestickItem } from './CandlestickItem';
import {
  useCandlestickChartScales,
  useCandlestickChartData,
  useCandlestickChartXAxis,
  useCandlestickChartXGrid,
  useCandlestickChartYAxis,
  useCandlestickChartYGrid,
  CANDLESTICK_CHART_MARGIN,
} from './util';

export interface CandlestickChartProps {
  readonly width: number;
  readonly height: number;
  readonly precision: number;
  readonly data: readonly TickerDataRow[];
  readonly interval: TickerDataResolution;
  readonly valueRange: NumericRange;
  readonly selectedItem: number | undefined;
  readonly onSelectItem: (index: number | undefined) => void;
  readonly onKeyDown?: (event: React.KeyboardEvent<SVGElement>) => void;
}

export function CandlestickChart({
  width,
  height,
  precision,
  data,
  interval,
  valueRange,
  selectedItem,
  onSelectItem,
  onKeyDown,
}: CandlestickChartProps): React.ReactElement {
  const xAxisRef = useRef<SVGGElement | null>(null);
  const yAxisRef = useRef<SVGGElement | null>(null);

  const xGridLinesRef = useRef<SVGGElement | null>(null);
  const yGridLinesRef = useRef<SVGGElement | null>(null);

  const { xScale, yScale } = useCandlestickChartScales(
    data,
    interval,
    valueRange,
    width,
    height,
  );

  const chartData = useCandlestickChartData(data, xScale, yScale);

  useCandlestickChartXAxis(xAxisRef, xScale);
  useCandlestickChartXGrid(xGridLinesRef, xScale, interval, data, height);

  useCandlestickChartYAxis(yAxisRef, yScale, precision);
  useCandlestickChartYGrid(yGridLinesRef, yScale, width);

  const chartAreaWidth =
    width - CANDLESTICK_CHART_MARGIN.left - CANDLESTICK_CHART_MARGIN.right;

  const chartAreaHeight =
    height - CANDLESTICK_CHART_MARGIN.top - CANDLESTICK_CHART_MARGIN.bottom;

  if (width === 0 || height === 0) {
    return <div />;
  }

  return (
    <svg
      tabIndex={0} // needed for focus (keyboard handling)
      // width={width}
      // height={height}
      viewBox={`0 0 ${width} ${height}`}
      className='bg-slate-100'
      onKeyDown={onKeyDown}
    >
      <defs>
        <clipPath id={'chartArea'}>
          <rect
            x={CANDLESTICK_CHART_MARGIN.left}
            y={CANDLESTICK_CHART_MARGIN.top}
            width={chartAreaWidth}
            height={chartAreaHeight}
          />
        </clipPath>
      </defs>

      <g
        ref={xAxisRef}
        transform={`translate(0, ${height - CANDLESTICK_CHART_MARGIN.bottom})`}
      />
      <g
        ref={yAxisRef}
        transform={`translate(${CANDLESTICK_CHART_MARGIN.left}, 0)`}
      />

      <g
        ref={xGridLinesRef}
        transform={`translate(0, ${CANDLESTICK_CHART_MARGIN.top})`}
      />
      <g
        ref={yGridLinesRef}
        transform={`translate(${CANDLESTICK_CHART_MARGIN.left}, 0)`}
      />

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
            onMouseOver={onSelectItem}
            isSelected={selectedItem === i}
            precision={precision}
            tooltipData={tooltip}
          />
        ))}
      </g>
    </svg>
  );
}
