import { z } from 'zod';
import { SCHEMA_EMPTY_STRING, createSchemaIntegerInRange } from './base';

export function createSchemaReplayInput(
  min: number,
  max: number,
): z.ZodUnion<
  [typeof SCHEMA_EMPTY_STRING, ReturnType<typeof createSchemaIntegerInRange>]
> {
  return z.union([SCHEMA_EMPTY_STRING, createSchemaIntegerInRange(min, max)]);
}

export const SCHEMA_REPLAY_NAVIGATION_STEP_SIZE_INPUT =
  createSchemaIntegerInRange(0, 10_000);
