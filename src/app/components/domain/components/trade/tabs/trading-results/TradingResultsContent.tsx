import React, { useMemo } from 'react';
import { ComponentStack } from '../../shared/ComponentStack';
import { ValueDisplayDataAnyList, ValueDisplayItem } from '../../../shared';
import { PRECISION_MONEY, PRECISION_POINT } from '../../../../util';
import {
  TradeResult,
  TradesCollection,
  TradingParameters,
  calculateTradeResults,
} from '@gmjs/gm-trading-shared';

export interface TradingResultsContentProps {
  readonly tradingParams: TradingParameters;
  readonly tradesCollection: TradesCollection;
}

export function TradingResultsContent({
  tradingParams,
  tradesCollection,
}: TradingResultsContentProps): React.ReactElement {
  const pipDigit = tradingParams.pipDigit;

  const result = useMemo(() => {
    return calculateTradeResults(tradesCollection, pipDigit);
  }, [pipDigit, tradesCollection]);

  const displayItems = useMemo(() => getDisplayItems(result), [result]);

  return (
    <ComponentStack className='mt-1 p-4'>
      <div className='grid grid-cols-4 gap-2'>
        {displayItems.map((item, index) => {
          return <ValueDisplayItem key={index} item={item} />;
        })}
      </div>
    </ComponentStack>
  );
}

function getDisplayItems(result: TradeResult): ValueDisplayDataAnyList {
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

  return [
    {
      kind: 'pnl',
      label: 'P&L',
      value: pnl,
      precision: PRECISION_MONEY,
    },
    {
      kind: 'pnl',
      label: 'P&L Points',
      value: pnlPoints,
      precision: PRECISION_POINT,
    },
    {
      kind: 'none',
      colSpan: 2,
    },
    {
      kind: 'decimal',
      label: 'Win',
      value: winCount,
      precision: 0,
    },
    {
      kind: 'decimal',
      label: 'Loss',
      value: lossCount,
      precision: 0,
    },
    {
      kind: 'decimal',
      label: 'Total Count',
      value: totalCount,
      precision: 0,
    },
    {
      kind: 'none',
      colSpan: 1,
    },
    {
      kind: 'decimal',
      label: 'Win %',
      value: winFraction * 100,
      precision: 2,
      suffix: '%',
    },
    {
      kind: 'decimal',
      label: 'Loss %',
      value: lossFraction * 100,
      precision: 2,
      suffix: '%',
    },
    {
      kind: 'none',
      colSpan: 2,
    },
    {
      kind: 'decimal',
      label: 'Avg Win',
      value: avgWin,
      precision: PRECISION_MONEY,
    },
    {
      kind: 'decimal',
      label: 'Avg Loss',
      value: avgLoss,
      precision: PRECISION_MONEY,
    },
    {
      kind: 'decimal',
      label: 'Avg Win Pts',
      value: avgWinPts,
      precision: PRECISION_POINT,
    },
    {
      kind: 'decimal',
      label: 'Avg Loss Pts',
      value: avgLossPts,
      precision: PRECISION_POINT,
    },
    {
      kind: 'decimal',
      label: 'Max Drawdown',
      value: maxDrawdown,
      precision: PRECISION_MONEY,
    },
    {
      kind: 'decimal',
      label: 'Max Draw Pts',
      value: maxDrawdownPts,
      precision: PRECISION_POINT,
    },
  ];
}
