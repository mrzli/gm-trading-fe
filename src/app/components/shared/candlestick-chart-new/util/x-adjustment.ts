const PRECISION = 2;

export function toFirstXIndex(xOffset: number): number {
  return xOffset > 0 ? Math.floor(xOffset) : 0;
}

export function nomalizeXOffset(xOffset: number): number {
  const normalized = xOffset - toFirstXIndex(xOffset);
  return round(normalized, PRECISION);
}

export function round(value: number, precision: number): number {
  const multiplier = 10 ** precision;
  return Math.round(value * multiplier) / multiplier;
}
