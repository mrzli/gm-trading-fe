import React from 'react';
import { RightToolbarState } from './types';
import { invariant } from '@gmjs/assert';
import { TradeContainer } from '../trade/TradeContainer';
import { GroupedTickerDataRows } from '../../../types';
import { TwBarReplaySettings } from '../tw-chart/types';

export interface TickerDataRightToolbarProps {
  readonly state: RightToolbarState;
  readonly data: GroupedTickerDataRows;
  readonly replaySettings: TwBarReplaySettings;
}

export function TickerDataRightToolbar({
  state,
  data,
  replaySettings,
}: TickerDataRightToolbarProps): React.ReactElement {
  const content = getContent(state, data, replaySettings);

  return <div className='min-w-[480px]'>{content}</div>;
}

function getContent(
  state: RightToolbarState,
  data: GroupedTickerDataRows,
  replaySettings: TwBarReplaySettings,
): React.ReactElement {
  switch (state) {
    case 'trade': {
      return <TradeContainer data={data} replaySettings={replaySettings} />;
    }
    default: {
      invariant(false, `Invalid right toolbar state: ${state}`);
    }
  }
}
