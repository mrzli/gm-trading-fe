import React, { useMemo, useRef } from 'react';
import { NumericRange, Rect } from '../../../../types';
import { useCandlestickChartYGrid, useCandlestickChartYScale } from '../util';

export interface YGridProps {
  readonly chartRect: Rect;
  readonly valueRange: NumericRange;
}

export function YGrid({
  chartRect,
  valueRange,
}: YGridProps): React.ReactElement {
  const ref = useRef<SVGGElement | null>(null);

  const yScale = useCandlestickChartYScale(valueRange, chartRect.height);

  useCandlestickChartYGrid(ref, yScale, chartRect.width);

  const translate = useMemo(
    () => `translate(${chartRect.x}, ${chartRect.y})`,
    [chartRect],
  );

  return <g ref={ref} transform={translate} />;
}
