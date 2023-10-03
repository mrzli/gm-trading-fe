import type { Meta, StoryObj } from '@storybook/react';
import { CandlestickChart, CandlestickChartProps } from './CandlestickChart';
import { decoratorContainer, disableControl } from '../../../../storybook';
import { TEST_TICKER_ROWS } from './data';
import { NumericRange, TickerDataRow } from '../../../types';
import { maxBy, minBy } from '@gmjs/value-transformers';

const DATA: readonly TickerDataRow[] = TEST_TICKER_ROWS.slice(0, 30);

const RANGE_PADDING = 100;

const VALUE_RANGE: NumericRange = {
  start: minBy<TickerDataRow>((item) => item.l)(DATA) - RANGE_PADDING,
  end: maxBy<TickerDataRow>((item) => item.h)(DATA) + RANGE_PADDING,
};

const STORY_META: Meta<CandlestickChartProps> = {
  component: CandlestickChart,
  tags: ['autodocs'],
  decorators: [decoratorContainer({ height: '100vh', padding: 16 })],
  argTypes: {
    data: disableControl(),
    resolution: disableControl(),
    onKeyDown: disableControl(),
  },
  args: {
    data: DATA,
    resolution: 'quarter',
    priceRange: VALUE_RANGE,
  },
};
export default STORY_META;

export const Primary: StoryObj<CandlestickChartProps> = {
  render: (args: CandlestickChartProps) => {
    return <CandlestickChart {...args} />;
  },
  args: {
    precision: 2,
  },
};
