import type { Meta, StoryObj } from '@storybook/react';
import {
  CompletedTradeItem,
  CompletedTradeItemProps,
} from './CompletedTradeItem';
import { TYPES_OF_TW_CHART_TIMEZONES } from '../../../../tw-chart/types';
import {
  argTypeInlineRadio,
  decoratorPadding,
} from '../../../../../../../storybook';
import { DEFAULT_TRADING_PARAMS } from '../../../util';
import { CompletedTrade } from '../../../types';

const STORY_META: Meta<CompletedTradeItemProps> = {
  component: CompletedTradeItem,
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

const ITEM: CompletedTrade = {
  id: 0,
  openTime: TIME,
  openPrice: 1000,
  closeTime: TIME + 15 * 60,
  closePrice: 1020,
  amount: 5,
  closeReason: 'manual',
};

export const Primary: StoryObj<CompletedTradeItemProps> = {
  render: (args: CompletedTradeItemProps) => {
    return <CompletedTradeItem {...args} />;
  },
  args: {
    item: ITEM,
  },
};
