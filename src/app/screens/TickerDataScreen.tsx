import React, { useEffect, useState } from 'react';
import { useStoreInstrument, useStoreTickerData } from '../../store';
import { CandlestickChart } from '../components/shared/chart/CandlestickChart';
import { NumericRange, TickerDataRow } from '../types';
import { parseFloatOrThrow, parseIntegerOrThrow } from '@gmjs/number-util';
import { LoadingDisplay } from '../components/shared/display/LoadingDisplay';

export function TickerDataScreen(): React.ReactElement {
  const { isLoadingAllInstruments, allInstruments, getAllInstruments } =
    useStoreInstrument();

  const { isLoadingTickerData, tickerData, getTickerData } =
    useStoreTickerData();

  useEffect(() => {
    getAllInstruments();
    // getTickerData();
  }, [getAllInstruments]);

  const [selectedItem, setSelectedItem] = useState<number | undefined>(
    undefined,
  );

  if (isLoadingAllInstruments || !allInstruments) {
    return <LoadingDisplay />;
  }

  return (
    <div>
      <pre>{JSON.stringify(allInstruments, undefined, 2)}</pre>
    </div>
  );

  // const data = tickerData.map((line) => tickerDataLineToRow(line)).slice(-100);
  // const valueRange: NumericRange = {
  //   start: 15_000,
  //   end: 17_000,
  // };

  // return (
  //   <div className='h-screen'>
  //     <CandlestickChart
  //       precision={1}
  //       data={data}
  //       interval={'day'}
  //       valueRange={valueRange}
  //       selectedItem={selectedItem}
  //       onSelectItem={setSelectedItem}
  //     />
  //   </div>
  // );
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
