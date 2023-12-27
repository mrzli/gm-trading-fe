import type { Meta, StoryObj } from '@storybook/react';
import { TradeContainer, TradeContainerProps } from './TradeContainer';
import { decoratorPadding } from '../../../../../storybook';
import { Bars } from '../../types';
import { TEST_TICKER_BARS_MINUTE } from '../../data';

const BAR_DATA: Bars = TEST_TICKER_BARS_MINUTE;

const STORY_META: Meta<TradeContainerProps> = {
  component: TradeContainer,
  tags: ['autodocs'],
  decorators: [decoratorPadding()],
  argTypes: {},
  args: {
    settings: {
      instrumentName: 'DJI',
      resolution: '1m',
      timezone: 'UTC',
    },
    barData: BAR_DATA,
    barIndex: 0,
  },
};
export default STORY_META;

export const Primary: StoryObj<TradeContainerProps> = {
  render: (args: TradeContainerProps) => {
    return <TradeContainer {...args} />;
  },
};
