import type * as d3 from 'd3';

export type CandlestickChartD3GSelectionFn = (
  selection: d3.Selection<SVGGElement, unknown, null, undefined>
) => void;