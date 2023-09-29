import { useLayoutEffect, useMemo } from 'react';
import * as d3 from 'd3';
import {
  TickerDataRow,
  TickerDataResolution,
  NumericRange,
} from '../../../../types';
import { CandlestickChartDataItem } from '../types';
import {
  CandlestickChartScales,
  CandlestickChartXScale,
  CandlestickChartYScale,
  getScales,
} from './scale';
import { getXAxis, getYAxis } from './axes';
import { getXGrid, getYGrid } from './grid';
import { toCandlestickChartDataItem } from './item';

export function useCandlestickChartScales(
  rows: readonly TickerDataRow[],
  interval: TickerDataResolution,
  valueRange: NumericRange,
  x1: number,
  x2: number,
  y1: number,
  y2: number,
): CandlestickChartScales {
  return useMemo(
    () => getScales(rows, interval, valueRange, x1, x2, y1, y2),
    [rows, interval, valueRange, x1, x2, y1, y2],
  );
}

export function useCandlestickChartData(
  rows: readonly TickerDataRow[],
  xScale: CandlestickChartXScale,
  yScale: CandlestickChartYScale,
): readonly CandlestickChartDataItem[] {
  return useMemo<readonly CandlestickChartDataItem[]>(() => {
    const chartData: readonly CandlestickChartDataItem[] = rows.map((item) =>
      toCandlestickChartDataItem(item, xScale, yScale),
    );

    return chartData;
  }, [rows, xScale, yScale]);
}

export function useCandlestickChartXAxis(
  xAxisRef: React.MutableRefObject<SVGGElement | null>,
  xScale: CandlestickChartXScale,
  resolution: TickerDataResolution,
  rows: readonly TickerDataRow[],
): void {
  useLayoutEffect(() => {
    if (!xAxisRef.current) {
      return;
    }

    const xAxis = getXAxis(xScale, resolution, rows);
    d3.select(xAxisRef.current)
      .call(xAxis)
      .call((g) =>
        g
          .selectAll('text')
          .attr('transform', 'rotate(45)')
          .style('text-anchor', 'start'),
      );
  }, [xAxisRef, xScale, resolution]);
}

export function useCandlestickChartXGrid(
  xGridLinesRef: React.MutableRefObject<SVGGElement | null>,
  xScale: CandlestickChartXScale,
  resolution: TickerDataResolution,
  rows: readonly TickerDataRow[],
  height: number,
): void {
  useLayoutEffect(() => {
    if (!xGridLinesRef.current) {
      return;
    }

    const xGrid = getXGrid(xScale, resolution, rows, height);
    d3.select(xGridLinesRef.current).call(xGrid);
  }, [xGridLinesRef, xScale, resolution, rows, height]);
}

export function useCandlestickChartYAxis(
  yAxisRef: React.MutableRefObject<SVGGElement | null>,
  yScale: CandlestickChartYScale,
  precision: number,
): void {
  useLayoutEffect(() => {
    if (!yAxisRef.current) {
      return;
    }

    const yAxis = getYAxis(yScale, precision);
    d3.select(yAxisRef.current).call(yAxis);
  }, [yAxisRef, yScale, precision]);
}

export function useCandlestickChartYGrid(
  yGridLinesRef: React.MutableRefObject<SVGGElement | null>,
  yScale: CandlestickChartYScale,
  width: number,
): void {
  useLayoutEffect(() => {
    if (!yGridLinesRef.current) {
      return;
    }

    const yGrid = getYGrid(yScale, width);
    d3.select(yGridLinesRef.current).call(yGrid);
  }, [yGridLinesRef, yScale, width]);
}
