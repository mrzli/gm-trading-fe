import { ISeriesApi, ITimeScaleApi, Time } from 'lightweight-charts';

export type ChartHorizontalScaleItem = Time;
export type ChartSeriesType = 'Candlestick';
export type RequestUpdate = () => void;

export type ChartSeriesApi = ISeriesApi<ChartSeriesType>;
export type ChartTimeScaleApi = ITimeScaleApi<ChartHorizontalScaleItem>;
