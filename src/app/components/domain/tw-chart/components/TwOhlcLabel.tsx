import React, { useMemo } from 'react';
import { COLOR_DOWN, COLOR_UP } from '../util';

export interface TwOhlcLabelProps {
  readonly o: number;
  readonly h: number;
  readonly l: number;
  readonly c: number;
  readonly precision: number;
}

type LabelValuePair = readonly [label: string, value: number];

export function TwOhlcLabel({
  o,
  h,
  l,
  c,
  precision,
}: TwOhlcLabelProps): React.ReactElement {
  const isUp = c >= o;

  const items = useMemo<readonly LabelValuePair[]>(() => {
    return [
      ['O', o],
      ['H', h],
      ['L', l],
      ['C', c],
    ];
  }, [o, h, l, c]);

  return (
    <div className='inline-flex flex-row gap-1 px-1 bg-slate-100/40 border border-slate-300 rounded'>
      {items.map(([label, value]) => {
        return (
          <span key={label} className=''>
            {getOhlcElement(label, value, precision, isUp)}
          </span>
        );
      })}
    </div>
  );
}

function getOhlcElement(
  label: string,
  value: number,
  precision: number,
  isUp: boolean,
): React.ReactElement {
  const color = isUp ? COLOR_UP : COLOR_DOWN;

  return (
    <span className='flex flex-row items-center'>
      <span className='font-semibold mr-[1px]'>{label}</span>
      <span className='font-sm' style={{ color }}>
        {format(value, precision)}
      </span>
    </span>
  );
}

function format(value: number, precision: number): string {
  return value.toFixed(precision);
}
