import React, { useEffect, useRef } from 'react';
import {
  ColorType,
  DeepPartial,
  IChartApi,
  ISeriesApi,
  TimeChartOptions,
  UTCTimestamp,
  createChart,
} from 'lightweight-charts';

export interface TwChartProps {
  readonly data: readonly number[];
}

export function TwChart({ data }: TwChartProps): React.ReactElement {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chart = elementRef.current
      ? createChart(elementRef.current)
      : undefined;
    initChart(chart);

    return () => {
      destroyChart(chart);
    };
  }, []);

  return (
    <div className='h-full overflow-hidden'>
      <div ref={elementRef} className='h-full' />
    </div>
  );
}

const UP_COLOR = '#26A69A';
const DOWN_COLOR = '#EF5350';

function initChart(chart: IChartApi | undefined): void {
  if (!chart) {
    return;
  }

  const chartOptions: DeepPartial<TimeChartOptions> = {
    autoSize: true,
    layout: {
      textColor: 'black',
      background: { type: ColorType.Solid, color: 'white' },
    },
  };
  chart.applyOptions(chartOptions);

  // const areaSeries = chart.addAreaSeries({
  //   lineColor: '#2962FF',
  //   topColor: '#2962FF',
  //   bottomColor: 'rgba(41, 98, 255, 0.28)',
  // });
  // areaSeries.setData([
  //   { time: '2018-12-22', value: 32.51 },
  //   { time: '2018-12-23', value: 31.11 },
  //   { time: '2018-12-24', value: 27.02 },
  //   { time: '2018-12-25', value: 27.32 },
  //   { time: '2018-12-26', value: 25.17 },
  //   { time: '2018-12-27', value: 28.89 },
  //   { time: '2018-12-28', value: 25.46 },
  //   { time: '2018-12-29', value: 23.92 },
  //   { time: '2018-12-30', value: 22.68 },
  //   { time: '2018-12-31', value: 22.67 },
  // ]);

  const candlestickSeries = chart.addCandlestickSeries({
    upColor: UP_COLOR,
    downColor: DOWN_COLOR,
    wickUpColor: UP_COLOR,
    wickDownColor: DOWN_COLOR,
    borderVisible: false,
  });

  candlestickSeries.setData([
    { time: '2018-12-22', open: 75.16, high: 82.84, low: 36.16, close: 45.72 },
    { time: '2018-12-23', open: 45.12, high: 53.9, low: 45.12, close: 48.09 },
    { time: '2018-12-24', open: 60.71, high: 60.71, low: 53.39, close: 59.29 },
    { time: '2018-12-25', open: 68.26, high: 68.26, low: 59.04, close: 60.5 },
    { time: '2018-12-26', open: 67.71, high: 105.85, low: 66.67, close: 91.04 },
    { time: '2018-12-27', open: 91.04, high: 121.4, low: 82.7, close: 111.4 },
    {
      time: '2018-12-28',
      open: 111.51,
      high: 142.83,
      low: 103.34,
      close: 131.25,
    },
    {
      time: '2018-12-29',
      open: 131.33,
      high: 151.17,
      low: 77.68,
      close: 96.43,
    },
    { time: '2018-12-30', open: 106.33, high: 110.2, low: 90.39, close: 98.1 },
    {
      time: '2018-12-31',
      open: 109.87,
      high: 114.69,
      low: 85.66,
      close: 111.26,
    },
  ]);

  chart.timeScale().fitContent();
}

function destroyChart(chart: IChartApi | undefined): void {
  if (!chart) {
    return;
  }

  chart.remove();
}
