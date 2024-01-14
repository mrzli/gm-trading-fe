import { IChartApi } from 'lightweight-charts';
import { ChartSeriesApi, ChartTimeScaleApi } from './types';

export interface ChartPrimitiveContext {
  readonly chart: () => IChartApi;
  readonly series: () => ChartSeriesApi;
  readonly timeScale: () => ChartTimeScaleApi;
}
