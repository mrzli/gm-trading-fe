import type { Meta, StoryObj } from '@storybook/react';
import { ChartToolbar, ChartToolbarProps } from './ChartToolbar';
import { decoratorPadding, disableControl } from '../../../../../storybook';
import { useState } from 'react';
import { PrettyDisplay } from '../../../shared';
import { TEST_TICKER_ROWS_MINUTE } from '../../data';
import {
  aggregateGroupedDataRows,
  groupDataRows,
} from '../ticker-data-container/util/process-chart-data';
import { ChartSettings } from '../../types';

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

const STORY_META: Meta<ChartToolbarProps> = {
  component: ChartToolbar,
  tags: ['autodocs'],
  decorators: [decoratorPadding()],
  argTypes: {
    settings: disableControl(),
    subRows: disableControl(),
    rows: disableControl(),
    onSettingsChange: disableControl(),
  },
  args: {
    instrumentNames: INSTRUMENT_NAMES,
    subRows: groupDataRows(TEST_TICKER_ROWS_MINUTE, '5m'),
    rows: aggregateGroupedDataRows(
      groupDataRows(TEST_TICKER_ROWS_MINUTE, '5m'),
    ),
    logicalRange: {
      from: 5,
      to: 15,
    },
  },
};
export default STORY_META;

export const Primary: StoryObj<ChartToolbarProps> = {
  render: (args: ChartToolbarProps) => {
    const { settings: _ignore1, onSettingsChange: _ignore2, ...rest } = args;

    const [settings, setSettings] = useState<ChartSettings>({
      instrumentName: INSTRUMENT_NAMES[0],
      resolution: '5m',
      timezone: 'UTC',
      replayPosition: {
        barIndex: undefined,
        subBarIndex: 0,
      },
    });

    return (
      <div>
        <ChartToolbar
          {...rest}
          settings={settings}
          onSettingsChange={setSettings}
        />
        <div style={{ marginTop: 20 }}>
          <PrettyDisplay content={settings} />
        </div>
      </div>
    );
  },
};
