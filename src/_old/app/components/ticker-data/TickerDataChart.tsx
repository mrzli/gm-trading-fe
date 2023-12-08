import React, { useState } from 'react';
import { CandlestickChart } from '../shared/candlestick-chart/CandlestickChart';
import { TickerDataRow } from '../../../app/types';
import { parseIntegerOrThrow, parseFloatOrThrow } from '@gmjs/number-util';
import { TickerDataResolution } from '@gmjs/gm-trading-shared';
import { applyFn } from '@gmjs/apply-function';
import { compose } from '@gmjs/compose-function';
import { maxBy, minBy } from '@gmjs/value-transformers';
import { CandlestickChartPosition } from '../shared/candlestick-chart/types';

export interface TickerDataChartProps {
  readonly resolution: TickerDataResolution;
  readonly rawData: readonly string[];
}

export function TickerDataChart({
  resolution,
  rawData,
}: TickerDataChartProps): React.ReactElement {
  const data = rawData.map((element) => tickerDataLineToRow(element));

  const [position, setPosition] = useState<CandlestickChartPosition>(
    getInitialPosition(data),
  );

  return (
    <CandlestickChart
      precision={1}
      data={data}
      resolution={resolution}
      position={position}
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

const INITIAL_CANDLE_COUNT = 50;
const INITIAL_CANDLE_OFFSET = 10;
const PRICE_RANGE_PADDING = 0.2;

function getInitialPosition(
  data: readonly TickerDataRow[],
): CandlestickChartPosition {
  const lastTs = data.at(-1)?.ts ?? 0;

  const visibleDataCount = INITIAL_CANDLE_COUNT - INITIAL_CANDLE_OFFSET;
  const visibleData = data.slice(-visibleDataCount);

  const minPrice = applyFn(visibleData, compose(minBy((row) => row.l)));
  const maxPrice = applyFn(visibleData, compose(maxBy((row) => row.h)));
  const centerPrice = (minPrice + maxPrice) / 2;
  const visiblePriceRange = maxPrice - minPrice;
  const priceHeight = visiblePriceRange * (1 + PRICE_RANGE_PADDING * 2);

  console.log(
    visibleDataCount,
    visibleData,
    minPrice,
    maxPrice,
    centerPrice,
    visiblePriceRange,
    priceHeight,
  );

  return {
    xTs: lastTs,
    xCandleOffset: INITIAL_CANDLE_OFFSET,
    xCandleWidth: INITIAL_CANDLE_COUNT,
    yCenterPrice: centerPrice,
    yPriceHeight: priceHeight,
  };
}
