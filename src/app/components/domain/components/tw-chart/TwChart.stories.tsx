import { useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TwChart, TwChartProps } from './TwChart';
import {
  argTypeInlineRadio,
  argTypeInteger,
  decoratorContainer,
  disableControl,
} from '../../../../../storybook';
import { TYPES_OF_CHART_TIMEZONES, Bars } from '../../types';
import {
  TEST_TICKER_BARS_DAY,
  TEST_TICKER_BARS_MINUTE,
  TEST_TICKER_BARS_QUARTER,
} from '../../data';
import { TickerDataResolution } from '@gmjs/gm-trading-shared';

const STORY_META: Meta<TwChartProps> = {
  component: TwChart,
  tags: ['autodocs'],
  decorators: [decoratorContainer({ height: '100vh', padding: 16 })],
  argTypes: {
    precision: argTypeInteger(0, 10),
    data: disableControl(),
    timezone: argTypeInlineRadio(TYPES_OF_CHART_TIMEZONES),
    onLogicalRangeChange: disableControl(),
    onChartKeyDown: disableControl(),
  },
  args: {
    precision: 2,
    timezone: 'UTC',
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

function getData(resolution: TickerDataResolution): Bars {
  switch (resolution) {
    case 'day': {
      return TEST_TICKER_BARS_DAY;
    }
    case 'minute': {
      return TEST_TICKER_BARS_MINUTE;
    }
    case 'quarter': {
      return TEST_TICKER_BARS_QUARTER;
    }
  }
}
