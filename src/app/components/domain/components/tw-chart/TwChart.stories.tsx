import { useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TwChart, TwChartProps } from './TwChart';
import { decoratorContainer, disableControl } from '../../../../../storybook';
import { Bars } from '../../types';
import {
  TEST_TICKER_BARS_DAY,
  TEST_TICKER_BARS_MINUTE,
  TEST_TICKER_BARS_QUARTER,
} from '../../data';
import { TickerDataResolution } from '@gmjs/gm-trading-shared';
import { invariant } from '@gmjs/assert';

const STORY_META: Meta<TwChartProps> = {
  component: TwChart,
  tags: ['autodocs'],
  decorators: [decoratorContainer({ height: '100vh', padding: 16 })],
  argTypes: {
    data: disableControl(),
    onLogicalRangeChange: disableControl(),
    onChartKeyDown: disableControl(),
  },
  args: {},
};
export default STORY_META;

export const Primary: StoryObj<TwChartProps> = {
  render: (args: TwChartProps) => {
    const { data: _ignore1, ...rest } = args;

    const data = useMemo(() => getData('1m'), []);

    return <TwChart {...rest} data={data} />;
  },
};

function getData(resolution: TickerDataResolution): Bars {
  switch (resolution) {
    case '1m': {
      return TEST_TICKER_BARS_MINUTE;
    }
    case '15m': {
      return TEST_TICKER_BARS_QUARTER;
    }
    case 'D': {
      return TEST_TICKER_BARS_DAY;
    }
    default: {
      invariant(false, `Data does not exist for resolution: '${resolution}'.`);
    }
  }
}
