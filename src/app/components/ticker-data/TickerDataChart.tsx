import React from 'react';
import { CandlestickChart } from '../shared/candlestick-chart/CandlestickChart';
import { NumericRange, TickerDataRow } from '../../types';
import { parseIntegerOrThrow, parseFloatOrThrow } from '@gmjs/number-util';
import { TickerDataResolution } from '@gmjs/gm-trading-shared';

export interface TickerDataChartProps {
  readonly resolution: TickerDataResolution;
  readonly rawData: readonly string[];
}

export function TickerDataChart({
  resolution,
  rawData,
}: TickerDataChartProps): React.ReactElement {
  const data = rawData.map((element) => tickerDataLineToRow(element));

  const priceRange: NumericRange = {
    start: 15_320,
    end: 15_520,
  };

  return (
    <CandlestickChart
      precision={1}
      data={data}
      resolution={resolution}
      priceRange={priceRange}
    />
  );
}

function tickerDataLineToRow(line: string): TickerDataRow {
  const parts = line.split(',');

  return {
    ts: parseIntegerOrThrow(parts[0] ?? ''),
    date: parts[1] ?? '',
    o: parseFloatOrThrow(parts[2] ?? ''),
    h: parseFloatOrThrow(parts[3] ?? ''),
    l: parseFloatOrThrow(parts[4] ?? ''),
    c: parseFloatOrThrow(parts[5] ?? ''),
  };
}
