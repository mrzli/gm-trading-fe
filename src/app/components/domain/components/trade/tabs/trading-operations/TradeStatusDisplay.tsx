import React, { useMemo } from 'react';
import { Bar, BarReplayPosition, ChartResolution } from '../../../../types';
import { TradeProcessState, TradingDataAndInputs } from '../../types';
import { BarReplay } from './bar-replay/BarReplay';
import { DateValueDisplay, DecimalValueDisplay } from '../../../shared';
import { getOhlc } from '../../util/ohlc';
import {
  getActiveTradePnl,
  getActiveTradePnlPoints,
  getCompletedTradePnl,
  getCompletedTradePnlPoints,
  pipAdjust,
} from '../../util';
import { applyFn } from '@gmjs/apply-function';
import { map, sum } from '@gmjs/value-transformers';
import {
  PRECISION_MONEY,
  PRECISION_POINT,
  resolutionToSeconds,
} from '../../../../util';
import { UTCTimestamp } from 'lightweight-charts';

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
  const { resolution, timezone } = settings;
  const { subBars } = fullData;
  const { params } = inputs;
  const { priceDecimals, spread: pointSpread, pipDigit } = params;
  const spread = pipAdjust(pointSpread, pipDigit);

  const { activeTrades, completedTrades } = state;

  const bar =
    barData[barIndex] ?? createAfterLastBar(barData[barIndex - 1], resolution);
  const time = bar.time;

  const barBuy = useMemo(() => getOhlc(bar, true, spread), [bar, spread]);
  const barSell = useMemo(() => getOhlc(bar, false, spread), [bar, spread]);

  const activeTradesPnlPoints = useMemo(
    () =>
      applyFn(
        activeTrades,
        map((item) => getActiveTradePnlPoints(item, bar, pipDigit, spread)),
        sum(),
      ),
    [activeTrades, bar, pipDigit, spread],
  );

  const activeTradesPnl = useMemo(
    () =>
      applyFn(
        activeTrades,
        map((item) => getActiveTradePnl(item, bar, pipDigit, spread)),
        sum(),
      ),
    [activeTrades, bar, pipDigit, spread],
  );

  const completedTradesPnlPoints = useMemo(
    () =>
      applyFn(
        completedTrades,
        map((item) => getCompletedTradePnlPoints(item, pipDigit)),
        sum(),
      ),
    [completedTrades, pipDigit],
  );

  const completedTradesPnl = useMemo(
    () =>
      applyFn(
        completedTrades,
        map((item) => getCompletedTradePnl(item, pipDigit)),
        sum(),
      ),
    [completedTrades, pipDigit],
  );

  return (
    <div className='flex flex-col gap-2'>
      <BarReplay
        timezone={timezone}
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
          precision={PRECISION_POINT}
        />
        <DecimalValueDisplay
          label={'Active P&L'}
          value={activeTradesPnl}
          precision={PRECISION_MONEY}
        />
        <DecimalValueDisplay
          label={'Comp P&L Pts'}
          value={completedTradesPnlPoints}
          precision={PRECISION_POINT}
        />
        <DecimalValueDisplay
          label={'Comp P&L'}
          value={completedTradesPnl}
          precision={PRECISION_MONEY}
        />
      </div>
    </div>
  );
}

function createAfterLastBar(lastBar: Bar, resolution: ChartResolution): Bar {
  const newTime = lastBar.time + resolutionToSeconds(resolution);
  const newOpen = lastBar.close;

  return {
    time: newTime as UTCTimestamp,
    open: newOpen,
    high: newOpen,
    low: newOpen,
    close: newOpen,
  };
}
