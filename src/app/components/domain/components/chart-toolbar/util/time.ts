import { invariant } from '@gmjs/assert';
import { parseIntegerOrThrow } from '@gmjs/number-util';
import { TimeStepSelection } from '../types';
import { ChartTimeStep, ChartTimeStepUnit } from '../../../types';

export function twTimeStepSelectionToTimeStep(
  timeStepSelection: TimeStepSelection,
  isForward: boolean,
): ChartTimeStep {
  const match = timeStepSelection.match(/(\d+)(B|h|D|WD|W|M)/) ?? undefined;
  invariant(
    match !== undefined,
    `Invalid time step selection: '${timeStepSelection}'.`,
  );

  const value = parseIntegerOrThrow(match[1]);
  const unit = match[2];

  return { unit: unit as ChartTimeStepUnit, value: isForward ? value : -value };
}
