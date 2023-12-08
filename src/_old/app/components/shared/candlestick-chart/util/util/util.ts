import { invariant } from "@gmjs/assert";

export function findIndexBinaryExact<T>(
  array: readonly T[],
  value: number,
  selector: (item: T) => number,
): number {
  let start = 0;
  let end = array.length - 1;

  while (start <= end) {
    const mid = Math.floor((start + end) / 2);
    const midVal = selector(array[mid] as T);

    if (midVal < value) {
      start = mid + 1;
    } else if (midVal > value) {
      end = mid - 1;
    } else {
      return mid;
    }
  }

  invariant(false, `Value ${value} not found in array.`);
}
