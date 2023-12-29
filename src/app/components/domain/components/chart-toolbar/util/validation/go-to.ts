import { SelectOption } from '../../../../../shared';
import { TYPES_OF_CHART_RESOLUTIONS, ChartResolution } from '../../../../types';
import { toSimpleSelectOption } from '../../../../util';

export const RESOLUTION_OPTIONS: readonly SelectOption<ChartResolution>[] =
  TYPES_OF_CHART_RESOLUTIONS.map((resolution) =>
    toSimpleSelectOption(resolution),
  );
