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
import { CandlestickChartTooltipData } from '../../types';
import { TooltipDisplay } from '../../../display/TooltipDisplay';

export interface CandleSelectionProps {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly i: number;
  readonly onMouseOver: (index: number | undefined) => void;
  readonly isSelected: boolean;
  readonly precision: number;
  readonly tooltipData: CandlestickChartTooltipData;
}

export function CandleSelection({
  x,
  y,
  w,
  h,
  i,
  onMouseOver,
  isSelected,
  precision,
  tooltipData,
}: CandleSelectionProps): React.ReactElement {
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
    <g>
      <rect
        ref={ttRefs.setReference}
        x={x}
        y={y}
        width={w}
        height={h}
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
