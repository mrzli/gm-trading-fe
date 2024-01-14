import { IChartApi } from 'lightweight-charts';
import { ChartSeriesApi, ChartTimeScaleApi, RequestUpdate } from './types';

export interface ChartPrimitiveContext {
  readonly chart: () => IChartApi;
  readonly series: () => ChartSeriesApi;
  readonly timeScale: () => ChartTimeScaleApi;
  readonly requestUpdate: RequestUpdate;
}
