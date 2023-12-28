import React, { useMemo } from 'react';
import { BarReplayPosition } from '../../../../types';
import { TradeProcessState, TradingDataAndInputs } from '../../types';
import { BarReplay } from './bar-replay/BarReplay';
import { DateValueDisplay, DecimalValueDisplay } from '../../../shared';
import { getOhlc } from '../../util/ohlc';
import {
  getActiveTradePnl,
  getActiveTradePnlPoints,
  getCompletedTradePnl,
  getCompletedTradePnlPoints,
} from '../../util';
import { applyFn } from '@gmjs/apply-function';
import { map, sum } from '@gmjs/value-transformers';

export interface TradeStatusDisplayProps {
  readonly dataAndInputs: TradingDataAndInputs;
  readonly state: TradeProcessState;
  readonly onReplayPositionChange: (position: BarReplayPosition) => void;
}

export function TradeStatusDisplay({
  dataAndInputs,
  state,
  onReplayPositionChange,
}: TradeStatusDisplayProps): React.ReactElement {
  const { settings, fullData, replayPosition, barData, barIndex, inputs } =
    dataAndInputs;
  const { timezone } = settings;
  const { subBars } = fullData;
  const { params } = inputs;
  const { priceDecimals, spread } = params;

  const { activeTrades, completedTrades } = state;

  const bar = barData[barIndex];
  const time = bar.time;

  const barBuy = useMemo(() => getOhlc(bar, true, spread), [bar, spread]);
  const barSell = useMemo(() => getOhlc(bar, false, spread), [bar, spread]);

  const activeTradesPnlPoints = useMemo(
    () =>
      applyFn(
        activeTrades,
        map((item) => getActiveTradePnlPoints(item, bar, spread)),
        sum(),
      ),
    [activeTrades, bar, spread],
  );

  const activeTradesPnl = useMemo(
    () =>
      applyFn(
        activeTrades,
        map((item) => getActiveTradePnl(item, bar, spread)),
        sum(),
      ),
    [activeTrades, bar, spread],
  );

  const completedTradesPnlPoints = useMemo(
    () =>
      applyFn(
        completedTrades,
        map((item) => getCompletedTradePnlPoints(item)),
        sum(),
      ),
    [completedTrades],
  );

  const completedTradesPnl = useMemo(
    () =>
      applyFn(
        completedTrades,
        map((item) => getCompletedTradePnl(item)),
        sum(),
      ),
    [completedTrades],
  );

  return (
    <div className='flex flex-col gap-2'>
      <BarReplay
        subBars={subBars}
        replayPosition={replayPosition}
        onReplayPositionChange={onReplayPositionChange}
      />
      <div className='grid grid-cols-8 gap-2'>
        <div className='col-span-2'>
          <DateValueDisplay
            label={'Next Bar Time'}
            value={time}
            timezone={timezone}
          />
        </div>
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
        <DecimalValueDisplay
          label={'Active P&L Pts'}
          value={activeTradesPnlPoints}
          precision={1}
        />
        <DecimalValueDisplay
          label={'Active P&L'}
          value={activeTradesPnl}
          precision={priceDecimals}
        />
        <DecimalValueDisplay
          label={'Comp P&L Pts'}
          value={completedTradesPnlPoints}
          precision={1}
        />
        <DecimalValueDisplay
          label={'Comp P&L'}
          value={completedTradesPnl}
          precision={priceDecimals}
        />
      </div>
    </div>
  );
}
