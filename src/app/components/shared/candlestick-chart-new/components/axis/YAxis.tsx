import React from 'react';
import { AxisTickItem, YAxisLocation } from '../../types';
import {
  TICK_SIZE,
  FONT_SIZE,
  LINE_TO_TEXT_OFFSET,
  TEXT_ELEMENT_SIZE,
} from './axis-util';

export interface YAxisProps {
  readonly x: number;
  readonly y: number;
  readonly location: YAxisLocation;
  readonly size: number;
  readonly ticks: readonly AxisTickItem[];
}

export function YAxis({
  x,
  y,
  location,
  size,
  ticks,
}: YAxisProps): React.ReactElement {
  const isLeft = location === 'left';

  const tickX2 = isLeft ? -TICK_SIZE : TICK_SIZE;

  return (
    <g transform={`translate(${x + 0.5}, ${y + 0.5})`}>
      <line x1={0} y1={0} x2={0} y2={size} stroke='black' strokeWidth={1} />
      {ticks.map((tick, index) => (
        <g key={index}>
          <line
            x1={0}
            y1={tick.offset}
            x2={tickX2}
            y2={tick.offset}
            stroke='black'
            strokeWidth={1}
          />
          {tick.textLines.map((textLine, index) => (
            <text
              key={index}
              x={getTextLineX(isLeft)}
              y={getTextLineY(tick.offset, index, tick.textLines.length)}
              textAnchor={isLeft ? 'end' : 'start'}
              dominantBaseline={'middle'}
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

function getTextLineX(isLeft: boolean): number {
  return isLeft ? -LINE_TO_TEXT_OFFSET : LINE_TO_TEXT_OFFSET;
}

function getTextLineY(offset: number, index: number, numLines: number): number {
  const firstY = offset - ((numLines - 1) * TEXT_ELEMENT_SIZE) / 2;
  return firstY + index * TEXT_ELEMENT_SIZE;
}
