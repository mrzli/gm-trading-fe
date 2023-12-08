import React, { useMemo } from 'react';
import { useMeasure } from '@uidotdev/usehooks';
import { Rect, TickerDataRow } from '../../../../app/types';
import { TickerDataResolution } from '@gmjs/gm-trading-shared';
import { CandlestickChartArea } from './components/CandlestickChartArea';
import { XAxis } from './components/XAxis';
import { YAxis } from './components/YAxis';
import { XGrid } from './components/XGrid';
import { YGrid } from './components/YGrid';
import { CandlestickChartPosition } from './types';

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
  readonly resolution: TickerDataResolution;
  readonly position: CandlestickChartPosition;
}

function CandlestickChartInternal({
  precision,
  data,
  resolution,
  position,
}: CandlestickChartProps): React.ReactElement {
  const [containerRef, { width, height }] = useMeasure<HTMLDivElement>();

  const finalWidth = width ?? 0;
  const finalHeight = height ?? 0;

  const chartRect = useMemo<Rect>(
    () => ({
      x: CANDLESTICK_CHART_MARGIN.left,
      y: CANDLESTICK_CHART_MARGIN.top,
      width: Math.max(
        finalWidth -
          CANDLESTICK_CHART_MARGIN.left -
          CANDLESTICK_CHART_MARGIN.right,
        0,
      ),
      height: Math.max(
        finalHeight -
          CANDLESTICK_CHART_MARGIN.top -
          CANDLESTICK_CHART_MARGIN.bottom,
        0,
      ),
    }),
    [finalHeight, finalWidth],
  );

  const isValidSize = finalHeight > 0 && finalWidth > 0;

  return (
    <div ref={containerRef} className='h-full'>
      {isValidSize && (
        <svg
          tabIndex={0} // needed for focus (keyboard handling)
          // finalWidth={finalWidth}
          // finalHeight={finalHeight}
          viewBox={`0 0 ${finalWidth} ${finalHeight}`}
          className='bg-slate-100 outline-none select-none'
        >
          <XAxis
            chartRect={chartRect}
            resolution={resolution}
            data={data}
            position={position}
          />
          <YAxis
            chartRect={chartRect}
            position={position}
            precision={precision}
          />
          <XGrid
            chartRect={chartRect}
            resolution={resolution}
            data={data}
            position={position}
          />
          <YGrid chartRect={chartRect} position={position} />

          <CandlestickChartArea
            chartRect={chartRect}
            resolution={resolution}
            precision={precision}
            data={data}
            position={position}
          />
        </svg>
      )}
    </div>
  );
}

export const CandlestickChart = React.memo(CandlestickChartInternal);