import type { Meta, StoryObj } from '@storybook/react';
import { TwChart, TwChartProps } from './TwChart';
import {
  argTypeInteger,
  decoratorContainer,
  disableControl,
} from '../../../../storybook';
import { useMemo, useState } from 'react';
import { TickerDataRow } from '../../../types';
import {
  TEST_TICKER_ROWS_DAY,
  TEST_TICKER_ROWS_MINUTE,
  TEST_TICKER_ROWS_QUARTER,
} from './data';
import { TickerDataResolution } from '@gmjs/gm-trading-shared';
import { TwChartSettings } from './types';

const INSTRUMENT_NAMES: readonly string[] = [
  'DJI',
  'NDX',
  'DAX',
  'FTSE',
  'NI225',
  'EUR_USD',
  'GBP_USD',
  'USD_JPY',
];

const STORY_META: Meta<TwChartProps> = {
  component: TwChart,
  tags: ['autodocs'],
  decorators: [decoratorContainer({ height: '100vh', padding: 16 })],
  argTypes: {
    settings: disableControl(),
    onSettingsChange: disableControl(),
    precision: argTypeInteger(0, 10),
    data: disableControl(),
  },
  args: {
    instrumentNames: INSTRUMENT_NAMES,
    precision: 2,
  },
};
export default STORY_META;

export const Primary: StoryObj<TwChartProps> = {
  render: (args: TwChartProps) => {
    const {
      settings: _ignore1,
      onSettingsChange: _ignore2,
      data: _ignore3,
      ...rest
    } = args;

    const [settings, setSettings] = useState<TwChartSettings>({
      instrumentName: INSTRUMENT_NAMES[0],
      resolution: '5m',
    });

    const data = useMemo(() => getData('minute'), []);

    return (
      <TwChart
        {...rest}
        settings={settings}
        onSettingsChange={setSettings}
        data={data}
      />
    );
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
