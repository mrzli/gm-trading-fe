import { IChartApi } from 'lightweight-charts';
import { TickerDataRow } from '../../../../../types';
import { TwInitInput } from '../types';
import { getChartOptions, getDataSeriesOptions, getTimeScaleOptions } from './options';

export function getTwInitInput(
  precision: number,
  data: readonly TickerDataRow[],
): TwInitInput {
  return {
    precision,
    data,
  };
}

export function initChart(
  chart: IChartApi | undefined,
  input: TwInitInput,
): void {
  if (!chart) {
    return;
  }

  const { precision, data } = input;

  const chartOptions = getChartOptions();
  chart.applyOptions(chartOptions);

  const seriesOptions = getDataSeriesOptions(precision);
  const candlestickSeries = chart.addCandlestickSeries(seriesOptions);
  candlestickSeries.setData([...data]);

  const timeScaleOptions = getTimeScaleOptions();
  chart.timeScale().applyOptions(timeScaleOptions);
}

export function destroyChart(chart: IChartApi | undefined): void {
  if (!chart) {
    return;
  }

  chart.remove();
}
