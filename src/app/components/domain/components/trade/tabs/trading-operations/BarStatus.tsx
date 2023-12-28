import React, { useMemo } from 'react';
import { BarReplayPosition } from '../../../../types';
import { TradingDataAndInputs } from '../../types';
import { BarReplay } from './bar-replay/BarReplay';
import { DateValueDisplay, DecimalValueDisplay } from '../../../shared';
import { getOhlc } from '../../util/process/ohlc';

export interface BarStatusProps {
  readonly dataAndInputs: TradingDataAndInputs;
  readonly onReplayPositionChange: (position: BarReplayPosition) => void;
}

export function BarStatus({
  dataAndInputs,
  onReplayPositionChange,
}: BarStatusProps): React.ReactElement {
  const { settings, fullData, replayPosition, barData, barIndex, inputs } =
    dataAndInputs;
  const { timezone } = settings;
  const { subBars } = fullData;
  const { params } = inputs;
  const { priceDecimals, spread } = params;

  const bar = barData[barIndex];
  const time = bar.time;

  const barBuy = useMemo(() => getOhlc(bar, true, spread), [bar, spread]);
  const barSell = useMemo(() => getOhlc(bar, false, spread), [bar, spread]);

  return (
    <div className='flex flex-col gap-2'>
      <BarReplay
        subBars={subBars}
        replayPosition={replayPosition}
        onReplayPositionChange={onReplayPositionChange}
      />
      <div className='flex flex-row gap-2'>
        <DateValueDisplay
          label={'Next Bar Time'}
          value={time}
          timezone={timezone}
        />
        <DecimalValueDisplay
          label={'Open Buy'}
          value={barBuy.o}
          precision={priceDecimals}
        />
        <DecimalValueDisplay
          label={'Open Sell'}
          value={barSell.o}
          precision={priceDecimals}
        />
      </div>
    </div>
  );
}
