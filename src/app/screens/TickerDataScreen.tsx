import React, { useEffect, useState } from 'react';
import { useStoreTickerData } from '../../store';
import { CandlestickChart } from '../components/shared/chart/CandlestickChart';
import { NumericRange, TickerDataRow } from '../types';
import { parseFloatOrThrow, parseIntegerOrThrow } from '@gmjs/number-util';

export function TickerDataScreen(): React.ReactElement {
  const { isLoadingTickerData, tickerData, getTickerData } =
    useStoreTickerData();

  useEffect(() => {
    getTickerData();
  }, [getTickerData]);

  const [selectedItem, setSelectedItem] = useState<number | undefined>(
    undefined,
  );

  if (isLoadingTickerData || !tickerData) {
    return <div>{'Loading...'}</div>;
  }

  const data = tickerData.map((line) => tickerDataLineToRow(line)).slice(-100);
  const valueRange: NumericRange = {
    start: 15_000,
    end: 17_000,
  };

  return (
    <div className='h-screen'>
      <CandlestickChart
        precision={1}
        data={data}
        interval={'day'}
        valueRange={valueRange}
        selectedItem={selectedItem}
        onSelectItem={setSelectedItem}
      />
    </div>
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
