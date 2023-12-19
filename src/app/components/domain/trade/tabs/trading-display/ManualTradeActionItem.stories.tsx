import type { Meta, StoryObj } from '@storybook/react';
import {
  ManualTradeActionItem,
  ManualTradeActionItemProps,
} from './ManualTradeActionItem';
import { decoratorPadding } from '../../../../../../storybook';
import { TradingInputs } from '../../types';

const TRADING_INPUTS: TradingInputs = {
  params: {
    initialBalance: 10_000,
    priceDecimals: 1,
    spread: 0.1,
    marginPercent: 0.5,
    avgSlippage: 0,
    pipDigit: 0,
    minStopLossDistance: 6,
  },
  manualTradeActions: [],
};

const STORY_META: Meta<ManualTradeActionItemProps> = {
  component: ManualTradeActionItem,
  tags: ['autodocs'],
  decorators: [decoratorPadding()],
  argTypes: {},
  args: {
    tradingInputs: TRADING_INPUTS,
  },
};
export default STORY_META;

const Template: StoryObj<ManualTradeActionItemProps> = {
  render: (args: ManualTradeActionItemProps) => {
    return <ManualTradeActionItem {...args} />;
  },
};

const TIME = 1_703_014_214; // 2023-12-19T19:30:14Z;

export const Open: StoryObj<ManualTradeActionItemProps> = {
  ...Template,
  args: {
    tradeAction: {
      kind: 'open',
      time: TIME,
      id: 0,
      price: 1000,
      amount: 5,
      stopLossDistance: 10,
      limitDistance: 20,
    },
  },
};

export const Close: StoryObj<ManualTradeActionItemProps> = {
  ...Template,
  args: {
    tradeAction: {
      kind: 'close',
      id: 1,
      time: TIME,
      targetId: 0,
    },
  },
};

export const AmendOrder: StoryObj<ManualTradeActionItemProps> = {
  ...Template,
  args: {
    tradeAction: {
      kind: 'amend-order',
      id: 1,
      time: TIME,
      targetId: 0,
      price: 1000,
      amount: 5,
      stopLossDistance: 10,
      limitDistance: 20,
    },
  },
};

export const AmendTrade: StoryObj<ManualTradeActionItemProps> = {
  ...Template,
  args: {
    tradeAction: {
      kind: 'amend-trade',
      id: 1,
      time: TIME,
      targetId: 0,
      stopLoss: 9900,
      limit: 1020,
    },
  },
};
