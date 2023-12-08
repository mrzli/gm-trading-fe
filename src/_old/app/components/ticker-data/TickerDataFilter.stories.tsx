import type { Meta, StoryObj } from '@storybook/react';
import { TickerDataFilter, TickerDataFilterProps } from './TickerDataFilter';
import { decoratorPadding, disableControl } from '../../../storybook';
import { useState } from 'react';
import { TickerFilterData } from '../../../app/types';
import { DEFAULT_TICKER_DATA_FILTER_DATA } from '../../../app/util';

const STORY_META: Meta<TickerDataFilterProps> = {
  component: TickerDataFilter,
  tags: ['autodocs'],
  decorators: [decoratorPadding()],
  argTypes: {
    data: disableControl(),
    onDataChange: disableControl(),
  },
  args: {
    tickerNames: ['DAX', 'FTSE', 'DJI', 'NDX'],
  },
};
export default STORY_META;

export const Primary: StoryObj<TickerDataFilterProps> = {
  render: (args: TickerDataFilterProps) => {
    const { data: _ignore1, onDataChange: _ignore2, ...rest } = args;

    const [data, setData] = useState<TickerFilterData>(
      DEFAULT_TICKER_DATA_FILTER_DATA,
    );

    return (
      <div>
        <TickerDataFilter {...rest} data={data} onDataChange={setData} />
        <br />
        <div>
          Data: <pre>{JSON.stringify(data, undefined, 2)}</pre>
        </div>
      </div>
    );
  },
};
