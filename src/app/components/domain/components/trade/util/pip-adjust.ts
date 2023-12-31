// pip to price point adjustment
export function pipAdjust(value: number, pipDigit: number): number {
  return value * toPipMultiplier(pipDigit);
}

// price point to pip adjustment
export function pipAdjustInverse(value: number, pipDigit: number): number {
  return value * toPipMultiplier(-pipDigit);
}

function toPipMultiplier(pipDigit: number): number {
  return Math.pow(10, pipDigit);
}
