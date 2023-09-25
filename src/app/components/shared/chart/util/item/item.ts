import { TickerDataRow } from '../../../../../types';
import { CandlestickChartDataItem } from '../../types';
import { getItemX } from '../position';
import { CandlestickChartXScale, CandlestickChartYScale } from '../scale';

export function toCandlestickChartDataItem(
  item: TickerDataRow,
  xScale: CandlestickChartXScale,
  yScale: CandlestickChartYScale,
): CandlestickChartDataItem {
  return {
    x: getItemX(item.ts.toString(), xScale),
    w: xScale.bandwidth(),
    o: yScale(item.o),
    h: yScale(item.h),
    l: yScale(item.l),
    c: yScale(item.c),
    tooltip: {
      ts: item.ts,
      o: item.o,
      h: item.h,
      l: item.l,
      c: item.c,
    },
  };
}
