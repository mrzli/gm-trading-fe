import { IChartApi } from 'lightweight-charts';
import { ensureNotUndefined } from '@gmjs/assert';
import {
  ChartPrimitiveContext,
  ChartSeriesApi,
  ChartTimeScaleApi,
} from '../types';

export type ChartPrimitiveContextInitialize = (
  chart: IChartApi,
  series: ChartSeriesApi,
) => void;

export type ChartPrimitiveContextDestroy = () => void;

export function createChartPrimitiveContext(): readonly [
  ChartPrimitiveContextInitialize,
  ChartPrimitiveContextDestroy,
  ChartPrimitiveContext,
] {
  let _chart: IChartApi | undefined = undefined;
  let _series: ChartSeriesApi | undefined = undefined;
  // let _requestUpdate: RequestUpdate | undefined = undefined;

  function chart(): IChartApi {
    return ensureNotUndefined(_chart);
  }

  function series(): ChartSeriesApi {
    return ensureNotUndefined(_series);
  }

  function timeScale(): ChartTimeScaleApi {
    return chart().timeScale();
  }

  function initialize(chart: IChartApi, series: ChartSeriesApi): void {
    _chart = chart;
    _series = series;
    // _requestUpdate = ru;
  }

  function destroy(): void {
    // _requestUpdate = undefined;
    _series = undefined;
    _chart = undefined;
  }

  const primitiveContext: ChartPrimitiveContext = {
    chart,
    series,
    timeScale,
  };

  return [initialize, destroy, primitiveContext];
}
