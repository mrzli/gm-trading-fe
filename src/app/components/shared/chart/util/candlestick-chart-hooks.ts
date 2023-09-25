import { useLayoutEffect, useMemo } from 'react';
import * as d3 from 'd3';
import {
  getCandlestickChartScales,
  toCandlestickChartDataItem,
  getCandlestickChartXAxis,
  getCandlestickChartXGrid,
  getCandlestickChartYAxis,
  getCandlestickChartYGrid,
} from './candlestick-chart-util';
import {
  TickerDataRow,
  TickerDataResolution,
  NumericRange,
} from '../../../../types';
import {
  CandlestickChartScales,
  CandlestickChartXScale,
  CandlestickChartYScale,
  CandlestickChartDataItem,
} from '../types';

export function useCandlestickChartScales(
  rows: readonly TickerDataRow[],
  interval: TickerDataResolution,
  valueRange: NumericRange,
  width: number,
  height: number,
): CandlestickChartScales {
  return useMemo(
    () => getCandlestickChartScales(rows, interval, valueRange, width, height),
    [rows, interval, valueRange, width, height],
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
): void {
  useLayoutEffect(() => {
    if (!xAxisRef.current) {
      return;
    }

    const xAxis = getCandlestickChartXAxis(xScale);
    d3.select(xAxisRef.current)
      .call(xAxis)
      .call((g) =>
        g
          .selectAll('text')
          .attr('transform', 'rotate(45)')
          .style('text-anchor', 'start'),
      );
  }, [xAxisRef, xScale]);
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

    const xGrid = getCandlestickChartXGrid(xScale, resolution, rows, height);
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

    const yAxis = getCandlestickChartYAxis(yScale, precision);
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

    const yGrid = getCandlestickChartYGrid(yScale, width);
    d3.select(yGridLinesRef.current).call(yGrid);
  }, [yGridLinesRef, yScale, width]);
}
