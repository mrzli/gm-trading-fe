import React, { CSSProperties, useCallback, useState } from 'react';
import {
  FloatingPortal,
  useFloating,
  useHover,
  useInteractions,
  offset,
  flip,
  shift,
} from '@floating-ui/react';
import { DateTime } from 'luxon';
import cls from 'classnames';
import { TooltipDisplay } from '../../display/TooltipDisplay';
import { CandlestickChartTooltipData } from '../types';

export interface CandlestickItemProps {
  readonly x: number;
  readonly w: number;
  readonly o: number;
  readonly h: number;
  readonly l: number;
  readonly c: number;
  readonly i: number;
  readonly onMouseOver: (index: number | undefined) => void;
  readonly isSelected: boolean;
  readonly precision: number;
  readonly tooltipData: CandlestickChartTooltipData;
}

export function CandlestickItem({
  x,
  w,
  o,
  h,
  l,
  c,
  i,
  onMouseOver,
  isSelected,
  precision,
  tooltipData,
}: CandlestickItemProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  const {
    x: ttX,
    y: ttY,
    strategy: ttStrategy,
    refs: ttRefs,
    context: ttContext,
  } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'left-start',
    middleware: [offset(4), flip(), shift()],
  });

  const hover = useHover(ttContext);

  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  const halfWidth = w / 2;
  const minOc = Math.min(o, c);
  const maxOc = Math.max(o, c);
  const changeOc = c - o;
  const rectHeight = Math.abs(changeOc);
  // svg coordinates are y-down, so 'rising' coordinates mean price fall
  const fill = changeOc >= 0 ? COLOR_DOWN : COLOR_UP;

  const rectX = x - halfWidth;
  const finalRectHeight = Math.max(rectHeight, 0.0001);

  const selectionX = rectX - SELECTION_PADDING;
  const selectionY = h - SELECTION_PADDING;
  const selectionWidth = w + 2 * SELECTION_PADDING;
  const selectionHeight = l - h + 2 * SELECTION_PADDING;

  const selectionStroke = isSelected ? 'black' : 'none';

  const handleMouseEnter = useCallback(
    (_event: React.MouseEvent<SVGRectElement>) => {
      onMouseOver(i);
    },
    [i, onMouseOver],
  );

  const handleMouseLeave = useCallback(
    (_event: React.MouseEvent<SVGRectElement>) => {
      onMouseOver(undefined);
    },
    [onMouseOver],
  );

  return (
    <g className='bg-orange-500'>
      <line
        x1={x}
        y1={h}
        x2={x}
        y2={minOc}
        stroke={COLOR_BORDER}
        strokeWidth={STROKE_WIDTH}
      />
      <rect
        x={rectX}
        y={minOc}
        width={w}
        height={finalRectHeight}
        fill={fill}
        stroke={COLOR_BORDER}
        strokeWidth={STROKE_WIDTH}
      />
      <line
        x1={x}
        y1={maxOc}
        x2={x}
        y2={l}
        stroke={COLOR_BORDER}
        strokeWidth={STROKE_WIDTH}
      />
      <rect
        ref={ttRefs.setReference}
        x={selectionX}
        y={selectionY}
        width={selectionWidth}
        height={selectionHeight}
        fill={'transparent'}
        stroke={selectionStroke}
        fillOpacity={0.2}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...getReferenceProps()}
      />
      {isOpen && (
        <FloatingPortal>
          <TooltipDisplay
            ref={ttRefs.setFloating}
            x={ttX}
            y={ttY}
            strategy={ttStrategy}
            {...getFloatingProps()}
          >
            {getTooltipElement(tooltipData, precision)}
          </TooltipDisplay>
        </FloatingPortal>
      )}
    </g>
  );
}

const STROKE_WIDTH = 2;
const COLOR_DOWN = '#DC2626';
const COLOR_UP = '#059669';
const COLOR_BORDER = '#000000';

const SELECTION_PADDING = 6;

function getTooltipElement(
  tooltipData: CandlestickChartTooltipData,
  precision: number,
): React.ReactElement {
  const { ts, o, h, l, c } = tooltipData;

  const dt = DateTime.fromSeconds(ts, { zone: 'UTC' });
  const dateText = dt.toFormat('yyyy-MM-dd HH:mm ccc');

  const hl = h - l;
  const oc = c - o;

  return (
    <div className='grid gap-x-2 font-mono text-[14px]' style={TOOLTIP_STYLES}>
      <div className='row-start-1 col-start-1 col-span-3 text-[12px] font-semibold mb-2'>
        {dateText}
      </div>
      {getValueRow(2, 'O:', o.toFixed(precision), 'right')}
      {getValueRow(3, 'H:', h.toFixed(precision), 'right')}
      {getValueRow(4, 'L:', l.toFixed(precision), 'right')}
      {getValueRow(5, 'C:', c.toFixed(precision), 'right')}
      {getValueRow(6, 'HL:', hl.toFixed(precision), 'right')}
      {getValueRow(7, 'OC:', oc.toFixed(precision), 'right')}
    </div>
  );
}

type TooltipValueAlign = 'left' | 'right';

function getValueRow(
  row: number,
  label: string,
  value: string,
  align?: TooltipValueAlign,
): React.ReactElement {
  const labelCls = cls(`row-start-${row}`, 'col-start-1');
  const valueCls = cls(`row-start-${row}`, 'col-start-2', {
    'text-left': align === 'left',
    'text-right': align === 'right',
  });
  const emptyCls = cls(`row-start-${row}`, 'col-start-3');
  return (
    <>
      <div className={labelCls}>{label}</div>
      <div className={valueCls}>{value}</div>
      <div className={emptyCls}>&nbsp;</div>
    </>
  );
}

const TOOLTIP_STYLES: CSSProperties = {
  gridTemplateColumns: 'auto auto 1fr',
};
