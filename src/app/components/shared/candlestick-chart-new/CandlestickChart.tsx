import React, { useMemo } from 'react';
import { TickerDataResolution } from '@gmjs/gm-trading-shared';
import { Rect, TickerDataRow } from '../../../types';
import { CandleVisualData, CandlestickChartPosition } from './types';
import { useMeasure } from '@uidotdev/usehooks';
import {
  CANDLESTICK_CHART_MARGIN,
  nomalizeXOffset,
  toCandleVisualData,
  toFirstXIndex,
} from './util';
import { CandlestickChartArea } from './components/chart/CandlestickChartArea';
import { first } from '@gmjs/value-transformers';

export interface CandlestickChartProps {
  readonly resolution: TickerDataResolution;
  readonly precision: number;
  readonly position: CandlestickChartPosition;
  readonly data: readonly TickerDataRow[];
}

export function CandlestickChart({
  resolution,
  precision,
  position,
  data,
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

  const { xOffset, xItemsWidth } = position;

  const firstXIndex = useMemo(() => toFirstXIndex(xOffset), [xOffset]);
  const xNormalizedOffset = useMemo(() => nomalizeXOffset(xOffset), [xOffset]);
  const lastXIndex = useMemo(
    () => Math.ceil(firstXIndex + xNormalizedOffset + xItemsWidth - 1),
    [firstXIndex, xNormalizedOffset, xItemsWidth],
  );

  const slotWidth = useMemo(
    () => chartRect.width / xItemsWidth,
    [chartRect, xItemsWidth],
  );

  console.log(firstXIndex, xNormalizedOffset, lastXIndex);

  const finalData = useMemo<readonly TickerDataRow[]>(
    () => data.slice(firstXIndex, lastXIndex + 1),
    [data, firstXIndex, lastXIndex],
  );

  const visualData = useMemo<readonly CandleVisualData[]>(
    () =>
      finalData.map((item) => toCandleVisualData(item, position, chartRect)),
    [finalData, position, chartRect],
  );

  return (
    <div ref={containerRef} className='h-full'>
      {isValidSize && (
        <svg
          tabIndex={0} // needed for focus (keyboard handling)
          viewBox={`0 0 ${finalWidth} ${finalHeight}`}
          className='bg-slate-100 outline-none select-none'
        >
          <CandlestickChartArea
            {...chartRect}
            candleOffset={xNormalizedOffset}
            slotWidth={slotWidth}
            items={visualData}
          />
          {/* <XAxis
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
          /> */}
        </svg>
      )}
    </div>
  );
}
