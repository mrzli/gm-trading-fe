import { Rect } from '../../../../../types';

export interface CandlestickChartAreaMargin {
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
}

const CANDLESTICK_CHART_MARGIN: CandlestickChartAreaMargin = {
  top: 20,
  right: 80,
  bottom: 100,
  left: 60,
};

export function getChartArea(chartWidth: number, chartHeight: number): Rect {
  return {
    x: CANDLESTICK_CHART_MARGIN.left,
    y: CANDLESTICK_CHART_MARGIN.top,
    width: Math.max(
      chartWidth -
        CANDLESTICK_CHART_MARGIN.left -
        CANDLESTICK_CHART_MARGIN.right,
      0,
    ),
    height: Math.max(
      chartHeight -
        CANDLESTICK_CHART_MARGIN.top -
        CANDLESTICK_CHART_MARGIN.bottom,
      0,
    ),
  };
}
