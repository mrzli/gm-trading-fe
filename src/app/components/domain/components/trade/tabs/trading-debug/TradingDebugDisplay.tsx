import React, { useMemo } from 'react';
import { round } from '@gmjs/number-util';
import {
  TradeProcessState,
  TradeResult,
  TradingDataAndInputs,
} from '../../types';
import { PrettyDisplay } from '../../../../../shared';
import { calculateTradeResults } from '../../util';
import { ComponentStack } from '../../shared/ComponentStack';
import { PRECISION_MONEY, PRECISION_POINT } from '../../../../util';

export interface TradingDebugDisplayProps {
  readonly dataAndInputs: TradingDataAndInputs;
  readonly state: TradeProcessState;
}

const MAX_BARS_TO_DISPLAY_IN_DEBUG = 2;

export function TradingDebugDisplay({
  dataAndInputs,
  state,
}: TradingDebugDisplayProps): React.ReactElement {
  const pipDigit = dataAndInputs.inputs.params.pipDigit

  const inputsContent = useMemo<TradingDataAndInputs>(() => {
    return {
      ...dataAndInputs,
      fullData: {
        ...dataAndInputs.fullData,
        subBars: dataAndInputs.fullData.subBars.slice(
          0,
          MAX_BARS_TO_DISPLAY_IN_DEBUG,
        ),
        bars: dataAndInputs.fullData.bars.slice(
          0,
          MAX_BARS_TO_DISPLAY_IN_DEBUG,
        ),
      },
      barData: dataAndInputs.barData.slice(0, MAX_BARS_TO_DISPLAY_IN_DEBUG),
    };
  }, [dataAndInputs]);

  const result = useMemo(() => {
    return cleanUpTradeResult(calculateTradeResults(state, pipDigit));
  }, [pipDigit, state]);

  return (
    <ComponentStack className='mt-1'>
      <PrettyDisplay content={inputsContent} />
      <PrettyDisplay content={result} />
    </ComponentStack>
  );
}

function cleanUpTradeResult(result: TradeResult): TradeResult {
  const {
    pnl,
    pnlPoints,
    totalCount,
    winCount,
    lossCount,
    winFraction,
    lossFraction,
    avgWin,
    avgLoss,
    avgWinPts,
    avgLossPts,
    maxDrawdown,
  } = result;

  return {
    pnl: round(pnl, PRECISION_MONEY),
    pnlPoints: round(pnlPoints, PRECISION_POINT),
    totalCount,
    winCount,
    lossCount,
    winFraction: round(winFraction, 4),
    lossFraction: round(lossFraction, 4),
    avgWin: round(avgWin, PRECISION_MONEY),
    avgLoss: round(avgLoss, PRECISION_MONEY),
    avgWinPts: round(avgWinPts, PRECISION_POINT),
    avgLossPts: round(avgLossPts, PRECISION_POINT),
    maxDrawdown: round(maxDrawdown, PRECISION_MONEY),
  };
}
