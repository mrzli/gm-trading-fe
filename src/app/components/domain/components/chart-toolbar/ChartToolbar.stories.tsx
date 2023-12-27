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
import { BarReplayPosition, ChartRange, ChartSettings } from '../../types';

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
    onInstrumentChange: disableControl(),
    onResolutionChange: disableControl(),
    onTimezoneChange: disableControl(),
    onLogicalRangeChange: disableControl(),
    onReplayPositionChange: disableControl(),
  },
  args: {
    instrumentNames: INSTRUMENT_NAMES,
    subRows: groupDataRows(TEST_TICKER_ROWS_MINUTE, '5m'),
    rows: aggregateGroupedDataRows(
      groupDataRows(TEST_TICKER_ROWS_MINUTE, '5m'),
    ),
  },
};
export default STORY_META;

export const Primary: StoryObj<ChartToolbarProps> = {
  render: (args: ChartToolbarProps) => {
    const {
      settings: _ignore1,
      onInstrumentChange: _ignore2,
      onResolutionChange: _ignore3,
      onTimezoneChange: _ignore4,
      logicalRange: _ignore5,
      onLogicalRangeChange: _ignore6,
      replayPosition: _ignore7,
      onReplayPositionChange: _ignore8,
      ...rest
    } = args;

    const [settings, setSettings] = useState<ChartSettings>({
      instrumentName: INSTRUMENT_NAMES[0],
      resolution: '5m',
      timezone: 'UTC',
    });

    const [logicalRange, setLogicalRange] = useState<ChartRange | undefined>({
      from: 5,
      to: 15,
    });

    const [replayPosition, setReplayPosition] = useState<BarReplayPosition>({
      barIndex: undefined,
      subBarIndex: 0,
    });

    return (
      <div>
        <ChartToolbar
          {...rest}
          settings={settings}
          onInstrumentChange={(instrumentName) => {
            setSettings((s) => ({
              ...s,
              instrumentName,
            }));
          }}
          onResolutionChange={(resolution) => {
            setSettings((s) => ({
              ...s,
              resolution,
            }));
          }}
          onTimezoneChange={(timezone) => {
            setSettings((s) => ({
              ...s,
              timezone,
            }));
          }}
          logicalRange={logicalRange}
          onLogicalRangeChange={setLogicalRange}
          replayPosition={replayPosition}
          onReplayPositionChange={setReplayPosition}
        />
        <div style={{ marginTop: 20 }}>
          <PrettyDisplay content={settings} />
        </div>
      </div>
    );
  },
};
