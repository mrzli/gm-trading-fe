import {
  IChartApi,
  ISeriesApi,
  Time,
  isUTCTimestamp,
} from 'lightweight-charts';
import { Instrument, TickerDataResolution } from '@gmjs/gm-trading-shared';
import { unixSecondsToDateObjectTz } from '@gmjs/date-util';
import { ChartSettings, ChartTimezone } from '../../../types';
import { SessionHighlighting, SessionHighlighter } from '../plugins';
import { tzToUtcTimestamp } from './date';
import { dateObjectTzToWeekday, getHourMinute } from '../../../util';

export function applyPlugins(
  settings: ChartSettings,
  instrument: Instrument,
  _chart: IChartApi,
  series: ISeriesApi<'Candlestick'>,
): void {
  const { resolution, timezone, additional } = settings;
  const { highlightSession } = additional;

  // new UserPriceLines(chart, series, {});

  if (
    highlightSession &&
    HIGHLIGHTING_RESOLUTIONS.has(resolution) &&
    instrument.openTime !== instrument.closeTime
  ) {
    const sessionHighlighter = createSessionHighlighter(timezone, instrument);
    const sessionHighlighting = new SessionHighlighting(sessionHighlighter);
    series.attachPrimitive(sessionHighlighting);
  }
}

const HIGHLIGHTING_RESOLUTIONS: ReadonlySet<TickerDataResolution> = new Set([
  '1m',
  '2m',
  '5m',
  '10m',
  '15m',
]);

function createSessionHighlighter(
  timezone: ChartTimezone,
  instrument: Instrument,
): SessionHighlighter {
  const { timezone: instrumentTimezone, openTime, closeTime } = instrument;
  const [openHour, openMinute] = getHourMinute(openTime);
  const [closeHour, closeMinute] = getHourMinute(closeTime);
  const openMinuteOfDay = openHour * 60 + openMinute;
  const closeMinuteOfDay = closeHour * 60 + closeMinute;

  return (chartAdjustedTime: Time): string => {
    if (!isUTCTimestamp(chartAdjustedTime)) {
      return '';
    }

    const time = tzToUtcTimestamp(chartAdjustedTime, timezone);
    const dateObject = unixSecondsToDateObjectTz(time, instrumentTimezone);
    const weekday = dateObjectTzToWeekday(dateObject);
    if (weekday > 5) {
      return '';
    }

    const { hour, minute } = dateObject;

    const minuteOfDay = hour * 60 + minute;

    return minuteOfDay >= openMinuteOfDay && minuteOfDay < closeMinuteOfDay
      ? 'rgba(41, 98, 255, 0.08)'
      : '';
  };
}
