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

export interface TradingDebugDisplayProps {
  readonly dataAndInputs: TradingDataAndInputs;
  readonly state: TradeProcessState;
}

export function TradingDebugDisplay({
  dataAndInputs,
  state,
}: TradingDebugDisplayProps): React.ReactElement {
  const inputsContent = useMemo<TradingDataAndInputs>(() => {
    return {
      ...dataAndInputs,
      chartData: {
        ...dataAndInputs.chartData,
        barData: dataAndInputs.chartData.barData.slice(0, 2),
      },
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
    pnlPoints: round(pnlPoints, 1),
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
