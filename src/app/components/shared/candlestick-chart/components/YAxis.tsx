import React, { useMemo, useRef } from 'react';
import { Rect } from '../../../../types';
import { useCandlestickChartYAxis, useCandlestickChartYScale } from '../util';
import { CandlestickChartPosition } from '../types';

export interface YAxisProps {
  readonly chartRect: Rect;
  readonly position: CandlestickChartPosition;
  readonly precision: number;
}

export function YAxis({
  chartRect,
  position,
  precision,
}: YAxisProps): React.ReactElement {
  const ref = useRef<SVGGElement | null>(null);

  const yScale = useCandlestickChartYScale(position, chartRect.height);

  useCandlestickChartYAxis(ref, yScale, precision);

  const translate = useMemo(
    () => `translate(${chartRect.x + chartRect.width}, ${chartRect.y})`,
    [chartRect],
  );

  return <g ref={ref} transform={translate} />;
}
