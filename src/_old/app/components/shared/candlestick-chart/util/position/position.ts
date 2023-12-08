import { CandlestickChartXScale } from '../scale';

export function getItemX(ts: number, xScale: CandlestickChartXScale): number {
  // adjust shape to go exactly between ticks (half after tick), instead of being on the tick
  const adjustHalfTick = xScale.step() / 2;

  return getTickX(ts, xScale) + adjustHalfTick;
}

export function getTickX(ts: number, xScale: CandlestickChartXScale): number {
  const xBase = xScale(ts) ?? 0;
  // adjust for the fact that referent 'x' is the middle of the rect for my svg shape
  // and d3 seems to expect the referent 'x' to be on the left side of the shape
  const adjustReferentX = (xScale.step() * (1 - xScale.paddingInner())) / 2;

  return xBase + adjustReferentX;
}
