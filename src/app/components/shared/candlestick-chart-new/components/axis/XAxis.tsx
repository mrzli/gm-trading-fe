import React from 'react';
import { AxisTickItem, XAxisLocation } from '../../types';
import { TICK_SIZE, FONT_SIZE, LINE_TO_TEXT_OFFSET } from './axis-util';

export interface XAxisProps {
  readonly x: number;
  readonly y: number;
  readonly location: XAxisLocation;
  readonly size: number;
  readonly ticks: readonly AxisTickItem[];
}

export function XAxis({
  x,
  y,
  location,
  size,
  ticks,
}: XAxisProps): React.ReactElement {
  const isTop = location === 'top';

  const tickY2 = isTop ? -TICK_SIZE : TICK_SIZE;

  return (
    <g transform={`translate(${x + 0.5}, ${y + 0.5})`}>
      <line x1={0} y1={0} x2={size} y2={0} stroke='black' strokeWidth={1} />
      {ticks.map((tick, index) => (
        <g key={index}>
          <line
            x1={tick.offset}
            y1={0}
            x2={tick.offset}
            y2={tickY2}
            stroke='black'
            strokeWidth={1}
          />
          {tick.textLines.map((textLine, index) => (
            <text
              key={index}
              x={tick.offset}
              y={getTextLineY(isTop, index, tick.textLines.length)}
              textAnchor='middle'
              dominantBaseline={isTop ? 'auto' : 'hanging'}
              fontSize={FONT_SIZE}
            >
              {textLine}
            </text>
          ))}
        </g>
      ))}
    </g>
  );
}

function getTextLineY(isTop: boolean, index: number, numLines: number): number {
  return isTop
    ? -LINE_TO_TEXT_OFFSET - (numLines - 1 - index) * FONT_SIZE
    : LINE_TO_TEXT_OFFSET + index * FONT_SIZE;
}
