import React, { useCallback, useMemo, useState } from 'react';
import { Instrument } from '@gmjs/gm-trading-shared';
import { TwChart } from '../tw-chart/TwChart';
import {
  BarReplayPosition,
  ChartNavigatePayloadAny,
  ChartNavigatePayloadMoveBy,
  ChartSettings,
  ChartTimeStep,
  GroupedBars,
  TradeLine,
} from '../../types';
import {
  CreateOrderActionType,
  CreateOrderStateAny,
  CreateOrderStateFinish,
  FullBarData,
} from './types';
import { Key } from 'ts-key-enum';
import {
  getChartData,
  toLogicalOffset,
  transitionCreateOrderState,
} from './util';
import { barReplayMoveSubBar } from '../../util';
import { ChartMouseClickData } from '../tw-chart/types';
import { invariant } from '@gmjs/assert';

export interface ChartContainerProps {
  readonly instrument: Instrument;
  readonly settings: ChartSettings;
  readonly fullData: FullBarData;
  readonly isTrading: boolean;
  readonly navigatePayload: ChartNavigatePayloadAny | undefined;
  readonly onNavigate: (payload: ChartNavigatePayloadAny) => void;
  readonly replayPosition: BarReplayPosition;
  readonly onReplayPositionChange: (position: BarReplayPosition) => void;
  readonly tradeLines: readonly TradeLine[];
  readonly onCreateOrder: (data: CreateOrderStateFinish) => void;
}

export function ChartContainer({
  instrument,
  settings,
  fullData,
  isTrading,
  navigatePayload,
  onNavigate,
  replayPosition,
  onReplayPositionChange,
  tradeLines,
  onCreateOrder,
}: ChartContainerProps): React.ReactElement {
  const { resolution } = settings;
  const { subBars } = fullData;

  const chartData = useMemo(() => {
    return getChartData(fullData, replayPosition, resolution);
  }, [fullData, replayPosition, resolution]);

  const marketPrice = chartData.at(-1)!.open;

  const [createOrderState, setCreateOrderState] = useState<CreateOrderStateAny>(
    { type: 'start' },
  );

  const handleChartClick = useCallback(
    (data: ChartMouseClickData) => {
      const { price } = data;

      if (!isTrading || price === undefined) {
        return;
      }

      const newCreateOrderState = transitionCreateOrderState(
        createOrderState,
        marketPrice,
        {
          type: 'next-price',
          price,
        },
      );

      setCreateOrderState(newCreateOrderState);
    },
    [createOrderState, isTrading, marketPrice],
  );

  const handleChartKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      switch (event.key) {
        case Key.ArrowLeft:
        case Key.ArrowRight: {
          if (isTrading) {
            keyboardNavigateReplay(
              event,
              subBars,
              replayPosition,
              onReplayPositionChange,
            );
          } else {
            keyboardNavigateChart(event, onNavigate);
          }
          break;
        }
        case 'l':
        case 'm':
        case 'b':
        case 's':
        case ' ':
        case Key.Enter:
        case Key.Escape: {
          if (!isTrading) {
            break;
          }

          if (createOrderState.type === 'finish' && event.key === Key.Enter) {
            onCreateOrder(createOrderState);
          }

          const newCreateOrderState = transitionCreateOrderState(
            createOrderState,
            marketPrice,
            {
              type: keyToCreateOrderActionType(event.key),
            },
          );

          setCreateOrderState(newCreateOrderState);
        }
      }
    },
    [
      createOrderState,
      isTrading,
      marketPrice,
      onCreateOrder,
      onNavigate,
      onReplayPositionChange,
      replayPosition,
      subBars,
    ],
  );

  return (
    <TwChart
      settings={settings}
      instrument={instrument}
      data={chartData}
      navigatePayload={navigatePayload}
      onChartClick={handleChartClick}
      onChartKeyDown={handleChartKeyDown}
      tradeLines={tradeLines}
      createOrderState={createOrderState}
    />
  );
}

function keyboardNavigateChart(
  event: React.KeyboardEvent<HTMLDivElement>,
  onNavigate: (payload: ChartNavigatePayloadAny) => void,
): void {
  const offset = toLogicalOffset(event);
  const timeStep: ChartTimeStep = {
    unit: 'B',
    value: offset,
  };

  const payload: ChartNavigatePayloadMoveBy = {
    type: 'move-by',
    timeStep,
  };
  onNavigate(payload);
}

function keyboardNavigateReplay(
  event: React.KeyboardEvent<HTMLDivElement>,
  subBars: GroupedBars,
  replayPosition: BarReplayPosition,
  handleReplayPositionChange: (replayPosition: BarReplayPosition) => void,
): void {
  const { barIndex, subBarIndex } = replayPosition;
  if (barIndex === undefined) {
    return;
  }

  const amount = event.key === Key.ArrowLeft ? -1 : 1;
  const newBarReplayIndexes = barReplayMoveSubBar(
    subBars,
    barIndex,
    subBarIndex,
    amount,
  );

  const { barIndex: newBarIndex, subBarIndex: newSubBarIndex } =
    newBarReplayIndexes;

  const newBarReplayPosition: BarReplayPosition = {
    barIndex: newBarIndex,
    subBarIndex: newSubBarIndex,
  };

  handleReplayPositionChange(newBarReplayPosition);
}

function keyToCreateOrderActionType(
  key: string,
): Exclude<CreateOrderActionType, 'next-price'> {
  switch (key) {
    case 'l': {
      return 'order-limit';
    }
    case 'm': {
      return 'order-market';
    }
    case 'b': {
      return 'buy';
    }
    case 's': {
      return 'sell';
    }
    case ' ': {
      return 'skip';
    }
    case Key.Enter: {
      return 'finish';
    }
    case Key.Escape: {
      return 'cancel';
    }
    default: {
      invariant(false, 'Unhandled key.');
    }
  }
}
