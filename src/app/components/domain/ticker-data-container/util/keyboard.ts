import { Key } from 'ts-key-enum';
import { invariant } from '@gmjs/assert';

export function toLogicalOffset(
  event: React.KeyboardEvent<HTMLDivElement>,
): number {
  const base = toBaseLogicalOffset(event);
  const multiplier = toLogicalOffsetMultiplier(event);
  return base * multiplier;
}

function toBaseLogicalOffset(
  event: React.KeyboardEvent<HTMLDivElement>,
): number {
  switch (event.key) {
    case Key.ArrowLeft: {
      return -1;
    }
    case Key.ArrowRight: {
      return 1;
    }
  }

  invariant(false, `Unexpected key: ${event.key}`);
}

function toLogicalOffsetMultiplier(
  event: React.KeyboardEvent<HTMLDivElement>,
): number {
  return event.shiftKey ? 10 : 1;
}
