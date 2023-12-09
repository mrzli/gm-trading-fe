import {
  DeepPartial,
  TimeChartOptions,
  ColorType,
  CrosshairMode,
  CandlestickSeriesPartialOptions,
  TimeScaleOptions,
} from 'lightweight-charts';
import { COLOR_UP, COLOR_DOWN } from './colors';

export function getChartOptions(): DeepPartial<TimeChartOptions> {
  return {
    autoSize: true,
    crosshair: {
      mode: CrosshairMode.Normal,
    },
    layout: {
      textColor: 'black',
      background: { type: ColorType.Solid, color: 'white' },
    },
    localization: {
      // 'en-US' causes an error in Chrome, displays 24:15 instead of 00:15 (up to 01:00)
      // could be related to this: https://stackoverflow.com/a/55823036/520229 (hourCycle)
      locale: 'en-GB',
      dateFormat: 'yyyy-MM-dd',
    },
    rightPriceScale: {
      autoScale: false,
    },
  };
}

export function getDataSeriesOptions(
  precision: number,
): CandlestickSeriesPartialOptions {
  return {
    upColor: COLOR_UP,
    downColor: COLOR_DOWN,
    wickUpColor: COLOR_UP,
    wickDownColor: COLOR_DOWN,
    borderVisible: false,
    priceFormat: {
      type: 'custom',
      formatter: (price: number) => price.toFixed(precision),
      minMove: Math.pow(10, -precision),
    },
  };
}

export function getTimeScaleOptions(): DeepPartial<TimeScaleOptions> {
  return {
    barSpacing: 20,
    timeVisible: true,
    secondsVisible: false,
  };
}
