import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CandlestickChart, CandlestickChartProps } from './CandlestickChart';
import { decoratorPadding, disableControl } from '../../../../storybook';
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
  decorators: [decoratorPadding()],
  argTypes: {
    data: disableControl(),
    interval: disableControl(),
    selectedItem: disableControl(),
    onSelectItem: disableControl(),
    onKeyDown: disableControl(),
  },
  args: {
    data: DATA,
    interval: 'quarter',
    valueRange: VALUE_RANGE,
  },
};
export default STORY_META;

export const Primary: StoryObj<CandlestickChartProps> = {
  render: (args: CandlestickChartProps) => {
    const { selectedItem: _ignore1, onSelectItem: _ignore2, ...rest } = args;

    const [selectedItem, setSelectedItem] = useState<number | undefined>(
      undefined,
    );

    return (
      <CandlestickChart
        {...rest}
        selectedItem={selectedItem}
        onSelectItem={setSelectedItem}
      />
    );
  },
  args: {
    width: 800,
    height: 600,
    precision: 2,
  },
};
