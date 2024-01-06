import { z } from 'zod';
import {
  SCHEMA_EMPTY_STRING,
  schemaStringAsIntegerInRange,
} from '../../../../util';

export function createSchemaReplayInput(
  min: number,
  max: number,
): z.ZodUnion<
  [typeof SCHEMA_EMPTY_STRING, ReturnType<typeof schemaStringAsIntegerInRange>]
> {
  return z.union([SCHEMA_EMPTY_STRING, schemaStringAsIntegerInRange(min, max)]);
}

export const SCHEMA_REPLAY_NAVIGATION_STEP_SIZE_INPUT =
  schemaStringAsIntegerInRange(0, 10_000);
