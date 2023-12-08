import {
  DeepPartial,
  TimeChartOptions,
  ColorType,
  CrosshairMode,
  CandlestickSeriesPartialOptions,
  TimeScaleOptions,
} from 'lightweight-charts';

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
      locale: 'en-US',
      dateFormat: 'yyyy-MM-dd',
    },
  };
}

const UP_COLOR = '#26A69A';
const DOWN_COLOR = '#EF5350';

export function getDataSeriesOptions(
  precision: number,
): CandlestickSeriesPartialOptions {
  return {
    upColor: UP_COLOR,
    downColor: DOWN_COLOR,
    wickUpColor: UP_COLOR,
    wickDownColor: DOWN_COLOR,
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
