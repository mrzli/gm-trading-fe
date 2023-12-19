import type { Meta, StoryObj } from '@storybook/react';
import { TradeContainer, TradeContainerProps } from './TradeContainer';
import { decoratorPadding, disableControl } from '../../../../storybook';
import { TickerDataRows } from '../../../types';
import { TEST_TICKER_ROWS_MINUTE } from '../data';

const BAR_DATA: TickerDataRows = TEST_TICKER_ROWS_MINUTE;

const STORY_META: Meta<TradeContainerProps> = {
  component: TradeContainer,
  tags: ['autodocs'],
  decorators: [decoratorPadding()],
  argTypes: {
    barData: disableControl(),
  },
  args: {
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
