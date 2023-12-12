import { invariant } from '@gmjs/assert';
import { parseIntegerOrThrow } from '@gmjs/number-util';
import { TwTimeStepSelection } from '../types';
import {
  TYPES_OF_TIME_STEP_UNITS,
  TwTimeStep,
  TwTimeStepUnit,
} from '../../../../types/tw-time-step';

export function twTimeStepSelectionToTimeStep(
  timeStepSelection: TwTimeStepSelection,
  isForward: boolean,
): TwTimeStep {
  const value = parseIntegerOrThrow(timeStepSelection.slice(0, -1));
  const unit = timeStepSelection.slice(-1);

  invariant(
    TYPES_OF_TIME_STEP_UNITS.includes(unit as TwTimeStepUnit),
    `Invalid time step unit: '${unit}'.`,
  );

  return { unit: unit as TwTimeStepUnit, value: isForward ? value : -value };
}
