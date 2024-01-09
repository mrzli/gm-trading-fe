import {
  IChartApi,
  ISeriesApi,
  Time,
  isBusinessDay,
  isUTCTimestamp,
} from 'lightweight-charts';
import { ChartSettings } from '../../../types';
// import { SessionHighlighting } from '../plugins';

export function applyPlugins(
  settings: ChartSettings,
  _chart: IChartApi,
  series: ISeriesApi<'Candlestick'>,
): void {
  const { additional } = settings;
  const { highlightSession } = additional;

  // new UserPriceLines(chart, series, {});

  // if (highlightSession) {
  //   const sessionHighlighting = new SessionHighlighting(sessionHighlighter);
  //   series.attachPrimitive(sessionHighlighting);
  // }
}

// TODO several things related to session highlighting
// maybe only show on 15 min and below
// need to take into account the timezone related shift to timestamps I made to the chart
// and obviously the time and timezone from instrument, and the day of the week
// no need to implement weekends for now, my data doesn't have it apparently

function getDate(time: Time): Date {
  if (isUTCTimestamp(time)) {
    return new Date(time * 1000);
  } else if (isBusinessDay(time)) {
    return new Date(time.year, time.month, time.day);
  } else {
    return new Date(time);
  }
}

function sessionHighlighter(time: Time): string {
  const date = getDate(time);
  const dayOfWeek = date.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    // Weekend 🏖️
    return 'rgba(255, 152, 1, 0.08)';
  }
  return 'rgba(41, 98, 255, 0.08)';
}
