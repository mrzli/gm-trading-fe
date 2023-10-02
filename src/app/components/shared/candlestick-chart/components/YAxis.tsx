import React, { useMemo, useRef } from 'react';
import { NumericRange, Rect } from '../../../../types';
import { useCandlestickChartYAxis, useCandlestickChartYScale } from '../util';

export interface YAxisProps {
  readonly chartRect: Rect;
  readonly valueRange: NumericRange;
  readonly precision: number;
}

export function YAxis({
  chartRect,
  valueRange,
  precision,
}: YAxisProps): React.ReactElement {
  const ref = useRef<SVGGElement | null>(null);

  const yScale = useCandlestickChartYScale(valueRange, chartRect.height);

  useCandlestickChartYAxis(ref, yScale, precision);

  const translate = useMemo(
    () => `translate(${chartRect.x + chartRect.width}, ${chartRect.y})`,
    [chartRect],
  );

  return <g ref={ref} transform={translate} />;
}
