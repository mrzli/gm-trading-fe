import type { Meta, StoryObj } from '@storybook/react';
import { ActiveOrderItem, ActiveOrderItemProps } from './ActiveOrderItem';
import { TYPES_OF_TW_CHART_TIMEZONES } from '../../../tw-chart/types';
import { decoratorPadding } from '../../../../../../storybook';
import { DEFAULT_TRADING_PARAMS } from '../../util';
import { ActiveOrder } from '../../types';

const STORY_META: Meta<ActiveOrderItemProps> = {
  component: ActiveOrderItem,
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

const ITEM: ActiveOrder = {
  id: 0,
  time: TIME,
  price: 1000,
  amount: 5,
  stopLossDistance: 10,
  limitDistance: 20,
};

export const Primary: StoryObj<ActiveOrderItemProps> = {
  render: (args: ActiveOrderItemProps) => {
    return <ActiveOrderItem {...args} />;
  },
  args: {
    item: ITEM,
  },
};
