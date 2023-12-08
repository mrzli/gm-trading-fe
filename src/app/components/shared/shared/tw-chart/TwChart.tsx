import React, { useEffect, useMemo, useRef } from 'react';
import {
  CandlestickSeriesPartialOptions,
  ColorType,
  DeepPartial,
  IChartApi,
  TimeChartOptions,
  createChart,
} from 'lightweight-charts';
import { TickerDataRow } from '../../../../types';

export interface TwChartProps {
  readonly precision: number;
  readonly data: readonly TickerDataRow[];
}

export function TwChart({ precision, data }: TwChartProps): React.ReactElement {
  const elementRef = useRef<HTMLDivElement>(null);

  const input = useMemo<Input>(
    () => getInput(precision, data),
    [precision, data],
  );

  console.log('TwChart', input);

  useEffect(() => {
    const chart = elementRef.current
      ? createChart(elementRef.current)
      : undefined;
    initChart(chart, input);

    return () => {
      destroyChart(chart);
    };
  }, [input]);

  return (
    <div className='h-full overflow-hidden'>
      <div ref={elementRef} className='h-full' />
    </div>
  );
}

const UP_COLOR = '#26A69A';
const DOWN_COLOR = '#EF5350';

interface Input {
  readonly precision: number;
  readonly data: readonly TickerDataRow[];
}

function getInput(precision: number, data: readonly TickerDataRow[]): Input {
  return {
    precision,
    data,
  };
}

function initChart(chart: IChartApi | undefined, input: Input): void {
  if (!chart) {
    return;
  }

  const { precision, data } = input;

  const chartOptions: DeepPartial<TimeChartOptions> = {
    autoSize: true,
    layout: {
      textColor: 'black',
      background: { type: ColorType.Solid, color: 'white' },
    },
  };
  chart.applyOptions(chartOptions);

  const seriesOptions: CandlestickSeriesPartialOptions = {
    upColor: UP_COLOR,
    downColor: DOWN_COLOR,
    wickUpColor: UP_COLOR,
    wickDownColor: DOWN_COLOR,
    borderVisible: false,
    priceFormat: {
      type: 'custom',
      formatter: (price: number) => price.toFixed(precision),
      minMove: Math.pow(10, -precision),
    },
  };

  const candlestickSeries = chart.addCandlestickSeries(seriesOptions);

  candlestickSeries.setData([...data]);

  chart.timeScale().fitContent();
}

function destroyChart(chart: IChartApi | undefined): void {
  if (!chart) {
    return;
  }

  chart.remove();
}
