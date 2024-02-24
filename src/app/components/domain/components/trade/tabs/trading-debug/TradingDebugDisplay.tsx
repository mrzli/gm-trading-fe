import React, { useMemo } from 'react';
import { round } from '@gmjs/number-util';
import { TradingDataAndInputs } from '../../types';
import { PrettyDisplay } from '../../../../../shared';
import { ComponentStack } from '../../shared/ComponentStack';
import { PRECISION_MONEY, PRECISION_POINT } from '../../../../util';
import { TradeResult, TradesCollection, calculateTradeResults } from '@gmjs/gm-trading-shared';

export interface TradingDebugDisplayProps {
  readonly dataAndInputs: TradingDataAndInputs;
  readonly tradesCollection: TradesCollection;
}

const MAX_BARS_TO_DISPLAY_IN_DEBUG = 2;

export function TradingDebugDisplay({
  dataAndInputs,
  tradesCollection,
}: TradingDebugDisplayProps): React.ReactElement {
  const pipDigit = dataAndInputs.inputs.params.pipDigit;

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
    return cleanUpTradeResult(
      calculateTradeResults(tradesCollection, pipDigit),
    );
  }, [pipDigit, tradesCollection]);

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
    maxDrawdownPts,
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
    maxDrawdownPts: round(maxDrawdownPts, PRECISION_POINT),
  };
}
