// point to price adjustment
export function pipAdjust(value: number, pipDigit: number): number {
  return value * toPipMultiplier(pipDigit);
}

// price to point adjustment
export function pipAdjustInverse(value: number, pipDigit: number): number {
  return value * toPipMultiplier(-pipDigit);
}

function toPipMultiplier(pipDigit: number): number {
  return Math.pow(10, pipDigit);
}
