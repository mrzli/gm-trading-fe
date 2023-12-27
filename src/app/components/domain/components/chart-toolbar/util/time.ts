import { invariant } from '@gmjs/assert';
import { parseIntegerOrThrow } from '@gmjs/number-util';
import {
  ChartTimeStepUnit,
  TYPES_OF_CHART_TIME_STEP_UNITS,
  ChartTimeStep,
  TwTimeStepSelection,
} from '../types';

export function twTimeStepSelectionToTimeStep(
  timeStepSelection: TwTimeStepSelection,
  isForward: boolean,
): ChartTimeStep {
  const value = parseIntegerOrThrow(timeStepSelection.slice(0, -1));
  const unit = timeStepSelection.slice(-1);

  invariant(
    TYPES_OF_CHART_TIME_STEP_UNITS.includes(unit as ChartTimeStepUnit),
    `Invalid time step unit: '${unit}'.`,
  );

  return { unit: unit as ChartTimeStepUnit, value: isForward ? value : -value };
}
