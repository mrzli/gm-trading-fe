import type { Meta, StoryObj } from '@storybook/react';
import { TwChart, TwChartProps } from './TwChart';
import {
  argTypeInteger,
  decoratorContainer,
  disableControl,
} from '../../../../storybook';
import { useMemo } from 'react';
import { TickerDataRow } from '../../../types';
import {
  TEST_TICKER_ROWS_DAY,
  TEST_TICKER_ROWS_MINUTE,
  TEST_TICKER_ROWS_QUARTER,
} from './data';
import { TickerDataResolution } from '@gmjs/gm-trading-shared';

const STORY_META: Meta<TwChartProps> = {
  component: TwChart,
  tags: ['autodocs'],
  decorators: [decoratorContainer({ height: '100vh', padding: 16 })],
  args: {
    precision: 2,
  },
  argTypes: {
    precision: argTypeInteger(0, 10),
    data: disableControl(),
  },
};
export default STORY_META;

export const Primary: StoryObj<TwChartProps> = {
  render: (args: TwChartProps) => {
    const { data: _ignore1, ...rest } = args;

    const data = useMemo(() => getData('minute'), []);

    return <TwChart {...rest} data={data} />;
  },
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
