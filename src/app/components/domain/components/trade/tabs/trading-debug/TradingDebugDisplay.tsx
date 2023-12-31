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
import { PRECISION_POINT } from '../../../../util';

export interface TradingDebugDisplayProps {
  readonly dataAndInputs: TradingDataAndInputs;
  readonly state: TradeProcessState;
}

const MAX_BARS_TO_DISPLAY = 2;

export function TradingDebugDisplay({
  dataAndInputs,
  state,
}: TradingDebugDisplayProps): React.ReactElement {
  const inputsContent = useMemo<TradingDataAndInputs>(() => {
    return {
      ...dataAndInputs,
      fullData: {
        ...dataAndInputs.fullData,
        subBars: dataAndInputs.fullData.subBars.slice(0, MAX_BARS_TO_DISPLAY),
        bars: dataAndInputs.fullData.bars.slice(0, MAX_BARS_TO_DISPLAY),
      },
      barData: dataAndInputs.barData.slice(0, MAX_BARS_TO_DISPLAY),
    };
  }, [dataAndInputs]);

  const result = useMemo(() => {
    return cleanUpTradeResult(calculateTradeResults(state));
  }, [state]);

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
    maxDrawdown,
  } = result;

  return {
    pnl: round(pnl, 2),
    pnlPoints: round(pnlPoints, PRECISION_POINT),
    totalCount,
    winCount,
    lossCount,
    winFraction: round(winFraction, 2),
    lossFraction: round(lossFraction, 2),
    avgWin: round(avgWin, 2),
    avgLoss: round(avgLoss, 2),
    maxDrawdown: round(maxDrawdown, 2),
  };
}
