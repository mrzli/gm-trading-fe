import React, { useMemo, useRef } from 'react';
import { Rect, TickerDataRow } from '../../../../types';
import { TickerDataResolution } from '@gmjs/gm-trading-shared';
import { useCandlestickChartXGrid, useCandlestickChartXScale } from '../util';
import { CandlestickChartPosition } from '../types';

export interface XGridProps {
  readonly chartRect: Rect;
  readonly resolution: TickerDataResolution;
  readonly data: readonly TickerDataRow[];
  readonly position: CandlestickChartPosition;
}

export function XGrid({
  chartRect,
  resolution,
  data,
  position,
}: XGridProps): React.ReactElement {
  const ref = useRef<SVGGElement | null>(null);

  const xScale = useCandlestickChartXScale(
    data,
    resolution,
    position,
    chartRect.width,
  );

  useCandlestickChartXGrid(ref, xScale, resolution, data, chartRect.height);

  const translate = useMemo(
    () => `translate(${chartRect.x}, ${chartRect.y})`,
    [chartRect],
  );

  return <g ref={ref} transform={translate} />;
}
