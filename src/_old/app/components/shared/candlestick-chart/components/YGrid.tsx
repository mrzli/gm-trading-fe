import React, { useMemo, useRef } from 'react';
import { Rect } from '../../../../../app/types';
import { useCandlestickChartYGrid, useCandlestickChartYScale } from '../util';
import { CandlestickChartPosition } from '../types';

export interface YGridProps {
  readonly chartRect: Rect;
  readonly position: CandlestickChartPosition;
}

export function YGrid({ chartRect, position }: YGridProps): React.ReactElement {
  const ref = useRef<SVGGElement | null>(null);

  const yScale = useCandlestickChartYScale(position, chartRect.height);

  useCandlestickChartYGrid(ref, yScale, chartRect.width);

  const translate = useMemo(
    () => `translate(${chartRect.x}, ${chartRect.y})`,
    [chartRect],
  );

  return <g ref={ref} transform={translate} />;
}
