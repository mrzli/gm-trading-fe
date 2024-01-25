import {
  IChartApi,
  ISeriesApi,
  ITimeScaleApi,
  MouseEventParams,
  Time,
} from 'lightweight-charts';
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
  ChartMouseClickFn,
  ChartMouseClickInternalData,
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
  onChartClick: ChartMouseClickFn,
  onChartDoubleClick: ChartMouseClickFn,
  onChartTimeRangeChange: ChartTimeRangeChangeFn,
): TwInitInput {
  return {
    precision,
    // data,
    onCrosshairMove,
    onChartClick,
    onChartDoubleClick,
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

  const {
    precision,
    onCrosshairMove,
    onChartClick,
    onChartDoubleClick,
    onChartTimeRangeChange,
  } = input;

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

  chart.subscribeClick((param) => {
    const { logical, point } = param;
    const data: ChartMouseClickInternalData = {
      index: logical === undefined ? undefined : logical,
      price:
        point === undefined
          ? undefined
          : candlestickSeries.coordinateToPrice(point.y) ?? undefined,
      point,
    };
    onChartClick(data);
  });

  chart.subscribeClick((param) => {
    onChartClick(toChartMouseClickInternalData(candlestickSeries, param));
  });

  chart.subscribeDblClick((param) => {
    onChartDoubleClick(toChartMouseClickInternalData(candlestickSeries, param));
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
