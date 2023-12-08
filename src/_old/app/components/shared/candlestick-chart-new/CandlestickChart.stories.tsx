import type { Meta, StoryObj } from '@storybook/react';
import { decoratorContainer, disableControl } from '../../../../../storybook';
import { CandlestickChart, CandlestickChartProps } from './CandlestickChart';
import {
  TEST_TICKER_ROWS_DAY,
  TEST_TICKER_ROWS_MINUTE,
  TEST_TICKER_ROWS_QUARTER,
} from './data';
import { TickerDataRow } from '../../../../app/types';
import { TickerDataResolution } from '@gmjs/gm-trading-shared';
import { useMemo } from 'react';

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
  },
  argTypes: {
    data: disableControl(),
  },
};
export default STORY_META;

export const Primary: StoryObj<CandlestickChartProps> = {
  render: (args: CandlestickChartProps) => {
    const { data: _ignore1, ...rest } = args;

    const { resolution } = args;

    const data = useMemo(() => getData(resolution), [resolution]);

    return <CandlestickChart {...rest} data={data} />;
  },
  args: {},
};

function getData(resolution: TickerDataResolution): readonly TickerDataRow[] {
  switch (resolution) {
    case 'day': {
      return TEST_TICKER_ROWS_DAY;
    }
    case 'minute': {
      return TEST_TICKER_ROWS_MINUTE;
    }
    case 'quarter': {
      return TEST_TICKER_ROWS_QUARTER;
    }
  }
}
