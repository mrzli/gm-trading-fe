import { Bars } from '../../../types';
import { ChartBars } from '../types';
import { UTCTimestamp } from 'lightweight-charts';
import { utcToTzTimestamp } from './date';

export function getChartBars(bars: Bars, timezone: string): ChartBars {
  // to optimize, we would need to take into account the timezone offset
  // const firstBarTime = bars[0].time;
  // const firstBarChangedTime = utcToTzTimestamp(firstBarTime, timezone);
  // const timeAdjustment = firstBarChangedTime - firstBarTime;

  return bars.map((bar) => {
    return {
      ...bar,
      time: (timezone === 'utc'
        ? bar.time
        : utcToTzTimestamp(bar.time, timezone)) as UTCTimestamp,
      //time: (bar.time + timeAdjustment),
      customValues: {
        realTime: bar.time,
      },
    };
  });
}
