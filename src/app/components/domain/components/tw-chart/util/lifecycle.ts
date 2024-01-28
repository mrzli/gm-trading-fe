import {
  IChartApi,
  ISeriesApi,
  ITimeScaleApi,
  LogicalRangeChangeEventHandler,
  MouseEventHandler,
  MouseEventParams,
  Time,
} from 'lightweight-charts';
import { ChartRange, ChartSettings } from '../../../types';
import {
  ChartInitInput,
  TwChartApi,
  SetTimeRangeFn,
  SetDataFn,
  GetTimeRangeFn,
  ChartBar,
  ChartBars,
  ChartMouseClickInternalData,
  ChartSubscribeInput,
  ChartSubscribeResult,
  TwChartApiContext,
} from '../types';
import {
  getChartOptions,
  getDataSeriesOptions,
  getTimeScaleOptions,
} from './options';
import { applyPlugins } from './plugins';
import { Instrument } from '@gmjs/gm-trading-shared';

export function initChart(
  settings: ChartSettings,
  instrument: Instrument,
  chart: IChartApi | undefined,
  input: ChartInitInput,
): TwChartApi | undefined {
  if (!chart) {
    return undefined;
  }

  const { precision } = input;

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

  const context = createTwChartApiContext();

  return {
    getChart: () => chart,
    getSeries: () => candlestickSeries,
    setData: createSetDataFn(candlestickSeries),
    getTimeRange: createGetTimeRangeFn(timeScale),
    setTimeRange: createSetTimeRangeFn(timeScale),
    plugins: pluginsApi,
    context,
  };
}

function createTwChartApiContext(): TwChartApiContext {
  let isChartRangeUpdateEnabled = true;

  return {
    setChartRangeUpdateEnabled: (enabled: boolean): void => {
      isChartRangeUpdateEnabled = enabled;
    },
    isChartRangeUpdateEnabled: () => isChartRangeUpdateEnabled,
  };
}

export function subscribeToChartEvents(
  input: ChartSubscribeInput,
  chartApi: TwChartApi,
): ChartSubscribeResult {
  const {
    onCrosshairMove,
    onChartClick,
    onChartDoubleClick,
    onChartTimeRangeChange,
  } = input;

  const chart = chartApi.getChart();
  const candlestickSeries = chartApi.getSeries();

  const timeScale = chart.timeScale();

  const handleCrosshairMove: MouseEventHandler<Time> = (param) => {
    const item = param.seriesData.get(candlestickSeries);
    if (!item) {
      onCrosshairMove(undefined);
      return;
    }

    onCrosshairMove(item as ChartBar);
  };

  chart.subscribeCrosshairMove(handleCrosshairMove);

  const handleClick: MouseEventHandler<Time> = (param) => {
    onChartClick(toChartMouseClickInternalData(candlestickSeries, param));
  };

  chart.subscribeClick(handleClick);

  const handleDoubleClick: MouseEventHandler<Time> = (param) => {
    onChartDoubleClick(toChartMouseClickInternalData(candlestickSeries, param));
  };

  chart.subscribeDblClick(handleDoubleClick);

  const handleVisibleLogicalRangeChange: LogicalRangeChangeEventHandler = (
    param,
  ) => {
    if (!chartApi.context.isChartRangeUpdateEnabled()) {
      return;
    }

    if (!param) {
      onChartTimeRangeChange(undefined);
      return;
    }

    onChartTimeRangeChange({
      from: param.from,
      to: param.to,
    });
  };

  timeScale.subscribeVisibleLogicalRangeChange(handleVisibleLogicalRangeChange);

  return {
    unsubscribe: (): void => {
      chart.unsubscribeCrosshairMove(handleCrosshairMove);
      chart.unsubscribeClick(handleClick);
      chart.unsubscribeDblClick(handleDoubleClick);
      timeScale.unsubscribeVisibleLogicalRangeChange(
        handleVisibleLogicalRangeChange,
      );
    },
  };
}

function toChartMouseClickInternalData(
  candlestickSeries: ISeriesApi<'Candlestick'>,
  param: MouseEventParams<Time>,
): ChartMouseClickInternalData {
  const { logical, point } = param;
  return {
    index: logical === undefined ? undefined : logical,
    price:
      point === undefined
        ? undefined
        : candlestickSeries.coordinateToPrice(point.y) ?? undefined,
    point,
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
