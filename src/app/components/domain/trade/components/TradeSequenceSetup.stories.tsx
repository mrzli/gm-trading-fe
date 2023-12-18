import type { Meta, StoryObj } from '@storybook/react';
import {
  TradeSequenceSetup,
  TradeSequenceSetupProps,
} from './TradeSequenceSetup';
import { decoratorPadding, disableControl } from '../../../../../storybook';
import { TradeSequenceInput } from '../types';
import { useState } from 'react';
import { PrettyDisplay } from '../../../shared';

const STORY_META: Meta<TradeSequenceSetupProps> = {
  component: TradeSequenceSetup,
  tags: ['autodocs'],
  decorators: [decoratorPadding()],
  argTypes: {
    value: disableControl(),
    onValueChange: disableControl(),
  },
  args: {},
};
export default STORY_META;

export const Primary: StoryObj<TradeSequenceSetupProps> = {
  render: (args: TradeSequenceSetupProps) => {
    const { value: _ignore1, onValueChange: _ignore2, ...rest } = args;

    const [value, setValue] = useState<TradeSequenceInput>({
      initialBalance: 100_000,
      spread: 0.5,
      marginPercent: 0.5,
      avgSlippage: 0,
    });

    return (
      <div>
        <TradeSequenceSetup {...rest} value={value} onValueChange={setValue} />
        <br />
        <br />
        <PrettyDisplay content={value} />
      </div>
    );
  },
};
