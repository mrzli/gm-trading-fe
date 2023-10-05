import React from 'react';
import { CandlestickChartTooltipData } from '../../types';
import { CandleSvg } from './CandleSvg';
import { CandleSelection } from './CandleSelection';

export interface CandleElementProps {
  readonly slotX: number;
  readonly slotWidth: number;
  readonly y1: number;
  readonly y2: number;
  readonly y3: number;
  readonly y4: number;
  readonly isBull: boolean;
  readonly i: number;
  readonly onMouseOver: (index: number | undefined) => void;
  readonly isSelected: boolean;
  readonly precision: number;
  readonly tooltipData: CandlestickChartTooltipData;
}

export function CandleElement({
  slotX,
  slotWidth,
  y1,
  y2,
  y3,
  y4,
  isBull,
  i,
  onMouseOver,
  isSelected,
  precision,
  tooltipData,
}: CandleElementProps): React.ReactElement {
  const w = slotWidth * CANDLE_WIDTH_FRACTION;
  const x = slotX + slotWidth / 2;
  // const y2 = Math.min(o, c);
  // const y3 = Math.max(o, c);
  // const isBull = c <= o; // smaller close coordinate means higher close price (i.e. bullish)

  // const rectX = x - w / 2;

  // const selX = rectX - SELECTION_PADDING;
  // const selY = h - SELECTION_PADDING;
  // const selWidth = w + 2 * SELECTION_PADDING;
  // const selHeight = l - h + 2 * SELECTION_PADDING;

  return (
    <g>
      <CandleSvg x={x} w={w} y1={y1} y2={y2} y3={y3} y4={y4} isBull={isBull} />
      {/* <CandleSelection
        x={selX}
        y={selY}
        w={selWidth}
        h={selHeight}
        i={i}
        onMouseOver={onMouseOver}
        isSelected={isSelected}
        precision={precision}
        tooltipData={tooltipData}
      /> */}
    </g>
  );
}

const CANDLE_WIDTH_FRACTION = 0.5;
const SELECTION_PADDING = 6;
