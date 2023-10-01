import React, { useState } from 'react';
import { CandlestickChart } from '../shared/chart/CandlestickChart';
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
  const [selectedItem, setSelectedItem] = useState<number | undefined>(
    undefined,
  );

  const data = rawData.map((element) => tickerDataLineToRow(element));

  const valueRange: NumericRange = {
    start: 15_100,
    end: 15_160,
  };

  return (
    <CandlestickChart
      precision={1}
      data={data}
      interval={resolution}
      valueRange={valueRange}
      selectedItem={selectedItem}
      onSelectItem={setSelectedItem}
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
