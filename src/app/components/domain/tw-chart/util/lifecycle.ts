import { IChartApi } from 'lightweight-charts';
import { TickerDataRow } from '../../../../types';
import { CrosshairMoveFn, TwInitInput, ChartTimeRangeChangeFn } from '../types';
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
): void {
  if (!chart) {
    return;
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
}

export function destroyChart(chart: IChartApi | undefined): void {
  if (!chart) {
    return;
  }

  chart.remove();
}
