import React, { useMemo } from 'react';
import { TradeProcessState, TradeResult, TradingParameters } from '../../types';
import { ComponentStack } from '../../shared/ComponentStack';
import { calculateTradeResults } from '../../util';
import { ValueDisplayDataAnyList, ValueDisplayItem } from '../../../shared';
import { PRECISION_POINT } from '../../../../util';

export interface TradingResultsContentProps {
  readonly tradingParams: TradingParameters;
  readonly state: TradeProcessState;
}

export function TradingResultsContent({
  tradingParams,
  state,
}: TradingResultsContentProps): React.ReactElement {
  const result = useMemo(() => {
    return calculateTradeResults(state);
  }, [state]);

  const displayItems = useMemo(
    () => getDisplayItems(tradingParams, result),
    [result, tradingParams],
  );

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

function getDisplayItems(
  tradingParams: TradingParameters,
  result: TradeResult,
): ValueDisplayDataAnyList {
  const { priceDecimals } = tradingParams;

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

  return [
    {
      kind: 'decimal',
      label: 'P&L',
      value: pnl,
      precision: priceDecimals,
    },
    {
      kind: 'decimal',
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
      precision: priceDecimals,
    },
    {
      kind: 'decimal',
      label: 'Avg Loss',
      value: avgLoss,
      precision: priceDecimals,
    },
    {
      kind: 'none',
      colSpan: 2,
    },
    {
      kind: 'decimal',
      label: 'Max Drawdown',
      value: maxDrawdown,
      precision: priceDecimals,
    },
  ];
}
