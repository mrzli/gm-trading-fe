import { useRef } from 'react';
import { useMeasure } from '@uidotdev/usehooks';
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
} from './util';

interface CandlestickChartMargin {
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
}

const CANDLESTICK_CHART_MARGIN: CandlestickChartMargin = {
  top: 20,
  right: 80,
  bottom: 100,
  left: 60,
};

export interface CandlestickChartProps {
  readonly precision: number;
  readonly data: readonly TickerDataRow[];
  readonly interval: TickerDataResolution;
  readonly valueRange: NumericRange;
  readonly selectedItem: number | undefined;
  readonly onSelectItem: (index: number | undefined) => void;
  readonly onKeyDown?: (event: React.KeyboardEvent<SVGElement>) => void;
}

export function CandlestickChart({
  precision,
  data,
  interval,
  valueRange,
  selectedItem,
  onSelectItem,
  onKeyDown,
}: CandlestickChartProps): React.ReactElement {
  const [containerRef, { width, height }] = useMeasure<HTMLDivElement>();

  const finalWidth = width ?? 0;
  const finalHeight = height ?? 0;

  const chartAreaX = CANDLESTICK_CHART_MARGIN.left;
  const chartAreaY = finalHeight - CANDLESTICK_CHART_MARGIN.bottom;

  const chartAreaWidth =
    finalWidth - CANDLESTICK_CHART_MARGIN.left - CANDLESTICK_CHART_MARGIN.right;

  const chartAreaHeight =
    finalHeight -
    CANDLESTICK_CHART_MARGIN.top -
    CANDLESTICK_CHART_MARGIN.bottom;

  const xAxisRef = useRef<SVGGElement | null>(null);
  const yAxisRef = useRef<SVGGElement | null>(null);

  const xGridLinesRef = useRef<SVGGElement | null>(null);
  const yGridLinesRef = useRef<SVGGElement | null>(null);

  const { xScale, yScale } = useCandlestickChartScales(
    data,
    interval,
    valueRange,
    chartAreaX,
    chartAreaX + chartAreaWidth,
    chartAreaY,
    chartAreaY - chartAreaHeight,
  );

  const chartData = useCandlestickChartData(data, xScale, yScale);

  useCandlestickChartXAxis(xAxisRef, xScale);
  useCandlestickChartXGrid(
    xGridLinesRef,
    xScale,
    interval,
    data,
    chartAreaHeight,
  );

  useCandlestickChartYAxis(yAxisRef, yScale, precision);
  useCandlestickChartYGrid(yGridLinesRef, yScale, chartAreaWidth);

  const isValidSize = finalHeight > 0 && finalWidth > 0;

  return (
    <div ref={containerRef} className='h-full'>
      {isValidSize && (
        <svg
          tabIndex={0} // needed for focus (keyboard handling)
          // finalWidth={finalWidth}
          // finalHeight={finalHeight}
          viewBox={`0 0 ${finalWidth} ${finalHeight}`}
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
            transform={`translate(0, ${
              finalHeight - CANDLESTICK_CHART_MARGIN.bottom
            })`}
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
      )}
    </div>
  );
}
