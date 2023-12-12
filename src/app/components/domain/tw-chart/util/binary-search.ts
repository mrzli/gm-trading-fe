import { invariant } from "@gmjs/assert";

/**
 * Binary search for the index of a value in a sorted array,
 * or the index of the closest lower value if the value is not found,
 * or the first index (0) if the value is lower than the first value.
 *
 * @param array The array to search.
 * @param value The value to search for.
 * @param selector A function that returns a number to compare agains for each item in the array.
 * @returns The index of the value in the array.
 */
export function binarySearch<T>(
  array: readonly T[],
  value: number,
  selector: (item: T) => number,
): number {
  invariant(array.length > 0, "Array must not be empty.");

  if (value < selector(array[0])) {
    return 0;
  } else if (value > selector(array.at(-1)!)) {
    return array.length - 1;
  }

  let start = 0;
  let end = array.length - 1;
  let closestLower = start;

  while (start <= end) {
    const mid = Math.floor((start + end) / 2);
    const midVal = selector(array[mid]);

    if (midVal < value) {
      closestLower = mid;
      start = mid + 1;
    } else if (midVal > value) {
      end = mid - 1;
    } else {
      return mid;
    }
  }

  return closestLower;
}
