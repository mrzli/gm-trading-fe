import { IChartApi, ISeriesApi, ITimeScaleApi, Time } from 'lightweight-charts';
import { ChartRange, ChartSettings } from '../../../types';
import {
  CrosshairMoveFn,
  TwInitInput,
  ChartTimeRangeChangeFn,
  TwChartApi,
  SetTimeRangeFn,
  SetDataFn,
  GetTimeRangeFn,
  ChartBar,
  ChartBars,
} from '../types';
import {
  getChartOptions,
  getDataSeriesOptions,
  getTimeScaleOptions,
} from './options';
import { applyPlugins } from './plugins';
import { Instrument } from '@gmjs/gm-trading-shared';

export function getTwInitInput(
  precision: number,
  // data: ChartBars,
  onCrosshairMove: CrosshairMoveFn,
  onChartTimeRangeChange: ChartTimeRangeChangeFn,
): TwInitInput {
  return {
    precision,
    // data,
    onCrosshairMove,
    onChartTimeRangeChange,
  };
}

export function initChart(
  settings: ChartSettings,
  instrument: Instrument,
  chart: IChartApi | undefined,
  input: TwInitInput,
): TwChartApi | undefined {
  if (!chart) {
    return undefined;
  }

  const { precision, onCrosshairMove, onChartTimeRangeChange } = input;

  const chartOptions = getChartOptions();
  chart.applyOptions(chartOptions);

  const seriesOptions = getDataSeriesOptions(precision);
  const candlestickSeries = chart.addCandlestickSeries(seriesOptions);

  const timeScaleOptions = getTimeScaleOptions();
  const timeScale = chart.timeScale();
  timeScale.applyOptions(timeScaleOptions);

  const pluginsApi = applyPlugins(
    settings,
    instrument,
    chart,
    candlestickSeries,
  );

  chart.subscribeCrosshairMove((param) => {
    const item = param.seriesData.get(candlestickSeries);
    if (!item) {
      onCrosshairMove(undefined);
      return;
    }

    onCrosshairMove(item as ChartBar);
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
    setData: createSetDataFn(candlestickSeries),
    getTimeRange: createGetTimeRangeFn(timeScale),
    setTimeRange: createSetTimeRangeFn(timeScale),
    plugins: pluginsApi,
  };
}

function createSetDataFn(
  candlestickSeries: ISeriesApi<'Candlestick'>,
): SetDataFn {
  return (data: ChartBars) => {
    candlestickSeries.setData(data as ChartBar[]);
  };
}

function createGetTimeRangeFn(timeScale: ITimeScaleApi<Time>): GetTimeRangeFn {
  return () => {
    const logicalRange = timeScale.getVisibleLogicalRange() ?? undefined;
    if (!logicalRange) {
      return undefined;
    }

    return {
      from: logicalRange.from,
      to: logicalRange.to,
    };
  };
}

function createSetTimeRangeFn(timeScale: ITimeScaleApi<Time>): SetTimeRangeFn {
  return (logicalRange: ChartRange) => {
    timeScale.setVisibleLogicalRange({
      from: logicalRange.from,
      to: logicalRange.to,
    });
  };
}

export function destroyChart(chart: IChartApi | undefined): void {
  if (!chart) {
    return;
  }

  chart.remove();
}
