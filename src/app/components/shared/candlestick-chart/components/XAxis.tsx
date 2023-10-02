import React, { useMemo, useRef } from 'react';
import { Rect, TickerDataRow } from '../../../../types';
import { TickerDataResolution } from '@gmjs/gm-trading-shared';
import { useCandlestickChartXAxis, useCandlestickChartXScale } from '../util';

export interface XAxisProps {
  readonly chartRect: Rect;
  readonly resolution: TickerDataResolution;
  readonly data: readonly TickerDataRow[];
}

export function XAxis({
  chartRect,
  resolution,
  data,
}: XAxisProps): React.ReactElement {
  const ref = useRef<SVGGElement | null>(null);

  const xScale = useCandlestickChartXScale(data, resolution, chartRect.width);

  useCandlestickChartXAxis(ref, xScale, resolution, data);

  const translate = useMemo(
    () => `translate(${chartRect.x}, ${chartRect.y + chartRect.height})`,
    [chartRect],
  );

  return <g ref={ref} transform={translate} />;
}
