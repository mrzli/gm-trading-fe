import type { Meta, StoryObj } from '@storybook/react';
import { ActiveTradeItem, ActiveTradeItemProps } from './ActiveTradeItem';
import { TYPES_OF_TW_CHART_TIMEZONES } from '../../../tw-chart/types';
import { decoratorPadding } from '../../../../../../storybook';
import { DEFAULT_TRADING_PARAMS } from '../../util';
import { ActiveTrade } from '../../types';

const STORY_META: Meta<ActiveTradeItemProps> = {
  component: ActiveTradeItem,
  tags: ['autodocs'],
  decorators: [decoratorPadding()],
  argTypes: {
    timezone: {
      control: 'inline-radio',
      options: TYPES_OF_TW_CHART_TIMEZONES,
    },
  },
  args: {
    timezone: 'UTC',
    tradingParams: DEFAULT_TRADING_PARAMS,
  },
};
export default STORY_META;

const TIME = 1_703_014_214; // 2023-12-19T19:30:14Z;

const ITEM: ActiveTrade = {
  id: 0,
  openTime: TIME,
  openPrice: 1000,
  amount: 5,
  stopLoss: 990,
  limit: 1020,
};

export const Primary: StoryObj<ActiveTradeItemProps> = {
  render: (args: ActiveTradeItemProps) => {
    return <ActiveTradeItem {...args} />;
  },
  args: {
    item: ITEM,
  },
};
