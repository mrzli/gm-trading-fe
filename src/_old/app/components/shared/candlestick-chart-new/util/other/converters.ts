import { Rect, TickerDataRow } from '../../../../../../app/types';
import { CandlestickChartPosition, CandleVisualData } from '../../types';

export function toCandleVisualData(
  item: TickerDataRow,
  position: CandlestickChartPosition,
  chartRect: Rect,
): CandleVisualData {
  const { o, h, l, c } = item;
  if (chartRect.height === 0) {
    return { y1: 0, y2: 0, y3: 0, y4: 0, isBull: false };
  }

  const maxOc = Math.max(o, c);
  const minOc = Math.min(o, c);

  const y1 = priceToCoord(h, position, chartRect);
  const y2 = priceToCoord(maxOc, position, chartRect);
  const y3 = priceToCoord(minOc, position, chartRect);
  const y4 = priceToCoord(l, position, chartRect);

  const isBull = c > o;

  return { y1, y2, y3, y4, isBull };
}

export function priceToCoord(
  price: number,
  position: CandlestickChartPosition,
  chartRect: Rect,
): number {
  const { yPrice, yPriceHeight } = position;
  const { height } = chartRect;

  const minPrice = yPrice;
  const maxPrice = yPrice + yPriceHeight;

  const priceFraction = 1 - (price - minPrice) / (maxPrice - minPrice);

  return priceFraction * height;
}
