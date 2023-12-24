import type { Meta, StoryObj } from '@storybook/react';
import {
  CompletedTradeItem,
  CompletedTradeItemProps,
} from './CompletedTradeItem';
import { TYPES_OF_TW_CHART_TIMEZONES } from '../../../tw-chart/types';
import { decoratorPadding } from '../../../../../../storybook';
import { DEFAULT_TRADING_PARAMS } from '../../util';

const STORY_META: Meta<CompletedTradeItemProps> = {
  component: CompletedTradeItem,
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

export const Primary: StoryObj<CompletedTradeItemProps> = {
  render: (args: CompletedTradeItemProps) => {
    return <CompletedTradeItem {...args} />;
  },
};
