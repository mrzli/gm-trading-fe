import React from 'react';

export interface GridProps {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly horizontal: readonly number[];
  readonly vertical: readonly number[];
}

const OPACITY = 0.2;

export function Grid({
  x,
  y,
  width,
  height,
  horizontal,
  vertical,
}: GridProps): React.ReactElement {
  return (
    <g transform={`translate(${x + 0.5}, ${y + 0.5})`}>
      {horizontal.map((y, index) => (
        <line
          key={index}
          x1={0}
          y1={y}
          x2={width}
          y2={y}
          stroke='black'
          strokeOpacity={OPACITY}
          strokeWidth={1}
        />
      ))}
      {vertical.map((x, index) => (
        <line
          key={index}
          x1={x}
          y1={0}
          x2={x}
          y2={height}
          stroke='black'
          strokeOpacity={OPACITY}
          strokeWidth={1}
        />
      ))}
    </g>
  );
}
