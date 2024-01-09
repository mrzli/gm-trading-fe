export function getPnlColor(value: number | undefined): string | undefined {
  return value === undefined || value === 0
    ? undefined
    : value > 0
      ? 'green'
      : 'red';
}
