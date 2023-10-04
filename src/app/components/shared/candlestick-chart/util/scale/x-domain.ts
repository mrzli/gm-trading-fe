import { TickerDataResolution } from '@gmjs/gm-trading-shared';
import { TickerDataRow } from '../../../../../types';
import { tickerDataResolutionToSeconds } from '../data';

export function toXDomain(
  data: readonly TickerDataRow[],
  interval: TickerDataResolution,
): readonly number[] {
  const tsList = data.map((data) => data.ts);
  const extendedTsList = extendTimestampListByOne(tsList, interval);
  return extendedTsList;
}

function extendTimestampListByOne(
  tsList: readonly number[],
  interval: TickerDataResolution,
): readonly number[] {
  if (tsList.length === 0) {
    return [];
  }

  const lastTs = tsList.at(-1) ?? 0;
  const nextTs = lastTs + tickerDataResolutionToSeconds(interval);

  return [...tsList, nextTs];
}



// import { TickerDataResolution } from '@gmjs/gm-trading-shared';
// import { TickerDataRow } from '../../../../../types';
// import { tickerDataResolutionToSeconds } from '../data';
// import { CandlestickChartPosition } from '../../types';
// import { findIndexBinaryExact } from '../util';
// import { applyFn } from '@gmjs/apply-function';
// import { compose } from '@gmjs/compose-function';
// import { range } from '@gmjs/value-generators';
// import { map, toArray } from '@gmjs/value-transformers';

// export function toXDomain(
//   data: readonly TickerDataRow[],
//   interval: TickerDataResolution,
//   position: CandlestickChartPosition,
// ): readonly number[] {
//   const { xTs, xCandleOffset, xCandleWidth } = position;

//   const referentIndex = findIndexBinaryExact(data, xTs, (data) => data.ts);
//   const minIndex = referentIndex - Math.floor(xCandleWidth - xCandleOffset);
//   const maxIndex = referentIndex + Math.floor(xCandleOffset);

//   const visibleData = data.slice(minIndex, maxIndex + 1).map((data) => data.ts);
//   return [
//     ...getTsExtensionsBefore(data, interval, minIndex),
//     ...visibleData,
//     ...getTsExtensionsAfter(data, interval, maxIndex),
//   ];
// }

// function getTsExtensionsBefore(
//   data: readonly TickerDataRow[],
//   interval: TickerDataResolution,
//   minIndex: number,
// ): readonly number[] {
//   if (minIndex >= 0) {
//     return [];
//   }

//   const firstTs = data[0]?.ts as number;
//   const stepTs = tickerDataResolutionToSeconds(interval);
//   return applyFn(
//     range(minIndex, 0),
//     compose(
//       map((index) => firstTs + stepTs * index),
//       toArray()
//     )
//   );
// }

// function getTsExtensionsAfter(
//   data: readonly TickerDataRow[],
//   interval: TickerDataResolution,
//   maxIndex: number,
// ): readonly number[] {
//   const lastIndex = data.length - 1;
//   if (maxIndex <= lastIndex) {
//     return [];
//   }

//   const firstTs = data[0]?.ts as number;
//   const stepTs = tickerDataResolutionToSeconds(interval);
//   return applyFn(
//     range(lastIndex + 1, maxIndex + 1),
//     compose(
//       map((index) => firstTs + stepTs * index),
//       toArray()
//     )
//   );
// }
