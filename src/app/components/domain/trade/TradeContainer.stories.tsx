import type { Meta, StoryObj } from '@storybook/react';
import { TradeContainer, TradeContainerProps } from './TradeContainer';
import { decoratorPadding } from '../../../../storybook';
import { TickerDataRows } from '../../../types';
import { TEST_TICKER_ROWS_MINUTE } from '../data';
import { TradingChartData } from './types';

const BAR_DATA: TickerDataRows = TEST_TICKER_ROWS_MINUTE;

const CHART_DATA: TradingChartData = {
  timezone: 'UTC',
  barData: BAR_DATA,
  barIndex: 0,
};

const STORY_META: Meta<TradeContainerProps> = {
  component: TradeContainer,
  tags: ['autodocs'],
  decorators: [decoratorPadding()],
  argTypes: {},
  args: {
    chartData: CHART_DATA,
  },
};
export default STORY_META;

export const Primary: StoryObj<TradeContainerProps> = {
  render: (args: TradeContainerProps) => {
    return <TradeContainer {...args} />;
  },
};
