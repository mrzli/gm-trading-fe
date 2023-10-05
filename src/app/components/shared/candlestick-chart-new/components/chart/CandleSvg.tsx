import React from 'react';

export interface CandleSvgProps {
  readonly x: number;
  readonly w: number;
  readonly y1: number;
  readonly y2: number;
  readonly y3: number;
  readonly y4: number;
  readonly isBull: boolean;
}

export function CandleSvg({
  x,
  w,
  y1,
  y2,
  y3,
  y4,
  isBull,
}: CandleSvgProps): React.ReactElement {
  const halfWidth = w / 2;

  const rectX = x - halfWidth;

  // we don't want the candle rect to disappear on 0 height
  const rectHeight = Math.max(y3 - y2, MIN_CANDLE_HEIGHT);
  const fill = isBull ? COLOR_BULL : COLOR_BEAR;

  return (
    <g>
      <line
        x1={x}
        y1={y1}
        x2={x}
        y2={y2}
        stroke={COLOR_BORDER}
        strokeWidth={STROKE_WIDTH}
      />
      <rect
        x={rectX}
        y={y2}
        width={w}
        height={rectHeight}
        fill={fill}
        stroke={COLOR_BORDER}
        strokeWidth={STROKE_WIDTH}
      />
      <line
        x1={x}
        y1={y3}
        x2={x}
        y2={y4}
        stroke={COLOR_BORDER}
        strokeWidth={STROKE_WIDTH}
      />
    </g>
  );
}

const MIN_CANDLE_HEIGHT = 0.0001;
const STROKE_WIDTH = 2;
const COLOR_BULL = '#059669';
const COLOR_BEAR = '#DC2626';
const COLOR_BORDER = '#000000';
