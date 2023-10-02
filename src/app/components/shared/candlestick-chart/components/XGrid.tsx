import React, { useMemo, useRef } from 'react';
import { Rect, TickerDataRow } from '../../../../types';
import { TickerDataResolution } from '@gmjs/gm-trading-shared';
import { useCandlestickChartXGrid, useCandlestickChartXScale } from '../util';

export interface XGridProps {
  readonly chartRect: Rect;
  readonly resolution: TickerDataResolution;
  readonly data: readonly TickerDataRow[];
}

export function XGrid({
  chartRect,
  resolution,
  data,
}: XGridProps): React.ReactElement {
  const ref = useRef<SVGGElement | null>(null);

  const xScale = useCandlestickChartXScale(data, resolution, chartRect.width);

  useCandlestickChartXGrid(ref, xScale, resolution, data, chartRect.height);

  const translate = useMemo(
    () => `translate(${chartRect.x}, ${chartRect.y})`,
    [chartRect],
  );

  return <g ref={ref} transform={translate} />;
}
