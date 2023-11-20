import type { Meta, StoryObj } from '@storybook/react';
import { decoratorContainer } from '../../../../storybook';
import { CandlestickChart, CandlestickChartProps } from './CandlestickChart';
import { TEST_TICKER_ROWS } from './data';
import { TickerDataRow } from '../../../types';

const DATA: readonly TickerDataRow[] = TEST_TICKER_ROWS;

const STORY_META: Meta<CandlestickChartProps> = {
  component: CandlestickChart,
  tags: ['autodocs'],
  decorators: [decoratorContainer({ height: '100vh', padding: 16 })],
  args: {
    resolution: 'quarter',
    precision: 1,
    position: {
      xOffset: 0,
      xItemsWidth: 30,
      yPrice: 13_800,
      yPriceHeight: 300,
    },
    data: DATA,
  },
};
export default STORY_META;

export const Primary: StoryObj<CandlestickChartProps> = {
  render: (args: CandlestickChartProps) => {
    return <CandlestickChart {...args} />;
  },
  args: {},
};
