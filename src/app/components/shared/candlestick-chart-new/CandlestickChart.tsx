import React, { useMemo } from 'react';
import { TickerDataResolution } from '@gmjs/gm-trading-shared';
import { Rect, TickerDataRow } from '../../../types';
import {
  AxisTickItem,
  CandleVisualData,
  CandlestickChartPosition,
} from './types';
import { useMeasure } from '@uidotdev/usehooks';
import {
  getChartArea,
  getXAxisTicks,
  nomalizeXOffset,
  toCandleVisualData,
  toFirstXIndex,
} from './util';
import { CandlestickChartArea } from './components/chart/CandlestickChartArea';
import { XAxis } from './components/axis/XAxis';
import { YAxis } from './components/axis/YAxis';
import { Grid } from './components/grid/Grid';

export interface CandlestickChartProps {
  readonly resolution: TickerDataResolution;
  readonly precision: number;
  readonly position: CandlestickChartPosition;
  readonly data: readonly TickerDataRow[];
}

export function CandlestickChartInternal({
  resolution,
  precision,
  position,
  data,
}: CandlestickChartProps): React.ReactElement {
  const [containerRef, { width, height }] = useMeasure<HTMLDivElement>();

  const finalWidth = width ?? 0;
  const finalHeight = height ?? 0;

  const chartRect = useMemo<Rect>(
    () => getChartArea(finalWidth, finalHeight),
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

  const normalizedData = useMemo<readonly TickerDataRow[]>(
    () => data.slice(firstXIndex, lastXIndex + 2),
    [data, firstXIndex, lastXIndex],
  );

  const visualData = useMemo<readonly CandleVisualData[]>(
    () =>
      normalizedData.map((item) =>
        toCandleVisualData(item, position, chartRect),
      ),
    [normalizedData, position, chartRect],
  );

  const xAxisTicks = useMemo<readonly AxisTickItem[]>(
    () =>
      getXAxisTicks(
        resolution,
        normalizedData,
        xNormalizedOffset,
        slotWidth,
        chartRect.width,
      ),
    [resolution, normalizedData, xNormalizedOffset, slotWidth, chartRect.width],
  );

  const verticalGridLines = useMemo<readonly number[]>(
    () => xAxisTicks.map((tick) => tick.offset),
    [xAxisTicks],
  );

  return (
    <div ref={containerRef} className='h-full'>
      {isValidSize && (
        <svg
          tabIndex={0} // needed for focus (keyboard handling)
          viewBox={`0 0 ${finalWidth} ${finalHeight}`}
          className='bg-slate-100 outline-none select-none'
        >
          <Grid {...chartRect} horizontal={[0]} vertical={verticalGridLines} />
          <CandlestickChartArea
            {...chartRect}
            candleOffset={xNormalizedOffset}
            slotWidth={slotWidth}
            items={visualData}
          />
          <XAxis
            x={chartRect.x}
            y={chartRect.y + chartRect.height}
            location={'bottom'}
            size={chartRect.width}
            ticks={xAxisTicks}
          />
          <YAxis
            x={chartRect.x + chartRect.width}
            y={chartRect.y}
            location={'right'}
            size={chartRect.height}
            ticks={[]}
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

export const CandlestickChart = React.memo(CandlestickChartInternal);
