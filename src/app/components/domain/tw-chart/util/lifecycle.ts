import { IChartApi, ITimeScaleApi, Time } from 'lightweight-charts';
import { TickerDataRow } from '../../../../types';
import {
  CrosshairMoveFn,
  TwInitInput,
  ChartTimeRangeChangeFn,
  TwChartApi,
  TwRange,
  SetTimeRangeFn,
} from '../types';
import {
  getChartOptions,
  getDataSeriesOptions,
  getTimeScaleOptions,
} from './options';

export function getTwInitInput(
  precision: number,
  data: readonly TickerDataRow[],
  onCrosshairMove: CrosshairMoveFn,
  onChartTimeRangeChange: ChartTimeRangeChangeFn,
): TwInitInput {
  return {
    precision,
    data,
    onCrosshairMove,
    onChartTimeRangeChange,
  };
}

export function initChart(
  chart: IChartApi | undefined,
  input: TwInitInput,
): TwChartApi | undefined {
  if (!chart) {
    return undefined;
  }

  const { precision, data, onCrosshairMove, onChartTimeRangeChange } = input;

  const chartOptions = getChartOptions();
  chart.applyOptions(chartOptions);

  const seriesOptions = getDataSeriesOptions(precision);
  const candlestickSeries = chart.addCandlestickSeries(seriesOptions);
  candlestickSeries.setData([...data]);

  const timeScaleOptions = getTimeScaleOptions();
  const timeScale = chart.timeScale();
  timeScale.applyOptions(timeScaleOptions);

  chart.subscribeCrosshairMove((param) => {
    const item = param.seriesData.get(candlestickSeries);
    if (!item) {
      onCrosshairMove(undefined);
      return;
    }

    onCrosshairMove(item as TickerDataRow);
  });

  timeScale.subscribeVisibleLogicalRangeChange((param) => {
    if (!param) {
      onChartTimeRangeChange(undefined);
      return;
    }

    onChartTimeRangeChange({
      from: param.from,
      to: param.to,
    });
  });

  return {
    setTimeRange: createSetTimeRangeFn(timeScale),
  };
}

function createSetTimeRangeFn(timeScale: ITimeScaleApi<Time>): SetTimeRangeFn {
  return (timeRange: TwRange) => {
    timeScale.setVisibleLogicalRange({
      from: timeRange.from,
      to: timeRange.to,
    });
  };
}

export function destroyChart(chart: IChartApi | undefined): void {
  if (!chart) {
    return;
  }

  chart.remove();
}
