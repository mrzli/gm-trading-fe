import type { Meta, StoryObj } from '@storybook/react';
import {
  ManualTradeActionItem,
  ManualTradeActionItemProps,
} from './ManualTradeActionItem';
import {
  argTypeInlineRadio,
  decoratorPadding,
} from '../../../../../../storybook';
import {
  ManualTradeActionAmendOrder,
  ManualTradeActionAmendTrade,
  ManualTradeActionClose,
  ManualTradeActionOpen,
} from '../../types';
import { TYPES_OF_TW_CHART_TIMEZONES } from '../../../tw-chart/types';
import { DEFAULT_TRADING_PARAMS } from '../../util';

const STORY_META: Meta<ManualTradeActionItemProps> = {
  component: ManualTradeActionItem,
  tags: ['autodocs'],
  decorators: [decoratorPadding()],
  argTypes: {
    timezone: argTypeInlineRadio(TYPES_OF_TW_CHART_TIMEZONES),
  },
  args: {
    timezone: 'UTC',
    tradingParams: DEFAULT_TRADING_PARAMS,
  },
};
export default STORY_META;

const TIME = 1_703_014_214; // 2023-12-19T19:30:14Z;

const TRADE_ACTION_OPEN: ManualTradeActionOpen = {
  kind: 'open',
  time: TIME,
  id: 0,
  price: 1000,
  amount: 5,
  stopLossDistance: 10,
  limitDistance: 20,
};

const TRADE_ACTION_CLOSE: ManualTradeActionClose = {
  kind: 'close',
  id: 1,
  time: TIME,
  targetId: 0,
};

const TRADE_ACTION_AMEND_ORDER: ManualTradeActionAmendOrder = {
  kind: 'amend-order',
  id: 1,
  time: TIME,
  targetId: 0,
  price: 1000,
  amount: 5,
  stopLossDistance: 10,
  limitDistance: 20,
};

const TRADE_ACTION_AMEND_TRADE: ManualTradeActionAmendTrade = {
  kind: 'amend-trade',
  id: 1,
  time: TIME,
  targetId: 0,
  stopLoss: 9900,
  limit: 1020,
};

const Template: StoryObj<ManualTradeActionItemProps> = {
  render: (args: ManualTradeActionItemProps) => {
    return <ManualTradeActionItem {...args} />;
  },
};

export const Open: StoryObj<ManualTradeActionItemProps> = {
  ...Template,
  args: {
    tradeAction: TRADE_ACTION_OPEN,
  },
};

export const Close: StoryObj<ManualTradeActionItemProps> = {
  ...Template,
  args: {
    tradeAction: TRADE_ACTION_CLOSE,
  },
};

export const AmendOrder: StoryObj<ManualTradeActionItemProps> = {
  ...Template,
  args: {
    tradeAction: TRADE_ACTION_AMEND_ORDER,
  },
};

export const AmendTrade: StoryObj<ManualTradeActionItemProps> = {
  ...Template,
  args: {
    tradeAction: TRADE_ACTION_AMEND_TRADE,
  },
};

export const All: StoryObj<ManualTradeActionItemProps> = {
  render: (args: ManualTradeActionItemProps) => {
    const { tradeAction: _ignore1, ...rest } = args;

    return (
      <div className='flex flex-col gap-1'>
        <ManualTradeActionItem {...rest} tradeAction={TRADE_ACTION_OPEN} />
        <ManualTradeActionItem {...rest} tradeAction={TRADE_ACTION_CLOSE} />
        <ManualTradeActionItem
          {...rest}
          tradeAction={TRADE_ACTION_AMEND_ORDER}
        />
        <ManualTradeActionItem
          {...rest}
          tradeAction={TRADE_ACTION_AMEND_TRADE}
        />
      </div>
    );
  },
};
