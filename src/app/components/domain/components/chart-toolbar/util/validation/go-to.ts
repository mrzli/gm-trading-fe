import {
  TYPES_OF_TICKER_DATA_RESOLUTIONS,
  TickerDataResolution,
} from '@gmjs/gm-trading-shared';
import { SelectOption } from '../../../../../shared';
import { toSimpleSelectOption } from '../../../../util';

export const RESOLUTION_OPTIONS: readonly SelectOption<TickerDataResolution>[] =
  TYPES_OF_TICKER_DATA_RESOLUTIONS.map((resolution) =>
    toSimpleSelectOption(resolution),
  );
