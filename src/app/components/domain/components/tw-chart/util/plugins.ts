import { IChartApi, ISeriesApi } from 'lightweight-charts';
import { Instrument, TickerDataResolution } from '@gmjs/gm-trading-shared';
import { ChartSettings } from '../../../types';
import {
  createSeriesPrimitiveSessionHighlight,
  SessionHighlightOptions,
} from '../plugins';

export function applyPlugins(
  settings: ChartSettings,
  instrument: Instrument,
  _chart: IChartApi,
  series: ISeriesApi<'Candlestick'>,
): void {
  const { resolution, timezone, additional } = settings;
  const { highlightSession } = additional;

  if (
    highlightSession &&
    HIGHLIGHTING_RESOLUTIONS.has(resolution) &&
    instrument.openTime !== instrument.closeTime
  ) {
    const sessionHighlightOptions: SessionHighlightOptions = {
      instrument,
      chartTimezone: timezone,
      color: 'rgba(41, 98, 255, 0.08)',
    };
    const sessionHighlightPrimitive = createSeriesPrimitiveSessionHighlight(
      sessionHighlightOptions,
    );
    series.attachPrimitive(sessionHighlightPrimitive);
  }
}

const HIGHLIGHTING_RESOLUTIONS: ReadonlySet<TickerDataResolution> = new Set([
  '1m',
  '2m',
  '5m',
  '10m',
  '15m',
]);
