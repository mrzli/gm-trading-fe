import { IChartApi, ISeriesApi } from 'lightweight-charts';
import { ChartRange } from '../../../../types';
import { ChartBars } from '../chart-bar';
import { TwPluginsApi } from '../plugins';

export interface TwChartApi {
  readonly getChart: () => IChartApi;
  readonly getSeries: () => ISeriesApi<'Candlestick'>;
  readonly setData: SetDataFn;
  readonly getTimeRange: GetTimeRangeFn;
  readonly setTimeRange: SetTimeRangeFn;
  readonly plugins: TwPluginsApi;
  readonly context: TwChartApiContext;
}

export type SetDataFn = (data: ChartBars) => void;
export type GetTimeRangeFn = () => ChartRange | undefined;
export type SetTimeRangeFn = (range: ChartRange) => void;

export interface TwChartApiContext {
  readonly setChartRangeUpdateEnabled: (enabled: boolean) => void;
  readonly isChartRangeUpdateEnabled: () => boolean;
}
