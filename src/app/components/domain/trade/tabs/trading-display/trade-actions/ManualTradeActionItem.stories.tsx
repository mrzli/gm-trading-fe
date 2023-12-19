import type { Meta, StoryObj } from '@storybook/react';
import {
  ManualTradeActionItem,
  ManualTradeActionItemProps,
} from './ManualTradeActionItem';
import { decoratorPadding } from '../../../../../../../storybook';

const STORY_META: Meta<ManualTradeActionItemProps> = {
  component: ManualTradeActionItem,
  tags: ['autodocs'],
  decorators: [decoratorPadding()],
  argTypes: {},
  args: {},
};
export default STORY_META;

const Template: StoryObj<ManualTradeActionItemProps> = {
  render: (args: ManualTradeActionItemProps) => {
    return <ManualTradeActionItem {...args} />;
  },
};

const TIME = 1_703_014_214; // 2023-12-19T19:30:14Z;

export const CreateOrder: StoryObj<ManualTradeActionItemProps> = {
  ...Template,
  args: {
    tradeAction: {
      kind: 'create-order',
      time: TIME,
      orderId: 0,
      price: 1000,
      amount: 5,
      stopLossDistance: 10,
      limitDistance: 20,
    },
  },
};

export const CancelOrder: StoryObj<ManualTradeActionItemProps> = {
  ...Template,
  args: {
    tradeAction: {
      kind: 'cancel-order',
      time: TIME,
      orderId: 0,
    },
  },
};

export const CloseTrade: StoryObj<ManualTradeActionItemProps> = {
  ...Template,
  args: {
    tradeAction: {
      kind: 'close-trade',
      time: TIME,
      tradeId: 0,
      price: 1000,
    },
  },
};

export const AdjustOrder: StoryObj<ManualTradeActionItemProps> = {
  ...Template,
  args: {
    tradeAction: {
      kind: 'adjust-order',
      time: TIME,
      orderId: 0,
      price: 1000,
      amount: 5,
      stopLossDistance: 10,
      limitDistance: 20,
    },
  },
};

export const AdjustTrade: StoryObj<ManualTradeActionItemProps> = {
  ...Template,
  args: {
    tradeAction: {
      kind: 'adjust-trade',
      time: TIME,
      tradeId: 0,
      stopLoss: 9900,
      limit: 1020,
    },
  },
};
